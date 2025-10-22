# Deployment Fix - Content Loading Issues on Vercel

**Date**: 2025-10-22
**Issue**: Content not loading on production (Vercel) - articles, trending articles, tools, and courses stuck on "Loading..." state

## Root Causes Identified

### 1. Missing Row Level Security (RLS) Policies
**Problem**: Main tables (articles, tools, courses, profiles, etc.) did not have proper RLS policies configured in migrations.

**Impact**: Supabase was blocking public read access to content, causing all queries to fail silently on production.

**Fix**: Created comprehensive RLS migration file: `supabase/migrations/20251022_add_rls_policies_main_tables.sql`

This migration:
- Enables RLS on all main tables
- Creates public read access policies for published content
- Creates admin full access policies
- Grants proper permissions to anon and authenticated roles
- Includes verification checks

### 2. Missing Field in `get_trending_articles` Function
**Problem**: The PostgreSQL function `get_trending_articles` was returning data without the `description` field, but TypeScript interface expected it.

**Impact**: TrendingArticles widget would fail when trying to display article descriptions.

**Fix**: Updated two files:
1. **Migration**: `supabase/migrations/20250120_trending_and_device_stats.sql`
   - Added `description TEXT` to return type
   - Added `a.description` to SELECT clause
   - Added `a.description` to GROUP BY clause

2. **TypeScript Types**: `src/integrations/supabase/types.ts`
   - Added `description: string` to return type interface

## Changes Made

### 1. Database Migrations

#### New Migration File
**File**: `supabase/migrations/20251022_add_rls_policies_main_tables.sql`

Creates comprehensive RLS policies for:
- ✅ articles (public read for published, admin full access)
- ✅ tools (public read for published, admin full access)
- ✅ courses (public read for published, admin full access)
- ✅ profiles (public read all, users update own, admin full access)
- ✅ contact_messages (public insert, admin full access)
- ✅ hero_sections (public read active, admin full access)
- ✅ cta_sections (public read active, admin full access)

#### Updated Migration File
**File**: `supabase/migrations/20250120_trending_and_device_stats.sql`

Updated `get_trending_articles` function to include `description` field in return type and query.

### 2. Frontend Changes

#### Removed Recommended Tools Section
**File**: `src/pages/Index.tsx`

Commented out AITools component import and usage as requested:
```typescript
// import AITools from "@/components/home/AITools"; // Removed - recommended tools
...
{/* <AITools /> */}
```

#### Updated TypeScript Types
**File**: `src/integrations/supabase/types.ts`

Added `description: string` to `get_trending_articles` return type to match updated database function.

## Deployment Steps

### 1. Apply Database Migrations

The migrations need to be applied to production Supabase instance:

```bash
# Method 1: Via Supabase CLI (if linked to project)
npx supabase db push

# Method 2: Manual via Supabase Dashboard
# 1. Go to https://supabase.com/dashboard/project/jzixoslapmlqafrlbvpk/sql/new
# 2. Copy contents of supabase/migrations/20251022_add_rls_policies_main_tables.sql
# 3. Execute the SQL
# 4. Copy contents of supabase/migrations/20250120_trending_and_device_stats.sql
# 5. Execute the SQL
```

### 2. Deploy Frontend to Vercel

After migrations are applied:

```bash
# Commit changes
git add .
git commit -m "fix: add RLS policies and update trending articles function

- Add comprehensive RLS policies for main tables
- Update get_trending_articles to include description field
- Remove recommended tools section from homepage
- Update TypeScript types to match database functions"

# Push to trigger Vercel deployment
git push origin main
```

### 3. Verification Checklist

After deployment, verify:

- [ ] Homepage loads without errors
- [ ] "Naujausios AI naujienos" section displays 3 latest articles
- [ ] "Populiariausia šią savaitę" section displays trending articles with descriptions
- [ ] Recommended tools section is not visible
- [ ] "Mokykitės uždirbti su AI" section displays courses
- [ ] No console errors in browser
- [ ] No Supabase RLS policy errors in network tab

## Technical Details

### RLS Policy Pattern

All public content tables follow this pattern:

```sql
-- Enable RLS
ALTER TABLE public.{table_name} ENABLE ROW LEVEL SECURITY;

-- Public read for published/active content
CREATE POLICY "Allow public read access for published {table_name}"
    ON public.{table_name}
    FOR SELECT
    USING (published = true); -- or active = true

-- Admin full access
CREATE POLICY "Allow admin full access to {table_name}"
    ON public.{table_name}
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- Grant permissions
GRANT SELECT ON public.{table_name} TO anon, authenticated;
```

### Security Implications

✅ **Positive Security Changes**:
- All tables now have proper RLS policies
- Anonymous users can only read published/active content
- Admin operations require authentication and admin role verification
- Explicit permission grants for anon and authenticated roles

⚠️ **No Security Concerns**:
- All policies follow principle of least privilege
- No sensitive data exposed to public
- Admin verification uses secure JWT claims via auth.uid()

## Rollback Plan

If issues occur after deployment:

### Database Rollback
```sql
-- Disable RLS on tables (emergency only)
ALTER TABLE public.articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
-- etc.

-- Or drop specific policies
DROP POLICY "Allow public read access for published articles" ON public.articles;
-- etc.
```

### Frontend Rollback
```bash
# Revert commits
git revert HEAD
git push origin main
```

## Expected Results

After successful deployment:

1. **Homepage** should display:
   - Hero section
   - 3 latest published articles
   - 3 trending articles from last 7 days with descriptions
   - 2 published courses
   - Business solutions CTA
   - Call to action section

2. **No loading states** stuck permanently

3. **Network tab** shows successful Supabase queries:
   - `from('articles').select('*').eq('published', true)` → Returns data
   - `rpc('get_trending_articles')` → Returns data with descriptions
   - `from('courses').select('*').eq('published', true)` → Returns data

## Additional Notes

### Database Function Updates

The `get_trending_articles` function now properly returns:
```typescript
{
  id: UUID,
  title: TEXT,
  slug: TEXT,
  views: BIGINT,
  image_url: TEXT,
  category: TEXT[],
  description: TEXT  // ← New field
}
```

### Component Impact

Components affected by these changes:
- `src/components/home/FeaturedArticles.tsx` - Now receives data
- `src/components/widgets/trending-articles.tsx` - Now receives descriptions
- `src/components/home/Courses.tsx` - Now receives data
- `src/pages/Index.tsx` - Recommended tools section removed

## Testing Completed

✅ TypeScript compilation: `npm run type-check` - Passed
✅ Production build: `npm run build` - Passed
✅ No type errors
✅ No build errors

## Migration Order

Migrations should be applied in this order:
1. `20250115_change_articles_category_to_array.sql` (existing)
2. `20250115_create_comments_and_bookmarks.sql` (existing)
3. `20250120_analytics_tracking.sql` (existing)
4. `20250120_trending_and_device_stats.sql` **(updated)**
5. `20251015_expand_cta_hero_sections.sql` (existing)
6. `20251016_cta_analytics.sql` (existing)
7. `20251022_add_rls_policies_main_tables.sql` **(new)**

---

**Status**: Ready for deployment
**Risk Level**: Low (changes are additive and follow established patterns)
**Estimated Downtime**: None (migrations are non-breaking)
