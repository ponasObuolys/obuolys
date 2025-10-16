# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build, Development and Common Commands

### Essential Commands
```bash
# Development
npm run dev                    # Start dev server on port 8080
npm run build                  # Production build
npm run build:dev              # Development build with source maps
npm run preview                # Preview production build

# Code Quality
npm run lint                   # Run ESLint
npm run lint:fix               # Fix ESLint issues
npm run format                 # Format with Prettier
npm run type-check             # TypeScript type checking
npm run quality-check          # Run all quality checks (lint + typecheck + format)
npm run quality:comprehensive  # Comprehensive quality analysis

# Testing
npm run test                   # Run Vitest in watch mode
npm run test:run               # Run all tests once
npm run test:coverage          # Generate coverage report
npm run test:unit              # Run unit tests only
npm run test:integration       # Run integration tests
npm run test:e2e               # Run Playwright E2E tests
npm run test:e2e:ui            # Run E2E tests with UI
npm run test:a11y              # Run accessibility tests
npm run test:visual            # Run visual regression tests
npm run test:all               # Run all test suites

# Supabase
npm run supabase:types         # Generate TypeScript types from DB schema
npm run supabase:start         # Start local Supabase
npm run supabase:stop          # Stop local Supabase
npm run supabase:reset         # Reset local database

# Development Utilities
npm run dev:doctor             # Comprehensive health check
npm run dev:insights           # Project analytics and insights
npm run health:monitor         # Monitor project health
npm run performance:analyze    # Analyze build performance
npm run git:status             # Enhanced git status with insights
```

### Custom Development Scripts
The project includes extensive custom scripts in `scripts/` directory:
- `dev-assistant.js` - Interactive development assistant
- `health-monitor.js` - Project health monitoring
- `performance-monitor.js` - Build and runtime performance analysis
- `quality-check.js` - Comprehensive code quality checks
- `git-workflow.js` - Enhanced git workflow helpers

## Architecture Overview

### Tech Stack
- **Frontend**: React 18.3.1 with TypeScript + Vite
- **UI Components**: Shadcn/UI (Radix UI primitives)
- **Styling**: Tailwind CSS with tailwindcss-animate
- **State Management**: React Context (Auth, Language) + Tanstack Query (server state)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest (unit/integration) + Playwright (e2e/visual/a11y)
- **Deployment**: Vercel with Analytics

### Project Structure
```
src/
├── components/
│   ├── admin/              # Admin dashboard components
│   ├── error-boundaries/   # Multi-level error boundary system
│   ├── home/               # Homepage components
│   ├── layout/             # Layout components (Header, Footer)
│   ├── tools/              # AI tools components
│   └── ui/                 # Shadcn/UI components
├── context/                # React contexts (Auth, Language)
├── hooks/                  # Custom React hooks
├── integrations/supabase/  # Supabase client and types
├── pages/                  # Route-level page components
├── providers/              # Context providers
└── utils/                  # Utilities (lazyLoad, webVitals, etc.)

scripts/                    # Custom development utilities
```

### Key Architectural Patterns

#### 1. Multi-Level Error Boundary System
The app uses a sophisticated error boundary hierarchy defined in [src/components/error-boundaries/](src/components/error-boundaries/):
- **GlobalErrorBoundary**: Top-level, catches critical app crashes
- **RouteErrorBoundary**: Route-level, with auto-recovery capabilities
- **ContentRouteErrorBoundary**: Content pages (articles, tools, courses)
- **AuthRouteErrorBoundary**: Authentication flows
- **AdminRouteErrorBoundary**: Admin dashboard
- **ChunkErrorFallback**: Handles code-splitting chunk load failures

See [src/App.tsx](src/App.tsx#L144-L556) for implementation.

#### 2. Code Splitting Strategy
Intelligent lazy loading with manual chunk optimization:

**Lazy Loading**: Custom `createLazyComponent` utility in [src/utils/lazyLoad.ts](src/utils/lazyLoad.ts)
- Caching by key
- Intelligent preloading based on priority
- Error boundary integration

**Manual Chunks** in [vite.config.ts](vite.config.ts#L36-L132):
- `react-core` - React and React Router
- `ui-*` - Radix UI split by category (overlay, form, feedback, base)
- `admin-dashboard` - Admin components separate chunk
- `auth-pages` - Authentication flows
- `content-*` - Content pages split by feature
- `supabase` - Backend integration
- `form-lib`, `query-lib`, `charts`, `utils` - Library groupings

This creates ~25KB initial bundle with efficient lazy loading.

#### 3. Database-First with Supabase
All database operations through Supabase with auto-generated types:
- **Client**: [src/integrations/supabase/client.ts](src/integrations/supabase/client.ts)
- **Types**: [src/integrations/supabase/types.ts](src/integrations/supabase/types.ts) (auto-generated)
- **Project ID**: jzixoslapmlqafrlbvpk
- **Row Level Security (RLS)**: Enabled on all tables
- **Schema Documentation**: See [DB.md](DB.md) for complete schema

**Tables**: profiles, articles, tools, courses, contact_messages, hero_sections, cta_sections, translation_requests

#### 4. State Management Architecture
- **Global State**: AuthContext (authentication), LanguageContext (i18n)
- **Server State**: React Query with 3 retry attempts and exponential backoff
- **Local State**: useState/useReducer for component-specific state
- **Image Loading**: ImageLoadingProvider for lazy image optimization

#### 5. Performance Optimizations
- **Intelligent Preloading**: Priority-based preloading system (high/medium/low)
- **Web Vitals Monitoring**: Integrated with Vercel Analytics
- **Image Lazy Loading**: Custom LazyImage component with Intersection Observer
- **CSS Code Splitting**: Separate CSS chunks for better caching
- **Tree Shaking**: Optimized esbuild config removes console.* in production

## Critical Project Rules

### 1. Lithuanian Language Requirement
**All UI text, content, and user-facing strings must be in Lithuanian.**
- Technical terms and variable names can be English
- Route paths are in Lithuanian (e.g., `/publikacijos`, `/irankiai`, `/kursai`)
- Translations managed via [src/context/LanguageContext.tsx](src/context/LanguageContext.tsx)

### 2. Database Changes Protocol
**Always check [DB.md](DB.md) before any database-related code changes.**
- Complete schema documentation with RLS policies
- Migration history and documentation
- Foreign key constraints and relationships
- Never modify database without consulting this file

### 3. Supabase-Only Integration
**Use Supabase exclusively for all backend operations.**
- No direct PostgreSQL queries outside Supabase client
- No alternative backend services
- Follow existing Supabase patterns in [src/integrations/supabase/](src/integrations/supabase/)

### 4. Image Loading Requirement
**Always use LazyImage component instead of standard `<img>` tags.**
```tsx
import LazyImage from '@/components/ui/lazy-image';

// ✅ Correct
<LazyImage src={imageUrl} alt="Description" />

// ❌ Wrong
<img src={imageUrl} alt="Description" />
```

### 5. Admin Editor Patterns
**Follow existing editor patterns for consistency:**
- ArticleEditor, NewsEditor, CourseEditor, ToolEditor patterns
- Use RichTextEditor for content editing
- FileUpload component for images
- React Hook Form + Zod validation
- Consistent UI/UX across all admin features

See [src/components/admin/](src/components/admin/) for examples.

### 6. Component Guidelines
- Use shadcn/ui components from [src/components/ui/](src/components/ui/)
- Follow Tailwind CSS for all styling (no custom CSS files)
- Use React Hook Form + Zod for all forms
- Display errors via toast notifications

### 7. Content Management
- **News**: Manual entry only through admin dashboard (RSS removed)
- **Articles/Tools/Courses**: Use RichTextEditor
- **Status System**: published/featured flags control visibility

## Database Guidelines

### Schema Structure
Refer to [DB.md](DB.md) for:
- Complete table definitions with all columns
- Row Level Security policies for each table
- Functions and triggers
- Indexes and constraints
- Migration history

### Common Patterns
```typescript
// Example: Fetching published articles
const { data, error } = await supabase
  .from('articles')
  .select('*')
  .eq('published', true)
  .order('created_at', { ascending: false });

// Example: Admin-only operations (RLS enforced)
const { error } = await supabase
  .from('articles')
  .update({ published: true })
  .eq('id', articleId);
// Fails if user is not admin due to RLS
```

### Type Safety
Always use generated types from [src/integrations/supabase/types.ts](src/integrations/supabase/types.ts):
```typescript
import { Database } from '@/integrations/supabase/types';

type Article = Database['public']['Tables']['articles']['Row'];
type ArticleInsert = Database['public']['Tables']['articles']['Insert'];
```

Regenerate types after schema changes:
```bash
npm run supabase:types
```

## Key Integration Files

### Core Configuration
- [vite.config.ts](vite.config.ts) - Build optimization and chunk strategy
- [src/App.tsx](src/App.tsx) - Route definitions and error boundaries
- [components.json](components.json) - Shadcn/UI configuration

### State Management
- [src/context/AuthContext.tsx](src/context/AuthContext.tsx) - Authentication state
- [src/context/LanguageContext.tsx](src/context/LanguageContext.tsx) - i18n translations

### Supabase Integration
- [src/integrations/supabase/client.ts](src/integrations/supabase/client.ts) - Supabase client setup
- [src/integrations/supabase/types.ts](src/integrations/supabase/types.ts) - Auto-generated types

### Utilities
- [src/utils/lazyLoad.ts](src/utils/lazyLoad.ts) - Code splitting utilities
- [src/components/ui/lazy-image.tsx](src/components/ui/lazy-image.tsx) - Image lazy loading
- [src/components/admin/RichTextEditor.tsx](src/components/admin/RichTextEditor.tsx) - Content editor

## Testing Strategy

### Unit & Integration Tests (Vitest)
- Test files: `*.test.ts`, `*.test.tsx`
- Location: Co-located with source files or `src/test/`
- Coverage target: Check with `npm run test:coverage:check`

### E2E Tests (Playwright)
- Test files: `tests/**/*.spec.ts`
- Multiple configurations:
  - `playwright.config.ts` - Main E2E tests
  - `playwright.a11y.config.ts` - Accessibility tests
  - `playwright.visual.config.ts` - Visual regression tests
  - `playwright.config.prod.ts` - Production environment tests

### Test Patterns
```typescript
// Unit test example
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Text')).toBeInTheDocument();
  });
});

// E2E test example
import { test, expect } from '@playwright/test';

test('user can navigate to articles', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Publikacijos');
  await expect(page).toHaveURL('/publikacijos');
});
```

## Route Structure

All routes use Lithuanian paths:
```
/                           # Homepage
/publikacijos              # Articles listing
/publikacijos/:slug        # Article detail
/irankiai                  # Tools listing
/irankiai/:slug            # Tool detail
/kursai                    # Courses listing
/kursai/:slug              # Course detail
/kontaktai                 # Contact page
/paremti                   # Support page
/verslo-sprendimai         # Custom solutions

/auth                      # Authentication
/profilis                  # User profile
/mano-sarasas             # User bookmarks

/admin                     # Admin dashboard
/admin/cleanup             # User cleanup
/admin/setup              # Admin setup
/admin/info               # Admin info
/admin/inquiries          # Contact inquiries
/admin/cta                # CTA management
/admin/analytics          # CTA analytics
```

New routes must be registered in [src/App.tsx](src/App.tsx) with appropriate error boundaries.

## Performance Considerations

### Bundle Size
- Initial bundle target: ~25KB gzipped
- Chunk size warning limit: 200KB
- Monitor with: `npm run build:analyze`
- Bundle size check: `npm run bundle-size:check`

### Optimization Checklist
- ✅ Code splitting with lazy loading
- ✅ Intelligent preloading by priority
- ✅ Image lazy loading with LazyImage
- ✅ CSS code splitting
- ✅ Tree shaking enabled
- ✅ Console removal in production
- ✅ Web Vitals monitoring

### Performance Monitoring
```bash
npm run performance:analyze     # Full performance analysis
npm run performance:quick       # Quick performance check
npm run performance:build       # Build-time analysis only
```
