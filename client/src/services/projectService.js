/**
 * client/src/services/projectService.js
 *
 * Thin wrapper over api.js for all project-related calls.
 * All functions throw ApiError on failure — callers handle UI state.
 */
import { api } from '../lib/api';

/** List all projects for the logged-in user */
export const listProjects = () => api.get('/projects');

/** Fetch a single project with deliverables + revisions */
export const getProject = (projectId) => api.get(`/projects/${projectId}`);

/**
 * Brand creates a project after deal is confirmed.
 * @param {object} payload - { hiring_request_id, package_title, package_price_str, deadline? }
 */
export const createProject = (payload) => api.post('/projects', payload);

/**
 * Creator updates progress %.
 * @param {string} projectId
 * @param {number} progress  0–100
 */
export const updateProgress = (projectId, progress) =>
  api.patch(`/projects/${projectId}/progress`, { progress });

/**
 * Creator submits a deliverable via its public URL (e.g. after client-side upload).
 * @param {string} projectId
 * @param {{ file_url, file_name, file_size?, mime_type?, notes? }} payload
 */
export const submitDeliverable = (projectId, payload) =>
  api.post(`/projects/${projectId}/submit`, payload);

/**
 * Brand requests a revision.
 * @param {string} projectId
 * @param {{ deliverable_id, feedback }} payload
 */
export const requestRevision = (projectId, payload) =>
  api.post(`/projects/${projectId}/revision`, payload);

/**
 * Brand approves deliverable — releases payment.
 */
export const approveProject = (projectId) =>
  api.post(`/projects/${projectId}/approve`, {});

/**
 * Either party cancels the project.
 */
export const cancelProject = (projectId, reason = '') =>
  api.post(`/projects/${projectId}/cancel`, { reason });
