import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { apiLimiter } from '../../middleware/rateLimiter.js';
import { listCreatorsSchema, updateCreatorProfileSchema } from '../../schemas/creatorSchemas.js';
import { supabase } from '../../utils/supabase.js';
import { AppError } from '../../utils/AppError.js';

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
    const userId = req.user.id;
    const updates = req.body;

    // Handle platform_urls — store as JSONB
    const dbPayload = {
      ...updates,
      platform_urls: updates.platform_urls ? JSON.stringify(updates.platform_urls) : undefined,
      updated_at: new Date().toISOString(),
    };

    // Remove undefined keys
    Object.keys(dbPayload).forEach(k => dbPayload[k] === undefined && delete dbPayload[k]);

    const { error } = await supabase
      .from('profiles')
      .update(dbPayload)
      .eq('id', userId);

    if (error) throw new AppError(error.message, 500, 'DB_ERROR');

    res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    next(err);
  }
});


export default router;
