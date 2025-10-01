import { useState, useEffect, useCallback } from "react";
import {
  getStoredMetrics,
  clearStoredMetrics,
  calculatePerformanceScore,
  type PerformanceMetric,
} from "@/utils/webVitals";
import { getComponentLoadingStats } from "@/utils/lazyLoad";
import type { ComponentStats } from "./performance-monitor.types";

export const usePerformanceData = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [componentStats, setComponentStats] = useState<ComponentStats | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(() => {
    setIsRefreshing(true);

    const storedMetrics = getStoredMetrics();
    setMetrics(storedMetrics);
    setPerformanceScore(calculatePerformanceScore(storedMetrics));

    const stats = getComponentLoadingStats();
    setComponentStats(stats);

    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleClearMetrics = useCallback(() => {
    clearStoredMetrics();
    setMetrics([]);
    setPerformanceScore(0);
  }, []);

  return {
    metrics,
    performanceScore,
    componentStats,
    isRefreshing,
    loadData,
    handleClearMetrics,
  };
};

export const useMetricHelpers = (metrics: PerformanceMetric[]) => {
  const getLatestMetric = useCallback(
    (name: string) => {
      return metrics.filter((m) => m.name === name).sort((a, b) => b.timestamp - a.timestamp)[0];
    },
    [metrics]
  );

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "good":
        return "bg-green-500";
      case "needs-improvement":
        return "bg-yellow-500";
      case "poor":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatValue = (name: string, value: number) => {
    if (name === "CLS") return value.toFixed(3);
    return `${Math.round(value)}ms`;
  };

  return { getLatestMetric, getRatingColor, formatValue };
};
