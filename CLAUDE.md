# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build, Development and Common Commands

### Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build for development (with source maps)
npm run build:dev

# Lint the codebase
npm run lint

# Preview production build
npm run preview
```

### Important Notes
- No test commands are currently configured. Consider implementing tests using Jest + Testing Library
- The project uses Vite for fast development and building
- ESLint is configured for code quality checks
- No explicit typecheck command configured - run TypeScript compiler directly: `npx tsc --noEmit`

## Architecture Overview

### Tech Stack
- **Frontend Framework**: React 18.3.1 with TypeScript
- **UI Components**: Shadcn/UI (Radix UI based)
- **Styling**: Tailwind CSS with tailwindcss-animate
- **State Management**: 
  - React Context (AuthContext, LanguageContext)
  - React Query (Tanstack Query) for server state
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Vercel with Analytics
- **Build Tool**: Vite

### Project Structure
```
src/
├── components/       # All React components
│   ├── admin/       # Admin dashboard components
│   ├── home/        # Homepage specific components
│   ├── layout/      # Layout components (Header, Footer)
│   ├── tools/       # AI tools related components
│   └── ui/          # Reusable UI components (shadcn/ui)
├── context/         # React contexts
├── hooks/           # Custom React hooks
├── integrations/    # External service integrations
│   └── supabase/    # Supabase client and types
├── lib/             # Utility libraries
├── pages/           # Page components (route handlers)
├── providers/       # Context providers
└── utils/           # Helper functions
```

### Key Architectural Patterns

#### 1. Database-First Approach
The project uses Supabase with Row Level Security (RLS) policies. All database operations go through Supabase client with automatic type generation.

#### 2. Component Organization
- **UI Components**: Generic, reusable components in `src/components/ui/`
- **Feature Components**: Business logic components organized by feature
- **Page Components**: Route-level components in `src/pages/`

#### 3. State Management Strategy
- **Global State**: AuthContext for authentication, LanguageContext for i18n
- **Server State**: React Query for caching and synchronization
- **Local State**: useState/useReducer for component-specific state

#### 4. Image Optimization
- Custom LazyImage component for all images
- Intersection Observer for lazy loading
- Placeholder images during loading

## Important Project Rules

### Language Requirements
- **UI and Content**: Everything must be in Lithuanian language
- **Code**: Variables and technical terms can be in English
- **Translations**: Managed via LanguageContext.tsx

### Database Guidelines
- **Always check DB.md** before modifying database-related code
- **Use Supabase exclusively** for all database operations
- **RLS Policies**: Respect existing Row Level Security configurations
- **Tables**: profiles, articles, tools, courses, contact_messages, hero_sections, cta_sections, translation_requests
- **Project ID**: jzixoslapmlqafrlbvpk (ponasObuolys)

### Development Standards
- **Components**: Use shadcn/ui components and follow existing patterns
- **Styling**: Tailwind CSS only, no custom CSS files
- **Forms**: Use react-hook-form with zod validation
- **Error Handling**: Display user-friendly toast messages
- **Images**: Always use LazyImage component instead of <img>

### Admin Dashboard Patterns
- Follow existing editor patterns (ArticleEditor, NewsEditor, CourseEditor, ToolEditor)
- Use RichTextEditor for content editing
- Maintain consistent UI/UX across all admin features

### Performance Considerations
- Implement optimistic updates for better UX
- Use React Query caching effectively
- Lazy load components and images
- Follow mobile-first responsive design

## Critical Files to Know

### Configuration Files
- `src/integrations/supabase/client.ts` - Supabase client setup
- `src/integrations/supabase/types.ts` - Auto-generated database types
- `components.json` - Shadcn/UI configuration

### Key Components
- `src/components/ui/lazy-image.tsx` - Image lazy loading
- `src/components/admin/RichTextEditor.tsx` - Content editor
- `src/context/AuthContext.tsx` - Authentication logic
- `src/components/layout/Layout.tsx` - Main layout wrapper

### Documentation
- `DB.md` - Complete database schema documentation
- `TECHNICAL_DOCUMENTATION.md` - Detailed technical overview
- `README.md` - Project overview and content management guide

## Common Development Tasks

### Adding a New Page
1. Create component in `src/pages/`
2. Register route in `src/App.tsx`
3. Add navigation if needed in Header/Footer

### Working with Database
1. Check types in `src/integrations/supabase/types.ts`
2. Use Supabase client from `src/integrations/supabase/client.ts`
3. Follow RLS policies documented in DB.md

### Creating Admin Features
1. Follow existing patterns in `src/components/admin/`
2. Use FileUpload component for images
3. Implement with RichTextEditor for content
4. Add proper validation with zod schemas

## Critical Project Rules (.cursorrules)

### Lithuanian Language Requirement
All UI, content, and documentation must be in Lithuanian. English allowed only for technical terms and variable names. Translations managed via LanguageContext.tsx.

### Content Management Workflow
- **News**: Manual entry only through admin dashboard (automatic RSS removed)
- **Articles/Tools/Courses**: Use RichTextEditor for content creation
- **Images**: Always use LazyImage component instead of `<img>` tags
- **Admin Patterns**: Follow existing editor patterns (ArticleEditor, NewsEditor, etc.)

### Validation and Error Handling
- All forms must use react-hook-form with zod validation
- Display user-friendly error messages via toast notifications
- Implement optimistic updates for better UX

## Known Issues and Notes

### Database Cleanup Needed
- Tables `categories`, `products`, `inventory` should be removed (not part of this project)
- These tables lack RLS policies and contain unrelated data

### Missing Features
- No automated tests implemented
- No error tracking/monitoring system
- Comments system not yet implemented
- Advanced search functionality pending

### Performance Optimizations
- Vercel Analytics integrated
- Lazy loading implemented for images
- Code splitting via Vite's dynamic imports