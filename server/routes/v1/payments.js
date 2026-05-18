import { Router } from 'express';
import * as opportunityService from '../../services/opportunityService.js';
import { createPaymentSchema } from '../../schemas/opportunitySchemas.js';
import { validate } from '../../middleware/validate.js';
import { protect, restrictTo } from '../../middleware/auth.js';

const router = Router();

/**
 * PROTECTED (BRAND): Create payment (deposit to escrow)
 * POST /api/v1/payments
 */
router.post(
  '/',
  protect,
  restrictTo('brand'),
  validate(createPaymentSchema),
  async (req, res, next) => {
    try {
      const payment = await opportunityService.createPayment(req.user.id, req.body);
      res.status(201).json({ status: 'success', data: payment });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PROTECTED (BRAND): Release payment
 * PATCH /api/v1/payments/:id/release
 */
router.patch(
  '/:id/release',
  protect,
  restrictTo('brand'),
  async (req, res, next) => {
    try {
      const payment = await opportunityService.releasePayment(req.params.id, req.user.id);
      res.json({ status: 'success', data: payment });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PROTECTED: List own payments
 * GET /api/v1/payments
 */
router.get(
  '/',
  protect,
  async (req, res, next) => {
    try {
      const payments = await opportunityService.listUserPayments(req.user.id);
      res.json({ status: 'success', data: payments });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
