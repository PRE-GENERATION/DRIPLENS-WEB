-- =============================================================================
-- DRIPLENS — Add LinkedIn to Profiles
-- Migration: 20240009_add_linkedin_social.sql
-- =============================================================================

alter table public.profiles
  add column if not exists linkedin text check (char_length(linkedin) <= 100);

comment on column public.profiles.linkedin is 'LinkedIn profile URL or handle.';
