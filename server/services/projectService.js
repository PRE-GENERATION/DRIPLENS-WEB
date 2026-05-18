/**
 * projectService.js
 *
 * All database interactions for the Projects, Deliverables, and
 * Revision Requests tables.  Designed to be called only from the
 * projects route handler — never from other services directly.
 *
 * Service-role Supabase client is used so RLS is bypassed server-side;
 * access control is enforced explicitly in every function via
 * assertParty() / role checks.
 */

import { supabase }                   from '../utils/supabase.js';
import { emitToUser }                 from '../utils/socket.js';
import logger                         from '../utils/logger.js';
import {
  badRequest,
  forbidden,
  notFound,
  conflict,
}                                     from '../utils/AppError.js';

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch a project and confirm the requesting user is a party to it.
 * Returns the project row.
 */
const assertParty = async (projectId, userId) => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id, brand_id, creator_id, status, progress,
      escrow_amount_paise, package_title, package_price_str,
      stripe_payment_intent_id, stripe_transfer_id, deadline,
      revision_count, max_revisions, dispute_reason, disputed_at, disputed_by,
      usage_rights_summary,
      created_at, updated_at,
      brand:brand_id     (id, username, avatar_url, gst_number, company_name),
      creator:creator_id (id, username, avatar_url),
      hiring_request:hiring_request_id (id, project_title, project_description, opportunity_id)
    `)
    .eq('id', projectId)
    .single();

  if (error || !data) throw notFound('Project not found');
  if (data.brand_id !== userId && data.creator_id !== userId) {
    throw forbidden('You are not a party to this project');
  }
  return data;
};

/**
 * Emit a project update event to BOTH parties (brand and creator),
 * except to the sender themselves.
 */
const broadcastProjectUpdate = (project, senderId, event = 'project_update') => {
  const recipients = [project.brand_id, project.creator_id].filter(
    (id) => id && id !== senderId,
  );
  recipients.forEach((recipientId) => emitToUser(recipientId, event, project));
};

/**
 * Fetch the latest deliverable for a project.
 */
const getLatestDeliverable = async (projectId) => {
  const { data } = await supabase
    .from('deliverables')
    .select('*')
    .eq('project_id', projectId)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data ?? null;
};

/**
 * Fetch all open revision requests for a project.
 */
const getOpenRevisions = async (projectId) => {
  const { data } = await supabase
    .from('revision_requests')
    .select('*')
    .eq('project_id', projectId)
    .eq('status', 'open')
    .order('requested_at', { ascending: false });
  return data ?? [];
};


// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a new project after checkout is confirmed.
 * Called by: POST /api/v1/projects
 * Role: brand (or service-level call on checkout confirmation)
 */
export const createProject = async ({
  hiring_request_id,
  brand_id,
  package_title,
  package_price_str,
  escrow_amount_paise = 0,
  stripe_payment_intent_id,
  deadline,
}) => {
  // Verify the hiring request exists and belongs to the brand
  const { data: hr, error: hrErr } = await supabase
    .from('hiring_requests')
    .select(`
      id, brand_id, creator_id, status,
      opportunity:opportunity_id (
        id, num_revisions, usage_rights, usage_rights_details
      )
    `)
    .eq('id', hiring_request_id)
    .single();

  if (hrErr || !hr) throw notFound('Hiring request not found');
  if (hr.brand_id !== brand_id) throw forbidden('This hiring request does not belong to you');
  if (!hr.creator_id) throw badRequest('Cannot start a project without a targeted creator');

  // Prevent duplicate project for same hiring_request
  const { data: existing } = await supabase
    .from('projects')
    .select('id')
    .eq('hiring_request_id', hiring_request_id)
    .maybeSingle();

  if (existing) throw conflict('A project already exists for this hiring request');

  const payload = {
    hiring_request_id,
    brand_id:   hr.brand_id,
    creator_id: hr.creator_id,
    status:     'in_progress',
    package_title,
    package_price_str,
    escrow_amount_paise,
    ...(stripe_payment_intent_id && { stripe_payment_intent_id }),
    ...(deadline && { deadline }),
    // Pull max revisions from opportunity if available
    max_revisions: hr.opportunity?.num_revisions ?? 1,
    usage_rights_summary: hr.opportunity?.usage_rights_details ?? (hr.opportunity?.usage_rights ? 'Platform Standard' : 'None'),
  };

  const { data: project, error } = await supabase
    .from('projects')
    .insert(payload)
    .select(`
      *, 
      brand:brand_id     (id, username, avatar_url),
      creator:creator_id (id, username, avatar_url)
    `)
    .single();

  if (error) throw error;

  // Notify the creator that work has started
  emitToUser(project.creator_id, 'project_created', project);

  logger.info('Project created', { projectId: project.id, brandId: brand_id });
  return project;
};


/**
 * Fetch a project with full context (deliverables, revisions).
 * Called by: GET /api/v1/projects/:id
 */
export const getProject = async (projectId, userId) => {
  const project = await assertParty(projectId, userId);

  const [latestDeliverable, openRevisions, allDeliverables] = await Promise.all([
    getLatestDeliverable(projectId),
    getOpenRevisions(projectId),
    supabase
      .from('deliverables')
      .select('*')
      .eq('project_id', projectId)
      .order('version', { ascending: false })
      .then(({ data }) => data ?? []),
  ]);

  return {
    ...project,
    latest_deliverable: latestDeliverable,
    open_revisions:     openRevisions,
    all_deliverables:   allDeliverables,
  };
};


/**
 * List all projects for the authenticated user (brand or creator).
 * Called by: GET /api/v1/projects
 */
export const listProjects = async (userId) => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id, status, progress, package_title, package_price_str, deadline, created_at, updated_at,
      brand:brand_id     (id, username, avatar_url),
      creator:creator_id (id, username, avatar_url),
      hiring_request:hiring_request_id (id, project_title)
    `)
    .or(`brand_id.eq.${userId},creator_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
};


/**
 * Creator updates the progress percentage (and optionally leaves a note).
 * Called by: PATCH /api/v1/projects/:id/progress
 * Role: creator
 */
export const updateProgress = async (projectId, userId, { progress, _note }) => {
  const project = await assertParty(projectId, userId);

  if (project.creator_id !== userId) {
    throw forbidden('Only the creator can update progress');
  }
  if (['approved', 'completed', 'cancelled'].includes(project.status)) {
    throw badRequest(`Cannot update progress on a project that is "${project.status}"`);
  }

  const { data: updated, error } = await supabase
    .from('projects')
    .update({ progress })
    .eq('id', projectId)
    .select(`
      *, 
      brand:brand_id     (id, username, avatar_url),
      creator:creator_id (id, username, avatar_url)
    `)
    .single();

  if (error) throw error;

  broadcastProjectUpdate(updated, userId, 'project_progress');
  logger.info('Progress updated', { projectId, progress, userId });
  return updated;
};


/**
 * Creator submits a deliverable (file already uploaded; provide URL).
 * Changes project status → 'submitted'.
 * Called by: POST /api/v1/projects/:id/submit
 * Role: creator
 */
export const submitDeliverable = async (
  projectId,
  userId,
  { file_url, file_name, file_size, mime_type, storage_path, notes, type = 'draft' },
) => {
  const project = await assertParty(projectId, userId);

  if (project.creator_id !== userId) {
    throw forbidden('Only the creator can submit deliverables');
  }
  if (['approved', 'completed', 'cancelled'].includes(project.status)) {
    throw badRequest(`Cannot submit to a project that is "${project.status}"`);
  }

  // Insert deliverable (version auto-set by DB trigger)
  const { data: deliverable, error: delErr } = await supabase
    .from('deliverables')
    .insert({
      project_id: projectId,
      creator_id: userId,
      file_url,
      file_name,
      file_size:    file_size    ?? null,
      mime_type:    mime_type    ?? null,
      storage_path: storage_path ?? null,
      notes:        notes        ?? null,
      type:         type         ?? 'draft',
    })
    .select()
    .single();

  if (delErr) throw delErr;

  // If there were open revisions, mark them as addressed
  await supabase
    .from('revision_requests')
    .update({ status: 'addressed', addressed_at: new Date().toISOString() })
    .eq('project_id', projectId)
    .eq('status', 'open');

  // Update project status → submitted
  const { data: updatedProject, error: projErr } = await supabase
    .from('projects')
    .update({ status: 'submitted' })
    .eq('id', projectId)
    .select(`
      *, 
      brand:brand_id     (id, username, avatar_url),
      creator:creator_id (id, username, avatar_url)
    `)
    .single();

  if (projErr) throw projErr;

  broadcastProjectUpdate(updatedProject, userId, 'project_submitted');
  emitToUser(updatedProject.brand_id, 'deliverable_submitted', {
    project:     updatedProject,
    deliverable,
  });

  logger.info('Deliverable submitted', {
    projectId,
    deliverableId: deliverable.id,
    version: deliverable.version,
    userId,
  });

  return { project: updatedProject, deliverable };
};


/**
 * Brand requests a revision on the latest deliverable.
 * Changes project status → 'revision_requested'.
 * Called by: POST /api/v1/projects/:id/revision
 * Role: brand
 */
export const requestRevision = async (
  projectId,
  userId,
  { deliverable_id, feedback },
) => {
  const project = await assertParty(projectId, userId);

  if (project.brand_id !== userId) {
    throw forbidden('Only the brand can request revisions');
  }
  if (project.status !== 'submitted') {
    throw badRequest('Revisions can only be requested after the creator submits deliverables');
  }

  // Verify deliverable belongs to this project
  const { data: deliverable, error: delErr } = await supabase
    .from('deliverables')
    .select('id, project_id')
    .eq('id', deliverable_id)
    .eq('project_id', projectId)
    .single();

  if (delErr || !deliverable) throw notFound('Deliverable not found on this project');

  const { data: revision, error: revErr } = await supabase
    .from('revision_requests')
    .insert({
      project_id:     projectId,
      deliverable_id,
      brand_id:       userId,
      feedback,
    })
    .select()
    .single();

  if (revErr) throw revErr;

  // Increment revision count on project
  await supabase
    .from('projects')
    .update({ revision_count: (project.revision_count || 0) + 1 })
    .eq('id', projectId);

  // Update project status → revision_requested
  const { data: updatedProject, error: projErr } = await supabase
    .from('projects')
    .update({ status: 'revision_requested' })
    .eq('id', projectId)
    .select(`
      *, 
      brand:brand_id     (id, username, avatar_url),
      creator:creator_id (id, username, avatar_url)
    `)
    .single();

  if (projErr) throw projErr;

  broadcastProjectUpdate(updatedProject, userId, 'revision_requested');
  emitToUser(updatedProject.creator_id, 'revision_requested', {
    project:  updatedProject,
    revision,
  });

  logger.info('Revision requested', { projectId, revisionId: revision.id, userId });
  return { project: updatedProject, revision };
};


/**
 * Brand approves the deliverable — project → 'approved'.
 * In a real Stripe integration you'd trigger payout here.
 * Called by: POST /api/v1/projects/:id/approve
 * Role: brand
 */
export const approveProject = async (projectId, userId) => {
  const project = await assertParty(projectId, userId);

  if (project.brand_id !== userId) {
    throw forbidden('Only the brand can approve and release payment');
  }
  if (project.status !== 'submitted') {
    throw badRequest('Project must be in "submitted" state to be approved');
  }

  // ── Stripe payout would go here ──────────────────────────────────────────
  // const transfer = await stripe.transfers.create({ ... });
  // const stripeTransferId = transfer.id;
  // ─────────────────────────────────────────────────────────────────────────

  const { data: updatedProject, error } = await supabase
    .from('projects')
    .update({
      status: 'completed',
      // stripe_transfer_id: stripeTransferId,  // ← uncomment when Stripe is wired
    })
    .eq('id', projectId)
    .select(`
      *, 
      brand:brand_id     (id, username, avatar_url),
      creator:creator_id (id, username, avatar_url)
    `)
    .single();

  if (error) throw error;

  broadcastProjectUpdate(updatedProject, userId, 'project_approved');
  emitToUser(updatedProject.creator_id, 'payment_released', {
    project: updatedProject,
    message: 'Your payment has been released! Congratulations.',
  });

  logger.info('Project approved & payment released', { projectId, userId });
  return updatedProject;
};


/**
 * Raise a dispute for a project.
 * Changes project status → 'disputed'.
 * Called by: POST /api/v1/projects/:id/dispute
 */
export const raiseDispute = async (projectId, userId, { reason }) => {
  const project = await assertParty(projectId, userId);

  if (['completed', 'cancelled'].includes(project.status)) {
    throw badRequest(`Cannot dispute a project that is already "${project.status}"`);
  }

  const { data: updatedProject, error } = await supabase
    .from('projects')
    .update({ 
      status: 'disputed',
      dispute_reason: reason,
      disputed_at: new Date().toISOString(),
      disputed_by: userId
    })
    .eq('id', projectId)
    .select(`
      *, 
      brand:brand_id     (id, username, avatar_url),
      creator:creator_id (id, username, avatar_url)
    `)
    .single();

  if (error) throw error;

  broadcastProjectUpdate(updatedProject, userId, 'project_disputed');
  logger.warn('Project disputed', { projectId, userId, reason });
  return updatedProject;
};


/**
 * Either party can cancel a project that hasn't been completed yet.
 * Called by: POST /api/v1/projects/:id/cancel
 */
export const cancelProject = async (projectId, userId, reason) => {
  const project = await assertParty(projectId, userId);

  if (['completed', 'cancelled'].includes(project.status)) {
    throw badRequest(`Cannot cancel a project that is already "${project.status}"`);
  }

  const { data: updatedProject, error } = await supabase
    .from('projects')
    .update({ status: 'cancelled' })
    .eq('id', projectId)
    .select(`
      *, 
      brand:brand_id     (id, username, avatar_url),
      creator:creator_id (id, username, avatar_url)
    `)
    .single();

  if (error) throw error;

  broadcastProjectUpdate(updatedProject, userId, 'project_cancelled');
  logger.warn('Project cancelled', { projectId, userId, reason });
  return updatedProject;
};
