import { z } from 'zod';

export const listCreatorsSchema = z.object({
  category:   z.string().max(200).optional(),
  location:   z.string().max(100).optional(),
  search:     z.string().max(100).optional(),
  minBudget:  z.coerce.number().optional(),
  maxBudget:  z.coerce.number().optional(),
  followerTier: z.enum(['Nano', 'Micro', 'Mid', 'Macro', 'Mega', 'Any']).optional(),
  platforms:  z.string().optional(), // Comma-separated
  isAvailable: z.coerce.boolean().optional(),
  minRating:  z.coerce.number().min(0).max(5).optional(),
  tags:       z.string().optional(), // Comma-separated
  page:       z.coerce.number().int().positive().default(1),
  limit:      z.coerce.number().int().min(1).max(100).default(50)
});

export const updateProfileSchema = z.object({
  // Shared display fields
  bio:           z.string().max(500).optional(),
  location:      z.string().max(100).optional(),
  category:      z.string().max(200).optional(),
  avatar_url:    z.string().url().or(z.literal('')).optional(),
  banner_url:    z.string().url().or(z.literal('')).optional(),
  // Social links (from 20240003_add_social_links migration)
  instagram:     z.string().max(50).optional(),
  twitter:       z.string().max(50).optional(),
  linkedin:      z.string().max(100).optional(),
  website:       z.string().url().or(z.literal('')).optional(),
  // Advanced filter fields (from 20240005 migration)
  min_budget:    z.number().optional(),
  max_budget:    z.number().optional(),
  follower_count: z.number().int().optional(),
  platforms:     z.array(z.string()).optional(),
  is_available:  z.boolean().optional(),
  rating:        z.number().min(0).max(5).optional(),
  tags:          z.array(z.string()).optional(),
  // Onboarding fields (from 20240005 migration)
  display_name:       z.string().max(100).optional(),
  tagline:            z.string().max(80).optional(),
  primary_platform:   z.string().max(50).optional(),
  audience_tier:      z.enum(['Nano', 'Micro', 'Macro', 'Mega']).nullable().optional(),
  qualifications:     z.array(z.string()).optional(),
  past_work:          z.array(z.string()).optional(),
  preferred_work_type: z.array(z.string()).optional(),
  onboarding_complete: z.boolean().optional(),
}).strict();
