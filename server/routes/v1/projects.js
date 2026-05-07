/**
 * /api/v1/projects
 *
 * Endpoint map:
 *
 *   GET    /                → list all projects for the auth'd user
 *   POST   /                → create a project on checkout confirmation (brand)
 *   GET    /:id             → get full project detail with deliverables + revisions
 *   PATCH  /:id/progress    → creator updates progress %
 *   POST   /:id/submit      → creator submits a deliverable (file URL)
 *   POST   /:id/revision    → brand requests a revision
 *   POST   /:id/approve     → brand approves + releases payment
 *   POST   /:id/cancel      → either party cancels
 */

import { Router } from 'express';
import multer     from 'multer';

import { requireAuth, requireRole }    from '../../middleware/auth.js';
import { apiLimiter, uploadLimiter }   from '../../middleware/rateLimiter.js';
import { validate }                    from '../../middleware/validate.js';
import * as uploadService              from '../../services/uploadService.js';
import * as projectService             from '../../services/projectService.js';
import {
  createProjectSchema,
  updateProgressSchema,
  submitDeliverableSchema,
  requestRevisionSchema,
}                                      from '../../schemas/projectSchemas.js';

const router = Router();

// Multer — memory storage for deliverable file uploads (max 200 MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 200 * 1024 * 1024 },
});

// ── List projects ─────────────────────────────────────────────────────────

router.get('/', requireAuth, apiLimiter, async (req, res, next) => {
  try {
    const projects = await projectService.listProjects(req.user.id);
    res.json({ success: true, data: { projects } });
  } catch (err) { next(err); }
});

// ── Create project (brand, on checkout confirmation) ──────────────────────

router.post(
  '/',
  requireAuth,
  requireRole('brand'),
  apiLimiter,
  validate(createProjectSchema),
  async (req, res, next) => {
    try {
      const project = await projectService.createProject({
        ...req.body,
        brand_id: req.user.id,
      });
      res.status(201).json({ success: true, data: { project } });
    } catch (err) { next(err); }
  },
);

// ── Get single project ────────────────────────────────────────────────────

router.get('/:id', requireAuth, apiLimiter, async (req, res, next) => {
  try {
    const project = await projectService.getProject(req.params.id, req.user.id);
    res.json({ success: true, data: { project } });
  } catch (err) { next(err); }
});

// ── Update progress (creator) ─────────────────────────────────────────────

router.patch(
  '/:id/progress',
  requireAuth,
  requireRole('creator'),
  apiLimiter,
  validate(updateProgressSchema),
  async (req, res, next) => {
    try {
      const project = await projectService.updateProgress(
        req.params.id,
        req.user.id,
        req.body,
      );
      res.json({ success: true, data: { project } });
    } catch (err) { next(err); }
  },
);

// ── Submit deliverable via file upload (creator) ──────────────────────────
//
// Two modes:
//   1. Multipart/form-data → file uploaded to Supabase Storage via uploadService
//   2. JSON body with existing file_url (already uploaded elsewhere)
//
// Mode 1 is preferred for production; mode 2 is a convenience for testing.

router.post(
  '/:id/submit',
  requireAuth,
  requireRole('creator'),
  uploadLimiter,
  // Conditionally parse multipart (if client sends a file) or JSON (if URL provided)
  (req, res, next) => {
    const contentType = req.headers['content-type'] ?? '';
    if (contentType.includes('multipart/form-data')) {
      return upload.single('deliverable')(req, res, next);
    }
    next();
  },
  async (req, res, next) => {
    try {
      let file_url, file_name, file_size, mime_type, storage_path, notes;

      if (req.file) {
        // Mode 1: file uploaded in this request → push to Supabase Storage
        const uploaded = await uploadService.uploadDeliverable(
          req.user.id,
          req.params.id,
          req.file,
        );
        file_url      = uploaded.publicUrl;
        file_name     = req.file.originalname;
        file_size     = req.file.size;
        mime_type     = req.file.mimetype;
        storage_path  = uploaded.storagePath;
        notes         = req.body?.notes ?? null;
      } else {
        // Mode 2: client already has the URL (e.g. Supabase Storage SDK used client-side)
        const parsed = submitDeliverableSchema.safeParse(req.body);
        if (!parsed.success) {
          const messages = parsed.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
          return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: messages } });
        }
        ({ file_url, file_name, file_size, mime_type, storage_path, notes } = parsed.data);
      }

      const result = await projectService.submitDeliverable(
        req.params.id,
        req.user.id,
        { file_url, file_name, file_size, mime_type, storage_path, notes },
      );

      res.status(201).json({ success: true, data: result });
    } catch (err) { next(err); }
  },
);

// ── Request revision (brand) ──────────────────────────────────────────────

router.post(
  '/:id/revision',
  requireAuth,
  requireRole('brand'),
  apiLimiter,
  validate(requestRevisionSchema),
  async (req, res, next) => {
    try {
      const result = await projectService.requestRevision(
        req.params.id,
        req.user.id,
        req.body,
      );
      res.status(201).json({ success: true, data: result });
    } catch (err) { next(err); }
  },
);

// ── Approve + release payment (brand) ────────────────────────────────────

router.post(
  '/:id/approve',
  requireAuth,
  requireRole('brand'),
  apiLimiter,
  async (req, res, next) => {
    try {
      const project = await projectService.approveProject(req.params.id, req.user.id);
      res.json({ success: true, data: { project } });
    } catch (err) { next(err); }
  },
);

// ── Cancel project ────────────────────────────────────────────────────────

router.post(
  '/:id/cancel',
  requireAuth,
  apiLimiter,
  async (req, res, next) => {
    try {
      const project = await projectService.cancelProject(
        req.params.id,
        req.user.id,
        req.body?.reason,
      );
      res.json({ success: true, data: { project } });
    } catch (err) { next(err); }
  },
);

export default router;
