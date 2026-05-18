-- Migration: Fix profile array columns to ensure they are text[]
-- Created at: 2024-05-11

-- Check column types (for manual verification)
-- select column_name, data_type 
-- from information_schema.columns 
-- where table_name = 'profiles' 
-- and column_name in ('qualifications', 'past_work', 'tags', 'platforms');

alter table public.profiles
  alter column qualifications type text[] using 
    case when qualifications is null then null 
    else array[qualifications] end,
  alter column past_work type text[] using 
    case when past_work is null then null 
    else array[past_work] end,
  alter column tags type text[] using 
    case when tags is null then null 
    else array[tags] end,
  alter column platforms type text[] using 
    case when platforms is null then null 
    else array[platforms] end;
