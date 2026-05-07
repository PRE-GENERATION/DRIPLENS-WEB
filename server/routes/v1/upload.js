import { Router } from 'express';
import multer from 'multer';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { uploadLimiter, apiLimiter } from '../../middleware/rateLimiter.js';
import { validate } from '../../middleware/validate.js';
import { uploadMetaSchema } from '../../schemas/uploadSchemas.js';
import { listCreatorsSchema } from '../../schemas/creatorSchemas.js';
import * as uploadService from '../../services/uploadService.js';
import { z } from 'zod';

const router = Router();

// File size limit enforced at multer level — 500MB hard cap
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 500 * 1024 * 1024 }
});

router.post(
  '/portfolio',
  requireAuth,
  requireRole('creator'),
  uploadLimiter,
  upload.single('media'),
  validate(uploadMetaSchema),
  async (req, res, next) => {
    try {
      const item = await uploadService.uploadPortfolio(req.user.id, req.file, req.body);
      res.status(201).json({ success: true, data: { item } });
    } catch (err) { next(err); }
  }
);

router.post(
  '/avatar',
  requireAuth,
  uploadLimiter,
  upload.single('avatar'),
  async (req, res, next) => {
    try {
      const { publicUrl } = await uploadService.uploadProfileImage(req.user.id, req.file, 'avatar');
      res.json({ success: true, data: { publicUrl } });
    } catch (err) { next(err); }
  }
);

router.post(
  '/banner',
  requireAuth,
  uploadLimiter,
  upload.single('banner'),
  async (req, res, next) => {
    try {
      const { publicUrl } = await uploadService.uploadProfileImage(req.user.id, req.file, 'banner');
      res.json({ success: true, data: { publicUrl } });
    } catch (err) { next(err); }
  }
);

// POST /api/v1/upload/resume — portfolio document (PDF/DOC)
router.post(
  '/resume',
  requireAuth,
  uploadLimiter,
  upload.single('resume'),
  async (req, res, next) => {
    try {
      const { publicUrl } = await uploadService.uploadProfileImage(req.user.id, req.file, 'resume');
      res.json({ success: true, data: { publicUrl } });
    } catch (err) { next(err); }
  }
);

const paginationSchema = listCreatorsSchema.pick({ page: true, limit: true }).extend({
  creator_id: z.string().uuid().optional()
});

router.get('/', apiLimiter, validate(paginationSchema, 'query'), async (req, res, next) => {
  try {
    const result = await uploadService.listPortfolio(req.query);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

export default router;
