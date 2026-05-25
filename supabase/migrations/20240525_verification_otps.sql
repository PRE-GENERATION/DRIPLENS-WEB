-- Create verification_otps table
CREATE TABLE IF NOT EXISTS public.verification_otps (
  email text primary key,
  code text not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

-- RLS policies
ALTER TABLE public.verification_otps ENABLE ROW LEVEL SECURITY;

-- Only service role can access this table directly
CREATE POLICY "Service role has full access to verification_otps"
  ON public.verification_otps
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');
