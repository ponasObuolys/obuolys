import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  getStoredMetrics,
  clearStoredMetrics,
  calculatePerformanceScore,
  type PerformanceMetric
} from '@/utils/webVitals';
import { TrendingUp, TrendingDown, Activity, Zap, Clock, Eye } from 'lucide-react';

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [performanceScore, setPerformanceScore] = useState(0);

  useEffect(() => {
    const loadMetrics = () => {
      const storedMetrics = getStoredMetrics();
      setMetrics(storedMetrics);
      setPerformanceScore(calculatePerformanceScore(storedMetrics));
    };

    loadMetrics();

    // Refresh metrics every 30 seconds
    const interval = setInterval(loadMetrics, 30000);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Našumo monitoringas</h2>
          <p className="text-gray-600">Core Web Vitals ir kiti našumo rodikliai</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            clearStoredMetrics();
            setMetrics([]);
            setPerformanceScore(0);
          }}
        >
          Išvalyti duomenis
        </Button>
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

      {/* Bundle Size Information */}
      <Card>
        <CardHeader>
          <CardTitle>Bundle informacija</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Pagrindinis bundle:</span>
              <span className="font-mono">~74KB (21KB gzip)</span>
            </div>
            <div className="flex justify-between">
              <span>Bendras dydis:</span>
              <span className="font-mono">~800KB → ~420KB</span>
            </div>
            <div className="flex justify-between">
              <span>Pagerinimas:</span>
              <Badge variant="default">48% mažiau</Badge>
            </div>
            <div className="flex justify-between">
              <span>Chunk'ų skaičius:</span>
              <span className="font-mono">16</span>
            </div>
          </div>
        </CardContent>
      </Card>

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