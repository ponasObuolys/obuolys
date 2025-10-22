# Maintainability Improvement Plan

## Executive Summary

This plan systematically transforms the codebase from its current state (8/10 quality) to production-grade maintainability (10/10) through targeted refactoring, type safety improvements, and establishment of sustainable development practices.

## Current Quality Assessment

### Metrics Analysis

| Metric                        | Current      | Target       | Gap       |
| ----------------------------- | ------------ | ------------ | --------- |
| Unknown types                 | 32 instances | 0 instances  | -32       |
| Large components (>400 lines) | 5 files      | 0 files      | -5        |
| ESLint violations             | ~15 warnings | 0 violations | -15       |
| Average component size        | 180 lines    | <150 lines   | -30 lines |
| Type coverage                 | 85%          | 95%          | +10%      |
| Cyclomatic complexity         | 8.2 avg      | <6 avg       | -2.2      |

### Quality Debt Categories

1. **Type Safety Debt**: 32 `unknown` types requiring proper interfaces
2. **Architectural Debt**: 5 monolithic components requiring decomposition
3. **Configuration Debt**: ESLint rules insufficient for quality enforcement
4. **Organizational Debt**: Inconsistent file structure and naming conventions
5. **Documentation Debt**: Missing type definitions and component documentation

## Phase 1: Foundation - Type Safety (Week 1)

### 1.1 Error Handling Standardization

**Objective**: Replace all `unknown` error types with typed error handling

**Implementation Steps**:

1. ✅ **Error utilities created** (`/src/utils/errorHandling.ts`)
2. **Update error handling in core files**:
   - `AuthContext.tsx` (7 instances)
   - `FileUpload.tsx` (1 instance)
   - `ToolEditor.tsx` (2 instances)
   - Admin components (15+ instances)

**Example Migration**:

```typescript
// Before
catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : "Default message";
}

// After
catch (error: unknown) {
  const { message } = handleAuthError(error);
  handleAuthErrorWithToast(error, 'Prisijungimo klaida');
}
```

### 1.2 Form Data Type Safety

**Objective**: Replace `Record<string, unknown>` with specific form interfaces

**Implementation Steps**:

1. ✅ **Form types created** (`/src/types/form.types.ts`)
2. **Update form components**:
   - `ToolEditor.tsx`: Use `ToolFormData`
   - `CourseEditor.tsx`: Use `CourseFormData`
   - `PublicationEditor.tsx`: Use `ArticleFormData`
   - `ProfilePage.tsx`: Use `ProfileUpdateData`

**Example Migration**:

```typescript
// Before
const onSubmit = async (values: Record<string, unknown>) => {

// After
const onSubmit = async (values: ToolFormData) => {
```

### 1.3 Supabase Integration Types

**Objective**: Leverage generated Supabase types throughout the application

**Implementation Steps**:

1. **Create typed service layer**:

   ```typescript
   // src/services/content.service.ts
   import type { Database } from "@/integrations/supabase/types";

   type ArticleInsert = Database["public"]["Tables"]["articles"]["Insert"];
   type ArticleUpdate = Database["public"]["Tables"]["articles"]["Update"];
   ```

2. **Update database operations** to use typed interfaces
3. **Remove generic object manipulations** in favor of typed operations

## Phase 2: Architectural Refactoring (Week 2-3)

### 2.1 Component Decomposition Strategy

**Large Components Identified**:

1. **sidebar.tsx** (806 lines) → 6 smaller components
2. **AdminDashboard.tsx** (696 lines) → 8 smaller components
3. **ProfilePage.tsx** (681 lines) → 5 smaller components
4. **PublicationEditor.tsx** (540 lines) → 4 smaller components
5. **HeroSectionEditor.tsx** (443 lines) → 3 smaller components

### 2.2 AdminDashboard Refactoring (Priority 1)

**Target Structure**:

```
AdminDashboard (100 lines)
├── hooks/
│   ├── useAdminDashboard.ts     # State management (50 lines)
│   └── useDashboardStats.ts     # Statistics logic (80 lines)
├── components/
│   ├── DashboardLayout.tsx      # Layout wrapper (60 lines)
│   ├── DashboardTabs.tsx        # Tab navigation (80 lines)
│   ├── OverviewTab.tsx          # Overview content (120 lines)
│   ├── PublicationsTab.tsx      # Publications mgmt (100 lines)
│   ├── ToolsTab.tsx             # Tools management (90 lines)
│   └── UsersTab.tsx             # User management (110 lines)
```

**Implementation Priority**:

1. **Week 2**: Extract hooks and create layout components
2. **Week 3**: Implement tab components and integration
3. **Validation**: Ensure all functionality preserved

### 2.3 Sidebar Component Refactoring (Priority 2)

**Current Issues**: 806 lines with complex state management and multiple responsibilities

**Target Structure**:

```
Sidebar (150 lines)
├── hooks/
│   ├── useSidebar.ts            # Context and state (100 lines)
│   └── useSidebarItems.ts       # Navigation logic (60 lines)
├── components/
│   ├── SidebarProvider.tsx      # Context provider (40 lines)
│   ├── SidebarContent.tsx       # Main content (120 lines)
│   ├── SidebarMenu.tsx          # Menu structure (80 lines)
│   ├── SidebarMenuItem.tsx      # Menu item (50 lines)
│   └── SidebarTrigger.tsx       # Toggle button (30 lines)
```

### 2.4 Performance Optimization

**Code Splitting Strategy**:

```typescript
// Lazy load admin components
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const PublicationEditor = lazy(() => import('@/components/admin/editors/PublicationEditor'));

// Route-based splitting
const adminRoutes = [
  {
    path: '/admin',
    element: <Suspense fallback={<LoadingSpinner />}><AdminDashboard /></Suspense>
  }
];
```

**Memoization Strategy**:

```typescript
// Expensive computations
const dashboardStats = useMemo(() => calculateDashboardMetrics(data), [data]);

// Callback optimization
const handleEdit = useCallback((id: string) => {
  setEditingItem(id);
}, []);
```

## Phase 3: Configuration & Tooling (Week 4)

### 3.1 ESLint Configuration Enhancement

**Implemented Features**:

- ✅ **Strict TypeScript rules**: no-explicit-any, strict-boolean-expressions
- ✅ **Import organization**: consistent-type-imports, type-exports
- ✅ **Code quality rules**: member-ordering, naming-convention
- ✅ **Performance rules**: prefer-for-of, prefer-includes
- ✅ **Promise handling**: no-floating-promises, await-thenable

### 3.2 Development Scripts Enhancement

**Quality Scripts Added**:

```json
{
  "lint:fix": "eslint . --fix",
  "type-check": "tsc --noEmit",
  "quality-check": "npm run lint && npm run type-check",
  "quality-fix": "npm run lint:fix && npm run type-check",
  "pre-commit": "npm run quality-check"
}
```

### 3.3 Pre-commit Hook Setup

**Installation**:

```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npm run pre-commit"
```

**Configuration** (`.lintstagedrc.json`):

```json
{
  "*.{ts,tsx}": ["eslint --fix", "tsc --noEmit"],
  "*.{js,ts,tsx,json,md}": ["prettier --write"]
}
```

## Phase 4: Code Organization Standards (Week 5)

### 4.1 Directory Structure Implementation

**Migration Plan**:

```
src/
├── components/
│   ├── admin/
│   │   ├── dashboard/           # NEW: Dashboard components
│   │   ├── editors/             # NEW: Content editors
│   │   └── forms/               # NEW: Admin forms
│   └── forms/                   # NEW: Reusable forms
├── hooks/
│   ├── admin/                   # NEW: Admin hooks
│   ├── api/                     # NEW: API hooks
│   └── forms/                   # NEW: Form hooks
├── types/                       # Enhanced type definitions
│   ├── api.types.ts             # NEW: API types
│   ├── form.types.ts            # ✅ CREATED
│   └── business.types.ts        # NEW: Business types
├── utils/
│   ├── errorHandling.ts         # ✅ CREATED
│   ├── validation/              # NEW: Validation utils
│   └── formatting/              # NEW: Formatting utils
└── services/                    # NEW: Business services
    ├── auth.service.ts          # NEW: Auth service
    └── content.service.ts       # NEW: Content service
```

### 4.2 Import Organization Enforcement

**ESLint Rule Implementation**:

- ✅ **Type-only imports**: Enforced via `consistent-type-imports`
- ✅ **Import ordering**: Defined clear precedence rules
- **Barrel exports**: Create `index.ts` files for clean imports

### 4.3 Naming Convention Standardization

**Implemented Rules**:

- ✅ **Interfaces**: PascalCase without 'I' prefix
- ✅ **Types**: PascalCase for type aliases
- ✅ **Enums**: PascalCase with UPPER_CASE members
- ✅ **Functions**: camelCase with descriptive names
- ✅ **Components**: PascalCase with descriptive names

## Phase 5: Documentation & Testing (Week 6)

### 5.1 Component Documentation Standards

**Documentation Template**:

```typescript
/**
 * Brief component description
 *
 * @description Detailed functionality explanation
 * @param props - Component props with descriptions
 * @example Usage example with code snippet
 * @see Related components or hooks
 */
```

### 5.2 Type Documentation

**Interface Documentation**:

```typescript
/**
 * User profile form data structure
 *
 * @interface ProfileUpdateData
 * @property username - User's display name (3-30 characters)
 * @property avatar_url - URL to user's avatar image
 * @property bio - User's biographical information
 */
interface ProfileUpdateData {
  username?: string;
  avatar_url?: string;
  bio?: string;
}
```

### 5.3 Testing Strategy

**Unit Testing Priorities**:

1. **Custom hooks**: `useAdminDashboard`, `useDashboardStats`
2. **Utility functions**: Error handling, validation
3. **Critical components**: Form components, admin panels

**Testing Tools Setup**:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

## Implementation Timeline

### Week 1: Type Safety Foundation

- ✅ Create error handling utilities
- ✅ Create form type definitions
- ✅ Enhance ESLint configuration
- [ ] Update core files to use typed error handling
- [ ] Replace Record<string, unknown> with specific interfaces

### Week 2: Component Architecture

- [ ] Extract AdminDashboard hooks
- [ ] Create dashboard layout components
- [ ] Begin sidebar component decomposition
- [ ] Implement ProfilePage refactoring

### Week 3: Component Integration

- [ ] Complete AdminDashboard refactoring
- [ ] Finish sidebar component breakdown
- [ ] Refactor PublicationEditor component
- [ ] Implement HeroSectionEditor refactoring

### Week 4: Organization & Standards

- [ ] Implement directory structure migration
- [ ] Create service layer abstractions
- [ ] Establish import organization patterns
- [ ] Set up pre-commit hooks

### Week 5: Quality Assurance

- [ ] Comprehensive ESLint cleanup
- [ ] Type coverage analysis and improvements
- [ ] Performance optimization implementation
- [ ] Code review and validation

### Week 6: Documentation & Testing

- [ ] Component documentation completion
- [ ] Hook and utility documentation
- [ ] Unit test implementation
- [ ] Integration testing setup

## Success Metrics & Validation

### Automated Quality Gates

```bash
# Daily quality checks
npm run quality-check

# Pre-commit validation
npm run pre-commit

# Type coverage analysis
npx type-coverage --at-least 95

# Bundle size monitoring
npm run analyze
```

### Quality Metrics Tracking

| Metric             | Week 1 | Week 2 | Week 3 | Week 4 | Week 5 | Week 6 | Target |
| ------------------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| Unknown types      | 25     | 15     | 5      | 2      | 0      | 0      | 0      |
| Large components   | 5      | 4      | 2      | 1      | 0      | 0      | 0      |
| ESLint violations  | 15     | 10     | 5      | 2      | 0      | 0      | 0      |
| Type coverage      | 85%    | 87%    | 90%    | 92%    | 94%    | 95%    | 95%    |
| Avg component size | 180    | 165    | 150    | 140    | 135    | 130    | <150   |

### Performance Benchmarks

- **Bundle size**: <2MB (current: ~2.5MB)
- **First load time**: <3s (current: ~4s)
- **Component render time**: <16ms (60fps)
- **Memory usage**: <50MB runtime

## Risk Mitigation

### Technical Risks

1. **Breaking changes during refactoring**
   - Mitigation: Incremental changes with feature flags
   - Rollback strategy: Git branching with atomic commits

2. **Performance degradation**
   - Mitigation: Bundle analysis and performance monitoring
   - Prevention: Lazy loading and code splitting

3. **Type system complexity**
   - Mitigation: Gradual typing with utility types
   - Documentation: Clear examples and patterns

### Team Adoption Risks

1. **Learning curve for new patterns**
   - Mitigation: Training sessions and documentation
   - Support: Code review guidelines and mentoring

2. **Inconsistent implementation**
   - Mitigation: Automated tooling and pre-commit hooks
   - Enforcement: ESLint rules and quality gates

## Post-Implementation Maintenance

### Monthly Reviews

- Quality metrics analysis
- Performance benchmark assessment
- Technical debt evaluation
- Team feedback and process improvement

### Quarterly Updates

- ESLint rule review and updates
- Type coverage goal adjustments
- Architecture pattern evolution
- Tool and dependency updates

### Annual Assessment

- Complete codebase quality audit
- Architecture decision review
- Development process optimization
- Team skill development planning

This plan provides a systematic approach to achieving 10/10 code quality while maintaining development velocity and team productivity.
