import { z } from 'zod';

// ── Project ────────────────────────────────────────────────────────────────

export const createProjectSchema = z.object({
  hiring_request_id:  z.string().uuid(),
  package_title:      z.string().min(1).max(100).optional(),
  package_price_str:  z.string().max(50).optional(),
  escrow_amount_paise: z.number().int().nonnegative().optional(),
  stripe_payment_intent_id: z.string().optional(),
  deadline:           z.string().date().optional(), // ISO date 'YYYY-MM-DD'
});

export const updateProgressSchema = z.object({
  progress: z.number().int().min(0).max(100),
  // Optional status override; usually derived server-side but allow client hint
  note: z.string().max(500).optional(),
});

// ── Deliverable ────────────────────────────────────────────────────────────

export const submitDeliverableSchema = z.object({
  file_url:    z.string().url('file_url must be a valid URL'),
  file_name:   z.string().min(1).max(255),
  file_size:   z.number().int().nonnegative().optional(),
  mime_type:   z.string().max(100).optional(),
  storage_path: z.string().optional(),
  notes:       z.string().max(2000).optional(),
  type:        z.enum(['draft', 'final_link', 'raw_files']).default('draft').optional(),
});

// ── Revision Request ──────────────────────────────────────────────────────

export const requestRevisionSchema = z.object({
  deliverable_id: z.string().uuid(),
  feedback:       z.string().min(10).max(3000),
});

// ── Dispute ──────────────────────────────────────────────────────────────────

export const raiseDisputeSchema = z.object({
  reason: z.string().min(10).max(3000),
});
