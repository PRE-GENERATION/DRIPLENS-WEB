-- Fix 4 — Add onboarding_complete column to profiles table
alter table public.profiles
  add column if not exists onboarding_complete boolean default false;
