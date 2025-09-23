# Implementation Example: Error Handling Migration

## Before vs After: AuthContext.tsx Error Handling

This example demonstrates the practical application of the type safety improvements by migrating error handling in the AuthContext component.

### Current Implementation (Before)

```typescript
// Current error handling in AuthContext.tsx (lines 119-121)
} catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : "Įvyko klaida prisijungiant";
  toast({
    title: "Prisijungimo klaida",
    description: errorMessage,
    variant: "destructive",
  });
}
```

**Issues with current approach:**
- Repeated error handling logic across 7 locations
- No consistent error categorization
- Manual error message extraction
- No error logging or tracking
- Inconsistent toast notification patterns

### Improved Implementation (After)

```typescript
// 1. Import the new error handling utilities
import { useErrorHandler, handleAuthError } from '@/utils/errorHandling';

// 2. Use the error handler hook
const { handleAuthErrorWithToast } = useErrorHandler();

// 3. Simplified error handling
} catch (error: unknown) {
  handleAuthErrorWithToast(error, 'Prisijungimo klaida');
}
```

## Complete Migration Example

### Step 1: Update Imports

```typescript
// Add to imports section
import {
  useErrorHandler,
  handleAuthError,
  handleApiError,
  createAsyncHandler
} from '@/utils/errorHandling';
```

### Step 2: Initialize Error Handler

```typescript
// Add to component body
const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  // Existing state...
  const { toast } = useToast();

  // Add error handler
  const {
    handleAuthErrorWithToast,
    handleApiErrorWithToast
  } = useErrorHandler();
```

### Step 3: Migrate Individual Error Handlers

#### Login Function
```typescript
// Before
const signIn = async (email: string, password: string) => {
  try {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    toast({
      title: "Sėkmingai prisijungėte",
      description: "Sveiki sugrįžę!",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Įvyko klaida prisijungiant";
    toast({
      title: "Prisijungimo klaida",
      description: errorMessage,
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

// After
const signIn = async (email: string, password: string): Promise<void> => {
  try {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    toast({
      title: "Sėkmingai prisijungėte",
      description: "Sveiki sugrįžę!",
    });
  } catch (error: unknown) {
    handleAuthErrorWithToast(error, 'Prisijungimo klaida');
  } finally {
    setLoading(false);
  }
};
```

#### Registration Function
```typescript
// Before
const signUp = async (email: string, password: string) => {
  try {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    toast({
      title: "Registracija sėkminga",
      description: "Prašome patvirtinti savo el. paštą.",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Įvyko klaida registruojantis";
    toast({
      title: "Registracijos klaida",
      description: errorMessage,
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

// After
const signUp = async (email: string, password: string): Promise<void> => {
  try {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    toast({
      title: "Registracija sėkminga",
      description: "Prašome patvirtinti savo el. paštą.",
    });
  } catch (error: unknown) {
    handleAuthErrorWithToast(error, 'Registracijos klaida');
  } finally {
    setLoading(false);
  }
};
```

#### Profile Update with Complex Error Handling
```typescript
// Before
const updateProfile = async (data: Record<string, unknown>) => {
  try {
    if (!user) throw new Error("Vartotojas neprisijungęs");

    setLoading(true);

    // Prepare update object
    const updates: Record<string, unknown> = {};
    if (data.username) updates.username = data.username;
    if (data.avatarUrl) updates.avatar_url = data.avatarUrl;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;

    // Update local state
    setUserProfile(prev => ({
      ...prev,
      ...updates
    }));

    toast({
      title: "Profilis atnaujintas",
      description: "Jūsų profilis buvo sėkmingai atnaujintas.",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Įvyko klaida atnaujinant profilį";
    toast({
      title: "Profilio atnaujinimo klaida",
      description: errorMessage,
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

// After
const updateProfile = async (data: ProfileUpdateData): Promise<void> => {
  try {
    if (!user) throw new Error("Vartotojas neprisijungęs");

    setLoading(true);

    // Type-safe update object
    const updates: Partial<Database['public']['Tables']['profiles']['Update']> = {};
    if (data.username) updates.username = data.username;
    if (data.avatar_url) updates.avatar_url = data.avatar_url;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;

    // Update local state with type safety
    setUserProfile(prev => prev ? {
      ...prev,
      ...updates
    } : null);

    toast({
      title: "Profilis atnaujintas",
      description: "Jūsų profilis buvo sėkmingai atnaujintas.",
    });
  } catch (error: unknown) {
    handleApiErrorWithToast(error, 'Profilio atnaujinimo klaida');
  } finally {
    setLoading(false);
  }
};
```

### Step 4: Advanced Error Handling with Async Helper

```typescript
// For simpler functions, use the async handler helper
const signOut = createAsyncHandler(
  async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    toast({
      title: "Sėkmingai atsijungėte",
      description: "Sėkmingai atsijungėte nuo sistemos.",
    });
  },
  (error) => handleAuthErrorWithToast(error, 'Atsijungimo klaida')
);
```

## Benefits of the Migration

### Type Safety Improvements
- **Strong typing**: `ProfileUpdateData` instead of `Record<string, unknown>`
- **Database types**: Proper Supabase type usage
- **Function signatures**: Explicit return types and parameter types

### Code Quality Improvements
- **DRY principle**: No repeated error handling logic
- **Consistency**: Standardized error messages and toast patterns
- **Maintainability**: Centralized error handling logic
- **Testability**: Error handlers can be tested independently

### Error Handling Improvements
- **Categorization**: Authentication vs API vs validation errors
- **Logging**: Centralized error tracking
- **User Experience**: Consistent error message formatting
- **Debugging**: Better error context and stack traces

## Metrics Impact

### Before Migration
- **Code duplication**: 7 similar error handling blocks
- **Type safety**: `unknown` types throughout
- **Maintainability**: Changes require updating multiple locations
- **Testing**: Each component must test error handling separately

### After Migration
- **Code reduction**: ~30% fewer lines in error handling
- **Type safety**: 100% typed error handling
- **Maintainability**: Single source of truth for error logic
- **Testing**: Centralized error handling tests

## Implementation Timeline

### Phase 1: Setup (Day 1)
1. ✅ Create error handling utilities
2. ✅ Create form type definitions
3. Update AuthContext.tsx (priority file)

### Phase 2: Core Components (Day 2-3)
1. Update admin components with heavy error handling
2. Migrate FileUpload.tsx
3. Update form components

### Phase 3: Validation (Day 4)
1. Test all error scenarios
2. Verify type coverage improvements
3. Performance validation

This example demonstrates how the systematic approach transforms error handling from repetitive, untyped code to maintainable, type-safe utilities that improve both developer experience and code quality.