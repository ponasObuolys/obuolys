# Code Organization Standards

## Directory Structure Standards

### Current vs Recommended Structure

```
src/
├── components/
│   ├── ui/                      # Generic UI components (shadcn/ui)
│   ├── admin/                   # Admin-specific components
│   │   ├── dashboard/          # NEW: Dashboard sub-components
│   │   ├── editors/            # NEW: Content editors
│   │   ├── forms/              # NEW: Admin forms
│   │   └── shared/             # NEW: Shared admin components
│   ├── forms/                  # NEW: Reusable form components
│   ├── layout/                 # Layout components
│   ├── home/                   # Homepage components
│   └── tools/                  # NEW: Tools-related components
├── hooks/                      # Custom React hooks
│   ├── admin/                  # NEW: Admin-specific hooks
│   ├── api/                    # NEW: API-related hooks
│   ├── forms/                  # NEW: Form-related hooks
│   └── ui/                     # NEW: UI-related hooks
├── types/                      # TypeScript type definitions
│   ├── api.types.ts            # NEW: API response types
│   ├── form.types.ts           # NEW: Form-related types
│   ├── ui.types.ts             # NEW: UI component types
│   └── business.types.ts       # NEW: Business logic types
├── utils/                      # Utility functions
│   ├── api/                    # NEW: API utilities
│   ├── validation/             # NEW: Form validation
│   ├── formatting/             # NEW: Data formatting
│   └── errorHandling.ts        # NEW: Error handling utilities
├── constants/                  # NEW: Application constants
│   ├── api.constants.ts        # NEW: API endpoints and configs
│   ├── ui.constants.ts         # NEW: UI constants
│   └── validation.constants.ts # NEW: Validation rules
├── services/                   # NEW: Business logic services
│   ├── auth.service.ts         # NEW: Authentication service
│   ├── content.service.ts      # NEW: Content management service
│   └── upload.service.ts       # NEW: File upload service
└── lib/                        # External library configurations
```

## File Naming Conventions

### React Components
```typescript
// PascalCase for components
UserProfileForm.tsx          # Main component file
UserProfileForm.types.ts     # Type definitions
UserProfileForm.utils.ts     # Component utilities
UserProfileForm.constants.ts # Component constants
UserProfileForm.test.tsx     # Component tests
UserProfileForm.stories.tsx  # Storybook stories (if applicable)
```

### Hooks
```typescript
// camelCase with 'use' prefix
useUserProfile.ts            # Main hook
useUserProfile.types.ts      # Hook types
useUserProfile.test.ts       # Hook tests
```

### Utilities and Services
```typescript
// camelCase for functions, PascalCase for classes
errorHandling.ts             # Utility functions
ApiService.ts               # Service classes
validation.utils.ts         # Validation utilities
formatting.utils.ts         # Formatting utilities
```

### Types
```typescript
// Descriptive naming with .types.ts suffix
api.types.ts                # API-related types
form.types.ts               # Form-related types
business.types.ts           # Business logic types
ui.types.ts                 # UI component types
```

## Import Organization Standards

### Import Order
```typescript
// 1. React and external libraries
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

// 2. Internal types (type-only imports)
import type { Database } from '@/integrations/supabase/types';
import type { UserRole, AdminDashboardProps } from '@/types/business.types';
import type { FormData } from '@/types/form.types';

// 3. Internal hooks and utilities
import { useAuth } from '@/context/AuthContext';
import { useErrorHandler } from '@/utils/errorHandling';
import { formatDate } from '@/utils/formatting';

// 4. Services
import { AuthService } from '@/services/auth.service';
import { ContentService } from '@/services/content.service';

// 5. UI components (shadcn/ui)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';

// 6. Business components
import { UserManager } from '@/components/admin/UserManager';
import { PublicationEditor } from '@/components/admin/editors/PublicationEditor';

// 7. Constants
import { API_ENDPOINTS } from '@/constants/api.constants';
import { VALIDATION_RULES } from '@/constants/validation.constants';
```

### Type-only Imports
```typescript
// Always use type-only imports for types
import type { User } from '@/types/business.types';
import type { ComponentProps } from 'react';

// Not this:
import { User } from '@/types/business.types';
```

## Component Organization Patterns

### Component Structure
```typescript
// 1. Imports (organized as above)
import React from 'react';
import type { ComponentProps } from './Component.types';

// 2. Types and interfaces (if not in separate file)
interface LocalComponentState {
  // Local types here
}

// 3. Constants (if not in separate file)
const DEFAULT_OPTIONS = {
  // Constants here
} as const;

// 4. Main component
export const ComponentName: React.FC<ComponentProps> = ({
  prop1,
  prop2,
  ...rest
}) => {
  // 4.1 Hooks (in order of dependency)
  const [state, setState] = useState();
  const { data, loading } = useCustomHook();

  // 4.2 Event handlers
  const handleClick = useCallback(() => {
    // Handler logic
  }, [dependencies]);

  // 4.3 Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // 4.4 Computed values
  const computedValue = useMemo(() => {
    return expensiveComputation(data);
  }, [data]);

  // 4.5 Early returns
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  // 4.6 Render
  return (
    <div className="component-wrapper">
      {/* JSX here */}
    </div>
  );
};

// 5. Default export (if applicable)
export default ComponentName;
```

### Custom Hook Structure
```typescript
// 1. Imports
import { useState, useEffect, useCallback } from 'react';
import type { HookOptions, HookReturn } from './useHook.types';

// 2. Hook implementation
export const useCustomHook = (
  options: HookOptions = {}
): HookReturn => {
  // 2.1 State
  const [state, setState] = useState(initialState);

  // 2.2 Actions
  const action1 = useCallback(async () => {
    // Action logic
  }, [dependencies]);

  // 2.3 Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // 2.4 Return object
  return {
    state,
    actions: {
      action1,
    },
    computed: {
      // Computed values
    },
  };
};
```

## Folder Organization by Feature

### Feature-based Structure (for large features)
```
src/components/admin/dashboard/
├── index.ts                    # Export barrel
├── DashboardLayout.tsx         # Main layout
├── DashboardTabs.tsx          # Tab navigation
├── hooks/
│   ├── useAdminDashboard.ts   # Main dashboard hook
│   ├── useDashboardStats.ts   # Statistics hook
│   └── index.ts               # Hook exports
├── components/
│   ├── OverviewTab.tsx        # Overview tab
│   ├── PublicationsTab.tsx    # Publications tab
│   ├── StatsCard.tsx          # Statistics card
│   └── index.ts               # Component exports
├── types/
│   ├── dashboard.types.ts     # Dashboard types
│   └── index.ts               # Type exports
└── utils/
    ├── dashboard.utils.ts     # Dashboard utilities
    └── index.ts               # Utility exports
```

### Export Barrels
```typescript
// src/components/admin/dashboard/index.ts
export { DashboardLayout } from './DashboardLayout';
export { DashboardTabs } from './DashboardTabs';
export * from './components';
export * from './hooks';
export * from './types';

// Usage:
import { DashboardLayout, useDashboardStats } from '@/components/admin/dashboard';
```

## Type Organization

### Interface Naming
```typescript
// Component props
interface ComponentNameProps {
  // Props here
}

// Component state
interface ComponentNameState {
  // State here
}

// Hook options
interface UseHookNameOptions {
  // Options here
}

// Hook return
interface UseHookNameReturn {
  // Return properties here
}

// API responses
interface ApiResponseName {
  // Response properties here
}

// Form data
interface FormNameData {
  // Form fields here
}
```

### Enum Conventions
```typescript
// PascalCase for enum names, UPPER_CASE for values
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR',
}

export enum ContentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}
```

### Utility Types
```typescript
// Generic utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// API utility types
export type ApiResponse<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: string;
};

// Form utility types
export type FormState<T> = {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
};
```

## Constants Organization

### API Constants
```typescript
// src/constants/api.constants.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  CONTENT: {
    ARTICLES: '/api/articles',
    TOOLS: '/api/tools',
    COURSES: '/api/courses',
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
```

### UI Constants
```typescript
// src/constants/ui.constants.ts
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
} as const;
```

### Validation Constants
```typescript
// src/constants/validation.constants.ts
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: false,
  },
  EMAIL: {
    MAX_LENGTH: 254,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
  },
  FILE_UPLOAD: {
    MAX_SIZE_MB: 5,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  },
} as const;
```

## Documentation Standards

### Component Documentation
```typescript
/**
 * User profile management form component
 *
 * @description Handles user profile updates including avatar upload,
 * username changes, and bio modifications. Integrates with Supabase
 * for data persistence and includes optimistic updates for better UX.
 *
 * @param user - Current user data from auth context
 * @param onUpdate - Callback fired when profile is successfully updated
 * @param className - Additional CSS classes to apply
 *
 * @example
 * ```tsx
 * <UserProfileForm
 *   user={currentUser}
 *   onUpdate={(updatedUser) => {
 *     setUser(updatedUser);
 *     toast.success('Profile updated successfully');
 *   }}
 *   className="max-w-md mx-auto"
 * />
 * ```
 *
 * @see {@link useUserProfile} for the underlying hook
 * @see {@link ProfileUpdateData} for form data structure
 */
export const UserProfileForm: React.FC<UserProfileFormProps> = ({
  user,
  onUpdate,
  className
}) => {
  // Implementation
};
```

### Hook Documentation
```typescript
/**
 * Custom hook for managing user profile state and operations
 *
 * @description Provides methods for updating user profile data,
 * handling avatar uploads, and managing form state. Includes
 * error handling and optimistic updates.
 *
 * @param userId - ID of the user whose profile to manage
 * @param options - Configuration options for the hook
 *
 * @returns Object containing profile data, loading states, and action methods
 *
 * @example
 * ```typescript
 * const { profile, isLoading, updateProfile, uploadAvatar } = useUserProfile(
 *   user.id,
 *   { enableOptimisticUpdates: true }
 * );
 *
 * await updateProfile({ username: 'newUsername' });
 * ```
 */
export const useUserProfile = (
  userId: string,
  options: UseUserProfileOptions = {}
): UseUserProfileReturn => {
  // Implementation
};
```

## Quality Gates

### Pre-commit Checks
1. **ESLint**: No errors, warnings acceptable with justification
2. **TypeScript**: Strict type checking, no `any` or `unknown` without proper handling
3. **Import Organization**: All imports properly organized and typed
4. **File Structure**: Files placed in correct directories with proper naming
5. **Documentation**: All public interfaces documented

### Code Review Guidelines
1. **Single Responsibility**: Each component/hook has clear, focused purpose
2. **Type Safety**: All props, state, and return types properly defined
3. **Error Handling**: Consistent error handling patterns
4. **Performance**: Proper use of memoization and optimization
5. **Accessibility**: UI components meet accessibility standards
6. **Testing**: Critical logic covered by tests

This organization standard ensures maintainable, scalable, and type-safe code across the entire application.