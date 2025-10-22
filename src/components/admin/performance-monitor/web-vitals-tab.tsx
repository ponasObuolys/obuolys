import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Zap, Clock, Eye, TrendingUp } from "lucide-react";
import type { PerformanceMetric } from "@/utils/webVitals";

interface WebVitalsTabProps {
  getLatestMetric: (name: string) => PerformanceMetric | undefined;
  getRatingColor: (rating: string) => string;
  formatValue: (name: string, value: number) => string;
}

const getMetricIcon = (name: string) => {
  switch (name) {
    case "LCP":
      return <Eye className="h-4 w-4" />;
    case "INP":
      return <Zap className="h-4 w-4" />;
    case "CLS":
      return <Activity className="h-4 w-4" />;
    case "FCP":
      return <Clock className="h-4 w-4" />;
    case "TTFB":
      return <TrendingUp className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const MetricCard = ({
  metricName,
  metric,
  getRatingColor,
  formatValue,
}: {
  metricName: string;
  metric: PerformanceMetric | undefined;
  getRatingColor: (rating: string) => string;
  formatValue: (name: string, value: number) => string;
}) => (
  <div className="border rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        {getMetricIcon(metricName)}
        <span className="font-medium">{metricName}</span>
      </div>
      {metric && <div className={`w-3 h-3 rounded-full ${getRatingColor(metric.rating)}`} />}
    </div>
    {metric ? (
      <div>
        <div className="text-2xl font-bold">{formatValue(metricName, metric.value)}</div>
        <div className="text-sm text-gray-600 capitalize">{metric.rating.replace("-", " ")}</div>
      </div>
    ) : (
      <div className="text-gray-400">Nėra duomenų</div>
    )}
  </div>
);

export const WebVitalsTab = ({
  getLatestMetric,
  getRatingColor,
  formatValue,
}: WebVitalsTabProps) => {
  const coreMetrics = ["LCP", "INP", "CLS"];
  const otherMetrics = ["FCP", "TTFB"];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Core Web Vitals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coreMetrics.map(metricName => (
              <MetricCard
                key={metricName}
                metricName={metricName}
                metric={getLatestMetric(metricName)}
                getRatingColor={getRatingColor}
                formatValue={formatValue}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kiti našumo rodikliai</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherMetrics.map(metricName => (
              <MetricCard
                key={metricName}
                metricName={metricName}
                metric={getLatestMetric(metricName)}
                getRatingColor={getRatingColor}
                formatValue={formatValue}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
