-- Migration: 20240008_portfolio_projects.sql
-- Create portfolio projects table and link portfolio items

-- 1. Create portfolio_projects table
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id    UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title         TEXT          NOT NULL CHECK (char_length(title) BETWEEN 1 AND 100),
    description   TEXT          CHECK (char_length(description) <= 2000),
    category      TEXT          NOT NULL CHECK (char_length(category) BETWEEN 1 AND 50),
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- 2. Add project_id to portfolio_items
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolio_items' AND column_name='project_id') THEN
        ALTER TABLE public.portfolio_items ADD COLUMN project_id UUID REFERENCES public.portfolio_projects(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 3. Enable RLS
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Anyone can view portfolio projects
CREATE POLICY "portfolio_projects: public read"
    ON public.portfolio_projects
    FOR SELECT
    USING (true);

-- Only authenticated creators can insert their own projects
CREATE POLICY "portfolio_projects: creator insert"
    ON public.portfolio_projects
    FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated'
        AND auth.uid() = creator_id
    );

-- Only owners can update their own projects
CREATE POLICY "portfolio_projects: creator update"
    ON public.portfolio_projects
    FOR UPDATE
    USING (auth.uid() = creator_id)
    WITH CHECK (auth.uid() = creator_id);

-- Only owners can delete their own projects
CREATE POLICY "portfolio_projects: creator delete"
    ON public.portfolio_projects
    FOR DELETE
    USING (auth.uid() = creator_id);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_creator_id ON public.portfolio_projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_project_id ON public.portfolio_items(project_id);

-- 6. Trigger for updated_at
CREATE TRIGGER trg_portfolio_projects_updated_at
    BEFORE UPDATE ON public.portfolio_projects
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
