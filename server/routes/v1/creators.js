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


router.post('/instagram-sync', requireAuth, async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ success: false, message: 'Instagram username is required' });
    }
    // Simulate API fetch delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock data based on username
    const mockData = {
      username: username.toLowerCase().replace('@', ''),
      follower_count: Math.floor(Math.random() * (250000 - 15000) + 15000), // 15k to 250k
      engagement_rate: (Math.random() * (7.5 - 3.5) + 3.5).toFixed(1), // 3.5% to 7.5%
      bio: `Aesthetic lifestyle and fashion content creator based in Mumbai, India. Sharing daily reels, lookbooks, street styling, and transitions. For collaborations contact: ${username.replace('@', '')}@driplens.in`,
      category: 'Photography',
      platforms: ['Instagram', 'YouTube'],
      tags: ['Fashion', 'Lifestyle', 'Aesthetic', 'Streetwear', 'Cinematography'],
      min_budget: 15000,
      max_budget: 80000,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      banner_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800'
    };

    // Update profile in database using creatorService
    const updatedProfile = await creatorService.updateProfile(req.user.id, {
      bio: mockData.bio,
      category: mockData.category,
      instagram: mockData.username,
      avatar_url: mockData.avatar_url,
      banner_url: mockData.banner_url,
      min_budget: mockData.min_budget,
      max_budget: mockData.max_budget,
      follower_count: mockData.follower_count,
      platforms: mockData.platforms,
      tags: mockData.tags
    });

    res.json({ success: true, data: mockData });
  } catch (err) {
    next(err);
  }
});

export default router;
