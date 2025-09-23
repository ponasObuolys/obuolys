# AdminDashboard Refactoring Plan

## Current State Analysis

**File**: `src/pages/AdminDashboard.tsx` (696 lines)

### Issues Identified
- **Monolithic component**: Single component handling multiple concerns
- **Mixed responsibilities**: Stats, content management, user management, UI state
- **Large state object**: 7+ state variables in a single component
- **Complex logic**: Multiple async operations and side effects
- **Hard to maintain**: Difficult to test and extend individual features

### Responsibilities Currently Handled
1. Authentication checking and redirects
2. Tab navigation state management
3. Dashboard statistics fetching and display
4. Publications/Articles management
5. Tools management
6. Courses management
7. User management
8. Hero sections management
9. CTA sections management
10. Contact messages management

## Refactoring Strategy

### Phase 1: Extract Custom Hooks

#### 1.1 Dashboard State Management Hook
```typescript
// src/hooks/admin/useAdminDashboard.ts
export interface AdminDashboardState {
  activeTab: string;
  editingItem: string | null;
  isLoading: boolean;
}

export interface AdminDashboardActions {
  setActiveTab: (tab: string) => void;
  setEditingItem: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAdminDashboard = (): {
  state: AdminDashboardState;
  actions: AdminDashboardActions;
} => {
  // Extract all tab and editing state logic
};
```

#### 1.2 Dashboard Statistics Hook
```typescript
// src/hooks/admin/useDashboardStats.ts
export interface DashboardStats {
  publicationsCount: number;
  toolsCount: number;
  coursesCount: number;
  usersCount: number;
  heroSectionsCount: number;
  ctaSectionsCount: number;
  contactMessagesCount: number;
}

export const useDashboardStats = (): {
  stats: DashboardStats;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
} => {
  // Extract all statistics fetching logic
};
```

### Phase 2: Create Tab Components

#### 2.1 Overview Tab Component
```typescript
// src/components/admin/dashboard/OverviewTab.tsx
import type { DashboardStats } from '@/hooks/admin/useDashboardStats';

interface OverviewTabProps {
  stats: DashboardStats;
  loading: boolean;
  onRefresh: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  loading,
  onRefresh
}) => {
  return (
    <div className="space-y-6">
      <AdminDashboardStats stats={stats} loading={loading} />
      <QuickActions onRefresh={onRefresh} />
    </div>
  );
};
```

#### 2.2 Content Management Tabs
```typescript
// src/components/admin/dashboard/PublicationsTab.tsx
interface PublicationsTabProps {
  editingItem: string | null;
  onEdit: (id: string) => void;
  onSave: () => void;
}

export const PublicationsTab: React.FC<PublicationsTabProps> = ({
  editingItem,
  onEdit,
  onSave
}) => {
  return (
    <ContentManagementLayout
      title="Publikacijos"
      editor={<PublicationEditor />}
      editingItem={editingItem}
      onEdit={onEdit}
      onSave={onSave}
    />
  );
};
```

### Phase 3: Create Layout Components

#### 3.1 Dashboard Layout
```typescript
// src/components/admin/dashboard/DashboardLayout.tsx
interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User | null;
  isAdmin: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  user,
  isAdmin
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader user={user} />
      <main className="mt-8">
        {children}
      </main>
    </div>
  );
};
```

#### 3.2 Content Management Layout
```typescript
// src/components/admin/dashboard/ContentManagementLayout.tsx
interface ContentManagementLayoutProps<T> {
  title: string;
  items: T[];
  editingItem: string | null;
  editor: React.ReactNode;
  onEdit: (id: string) => void;
  onSave: () => void;
  onDelete: (id: string) => void;
}

export const ContentManagementLayout = <T extends { id: string }>({
  title,
  items,
  editingItem,
  editor,
  onEdit,
  onSave,
  onDelete
}: ContentManagementLayoutProps<T>): JSX.Element => {
  return (
    <div className="space-y-6">
      <ContentHeader title={title} />
      <ContentList
        items={items}
        editingItem={editingItem}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      {editingItem && (
        <ContentEditor onSave={onSave}>
          {editor}
        </ContentEditor>
      )}
    </div>
  );
};
```

### Phase 4: Tab Navigation Component

```typescript
// src/components/admin/dashboard/DashboardTabs.tsx
interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats: DashboardStats;
  editingItem: string | null;
  onEdit: (id: string) => void;
  onSave: () => void;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  onTabChange,
  stats,
  editingItem,
  onEdit,
  onSave
}) => {
  const tabs = [
    {
      id: 'overview',
      label: 'Apžvalga',
      component: <OverviewTab stats={stats} />
    },
    {
      id: 'publications',
      label: 'Publikacijos',
      component: (
        <PublicationsTab
          editingItem={editingItem}
          onEdit={onEdit}
          onSave={onSave}
        />
      )
    },
    // ... other tabs
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid grid-cols-7 w-full">
        {tabs.map(tab => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(tab => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
};
```

### Phase 5: Refactored Main Component

```typescript
// src/pages/AdminDashboard.tsx (New version ~100 lines)
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAdminDashboard } from '@/hooks/admin/useAdminDashboard';
import { useDashboardStats } from '@/hooks/admin/useDashboardStats';
import { DashboardLayout } from '@/components/admin/dashboard/DashboardLayout';
import { DashboardTabs } from '@/components/admin/dashboard/DashboardTabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useErrorHandler } from '@/utils/errorHandling';

const AdminDashboard: React.FC = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { state, actions } = useAdminDashboard();
  const { stats, loading: statsLoading, error, refresh } = useDashboardStats();
  const { handleAndShowError } = useErrorHandler();

  // Handle authentication
  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  // Handle errors
  if (error) {
    handleAndShowError(error, 'Klaida kraunant duomenis');
  }

  const handleEdit = (id: string): void => {
    actions.setEditingItem(id);
  };

  const handleSave = async (): Promise<void> => {
    try {
      actions.setLoading(true);
      // Save logic here
      actions.setEditingItem(null);
      await refresh();
    } catch (error) {
      handleAndShowError(error, 'Klaida išsaugant');
    } finally {
      actions.setLoading(false);
    }
  };

  return (
    <DashboardLayout user={user} isAdmin={isAdmin}>
      <DashboardTabs
        activeTab={state.activeTab}
        onTabChange={actions.setActiveTab}
        stats={stats}
        editingItem={state.editingItem}
        onEdit={handleEdit}
        onSave={handleSave}
      />
    </DashboardLayout>
  );
};

export default AdminDashboard;
```

## Implementation Benefits

### Code Quality Improvements
- **Single Responsibility**: Each component handles one specific concern
- **Reusability**: Layout and management components can be reused
- **Testability**: Individual components and hooks can be tested in isolation
- **Maintainability**: Changes to one feature don't affect others
- **Type Safety**: All components have proper TypeScript interfaces

### Performance Benefits
- **Code Splitting**: Tabs can be lazy loaded
- **Selective Re-rendering**: Only relevant components update when state changes
- **Optimized Hooks**: Custom hooks can implement proper memoization
- **Reduced Bundle Size**: Smaller individual components

### Developer Experience
- **Clear Structure**: Easy to understand component hierarchy
- **Focused Development**: Work on specific features without touching others
- **Easy Extension**: Add new tabs or features without modifying existing code
- **Better Debugging**: Easier to isolate and fix issues

## Migration Strategy

### Phase 1: Create Infrastructure (Week 1)
1. Create hooks directory structure
2. Implement useAdminDashboard hook
3. Implement useDashboardStats hook
4. Test hooks in isolation

### Phase 2: Extract Components (Week 2)
1. Create DashboardLayout component
2. Extract OverviewTab component
3. Create ContentManagementLayout
4. Test layout components

### Phase 3: Implement Tab Components (Week 3)
1. Create PublicationsTab
2. Create ToolsTab
3. Create other content tabs
4. Create DashboardTabs component

### Phase 4: Integration (Week 4)
1. Update main AdminDashboard component
2. Implement error handling with new utilities
3. Test complete integration
4. Performance optimization

### Quality Assurance
- **Testing**: Each component and hook should have unit tests
- **Type Safety**: All components use proper TypeScript interfaces
- **Error Handling**: Consistent error handling using new utilities
- **Performance**: Measure and optimize rendering performance
- **Documentation**: Document all new components and hooks

This refactoring reduces the main AdminDashboard from 696 lines to ~100 lines while improving maintainability, testability, and type safety.