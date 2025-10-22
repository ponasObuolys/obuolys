import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePerformanceData, useMetricHelpers } from "./performance-monitor.hooks";
import { PerformanceHeader } from "./performance-header";
import { PerformanceScoreCard } from "./performance-score-card";
import { WebVitalsTab } from "./web-vitals-tab";
import { ComponentsTab } from "./components-tab";
import { BundleTab } from "./bundle-tab";
import { RecommendationsCard } from "./recommendations-card";

export function PerformanceMonitor() {
  const { metrics, performanceScore, componentStats, isRefreshing, loadData, handleClearMetrics } =
    usePerformanceData();

  const { getLatestMetric, getRatingColor, formatValue } = useMetricHelpers(metrics);

  return (
    <div className="space-y-6">
      <PerformanceHeader
        isRefreshing={isRefreshing}
        onRefresh={loadData}
        onClear={handleClearMetrics}
      />

      <PerformanceScoreCard performanceScore={performanceScore} />

      <Tabs defaultValue="vitals" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1 md:gap-0">
          <TabsTrigger value="vitals" className="text-xs md:text-sm">
            <span className="hidden sm:inline">Core Web Vitals</span>
            <span className="sm:hidden">Vitals</span>
          </TabsTrigger>
          <TabsTrigger value="components" className="text-xs md:text-sm">
            <span className="hidden sm:inline">Komponentų kraunymas</span>
            <span className="sm:hidden">Komponentai</span>
          </TabsTrigger>
          <TabsTrigger value="bundle" className="text-xs md:text-sm">
            <span className="hidden sm:inline">Bundle informacija</span>
            <span className="sm:hidden">Bundle</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vitals">
          <WebVitalsTab
            getLatestMetric={getLatestMetric}
            getRatingColor={getRatingColor}
            formatValue={formatValue}
          />
        </TabsContent>

        <TabsContent value="components">
          <ComponentsTab componentStats={componentStats} />
        </TabsContent>

        <TabsContent value="bundle">
          <BundleTab />
        </TabsContent>
      </Tabs>

      {metrics.length > 0 && (
        <RecommendationsCard
          getLatestMetric={getLatestMetric}
          performanceScore={performanceScore}
        />
      )}
    </div>
  );
}
