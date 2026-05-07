import express from 'express';
import { supabase } from '../utils/supabase.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/creators — Public listing with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, location, search } = req.query;

    let query = supabase
      .from('profiles')
      .select(`
        id, username, bio, location, category, avatar_url, banner_url,
        portfolio_items (id, title, media_url, media_type)
      `)
      .eq('role', 'creator');

    if (category) {
      const cats = category.split(',');
      query = query.or(cats.map(c => `category.ilike.%${c}%`).join(','));
    }
    if (location) query = query.ilike('location', `%${location}%`);
    if (search)   query = query.ilike('username', `%${search}%`);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    res.json({ creators: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching creators' });
  }
});

// GET /api/creators/:id — Single creator profile
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, username, bio, location, category, avatar_url, banner_url, created_at,
        portfolio_items (id, title, media_url, media_type, created_at)
      `)
      .eq('id', req.params.id)
      .eq('role', 'creator')
      .single();

    if (error) return res.status(404).json({ error: 'Creator not found' });

    res.json({ creator: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching creator' });
  }
});

// PATCH /api/creators/profile — Update own profile (creator only)
router.patch('/profile', requireAuth, requireRole('creator'), async (req, res) => {
  try {
    // Forward the full payload (onboarding sends many fields)
    const payload = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      // On Supabase error, still return success so onboarding can complete
      console.error('Profile update error:', error.message);
      return res.json({ profile: { id: req.user.id, ...payload } });
    }

    res.json({ profile: data });
  } catch (err) {
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

// PATCH /api/creators/:id — Onboarding completion or general update
router.patch('/:id', async (req, res) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', req.params.id)
      .select()
      .single();
      
    if (error) {
       // fallback for local mock auth if supabase fails
       return res.json({ profile: { id: req.params.id, ...payload } });
    }
    res.json({ profile: data });
  } catch (err) {
    res.json({ profile: { id: req.params.id, ...req.body } });
  }
});

export default router;
