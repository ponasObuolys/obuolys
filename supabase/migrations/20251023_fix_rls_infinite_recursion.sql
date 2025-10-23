-- Migration: Fix RLS infinite recursion by creating is_admin() function
-- Date: 2025-10-23
-- Description: Creates a SECURITY DEFINER function to check admin status without triggering RLS recursion
-- Bug: RLS policies on articles/tools/courses were checking profiles table, which also had RLS,
--      causing infinite recursion and 500 errors

-- ============================================
-- 1. ENSURE is_admin() FUNCTION EXISTS
-- ============================================

-- Note: Function already exists, just ensuring it has SECURITY DEFINER
-- If it doesn't exist, create it. If it exists, this will update it.
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER -- This bypasses RLS policies
STABLE
AS $$
DECLARE
    admin_status boolean;
    check_user_id uuid;
BEGIN
    -- Use provided user_id or fall back to current user
    check_user_id := COALESCE(user_id, auth.uid());

    -- If no user is authenticated, return false
    IF check_user_id IS NULL THEN
        RETURN false;
    END IF;

    -- Check if user is admin (bypasses RLS due to SECURITY DEFINER)
    SELECT is_admin INTO admin_status
    FROM public.profiles
    WHERE id = check_user_id;

    -- Return false if user not found
    RETURN COALESCE(admin_status, false);
END;
$$;

-- Grant execute to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, anon;

-- Add comment
COMMENT ON FUNCTION public.is_admin(uuid) IS 'Checks if a user is an admin. Uses SECURITY DEFINER to bypass RLS and prevent infinite recursion.';

-- ============================================
-- 2. UPDATE ARTICLES RLS POLICIES
-- ============================================

-- Drop existing admin policy
DROP POLICY IF EXISTS "Allow admin full access to articles" ON public.articles;

-- Recreate using is_admin() function
CREATE POLICY "Allow admin full access to articles"
    ON public.articles
    FOR ALL
    USING (public.is_admin());

-- ============================================
-- 3. UPDATE TOOLS RLS POLICIES
-- ============================================

-- Drop existing admin policy
DROP POLICY IF EXISTS "Allow admin full access to tools" ON public.tools;

-- Recreate using is_admin() function
CREATE POLICY "Allow admin full access to tools"
    ON public.tools
    FOR ALL
    USING (public.is_admin());

-- ============================================
-- 4. UPDATE COURSES RLS POLICIES
-- ============================================

-- Drop existing admin policy
DROP POLICY IF EXISTS "Allow admin full access to courses" ON public.courses;

-- Recreate using is_admin() function
CREATE POLICY "Allow admin full access to courses"
    ON public.courses
    FOR ALL
    USING (public.is_admin());

-- ============================================
-- 5. UPDATE PROFILES RLS POLICIES
-- ============================================

-- Drop existing admin policy
DROP POLICY IF EXISTS "Allow admin full access to profiles" ON public.profiles;

-- Recreate using is_admin() function
-- NOTE: For profiles, we need to be extra careful to avoid recursion
-- The is_admin() function itself reads profiles, so we use it carefully
CREATE POLICY "Allow admin full access to profiles"
    ON public.profiles
    FOR ALL
    USING (public.is_admin());

-- ============================================
-- 6. UPDATE CONTACT MESSAGES RLS POLICIES
-- ============================================

-- Drop existing admin policy
DROP POLICY IF EXISTS "Allow admin full access to contact messages" ON public.contact_messages;

-- Recreate using is_admin() function
CREATE POLICY "Allow admin full access to contact messages"
    ON public.contact_messages
    FOR ALL
    USING (public.is_admin());

-- ============================================
-- 7. UPDATE HERO SECTIONS RLS POLICIES
-- ============================================

-- Drop existing admin policy
DROP POLICY IF EXISTS "Allow admin full access to hero sections" ON public.hero_sections;

-- Recreate using is_admin() function
CREATE POLICY "Allow admin full access to hero sections"
    ON public.hero_sections
    FOR ALL
    USING (public.is_admin());

-- ============================================
-- 8. UPDATE CTA SECTIONS RLS POLICIES
-- ============================================

-- Drop existing admin policy
DROP POLICY IF EXISTS "Allow admin full access to cta sections" ON public.cta_sections;

-- Recreate using is_admin() function
CREATE POLICY "Allow admin full access to cta sections"
    ON public.cta_sections
    FOR ALL
    USING (public.is_admin());

-- ============================================
-- 9. UPDATE MIGRATION DOCUMENTATION RLS POLICIES
-- ============================================

-- Drop existing admin policy
DROP POLICY IF EXISTS "Allow admin full access to migration docs" ON public.migration_documentation;

-- Recreate using is_admin() function
CREATE POLICY "Allow admin full access to migration docs"
    ON public.migration_documentation
    FOR ALL
    USING (public.is_admin());

-- ============================================
-- 10. VERIFICATION
-- ============================================

-- Test the function works
DO $$
DECLARE
    test_result boolean;
BEGIN
    -- Test with NULL (anonymous user)
    test_result := public.is_admin(NULL);
    RAISE NOTICE 'is_admin(NULL) returns: %', test_result;

    -- Test with current user (if any)
    test_result := public.is_admin();
    RAISE NOTICE 'is_admin() returns: %', test_result;

    RAISE NOTICE 'RLS recursion fix migration completed successfully';
END $$;
