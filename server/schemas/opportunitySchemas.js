import { z } from 'zod';

export const createOpportunitySchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().min(10),
  campaign_goal: z.string().optional(),
  
  city: z.string().optional(),
  language: z.array(z.string()).default([]),
  niche: z.array(z.string()).default([]),
  min_followers: z.number().int().min(0).default(0),
  max_followers: z.number().int().optional(),
  gender_preference: z.enum(['Any', 'Male', 'Female', 'Non-binary']).default('Any'),
  
  num_reels: z.number().int().min(0).default(0),
  num_stories: z.number().int().min(0).default(0),
  num_photos: z.number().int().min(0).default(0),
  
  budget_type: z.enum(['Paid', 'Barter', 'Paid + Barter']),
  budget_amount: z.number().min(0).optional(),
  
  application_deadline: z.string().datetime(),
  content_deadline: z.string().datetime(),
  
  raw_files_needed: z.boolean().default(false),
  num_revisions: z.number().int().min(0).default(1),
  usage_rights: z.boolean().default(false),
  usage_rights_details: z.string().optional(),
  
  status: z.enum(['draft', 'live', 'closed']).default('live')
});

export const applyOpportunitySchema = z.object({
  portfolio_snapshot: z.any().optional(),
  reel_links: z.array(z.string().url()).optional(),
  intro_message: z.string().max(200).optional(),
  expected_price: z.number().min(0).optional(),
  intro_video_url: z.string().url().optional()
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['pending', 'shortlisted', 'hired', 'rejected'])
});

export const createPaymentSchema = z.object({
  opportunity_id: z.string().uuid().optional(),
  creator_id: z.string().uuid(),
  amount: z.number().positive(),
  payment_method: z.enum(['UPI', 'Bank Transfer']).optional()
});
