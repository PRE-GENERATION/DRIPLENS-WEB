import { Router } from 'express';
import * as opportunityService from '../../services/opportunityService.js';
import { 
  createOpportunitySchema, 
  applyOpportunitySchema, 
  updateApplicationStatusSchema,
} from '../../schemas/opportunitySchemas.js';
import { validate } from '../../middleware/validate.js';
import { protect, restrictTo } from '../../middleware/auth.js';

const router = Router();

/**
 * PUBLIC: List all live opportunities
 * GET /api/v1/opportunities
 */
router.get('/', async (req, res, next) => {
  try {
    const opportunities = await opportunityService.listOpportunities(req.query);
    res.json({ success: true, data: opportunities });
  } catch (err) {
    next(err);
  }
});

/**
 * PROTECTED (BRAND): Create an opportunity
 * POST /api/v1/opportunities
 */
router.post(
  '/',
  protect,
  restrictTo('brand'),
  validate(createOpportunitySchema),
  async (req, res, next) => {
    try {
      const opportunity = await opportunityService.createOpportunity(req.user.id, req.body);
      res.status(201).json({ success: true, data: opportunity });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PROTECTED (BRAND): List own opportunities
 * GET /api/v1/opportunities/my/brand
 * ⚠️  MUST be registered before /:id to avoid 'my' being captured as an id param
 */
router.get(
  '/my/brand',
  protect,
  restrictTo('brand'),
  async (req, res, next) => {
    try {
      const opportunities = await opportunityService.listBrandOpportunities(req.user.id);
      res.json({ success: true, data: opportunities });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PROTECTED (CREATOR): List own applications
 * GET /api/v1/opportunities/my/applications
 * ⚠️  MUST be registered before /:id to avoid 'my' being captured as an id param
 */
router.get(
  '/my/applications',
  protect,
  restrictTo('creator'),
  async (req, res, next) => {
    try {
      const applications = await opportunityService.listCreatorApplications(req.user.id);
      res.json({ success: true, data: applications });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PROTECTED (BRAND): Shortlist/Reject an application
 * PATCH /api/v1/opportunities/applications/:appId
 * ⚠️  MUST be registered before /:id to avoid 'applications' being captured as an id param
 */
router.patch(
  '/applications/:appId',
  protect,
  restrictTo('brand'),
  validate(updateApplicationStatusSchema),
  async (req, res, next) => {
    try {
      const application = await opportunityService.updateApplicationStatus(
        req.params.appId,
        req.user.id,
        req.body.status
      );
      res.json({ success: true, data: application });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUBLIC: Get single opportunity detail
 * GET /api/v1/opportunities/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const opportunity = await opportunityService.getOpportunity(req.params.id);
    res.json({ success: true, data: opportunity });
  } catch (err) {
    next(err);
  }
});

/**
 * PROTECTED (CREATOR): Apply to an opportunity
 * POST /api/v1/opportunities/:id/apply
 */
router.post(
  '/:id/apply',
  protect,
  restrictTo('creator'),
  validate(applyOpportunitySchema),
  async (req, res, next) => {
    try {
      const application = await opportunityService.applyToOpportunity(
        req.user.id,
        req.params.id,
        req.body
      );
      res.status(201).json({ success: true, data: application });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PROTECTED (BRAND): View applicants for an opportunity
 * GET /api/v1/opportunities/:id/applications
 */
router.get(
  '/:id/applications',
  protect,
  restrictTo('brand'),
  async (req, res, next) => {
    try {
      const applications = await opportunityService.getOpportunityApplications(
        req.params.id,
        req.user.id
      );
      res.json({ success: true, data: applications });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
