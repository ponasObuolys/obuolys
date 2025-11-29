# Code Quality Improvements Task List

Based on the Obuolys Project Analysis Report, this task list addresses all identified issues.

## Relevant Files

### Console Statements Cleanup
- `src/components/admin/publication-editor/publication-editor.hooks.ts` - Contains 10 DEBUG console.log statements
- `src/utils/share-utils.ts` - Contains console.error for clipboard fallback
- `src/services/cta.service.ts` - Contains console.error for analytics tracking
- `src/hooks/useShare.ts` - Contains console.error for share errors
- `src/utils/sentry.ts` - Contains console.info/warn for Sentry initialization

### Security Fixes
- `src/utils/share-utils.ts` - innerHTML usage at line 134 (XSS risk)

### TODO Features
- `src/hooks/useProfileManagement.ts` - 3 TODOs for saved publications, enrolled courses, notifications
- `src/utils/featureFlags.ts` - 3 TODOs for feature flag implementations
- `supabase/migrations/` - New migration files needed for database tables

### Large Components (>400 lines - need refactoring)
- `src/integrations/supabase/types.ts` - 1128 lines (auto-generated, skip)
- `src/components/admin/course-editor/course-pricing-fields.tsx` - 511 lines
- `src/AppRoutes.tsx` - 498 lines
- `src/utils/errorReporting.ts` - 474 lines
- `src/pages/CustomSolutionsPage.tsx` - 456 lines
- `src/pages/admin/CalculatorSubmissionsPage.tsx` - 454 lines
- `src/pages/admin/InquiriesPage.tsx` - 450 lines
- `src/pages/AdminCommentsModeration.tsx` - 430 lines
- `src/components/error-boundaries/GlobalErrorBoundary.tsx` - 427 lines
- `src/data/ctaContent.ts` - 420 lines
- `src/components/admin/cta-management.tsx` - 411 lines

### Notes

- Unit tests should be placed alongside the code files they are testing
- Use `npm run test` to run Vitest tests
- Use `npm run lint` to check for linting issues
- Use `npm run lint:fix` to auto-fix linting issues

---

## Tasks

- [ ] 1.0 Remove Console Statements from Production Code
  - [ ] 1.1 Remove 10 DEBUG console.log statements from `publication-editor.hooks.ts` - replace with browserLogger or remove entirely
  - [ ] 1.2 Replace console.error in `share-utils.ts:102` with browserLogger.error
  - [ ] 1.3 Replace console.error in `cta.service.ts:37` with browserLogger.error
  - [ ] 1.4 Replace console.error in `useShare.ts:46` with browserLogger.error
  - [ ] 1.5 Review console statements in `sentry.ts` - keep only essential initialization logs
  - [ ] 1.6 Run `npm run lint` to verify no remaining console statements

- [ ] 2.0 Fix Security Issues
  - [ ] 2.1 Fix innerHTML XSS vulnerability in `share-utils.ts:134` - replace `tmp.innerHTML = html` with DOMParser or textContent approach
  - [ ] 2.2 Add unit test for `stripHtmlTags` function to verify XSS protection
  - [ ] 2.3 Review Supabase RLS policies - ensure all tables have proper row-level security
  - [ ] 2.4 Run security audit with `npm audit` and address any vulnerabilities

- [ ] 3.0 Complete TODO Features
  - [ ] 3.1 Create Supabase migration for `user_saved_publications` table
  - [ ] 3.2 Implement saved publications functionality in `useProfileManagement.ts` (lines 110-143)
  - [ ] 3.3 Create Supabase migration for `user_enrolled_courses` table
  - [ ] 3.4 Implement enrolled courses functionality in `useProfileManagement.ts` (lines 149-182)
  - [ ] 3.5 Implement notification settings API call in `useProfileManagement.ts` (line 319)
  - [ ] 3.6 Configure Sentry integration - add VITE_SENTRY_DSN to environment
  - [ ] 3.7 Enable `externalLogging` feature flag in `featureFlags.ts`
  - [ ] 3.8 Update feature flags: enable `savedPublications` and `enrolledCourses` after DB tables are created

- [ ] 4.0 Refactor Large Components
  - [ ] 4.1 Split `course-pricing-fields.tsx` (511 lines) into smaller components
    - [ ] 4.1.1 Extract pricing tier component
    - [ ] 4.1.2 Extract pricing form fields
    - [ ] 4.1.3 Create types file for pricing interfaces
  - [ ] 4.2 Split `AppRoutes.tsx` (498 lines) into route groups
    - [ ] 4.2.1 Extract admin routes to separate file
    - [ ] 4.2.2 Extract public routes to separate file
    - [ ] 4.2.3 Extract auth routes to separate file
  - [ ] 4.3 Split `errorReporting.ts` (474 lines) into modules
    - [ ] 4.3.1 Extract error types to separate file
    - [ ] 4.3.2 Extract error formatters to separate file
  - [ ] 4.4 Split `CustomSolutionsPage.tsx` (456 lines)
    - [ ] 4.4.1 Extract hero section component
    - [ ] 4.4.2 Extract features section component
    - [ ] 4.4.3 Extract CTA section component
  - [ ] 4.5 Split `CalculatorSubmissionsPage.tsx` (454 lines)
    - [ ] 4.5.1 Extract submissions table component
    - [ ] 4.5.2 Extract submission details modal
    - [ ] 4.5.3 Extract filters component
  - [ ] 4.6 Split `InquiriesPage.tsx` (450 lines)
    - [ ] 4.6.1 Extract inquiries table component
    - [ ] 4.6.2 Extract inquiry details component
  - [ ] 4.7 Split `AdminCommentsModeration.tsx` (430 lines)
    - [ ] 4.7.1 Extract comments table component
    - [ ] 4.7.2 Extract moderation actions component
  - [ ] 4.8 Split `GlobalErrorBoundary.tsx` (427 lines)
    - [ ] 4.8.1 Extract error display component
    - [ ] 4.8.2 Extract error recovery component
  - [ ] 4.9 Split `ctaContent.ts` (420 lines) - organize by CTA type/category
  - [ ] 4.10 Split `cta-management.tsx` (411 lines)
    - [ ] 4.10.1 Extract CTA list component
    - [ ] 4.10.2 Extract CTA editor component

- [ ] 5.0 Performance Optimizations
  - [ ] 5.1 Update bundle size warning limit in `vite.config.ts` from 200KB to 150KB
  - [ ] 5.2 Identify list components that need React.memo optimization
  - [ ] 5.3 Add React.memo to publication list item components
  - [ ] 5.4 Add React.memo to course list item components
  - [ ] 5.5 Add React.memo to comment list item components
  - [ ] 5.6 Review setTimeout usage and convert to requestIdleCallback where appropriate
  - [ ] 5.7 Run bundle analysis with `npm run build` and identify optimization opportunities
  - [ ] 5.8 Verify lazy loading is working correctly for all route components
