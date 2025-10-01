import type { PerformanceMetric } from "@/utils/webVitals";

export interface ComponentStats {
  totalComponents: number;
  cachedComponents: number;
  averageLoadTime: number;
  totalRetries: number;
}

export interface PerformanceMonitorState {
  metrics: PerformanceMetric[];
  performanceScore: number;
  componentStats: ComponentStats | null;
  isRefreshing: boolean;
}
