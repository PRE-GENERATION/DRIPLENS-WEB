import express from 'express';
import { supabase } from '../utils/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/messages/:requestId — Get thread
router.get('/:requestId', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id, content, is_read, created_at,
        sender:sender_id (id, username, avatar_url)
      `)
      .eq('hiring_request_id', req.params.requestId)
      .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });

    res.json({ messages: data });
  } catch (_err) {
    res.status(500).json({ error: 'Server error fetching messages' });
  }
});

// POST /api/messages/:requestId — Send a message
router.post('/:requestId', requireAuth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content?.trim()) return res.status(400).json({ error: 'Message cannot be empty' });

    const { data, error } = await supabase
      .from('messages')
      .insert({
        hiring_request_id: req.params.requestId,
        sender_id:         req.user.id,
        content:           content.trim()
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json({ message: data });
  } catch (_err) {
    res.status(500).json({ error: 'Server error sending message' });
  }
});

// PATCH /api/messages/:requestId/read — Mark all as read
router.patch('/:requestId/read', requireAuth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('hiring_request_id', req.params.requestId)
      .neq('sender_id', req.user.id);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ success: true });
  } catch (_err) {
    res.status(500).json({ error: 'Server error updating messages' });
  }
});

export default router;
