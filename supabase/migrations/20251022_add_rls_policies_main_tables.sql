-- Migration: Add RLS policies for main tables (articles, tools, courses)
-- Date: 2025-10-22
-- Description: Ensures Row Level Security is enabled and properly configured for public read access

-- ============================================
-- 1. ENABLE RLS ON MAIN TABLES
-- ============================================

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cta_sections ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. ARTICLES RLS POLICIES
-- ============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access for published articles" ON public.articles;
DROP POLICY IF EXISTS "Allow admin write access for articles" ON public.articles;
DROP POLICY IF EXISTS "Allow admin full access to articles" ON public.articles;

-- Public can read published articles
CREATE POLICY "Allow public read access for published articles"
    ON public.articles
    FOR SELECT
    USING (published = true);

-- Admin can do everything
CREATE POLICY "Allow admin full access to articles"
    ON public.articles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- ============================================
-- 3. TOOLS RLS POLICIES
-- ============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access for published tools" ON public.tools;
DROP POLICY IF EXISTS "Allow admin write access for tools" ON public.tools;
DROP POLICY IF EXISTS "Allow admin full access to tools" ON public.tools;

-- Public can read published tools
CREATE POLICY "Allow public read access for published tools"
    ON public.tools
    FOR SELECT
    USING (published = true);

-- Admin can do everything
CREATE POLICY "Allow admin full access to tools"
    ON public.tools
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- ============================================
-- 4. COURSES RLS POLICIES
-- ============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access for published courses" ON public.courses;
DROP POLICY IF EXISTS "Allow admin write access for courses" ON public.courses;
DROP POLICY IF EXISTS "Allow admin full access to courses" ON public.courses;

-- Public can read published courses
CREATE POLICY "Allow public read access for published courses"
    ON public.courses
    FOR SELECT
    USING (published = true);

-- Admin can do everything
CREATE POLICY "Allow admin full access to courses"
    ON public.courses
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- ============================================
-- 5. PROFILES RLS POLICIES
-- ============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow admin full access to profiles" ON public.profiles;

-- Public can read all profiles
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles
    FOR SELECT
    USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Admin can do everything
CREATE POLICY "Allow admin full access to profiles"
    ON public.profiles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- ============================================
-- 6. CONTACT MESSAGES RLS POLICIES
-- ============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow anyone to create contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admin read/update access for contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admin full access to contact messages" ON public.contact_messages;

-- Anyone can create contact messages
CREATE POLICY "Allow anyone to create contact messages"
    ON public.contact_messages
    FOR INSERT
    WITH CHECK (true);

-- Admin can read and update
CREATE POLICY "Allow admin full access to contact messages"
    ON public.contact_messages
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- ============================================
-- 7. HERO SECTIONS RLS POLICIES
-- ============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access for active sections" ON public.hero_sections;
DROP POLICY IF EXISTS "Allow admin write access" ON public.hero_sections;
DROP POLICY IF EXISTS "Allow admin full access to hero sections" ON public.hero_sections;

-- Public can read active hero sections
CREATE POLICY "Allow public read access for active hero sections"
    ON public.hero_sections
    FOR SELECT
    USING (active = true);

-- Admin can do everything
CREATE POLICY "Allow admin full access to hero sections"
    ON public.hero_sections
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- ============================================
-- 8. CTA SECTIONS RLS POLICIES
-- ============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access for active cta sections" ON public.cta_sections;
DROP POLICY IF EXISTS "Allow admin write access" ON public.cta_sections;
DROP POLICY IF EXISTS "Allow admin full access to cta sections" ON public.cta_sections;

-- Public can read active CTA sections
CREATE POLICY "Allow public read access for active cta sections"
    ON public.cta_sections
    FOR SELECT
    USING (active = true);

-- Admin can do everything
CREATE POLICY "Allow admin full access to cta sections"
    ON public.cta_sections
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- ============================================
-- 9. GRANT PERMISSIONS
-- ============================================

-- Grant usage on public schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant SELECT on tables to anon (public access)
GRANT SELECT ON public.articles TO anon, authenticated;
GRANT SELECT ON public.tools TO anon, authenticated;
GRANT SELECT ON public.courses TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT SELECT ON public.hero_sections TO anon, authenticated;
GRANT SELECT ON public.cta_sections TO anon, authenticated;

-- Grant INSERT on contact_messages to anon
GRANT INSERT ON public.contact_messages TO anon, authenticated;

-- ============================================
-- 10. VERIFICATION
-- ============================================

-- Verify RLS is enabled (this will show in migration logs)
DO $$
BEGIN
    RAISE NOTICE 'RLS enabled on articles: %', (SELECT relrowsecurity FROM pg_class WHERE relname = 'articles');
    RAISE NOTICE 'RLS enabled on tools: %', (SELECT relrowsecurity FROM pg_class WHERE relname = 'tools');
    RAISE NOTICE 'RLS enabled on courses: %', (SELECT relrowsecurity FROM pg_class WHERE relname = 'courses');
END $$;
