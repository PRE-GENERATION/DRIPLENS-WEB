/**
 * opportunityService.js
 *
 * Database interactions for Opportunities, Applications, and Payments.
 */

import { supabase } from '../utils/supabase.js';
import { emitToUser } from '../utils/socket.js';
import logger from '../utils/logger.js';
import {
  forbidden,
  notFound,
  conflict,
} from '../utils/AppError.js';

// ─────────────────────────────────────────────────────────────────────────────
// Opportunities
// ─────────────────────────────────────────────────────────────────────────────

export const createOpportunity = async (brandId, opportunityData) => {
  const { data, error } = await supabase
    .from('opportunities')
    .insert({ ...opportunityData, brand_id: brandId })
    .select()
    .single();

  if (error) throw error;
  logger.info('Opportunity created', { opportunityId: data.id, brandId });
  return data;
};

export const listOpportunities = async (filters = {}) => {
  let query = supabase
    .from('opportunities')
    .select(`
      *,
      brand:brand_id (id, username, avatar_url, is_verified)
    `)
    .eq('status', 'live')
    .order('created_at', { ascending: false });

  if (filters.city) query = query.eq('city', filters.city);
  if (filters.budget_type) query = query.eq('budget_type', filters.budget_type);
  if (filters.niche) query = query.contains('niche', [filters.niche]);
  if (filters.language) query = query.contains('language', [filters.language]);

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getOpportunity = async (id) => {
  const { data, error } = await supabase
    .from('opportunities')
    .select(`
      *,
      brand:brand_id (id, username, avatar_url, is_verified, bio)
    `)
    .eq('id', id)
    .single();

  if (error || !data) throw notFound('Opportunity not found');
  return data;
};

export const listBrandOpportunities = async (brandId) => {
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('brand_id', brandId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// Applications
// ─────────────────────────────────────────────────────────────────────────────

export const applyToOpportunity = async (creatorId, opportunityId, applicationData) => {
  // Check if already applied
  const { data: existing } = await supabase
    .from('applications')
    .select('id')
    .eq('opportunity_id', opportunityId)
    .eq('creator_id', creatorId)
    .maybeSingle();

  if (existing) throw conflict('You have already applied to this opportunity');

  const { data, error } = await supabase
    .from('applications')
    .insert({
      ...applicationData,
      opportunity_id: opportunityId,
      creator_id: creatorId
    })
    .select()
    .single();

  if (error) throw error;

  // Notify brand
  const { data: opp } = await supabase
    .from('opportunities')
    .select('brand_id')
    .eq('id', opportunityId)
    .single();
  
  if (opp) {
    emitToUser(opp.brand_id, 'new_application', { opportunity_id: opportunityId });
  }

  logger.info('Application submitted', { applicationId: data.id, creatorId, opportunityId });
  return data;
};

export const getOpportunityApplications = async (opportunityId, brandId) => {
  // Verify ownership
  const { data: opp } = await supabase
    .from('opportunities')
    .select('brand_id')
    .eq('id', opportunityId)
    .single();

  if (!opp || opp.brand_id !== brandId) throw forbidden('Not authorized');

  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      creator:creator_id (
        id, username, avatar_url, location, category,
        follower_count, rating, niche
      )
    `)
    .eq('opportunity_id', opportunityId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const updateApplicationStatus = async (appId, brandId, status) => {
  // Verify ownership via join
  const { data: app, error: fetchErr } = await supabase
    .from('applications')
    .select('*, opportunities!inner(brand_id)')
    .eq('id', appId)
    .single();

  if (fetchErr || !app) throw notFound('Application not found');
  if (app.opportunities.brand_id !== brandId) throw forbidden('Not authorized');

  const { data, error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', appId)
    .select()
    .single();

  if (error) throw error;

  // Notify creator
  emitToUser(app.creator_id, 'application_status_updated', {
    application_id: appId,
    status
  });

  logger.info('Application status updated', { appId, status, brandId });
  return data;
};

export const listCreatorApplications = async (creatorId) => {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      opportunity:opportunity_id (id, title, budget_type, budget_amount, application_deadline, content_deadline, brand:brand_id(username))
    `)
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// Payments
// ─────────────────────────────────────────────────────────────────────────────

export const createPayment = async (brandId, paymentData) => {
  const { data, error } = await supabase
    .from('payments')
    .insert({ ...paymentData, brand_id: brandId })
    .select()
    .single();

  if (error) throw error;

  // Notify creator
  emitToUser(paymentData.creator_id, 'payment_received', {
    amount: paymentData.amount,
    status: 'held'
  });

  logger.info('Payment created (escrow)', { paymentId: data.id, brandId });
  return data;
};

export const releasePayment = async (paymentId, brandId) => {
  const { data: payment } = await supabase
    .from('payments')
    .select('brand_id, creator_id, amount')
    .eq('id', paymentId)
    .single();

  if (!payment || payment.brand_id !== brandId) throw forbidden('Not authorized');

  const { data, error } = await supabase
    .from('payments')
    .update({ status: 'released' })
    .eq('id', paymentId)
    .select()
    .single();

  if (error) throw error;

  // Notify creator
  emitToUser(payment.creator_id, 'payment_released', {
    payment_id: paymentId,
    amount: payment.amount
  });

  logger.info('Payment released', { paymentId, brandId });
  return data;
};

export const listUserPayments = async (userId) => {
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      brand:brand_id (username, avatar_url),
      creator:creator_id (username, avatar_url),
      opportunity:opportunity_id (title)
    `)
    .or(`brand_id.eq.${userId},creator_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
