import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { PerformanceMetric } from "@/utils/webVitals";

interface RecommendationsCardProps {
  getLatestMetric: (name: string) => PerformanceMetric | undefined;
  performanceScore: number;
}

export const RecommendationsCard = ({
  getLatestMetric,
  performanceScore,
}: RecommendationsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rekomendacijos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {getLatestMetric("LCP")?.rating === "poor" && (
            <div className="flex items-center gap-2 text-red-600">
              <TrendingDown className="h-4 w-4" />
              LCP reikia tobulinti - optimizuokite paveikslėlius ir kritinį CSS
            </div>
          )}
          {getLatestMetric("INP")?.rating === "poor" && (
            <div className="flex items-center gap-2 text-red-600">
              <TrendingDown className="h-4 w-4" />
              INP reikia tobulinti - sumažinkite JavaScript vykdymą
            </div>
          )}
          {getLatestMetric("CLS")?.rating === "poor" && (
            <div className="flex items-center gap-2 text-red-600">
              <TrendingDown className="h-4 w-4" />
              CLS reikia tobulinti - nustatykite paveikslėlių dydžius
            </div>
          )}
          {performanceScore >= 90 && (
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
              Puikus našumas! Tęskite gerą darbą.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
