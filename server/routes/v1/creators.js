import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/auth.js';
import { apiLimiter } from '../../middleware/rateLimiter.js';
import { listCreatorsSchema, updateCreatorProfileSchema } from '../../schemas/creatorSchemas.js';
import * as creatorService from '../../services/creatorService.js';

const router = Router();

router.get('/', apiLimiter, validate(listCreatorsSchema, 'query'), async (req, res, next) => {
  try {
    const result = await creatorService.listCreators(req.query);
    res.json({ success: true, data: result });
  } catch (err) { console.error(err); next(err); }
});

router.get('/:id', apiLimiter, async (req, res, next) => {
  try {
    console.log('Searching for creator id:', req.params.id);
    const creator = await creatorService.getCreator(req.params.id);
    res.json({ success: true, data: { creator } });
  } catch (err) { console.error(err); next(err); }
});

router.patch('/profile', requireAuth, validate(updateCreatorProfileSchema), async (req, res, next) => {
  try {
    const profile = await creatorService.updateProfile(req.user.id, req.body);
    res.json({ success: true, data: { profile } });
  } catch (err) {
    console.error('PATCH /profile error:', err.message, err.details, err.hint);
    next(err);
  }
});


export default router;
