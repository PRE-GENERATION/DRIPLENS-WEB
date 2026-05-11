-- Migration: 20240010_brand_opportunities.sql

-- 1. Add verification status to profiles
alter table public.profiles add column if not exists is_verified boolean default false;

-- 2. Opportunities table (posted by brands)
create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.profiles(id) on delete cascade,
  
  -- Basic Info
  title text not null check (char_length(title) between 3 and 150),
  description text not null,
  campaign_goal text,
  
  -- Creator Requirements
  city text,
  language text[], -- array of languages
  niche text[], -- array of niches
  min_followers int default 0,
  max_followers int,
  gender_preference text check (gender_preference in ('Any', 'Male', 'Female', 'Non-binary')),
  
  -- Deliverables
  num_reels int default 0,
  num_stories int default 0,
  num_photos int default 0,
  
  -- Budget
  budget_type text not null check (budget_type in ('Paid', 'Barter', 'Paid + Barter')),
  budget_amount numeric(12, 2) check (budget_amount >= 0),
  
  -- Timeline
  application_deadline timestamptz not null,
  content_deadline timestamptz not null,
  
  -- Extra Requirements
  raw_files_needed boolean default false,
  num_revisions int default 1,
  usage_rights boolean default false,
  usage_rights_details text,
  
  status text not null default 'live' check (status in ('draft', 'live', 'closed')),
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Applications table (creators applying to opportunities)
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  
  portfolio_snapshot jsonb, -- snap of creator's portfolio at time of app
  reel_links text[],
  intro_message text check (char_length(intro_message) <= 200),
  expected_price numeric(12, 2),
  intro_video_url text,
  
  status text not null default 'pending' check (status in ('pending', 'shortlisted', 'hired', 'rejected')),
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  constraint uq_one_app_per_creator unique (opportunity_id, creator_id)
);

-- 4. Payments / Escrow table
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references public.opportunities(id) on delete set null,
  brand_id uuid not null references public.profiles(id) on delete cascade,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  
  amount numeric(12, 2) not null check (amount > 0),
  status text not null default 'held' check (status in ('held', 'released', 'refunded')),
  payment_method text check (payment_method in ('UPI', 'Bank Transfer')),
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Triggers for updated_at
create trigger trg_opportunities_updated_at
  before update on public.opportunities
  for each row execute function public.set_updated_at();

create trigger trg_applications_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

create trigger trg_payments_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- 6. RLS
alter table public.opportunities enable row level security;
alter table public.applications enable row level security;
alter table public.payments enable row level security;

-- Opportunities Policies
create policy "opportunities: public read"
  on public.opportunities
  for select
  using (status = 'live');

create policy "opportunities: brand manage"
  on public.opportunities
  for all
  using (auth.uid() = brand_id)
  with check (auth.uid() = brand_id);

-- Applications Policies
create policy "applications: creator read"
  on public.applications
  for select
  using (auth.uid() = creator_id);

create policy "applications: brand read"
  on public.applications
  for select
  using (
    exists (
      select 1 from public.opportunities
      where id = applications.opportunity_id and brand_id = auth.uid()
    )
  );

create policy "applications: creator insert"
  on public.applications
  for insert
  with check (auth.uid() = creator_id);

create policy "applications: brand update status"
  on public.applications
  for update
  using (
    exists (
      select 1 from public.opportunities
      where id = applications.opportunity_id and brand_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.opportunities
      where id = applications.opportunity_id and brand_id = auth.uid()
    )
  );

-- Payments Policies
create policy "payments: parties read"
  on public.payments
  for select
  using (auth.uid() = brand_id or auth.uid() = creator_id);

create policy "payments: brand insert"
  on public.payments
  for insert
  with check (auth.uid() = brand_id);

create policy "payments: brand update"
  on public.payments
  for update
  using (auth.uid() = brand_id)
  with check (auth.uid() = brand_id);
