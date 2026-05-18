-- =============================================================================
-- DRIPLENS — Add Brand-Specific Columns to Profiles
-- Migration: 20240011_brand_profile_fields.sql
--
-- The registration flow sends brand_name, contact_person, phone,
-- instagram_handle (→ instagram column), website, and is_verified for brand
-- users, but these columns didn't exist on profiles, causing a 500 error on
-- INSERT.
--
-- NOTE: instagram and website may already exist from 20240003. The
-- "IF NOT EXISTS" clause makes this idempotent.
-- =============================================================================

alter table public.profiles
  add column if not exists brand_name      text check (char_length(brand_name) <= 100),
  add column if not exists contact_person  text check (char_length(contact_person) <= 100),
  add column if not exists phone           text check (char_length(phone) <= 20),
  add column if not exists is_verified     boolean default false,
  add column if not exists instagram       text check (char_length(instagram) <= 50),
  add column if not exists website         text check (char_length(website) <= 255);

comment on column public.profiles.brand_name     is 'Display name for brand accounts.';
comment on column public.profiles.contact_person is 'Primary contact person for the brand.';
comment on column public.profiles.phone          is 'Contact phone number.';
comment on column public.profiles.is_verified    is 'Whether the profile has been verified.';
comment on column public.profiles.instagram      is 'Instagram handle (without @).';
comment on column public.profiles.website        is 'Public portfolio or brand website URL.';
