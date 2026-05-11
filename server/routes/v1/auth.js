import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { authLimiter } from '../../middleware/rateLimiter.js';
import { registerSchema, loginSchema } from '../../schemas/authSchemas.js';
import * as authService from '../../services/authService.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error('[POST /auth/register] Error:', err.message || err);
    next(err);
  }
});

router.post('/login', authLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.post('/refresh', authLimiter, async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'refresh_token required' } });
    const result = await authService.refreshToken(refresh_token);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
});

export default router;
