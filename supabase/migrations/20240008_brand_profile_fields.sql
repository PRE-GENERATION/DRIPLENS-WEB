-- BUG 3 — profiles table missing the new columns
alter table public.profiles
  add column if not exists brand_name       text,
  add column if not exists instagram_handle text,
  add column if not exists website          text,
  add column if not exists contact_person   text,
  add column if not exists phone_number     text;
