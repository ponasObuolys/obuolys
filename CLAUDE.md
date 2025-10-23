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

- **Library-only chunking**: Only third-party libraries are manually chunked to prevent React module initialization issues
- `react-core` - React and React Router
- `ui-*` - Radix UI split by category (overlay, form, feedback, base)
- `supabase` - Backend integration
- `form-lib`, `query-lib`, `charts`, `utils` - Library groupings
- **Application code**: Handled by Vite's automatic chunking to ensure proper dependency resolution

**IMPORTANT**: Never add application code (components, pages, contexts) to manual chunks. This prevents "Cannot read properties of undefined (reading 'Component'/'forwardRef')" errors by allowing Vite to handle module initialization order.

This creates ~25KB initial bundle with efficient lazy loading.

#### 3. Database-First with Supabase

All database operations through Supabase with auto-generated types:

- **Client**: [src/integrations/supabase/client.ts](src/integrations/supabase/client.ts)
- **Types**: [src/integrations/supabase/types.ts](src/integrations/supabase/types.ts) (auto-generated)
- **Project ID**: jzixoslapmlqafrlbvpk
- **Row Level Security (RLS)**: Enabled on all tables
- **Schema Documentation**: See [DB.md](DB.md) for complete schema

**Tables**: profiles, articles, tools, courses, contact_messages, custom_tool_inquiries, hero_sections, cta_sections, sticky_cta_messages, cta_clicks, article_comments, article_bookmarks, reading_progress, page_views, site_statistics, email_replies, migration_documentation, translation_requests

#### 4. State Management Architecture

- **Global State**: AuthContext (authentication), LanguageContext (i18n), ThemeContext
- **Server State**: React Query with 3 retry attempts and exponential backoff
- **Local State**: useState/useReducer for component-specific state
- **Image Loading**: ImageLoadingProvider for lazy image optimization

#### 5. Performance Optimizations

- **Intelligent Preloading**: Priority-based preloading system (high/medium/low)
- **Web Vitals Monitoring**: Integrated with Vercel Analytics
- **Image Lazy Loading**: Custom LazyImage component with Intersection Observer
- **CSS Code Splitting**: Separate CSS chunks for better caching
- **Tree Shaking**: Optimized esbuild config removes console.\* in production

## Critical Project Rules

### 1. Lithuanian Language Requirement

**All UI text, content, and user-facing strings must be in Lithuanian.**

- Technical terms and variable names can be English
- Route paths are in Lithuanian (e.g., `/publikacijos`, `/irankiai`, `/kursai`)
- Translations managed via [src/context/LanguageContext.tsx](src/context/LanguageContext.tsx)
- Error messages shown to users must be in Lithuanian (see error handling pattern)
- Comments for complex logic should be in Lithuanian

### 2. Database Changes Protocol

**Always check [DB.md](DB.md) before any database-related code changes.**

- Complete schema documentation with RLS policies
- Migration history and documentation
- Foreign key constraints and relationships
- 19 public tables with detailed column specifications
- All tables have RLS enabled
- Never modify database without consulting this file

### 3. Supabase-Only Integration

**Use Supabase exclusively for all backend operations.**

- No direct PostgreSQL queries outside Supabase client
- No alternative backend services
- Follow existing Supabase patterns in [src/integrations/supabase/](src/integrations/supabase/)
- Create dedicated service files for database operations (max 150 lines per service)

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

- ArticleEditor, CourseEditor, ToolEditor patterns
- Use RichTextEditor (Slate.js) for content editing
- FileUpload component for images
- React Hook Form + Zod validation
- Consistent UI/UX across all admin features

See [src/components/admin/](src/components/admin/) for examples.

### 6. Component Guidelines

- Use shadcn/ui components from [src/components/ui/](src/components/ui/)
- Follow Tailwind CSS for all styling (no custom CSS files)
- Use React Hook Form + Zod for all forms
- Display errors via toast notifications (Sonner)
- Maximum file length: **400 lines** (split before reaching this limit)
- Component files should use **kebab-case.tsx** naming

### 7. Content Management

- **News**: Manual entry only through admin dashboard (RSS removed - see README.md)
- **Articles/Tools/Courses**: Use RichTextEditor with Slate.js
- **Status System**: published/featured flags control visibility
- Future integration with MAKE.COM or automation platforms planned

### 8. File Organization & Refactoring Rules

When creating new features, automatically structure files as:

```
src/components/
  feature-name/
    index.tsx (main component, max 200 lines)
    feature-name.types.ts (TypeScript interfaces)
    feature-name.hooks.ts (custom hooks if needed)
    feature-name.utils.ts (helper functions if needed)
    components/ (sub-components if main > 150 lines)
      sub-component-name.tsx
```

**Automatic Refactoring Triggers** - Split components when:
1. File reaches 250 lines
2. Component has 3+ useState hooks (extract to custom hook)
3. JSX return is >100 lines (split into sub-components)
4. 5+ props being passed (consider composition pattern)
5. Nested ternaries (extract to separate components)
6. map() with >30 lines of JSX (extract list item component)

### 9. State Management Rules

1. **1-2 useState**: Keep in component
2. **3-5 useState**: Extract to custom hook in same file
3. **6+ useState**: Create separate `.hooks.ts` file
4. **Shared across 2+ components**: Use Context API
5. **Server state**: Always use React Query/Tanstack Query

### 10. Import Organization

Always organize imports in this order:

```typescript
// 1. React/core imports
import { useState, useEffect } from 'react';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 3. Absolute imports (@/ aliases)
import { Button } from '@/components/ui/button';

// 4. Relative imports - types
import { ComponentNameProps } from './component-name.types';

// 5. Relative imports - hooks
import { useComponentLogic } from './component-name.hooks';

// 6. Relative imports - components
import { SubComponent } from './components/sub-component';

// 7. Relative imports - utils/constants
import { formatDate } from './component-name.utils';

// 8. Assets/styles
import './styles.css';
```

## Database Guidelines

### Schema Structure

Refer to [DB.md](DB.md) for:

- Complete table definitions with all columns
- Row Level Security policies for each table (50+ policies)
- Functions and triggers (15 functions, 12 triggers)
- Indexes and constraints (57 indexes)
- Migration history (17 applied migrations)
- Foreign key relationships with CASCADE rules

### Common Patterns

```typescript
// Example: Fetching published articles
const { data, error } = await supabase
  .from("articles")
  .select("*")
  .eq("published", true)
  .order("created_at", { ascending: false });

// Example: Admin-only operations (RLS enforced)
const { error } = await supabase
  .from("articles")
  .update({ published: true })
  .eq("id", articleId);
// Fails if user is not admin due to RLS
```

### Service File Pattern

```typescript
// services/table-name.service.ts (max 150 lines per service file)
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

// Define schemas for validation
const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  // ... other fields
});

export const tableNameService = {
  async getAll() {
    const { data, error } = await supabase
      .from('table_name')
      .select('*');

    if (error) throw error;
    return ItemSchema.array().parse(data);
  },

  async create(item: z.infer<typeof ItemSchema>) {
    // If this service file >150 lines, split by operation type
    // create separate files: table-name-queries.ts, table-name-mutations.ts
  }
};
```

### Type Safety

Always use generated types from [src/integrations/supabase/types.ts](src/integrations/supabase/types.ts):

```typescript
import { Database } from "@/integrations/supabase/types";

type Article = Database["public"]["Tables"]["articles"]["Row"];
type ArticleInsert = Database["public"]["Tables"]["articles"]["Insert"];
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
- [src/context/ThemeContext.tsx](src/context/ThemeContext.tsx) - Theme management

### Supabase Integration

- [src/integrations/supabase/client.ts](src/integrations/supabase/client.ts) - Supabase client setup
- [src/integrations/supabase/types.ts](src/integrations/supabase/types.ts) - Auto-generated types

### Utilities

- [src/utils/lazyLoad.ts](src/utils/lazyLoad.ts) - Code splitting utilities
- [src/components/ui/lazy-image.tsx](src/components/ui/lazy-image.tsx) - Image lazy loading
- [src/components/admin/RichTextEditor.tsx](src/components/admin/RichTextEditor.tsx) - Slate.js content editor
- [src/utils/browserLogger.ts](src/utils/browserLogger.ts) - Browser logging utility

## Testing Strategy

### Unit & Integration Tests (Vitest)

- Test files: `*.test.ts`, `*.test.tsx`
- Location: Co-located with source files or `src/test/`
- Coverage target: Check with `npm run test:coverage:check`
- Keep test files under 200 lines (split into multiple test files if needed)

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

describe('ComponentName', () => {
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
/privatumo-politika        # Privacy policy
/slapuku-politika          # Cookie policy

/auth                      # Authentication
/auth/callback             # OAuth callback
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

## Error Handling Pattern

```typescript
// Always wrap async operations
try {
  const data = await fetchData();
  toast.success('Duomenys gauti sėkmingai'); // Lithuanian
} catch (error) {
  console.error('Error details:', error);
  toast.error('Klaida gaunant duomenis'); // User-friendly Lithuanian message
}
```

## Documentation Requirements

```typescript
/**
 * Komponentas vartotojo profilio redagavimui
 * Naudoja Supabase duomenų bazę
 */
export function UserProfile() {
  // Gauti vartotojo duomenis
  const user = useUser();

  /**
   * Išsaugoti profilio pakeitimus
   * @param data - formos duomenys
   */
  const handleSave = async (data: ProfileData) => {
    // implementation
  };
}
```

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

## Critical Restrictions

- **NEVER make Git commits or pushes** - These are managed manually
- **NEVER create or modify .env\* files** - These are managed manually
- **NEVER create files longer than 300 lines** (leave buffer before 400 limit)
- **On Windows PowerShell**: Use `;` instead of `&&` for command chaining
- **Always check for running dev servers** before starting new ones
- **NEVER add application code to manual chunks in vite.config.ts** - Only library code

## Automatic Checks Before Saving

Before saving any file, verify:
1. ✅ File is under 300 lines (max 400)
2. ✅ No component has more than 100 lines of JSX
3. ✅ No function exceeds 50 lines
4. ✅ Imports are organized correctly
5. ✅ All async operations have error handling
6. ✅ Lithuanian comments for complex logic
7. ✅ No unused imports or variables
8. ✅ Props are properly typed
9. ✅ Files follow kebab-case naming
10. ✅ Extracted sub-components if main component >200 lines

## MCP Server Utilization

### Sequential-thinking MCP
- Use before complex refactoring to plan steps
- Use for algorithm design to break down complex logic
- Command: "Use sequential-thinking to plan this feature implementation"

### Context7 MCP
- Always check context before major changes
- Update context after creating new components
- Command: "Check Context7 for existing patterns before implementing"

### Supabase MCP
- Use for all database operations
- Check schema before creating queries
- Command: "Use Supabase MCP to verify table structure"

### Playwright MCP
- Create E2E tests for critical user flows
- Test files: `tests/**/*.spec.ts`
- Command: "Generate Playwright test for this user flow"
