import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from "web-vitals";
import { log } from "@/utils/browserLogger";

interface PerformanceMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
  timestamp: number;
}

// Performance thresholds based on Core Web Vitals recommendations
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

function getRating(metricName: string, value: number): "good" | "needs-improvement" | "poor" {
  const threshold = THRESHOLDS[metricName as keyof typeof THRESHOLDS];
  if (!threshold) return "good";

  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
}

function formatMetric(metric: Metric): PerformanceMetric {
  return {
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name, metric.value),
    delta: metric.delta,
    id: metric.id,
    timestamp: Date.now(),
  };
}

// Send metrics to analytics (Vercel Analytics integration)
function sendToAnalytics(metric: PerformanceMetric) {
  // Send to Vercel Analytics if available
  if (window.va) {
    window.va("track", "performance", {
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    log.info("Performance metric:", metric);
  }

  // Store in localStorage for dashboard display
  try {
    const stored = localStorage.getItem("performance-metrics") || "[]";
    const metrics = JSON.parse(stored);
    metrics.push(metric);

    // Keep only last 50 metrics
    if (metrics.length > 50) {
      metrics.splice(0, metrics.length - 50);
    }

    localStorage.setItem("performance-metrics", JSON.stringify(metrics));
  } catch (error) {
    log.warn("Failed to store performance metric:", error);
  }
}

export function reportWebVitals(onPerfEntry?: (metric: PerformanceMetric) => void) {
  const handleMetric = (metric: Metric) => {
    const formattedMetric = formatMetric(metric);
    sendToAnalytics(formattedMetric);
    onPerfEntry?.(formattedMetric);
  };

  onCLS(handleMetric);
  onINP(handleMetric);
  onFCP(handleMetric);
  onLCP(handleMetric);
  onTTFB(handleMetric);
}

// Get stored performance metrics for dashboard display
export function getStoredMetrics(): PerformanceMetric[] {
  try {
    const stored = localStorage.getItem("performance-metrics") || "[]";
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// Clear stored metrics
export function clearStoredMetrics() {
  localStorage.removeItem("performance-metrics");
}

// Calculate average performance score
export function calculatePerformanceScore(metrics: PerformanceMetric[]): number {
  if (metrics.length === 0) return 0;

  const weights = { LCP: 0.25, INP: 0.25, CLS: 0.25, FCP: 0.125, TTFB: 0.125 };
  let totalScore = 0;
  let totalWeight = 0;

  for (const metric of metrics) {
    const weight = weights[metric.name as keyof typeof weights] || 0;
    if (weight === 0) continue;

    let score = 0;
    if (metric.rating === "good") score = 100;
    else if (metric.rating === "needs-improvement") score = 50;
    else score = 0;

    totalScore += score * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
}

// Extend window type for TypeScript
declare global {
  interface Window {
    va?: (event: string, name: string, data?: Record<string, unknown>) => void;
  }
}
