import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Zap, Clock, RefreshCw } from "lucide-react";
import type { ComponentStats } from "./performance-monitor.types";

interface ComponentsTabProps {
  componentStats: ComponentStats | null;
}

export const ComponentsTab = ({ componentStats }: ComponentsTabProps) => {
  if (!componentStats) return null;

  const cacheHitRate =
    (componentStats.cachedComponents / Math.max(componentStats.totalComponents, 1)) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Iš viso komponentų</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{componentStats.totalComponents}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cache taikiniai</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{Math.round(cacheHitRate)}%</div>
          <p className="text-xs text-muted-foreground">
            {componentStats.cachedComponents} iš {componentStats.totalComponents}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vidutinis kraunymo laikas</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(componentStats.averageLoadTime)}ms</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pakartotiniai bandymai</CardTitle>
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{componentStats.totalRetries}</div>
        </CardContent>
      </Card>
    </div>
  );
};
