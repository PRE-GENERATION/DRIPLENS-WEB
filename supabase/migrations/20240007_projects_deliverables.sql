-- =============================================================================
-- DRIPLENS — Projects, Deliverables & Revision Requests
-- Migration: 20240007_projects_deliverables.sql
--
-- This migration adds the project lifecycle tables that back the
-- full 14-step brand↔creator workflow:
--
--   hiring_request → project → deliverable → revision_request → payout
--
-- Run AFTER 20240002_rls_policies.sql (depends on profiles, hiring_requests).
-- Apply via: Supabase SQL editor, or `supabase db push`.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- 0. New ENUM types
-- ---------------------------------------------------------------------------

create type public.project_status as enum (
  'in_progress',        -- creator is working
  'submitted',          -- creator submitted deliverable, awaiting brand review
  'revision_requested', -- brand requested changes
  'approved',           -- brand approved, payment queued for release
  'completed',          -- payment released, project archived
  'cancelled'           -- either party cancelled before completion
);

create type public.revision_status as enum (
  'open',       -- revision request sent, creator has not addressed it yet
  'addressed'   -- creator resubmitted after addressing the request
);


-- ---------------------------------------------------------------------------
-- 1. projects
--    One project per accepted hiring_request. Created automatically by the
--    server when the checkout (Step 8) is confirmed.
-- ---------------------------------------------------------------------------
create table public.projects (
  id                uuid            primary key default gen_random_uuid(),
  hiring_request_id uuid            not null unique references public.hiring_requests(id) on delete cascade,
  brand_id          uuid            not null references public.profiles(id) on delete cascade,
  creator_id        uuid            not null references public.profiles(id) on delete cascade,

  status            project_status  not null default 'in_progress',
  progress          integer         not null default 0 check (progress between 0 and 100),

  -- Escrow tracking (store in paisa/cents as integer to avoid float rounding)
  escrow_amount_paise  bigint       not null default 0 check (escrow_amount_paise >= 0),
  -- Stripe PaymentIntent ID — set when checkout is confirmed
  stripe_payment_intent_id  text    unique,

  -- Stripe Transfer ID — set when payment is released to creator
  stripe_transfer_id          text   unique,

  package_title     text,
  package_price_str text,          -- display string e.g. "₹15,000-₹25,000"

  deadline          date,

  created_at        timestamptz     not null default now(),
  updated_at        timestamptz     not null default now()
);

comment on table  public.projects is
  'One row per active / completed brand↔creator project. Drives the ProjectProgressPage.';
comment on column public.projects.progress is
  'Creator-reported percentage 0–100. Updated via PATCH /projects/:id/progress.';
comment on column public.projects.escrow_amount_paise is
  'Amount in smallest currency unit (paise / cents) held in escrow. Set at checkout.';
comment on column public.projects.stripe_payment_intent_id is
  'Stripe PaymentIntent ID used for escrow capture and release.';


-- ---------------------------------------------------------------------------
-- 2. deliverables
--    Each time the creator hits "Submit Project" a new row is created
--    (versioned). Brands see the latest deliverable.
-- ---------------------------------------------------------------------------
create table public.deliverables (
  id            uuid          primary key default gen_random_uuid(),
  project_id    uuid          not null references public.projects(id) on delete cascade,
  creator_id    uuid          not null references public.profiles(id) on delete cascade,

  -- File uploaded to Supabase Storage / external URL
  file_url      text          not null,
  storage_path  text,                    -- internal path for deletion; null for external URLs
  file_name     text          not null,  -- original filename for display
  file_size     bigint,                  -- bytes
  mime_type     text,

  version       integer       not null default 1, -- auto-incremented per project
  notes         text          check (char_length(notes) <= 2000),

  submitted_at  timestamptz   not null default now()
);

comment on table  public.deliverables is
  'Versioned project deliverables submitted by creators. Each resubmission increments version.';
comment on column public.deliverables.version is
  'Starts at 1 for first submission. Incremented on every resubmission (revision → resubmit cycle).';


-- ---------------------------------------------------------------------------
-- 3. revision_requests
--    Brand-authored feedback requests on a specific deliverable.
-- ---------------------------------------------------------------------------
create table public.revision_requests (
  id              uuid              primary key default gen_random_uuid(),
  project_id      uuid              not null references public.projects(id) on delete cascade,
  deliverable_id  uuid              not null references public.deliverables(id) on delete cascade,
  brand_id        uuid              not null references public.profiles(id) on delete cascade,

  feedback        text              not null check (char_length(feedback) between 10 and 3000),
  status          revision_status   not null default 'open',

  requested_at    timestamptz       not null default now(),
  addressed_at    timestamptz                -- set when creator resubmits
);

comment on table  public.revision_requests is
  'Brand-authored revision requests on a deliverable. Status flips to ''addressed'' on creator resubmission.';


-- ---------------------------------------------------------------------------
-- 4. Indexes
-- ---------------------------------------------------------------------------

-- projects
create index idx_projects_hiring_request on public.projects(hiring_request_id);
create index idx_projects_brand          on public.projects(brand_id);
create index idx_projects_creator        on public.projects(creator_id);
create index idx_projects_status         on public.projects(status);
create index idx_projects_updated_at     on public.projects(updated_at desc);

-- deliverables
create index idx_deliverables_project    on public.deliverables(project_id);
create index idx_deliverables_version    on public.deliverables(project_id, version desc);

-- revision_requests
create index idx_revisions_project       on public.revision_requests(project_id);
create index idx_revisions_deliverable   on public.revision_requests(deliverable_id);
create index idx_revisions_status        on public.revision_requests(project_id, status);


-- ---------------------------------------------------------------------------
-- 5. updated_at trigger for projects
-- ---------------------------------------------------------------------------
create trigger trg_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------------
-- 6. Auto-increment deliverable version per project (database trigger)
--    Called BEFORE INSERT so `new.version` is already set correctly.
-- ---------------------------------------------------------------------------
create or replace function public.set_deliverable_version()
returns trigger
language plpgsql
as $$
declare
  max_version integer;
begin
  select coalesce(max(version), 0)
    into max_version
    from public.deliverables
   where project_id = new.project_id;

  new.version = max_version + 1;
  return new;
end;
$$;

create trigger trg_deliverable_version
  before insert on public.deliverables
  for each row execute function public.set_deliverable_version();


-- ---------------------------------------------------------------------------
-- 7. RLS Policies
-- ---------------------------------------------------------------------------

alter table public.projects          enable row level security;
alter table public.deliverables      enable row level security;
alter table public.revision_requests enable row level security;


-- projects: a party (brand or creator) can read their own projects
create policy "project_party_select"
  on public.projects for select
  using (
    auth.uid() = brand_id or auth.uid() = creator_id
  );

-- projects: only the system (service_role) can insert (server creates project on checkout)
create policy "project_service_insert"
  on public.projects for insert
  with check (false);  -- blocked for normal users; server uses service_role key

-- projects: brand or creator can update their own project
create policy "project_party_update"
  on public.projects for update
  using (
    auth.uid() = brand_id or auth.uid() = creator_id
  );


-- deliverables: party can read
create policy "deliverable_party_select"
  on public.deliverables for select
  using (
    exists (
      select 1 from public.projects p
       where p.id = deliverables.project_id
         and (p.brand_id = auth.uid() or p.creator_id = auth.uid())
    )
  );

-- deliverables: only creator can insert
create policy "deliverable_creator_insert"
  on public.deliverables for insert
  with check (
    auth.uid() = creator_id
  );


-- revision_requests: party can read
create policy "revision_party_select"
  on public.revision_requests for select
  using (
    exists (
      select 1 from public.projects p
       where p.id = revision_requests.project_id
         and (p.brand_id = auth.uid() or p.creator_id = auth.uid())
    )
  );

-- revision_requests: only brand can insert
create policy "revision_brand_insert"
  on public.revision_requests for insert
  with check (
    auth.uid() = brand_id
  );


-- ---------------------------------------------------------------------------
-- 8. Realtime — publish projects so dashboards live-update status badges
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.projects;
alter publication supabase_realtime add table public.deliverables;
alter publication supabase_realtime add table public.revision_requests;


-- =============================================================================
-- Migration complete.
-- =============================================================================
