# Performance Optimization Plan - Ponas Obuolys Project

## Executive Summary

**Current Performance**: 6/10 (815KB bundle, no code splitting)
**Target Performance**: 10/10 (<500KB main bundle, optimized loading)
**Expected Timeline**: 2-3 weeks implementation
**ROI**: 50%+ bundle size reduction, 60%+ faster initial load

---

## 🎯 Performance Targets

| Metric               | Current     | Target       | Improvement   |
| -------------------- | ----------- | ------------ | ------------- |
| **Main Bundle**      | 815KB       | <300KB       | 63% reduction |
| **Total Bundle**     | 815KB       | <500KB       | 38% reduction |
| **First Load**       | ~3-4s       | <2s          | 50% faster    |
| **Code Coverage**    | 100% loaded | ~30% initial | 70% deferred  |
| **Lighthouse Score** | ~70         | >90          | +20 points    |

---

## 📊 Current Bundle Analysis

### Bundle Composition (815KB)

```
- React Core: ~150KB (18%)
- Radix UI Components: ~200KB (25%)
- Admin Dashboard: ~180KB (22%)
- Other Pages: ~120KB (15%)
- Utilities & Libraries: ~165KB (20%)
```

### Large Components Identified

- `AdminDashboard.tsx`: 696 lines → Split into 4 components
- `ProfilePage.tsx`: 681 lines → Split into 3 components
- `sidebar.tsx`: 806 lines → Extract to separate chunks

---

## 🛠️ Implementation Strategy

### Phase 1: Advanced Vite Configuration (Week 1)

#### 1.1 Manual Chunking Strategy

```typescript
// vite.config.ts - Enhanced configuration
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
          ],
          "form-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],
          "chart-vendor": ["recharts"],

          // Feature chunks
          "admin-chunk": ["./src/pages/AdminDashboard.tsx", "./src/components/admin"],
          "auth-chunk": [
            "./src/pages/Auth.tsx",
            "./src/pages/ProfilePage.tsx",
            "./src/context/AuthContext.tsx",
          ],
          "content-chunk": [
            "./src/pages/PublicationsPage.tsx",
            "./src/pages/PublicationDetail.tsx",
            "./src/pages/CoursesPage.tsx",
            "./src/pages/CourseDetail.tsx",
          ],
        },
      },
    },
    // Optimization settings
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Chunk size optimization
    chunkSizeWarningLimit: 300,
  },
});
```

**Expected Impact**: 40% bundle size reduction (815KB → 490KB)

#### 1.2 Dynamic Import Configuration

```typescript
// Add to vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Dynamic chunk naming
        chunkFileNames: chunkInfo => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split("/").pop().replace(".tsx", "")
            : "chunk";
          return `${facadeModuleId}-[hash].js`;
        },
      },
    },
  },
});
```

### Phase 2: Route-based Code Splitting (Week 1)

#### 2.1 Lazy Loading Implementation

```typescript
// src/App.tsx - Updated with lazy loading
import { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';

// Lazy load heavy components
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PublicationDetail = lazy(() => import('./pages/PublicationDetail'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const ToolDetailPage = lazy(() => import('./pages/ToolDetailPage'));

// Wrap routes with Suspense
<Route
  path="/admin"
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <AdminDashboard />
    </Suspense>
  }
/>
```

**Expected Impact**: 60% initial bundle reduction (315KB → 185KB main chunk)

#### 2.2 Progressive Loading Strategy

```typescript
// src/utils/lazyLoad.ts
export const createLazyComponent = (importFn: () => Promise<any>) => {
  return lazy(() =>
    Promise.all([
      importFn(),
      new Promise(resolve => setTimeout(resolve, 100)), // Minimum loading time
    ]).then(([moduleExports]) => moduleExports)
  );
};

// Usage
const AdminDashboard = createLazyComponent(() => import("./pages/AdminDashboard"));
```

### Phase 3: Component Optimization (Week 2)

#### 3.1 AdminDashboard Refactoring

**Split 696 lines into:**

```typescript
// src/pages/AdminDashboard.tsx (150 lines)
const AdminDashboard = lazy(() => import("./AdminDashboard"));

// src/components/admin/DashboardLayout.tsx (120 lines)
// src/components/admin/StatsSection.tsx (100 lines)
// src/components/admin/ContentManagement.tsx (180 lines)
// src/components/admin/UserManagement.tsx (146 lines)
```

#### 3.2 ProfilePage Refactoring

**Split 681 lines into:**

```typescript
// src/pages/ProfilePage.tsx (180 lines)
// src/components/profile/ProfileHeader.tsx (150 lines)
// src/components/profile/ProfileSettings.tsx (200 lines)
// src/components/profile/ProfileActivity.tsx (151 lines)
```

#### 3.3 Component Lazy Loading

```typescript
// src/components/admin/index.ts
export const DashboardLayout = lazy(() => import("./DashboardLayout"));
export const StatsSection = lazy(() => import("./StatsSection"));
export const ContentManagement = lazy(() => import("./ContentManagement"));
```

**Expected Impact**: 25% component load time reduction

### Phase 4: Dependency Optimization (Week 2)

#### 4.1 Tree Shaking Configuration

```typescript
// vite.config.ts additions
export default defineConfig({
  build: {
    rollupOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "@tanstack/react-query"],
    exclude: [
      "@radix-ui/react-*", // Let these be chunked properly
    ],
  },
});
```

#### 4.2 Import Optimization

```typescript
// Replace barrel imports with specific imports
// Before:
import { Button, Input, Select } from "@/components/ui";

// After:
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
```

#### 4.3 Dynamic Radix UI Imports

```typescript
// src/components/ui/dynamic-imports.ts
export const Dialog = lazy(() => import("@radix-ui/react-dialog"));
export const DropdownMenu = lazy(() => import("@radix-ui/react-dropdown-menu"));
export const Select = lazy(() => import("@radix-ui/react-select"));
```

**Expected Impact**: 15% dependency size reduction

### Phase 5: Performance Monitoring (Week 3)

#### 5.1 Web Vitals Implementation

```typescript
// src/utils/webVitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

export function reportWebVitals(onPerfEntry?: (metric: any) => void) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
}

// Analytics integration
const sendToAnalytics = (metric: any) => {
  // Send to Vercel Analytics
  console.log("Performance metric:", metric);
};

reportWebVitals(sendToAnalytics);
```

#### 5.2 Bundle Analysis Setup

```json
// package.json additions
{
  "scripts": {
    "analyze": "vite build --mode analyze",
    "bundle-stats": "npx vite-bundle-analyzer dist/stats.html"
  },
  "devDependencies": {
    "vite-bundle-analyzer": "^0.7.0",
    "web-vitals": "^3.5.0"
  }
}
```

#### 5.3 Performance Dashboard

```typescript
// src/components/admin/PerformanceMonitor.tsx
export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    reportWebVitals((metric) => {
      setMetrics(prev => ({ ...prev, [metric.name]: metric.value }));
    });
  }, []);

  return (
    <div className="performance-dashboard">
      <h3>Performance Metrics</h3>
      <div>LCP: {metrics.LCP}ms</div>
      <div>FID: {metrics.FID}ms</div>
      <div>CLS: {metrics.CLS}</div>
    </div>
  );
};
```

---

## 📈 Expected Performance Improvements

### Bundle Size Optimization

```
Phase 1: 815KB → 490KB (40% reduction)
Phase 2: 490KB → 295KB (40% reduction)
Phase 3: 295KB → 265KB (10% reduction)
Phase 4: 265KB → 225KB (15% reduction)

Final Target: 225KB main bundle (72% reduction)
```

### Loading Performance

```
Initial Load:
- Current: ~3.5s (815KB over 3G)
- Target: ~1.2s (225KB over 3G)
- Improvement: 66% faster

Secondary Pages:
- Current: Full reload required
- Target: <500ms chunk loading
- Improvement: 85% faster navigation
```

### Core Web Vitals Targets

```
LCP (Largest Contentful Paint):
- Current: ~3.2s
- Target: <2.5s
- Strategy: Critical CSS, image optimization

FID (First Input Delay):
- Current: ~200ms
- Target: <100ms
- Strategy: Code splitting, reduced JS blocking

CLS (Cumulative Layout Shift):
- Current: ~0.15
- Target: <0.1
- Strategy: Image dimensions, font loading
```

---

## 🛠️ Implementation Steps

### Week 1: Foundation

1. **Day 1-2**: Implement advanced Vite configuration
2. **Day 3-4**: Add route-based lazy loading
3. **Day 5**: Test and validate initial improvements

### Week 2: Component Optimization

1. **Day 1-3**: Refactor AdminDashboard component
2. **Day 4-5**: Refactor ProfilePage and sidebar components
3. **Weekend**: Dependency optimization and tree shaking

### Week 3: Monitoring & Fine-tuning

1. **Day 1-2**: Implement Web Vitals monitoring
2. **Day 3-4**: Bundle analysis and micro-optimizations
3. **Day 5**: Performance testing and validation

---

## 🔍 Monitoring & Validation

### Performance Metrics Dashboard

```typescript
// Key metrics to track
const performanceTargets = {
  mainBundleSize: { target: 300, current: 815, unit: "KB" },
  initialLoadTime: { target: 2, current: 3.5, unit: "s" },
  lighthouseScore: { target: 90, current: 70, unit: "points" },
  chunkLoadTime: { target: 500, current: 0, unit: "ms" },
};
```

### Validation Checklist

- [ ] Main bundle <300KB
- [ ] No chunks >500KB
- [ ] LCP <2.5s
- [ ] FID <100ms
- [ ] CLS <0.1
- [ ] Lighthouse Performance >90

---

## 🎯 Success Criteria

### Performance Score: 10/10 Achievement

```
✅ Bundle Size: 815KB → 225KB (72% reduction)
✅ Load Time: 3.5s → 1.2s (66% improvement)
✅ Code Coverage: 100% → 30% initial (70% deferred)
✅ Lighthouse Score: 70 → 95 (+25 points)
✅ User Experience: Significantly improved
```

### Business Impact

- **User Retention**: +25% (faster loading)
- **SEO Performance**: +30% (better Core Web Vitals)
- **Mobile Experience**: +40% (reduced data usage)
- **Development Speed**: +20% (better code organization)

---

## 🚨 Risk Mitigation

### Potential Risks

1. **Over-fragmentation**: Too many small chunks
   - **Mitigation**: Monitor chunk count, combine related features
2. **Loading delays**: Suspense boundaries causing UX issues
   - **Mitigation**: Implement smart loading states
3. **Development complexity**: Increased build complexity
   - **Mitigation**: Comprehensive documentation and testing

### Rollback Strategy

- Maintain current `App.tsx` as `App.legacy.tsx`
- Feature flags for progressive rollout
- Performance monitoring with automatic alerts

---

_Performance Optimization Plan v1.0_
_Created: 2025-09-23_
_Target Completion: 2025-10-14_
