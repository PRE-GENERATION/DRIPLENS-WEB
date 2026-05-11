-- Migration: Fix preferred_work_type to be text instead of text[]
-- This is because the backend and frontend treat it as a single string/value

alter table public.profiles 
  alter column preferred_work_type type text using (
    case 
      when preferred_work_type is null then null
      when array_length(preferred_work_type, 1) > 0 then preferred_work_type[1]
      else ''
    end
  );
