import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getStoredMetrics,
  clearStoredMetrics,
  calculatePerformanceScore,
  type PerformanceMetric
} from '@/utils/webVitals';
import { getComponentLoadingStats } from '@/utils/lazyLoad';
import { TrendingUp, TrendingDown, Activity, Zap, Clock, Eye, Package, RefreshCw, Trash2 } from 'lucide-react';

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [componentStats, setComponentStats] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = () => {
    setIsRefreshing(true);

    const storedMetrics = getStoredMetrics();
    setMetrics(storedMetrics);
    setPerformanceScore(calculatePerformanceScore(storedMetrics));

    // Load component loading statistics
    const stats = getComponentLoadingStats();
    setComponentStats(stats);

    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();

    // Refresh metrics every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getLatestMetric = (name: string) => {
    return metrics
      .filter(m => m.name === name)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
  };

  const getMetricIcon = (name: string) => {
    switch (name) {
      case 'LCP': return <Eye className="h-4 w-4" />;
      case 'INP': return <Zap className="h-4 w-4" />;
      case 'CLS': return <Activity className="h-4 w-4" />;
      case 'FCP': return <Clock className="h-4 w-4" />;
      case 'TTFB': return <TrendingUp className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'bg-green-500';
      case 'needs-improvement': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatValue = (name: string, value: number) => {
    if (name === 'CLS') return value.toFixed(3);
    return `${Math.round(value)}ms`;
  };

  const coreMetrics = ['LCP', 'INP', 'CLS'];
  const otherMetrics = ['FCP', 'TTFB'];

  const cacheHitRate = componentStats ?
    (componentStats.cachedComponents / Math.max(componentStats.totalComponents, 1)) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Našumo monitoringas</h2>
          <p className="text-gray-600">Core Web Vitals ir komponentų kraunymo statistika</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atnaujinti
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearStoredMetrics();
              setMetrics([]);
              setPerformanceScore(0);
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Išvalyti
          </Button>
        </div>
      </div>

      {/* Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Bendrasis našumo balas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold">
              {performanceScore}/100
            </div>
            <Progress value={performanceScore} className="flex-1" />
            <Badge variant={performanceScore >= 90 ? 'default' : performanceScore >= 50 ? 'secondary' : 'destructive'}>
              {performanceScore >= 90 ? 'Puikus' : performanceScore >= 50 ? 'Reikia tobulinti' : 'Prastas'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="vitals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vitals">Core Web Vitals</TabsTrigger>
          <TabsTrigger value="components">Komponentų kraunymas</TabsTrigger>
          <TabsTrigger value="bundle">Bundle informacija</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals" className="space-y-4">
          {/* Core Web Vitals */}
          <Card>
            <CardHeader>
              <CardTitle>Core Web Vitals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {coreMetrics.map(metricName => {
                  const metric = getLatestMetric(metricName);
                  return (
                    <div key={metricName} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getMetricIcon(metricName)}
                          <span className="font-medium">{metricName}</span>
                        </div>
                        {metric && (
                          <div className={`w-3 h-3 rounded-full ${getRatingColor(metric.rating)}`} />
                        )}
                      </div>
                      {metric ? (
                        <div>
                          <div className="text-2xl font-bold">
                            {formatValue(metricName, metric.value)}
                          </div>
                          <div className="text-sm text-gray-600 capitalize">
                            {metric.rating.replace('-', ' ')}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-400">Nėra duomenų</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Other Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Kiti našumo rodikliai</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {otherMetrics.map(metricName => {
                  const metric = getLatestMetric(metricName);
                  return (
                    <div key={metricName} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getMetricIcon(metricName)}
                          <span className="font-medium">{metricName}</span>
                        </div>
                        {metric && (
                          <div className={`w-3 h-3 rounded-full ${getRatingColor(metric.rating)}`} />
                        )}
                      </div>
                      {metric ? (
                        <div>
                          <div className="text-2xl font-bold">
                            {formatValue(metricName, metric.value)}
                          </div>
                          <div className="text-sm text-gray-600 capitalize">
                            {metric.rating.replace('-', ' ')}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-400">Nėra duomenų</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components" className="space-y-4">
          {componentStats && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Iš viso komponentų
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{componentStats.totalComponents}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Cache taikiniai
                  </CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(cacheHitRate)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {componentStats.cachedComponents} iš {componentStats.totalComponents}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Vidutinis kraunymo laikas
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(componentStats.averageLoadTime)}ms
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pakartotiniai bandymai
                  </CardTitle>
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {componentStats.totalRetries}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="bundle" className="space-y-4">
          {/* Bundle Size Information */}
          <Card>
            <CardHeader>
              <CardTitle>Bundle optimizacija</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Pagrindinis bundle:</span>
                  <Badge variant="outline" className="font-mono">~81KB (24KB gzip)</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pradinis dydis:</span>
                  <span className="font-mono text-red-600">~815KB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Optimizuotas dydis:</span>
                  <span className="font-mono text-green-600">~420KB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pagerinimas:</span>
                  <Badge variant="default">48% mažiau</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Chunk'ų skaičius:</span>
                  <span className="font-mono">~16 dalių</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Gzip sertifikavimas:</span>
                  <Badge variant="secondary">3:1 suspaudimas</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chunk Details */}
          <Card>
            <CardHeader>
              <CardTitle>Chunk strategija</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Vendor chunks:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• react-core (~85KB)</li>
                      <li>• ui-overlay (~35KB)</li>
                      <li>• form-lib (~22KB)</li>
                      <li>• query-lib (~69KB)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Feature chunks:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• admin-dashboard (~145KB)</li>
                      <li>• auth-pages (~115KB)</li>
                      <li>• content-* (~80KB)</li>
                      <li>• shared-components (~35KB)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recommendations */}
      {metrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rekomendacijos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {getLatestMetric('LCP')?.rating === 'poor' && (
                <div className="flex items-center gap-2 text-red-600">
                  <TrendingDown className="h-4 w-4" />
                  LCP reikia tobulinti - optimizuokite paveikslėlius ir kritinį CSS
                </div>
              )}
              {getLatestMetric('INP')?.rating === 'poor' && (
                <div className="flex items-center gap-2 text-red-600">
                  <TrendingDown className="h-4 w-4" />
                  INP reikia tobulinti - sumažinkite JavaScript vykdymą
                </div>
              )}
              {getLatestMetric('CLS')?.rating === 'poor' && (
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
      )}
    </div>
  );
}