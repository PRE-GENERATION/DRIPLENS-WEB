-- Migration: 20240512_workflow_fixes.sql
-- Description: Adding missing workflow pieces (disputes, GST, deliverable types, revision tracking)

-- 1. Update project_status enum to include 'disputed'
-- Note: In PostgreSQL, we can't easily remove values, but we can add them.
ALTER TYPE public.project_status ADD VALUE IF NOT EXISTS 'disputed';

-- 2. Add GST and Company details to profiles for Brands
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gst_number text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_proof_url text;

-- 3. Track revisions on projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS revision_count integer DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS max_revisions integer DEFAULT 1;

-- 4. Add dispute details to projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS dispute_reason text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS disputed_at timestamptz;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS disputed_by uuid REFERENCES public.profiles(id);

-- 5. Add deliverable type and approval status to deliverables
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'deliverable_type') THEN
        CREATE TYPE public.deliverable_type AS ENUM ('draft', 'final_link', 'raw_files');
    END IF;
END $$;

ALTER TABLE public.deliverables ADD COLUMN IF NOT EXISTS type public.deliverable_type DEFAULT 'draft';
ALTER TABLE public.deliverables ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT false;

-- 6. Add notification preferences (placeholders for future WhatsApp/Email integration)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp_notifications boolean DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_notifications boolean DEFAULT true;

-- 7. Add Usage Rights details to projects (copied from opportunity on creation)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS usage_rights_summary text;

COMMENT ON COLUMN public.projects.revision_count IS 'Number of revisions already requested by the brand.';
COMMENT ON COLUMN public.deliverables.type IS 'Distinguishes between a draft for approval and the final live link or raw files.';
