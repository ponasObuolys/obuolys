import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  MousePointerClick, 
  Target,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Sparkles
} from 'lucide-react';
import { 
  useCTAPerformance, 
  useStickyPerformance, 
  useCTARecommendations 
} from '@/hooks/use-cta-analytics';

export default function CTAAnalyticsPage() {
  const { data: ctaPerformance, isLoading: ctaLoading } = useCTAPerformance();
  const { data: stickyPerformance, isLoading: stickyLoading } = useStickyPerformance();
  const { data: recommendations, isLoading: recsLoading } = useCTARecommendations();

  // Calculate overview stats
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalClicks = ctaPerformance?.reduce((sum, cta: any) => sum + (cta.total_clicks || 0), 0) || 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeCTAs = ctaPerformance?.filter((cta: any) => cta.active).length || 0;
  const topCTA = ctaPerformance?.[0];
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const highImpactRecs = recommendations?.filter((r: any) => r.impact === 'High').length || 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mediumImpactRecs = recommendations?.filter((r: any) => r.impact === 'Medium').length || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">CTA Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Stebėkite CTA efektyvumą ir optimizuokite konversiją
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Clicks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Viso paspaudimų</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Visų laikų statistika
              </p>
            </CardContent>
          </Card>

          {/* Active CTAs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktyvūs CTA</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCTAs}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Rodomi vartotojams
              </p>
            </CardContent>
          </Card>

          {/* Top Performer */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Geriausias CTA</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topCTA?.total_clicks || 0}</div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {topCTA?.title || 'Nėra duomenų'}
              </p>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rekomendacijos</CardTitle>
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{highImpactRecs + mediumImpactRecs}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {highImpactRecs} aukšto poveikio
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="recommendations">Rekomendacijos</TabsTrigger>
            <TabsTrigger value="sticky">Sticky Messages</TabsTrigger>
          </TabsList>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>CTA Performance</CardTitle>
                <CardDescription>
                  Visi CTA tekstai surikiuoti pagal paspaudimus
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ctaLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Kraunama...
                  </div>
                ) : ctaPerformance && ctaPerformance.length > 0 ? (
                  <div className="space-y-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {ctaPerformance.map((cta: any, index: number) => (
                      <div 
                        key={cta.id} 
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant={index < 3 ? "default" : "secondary"}>
                              #{index + 1}
                            </Badge>
                            <h3 className="font-semibold">{cta.title}</h3>
                            {!cta.active && (
                              <Badge variant="outline" className="text-xs">
                                Neaktyvus
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {cta.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {cta.context}
                            </span>
                            <span>Priority: {cta.priority}</span>
                            {cta.last_clicked && (
                              <span>
                                Paskutinis: {new Date(cta.last_clicked).toLocaleDateString('lt-LT')}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold">{cta.total_clicks || 0}</div>
                          <div className="text-xs text-muted-foreground">paspaudimai</div>
                          {cta.avg_clicks_per_day && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {Number(cta.avg_clicks_per_day).toFixed(1)}/dieną
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nėra duomenų. Pradėkite naudoti CTA, kad matytumėte statistiką.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Rekomendacijos</CardTitle>
                <CardDescription>
                  Automatinės optimizavimo rekomendacijos pagal duomenis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recsLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Kraunama...
                  </div>
                ) : recommendations && recommendations.length > 0 ? (
                  <div className="space-y-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {recommendations.map((rec: any, index: number) => {
                      const isIncrease = rec.recommendation_type === 'increase_priority';
                      const isDecrease = rec.recommendation_type === 'decrease_priority';
                      const isDeactivate = rec.recommendation_type === 'deactivate';

                      return (
                        <div 
                          key={index}
                          className="p-4 border rounded-lg space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              {isIncrease && (
                                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                  <ArrowUp className="h-5 w-5 text-green-500" />
                                </div>
                              )}
                              {isDecrease && (
                                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                                  <ArrowDown className="h-5 w-5 text-yellow-500" />
                                </div>
                              )}
                              {isDeactivate && (
                                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                  <AlertCircle className="h-5 w-5 text-red-500" />
                                </div>
                              )}
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold">{rec.title}</h3>
                                  <Badge 
                                    variant={
                                      rec.impact === 'High' ? 'default' : 
                                      rec.impact === 'Medium' ? 'secondary' : 
                                      'outline'
                                    }
                                  >
                                    {rec.impact} Impact
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {rec.reason}
                                </p>
                                <div className="flex items-center gap-4 text-xs">
                                  <span className="text-muted-foreground">
                                    Dabartinis priority: <strong>{rec.current_priority}</strong>
                                  </span>
                                  <span className="text-primary">
                                    Siūlomas: <strong>{rec.suggested_priority}</strong>
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <Button size="sm" variant="outline">
                              Pritaikyti
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      Puiku! Nėra rekomendacijų - visi CTA veikia optimaliai.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sticky Messages Tab */}
          <TabsContent value="sticky" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sticky Messages Performance</CardTitle>
                <CardDescription>
                  Sticky sidebar žinučių statistika
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stickyLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Kraunama...
                  </div>
                ) : stickyPerformance && stickyPerformance.length > 0 ? (
                  <div className="space-y-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {stickyPerformance.map((msg: any, _index: number) => (
                      <div 
                        key={msg.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{msg.emoji}</span>
                            <h3 className="font-semibold">{msg.title}</h3>
                            {!msg.active && (
                              <Badge variant="outline" className="text-xs">
                                Neaktyvus
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {msg.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Priority: {msg.priority}</span>
                            {msg.last_clicked && (
                              <span>
                                Paskutinis: {new Date(msg.last_clicked).toLocaleDateString('lt-LT')}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold">{msg.total_clicks || 0}</div>
                          <div className="text-xs text-muted-foreground">paspaudimai</div>
                          {msg.avg_clicks_per_day && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {Number(msg.avg_clicks_per_day).toFixed(1)}/dieną
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nėra duomenų. Sticky žinutės dar nebuvo paspaustos.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
