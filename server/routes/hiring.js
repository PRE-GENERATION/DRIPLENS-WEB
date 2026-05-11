import express from 'express';
import { supabase } from '../utils/supabase.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// POST /api/hiring — Brand sends request to creator
router.post('/', requireAuth, requireRole('brand'), async (req, res) => {
  try {
    const { creator_id, project_title, project_description, budget } = req.body;

    const { data, error } = await supabase
      .from('hiring_requests')
      .insert({
        brand_id: req.user.id,
        creator_id,
        project_title,
        project_description,
        budget: parseFloat(budget) || 0
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json({ request: data });
  } catch (_err) {
    res.status(500).json({ error: 'Server error creating request' });
  }
});

// GET /api/hiring — Get all requests involving current user
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('hiring_requests')
      .select(`
        *,
        brand:brand_id (id, username, avatar_url),
        creator:creator_id (id, username, avatar_url)
      `)
      .or(`brand_id.eq.${userId},creator_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    res.json({ requests: data });
  } catch (_err) {
    res.status(500).json({ error: 'Server error fetching requests' });
  }
});

// PATCH /api/hiring/:id/status — Update request status
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Accepted','Declined','Completed','Review'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabase
      .from('hiring_requests')
      .update({ status })
      .eq('id', req.params.id)
      .or(`brand_id.eq.${req.user.id},creator_id.eq.${req.user.id}`)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.json({ request: data });
  } catch (_err) {
    res.status(500).json({ error: 'Server error updating status' });
  }
});

export default router;
