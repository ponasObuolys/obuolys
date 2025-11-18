import { useAuth } from "@/context/AuthContext";
import { useState, lazy, Suspense, useEffect } from "react";

import { Navigate } from "react-router-dom";

import AdminDashboardStats from "@/components/admin/AdminDashboardStats";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useUnreadMessages } from "@/hooks/use-unread-messages";
import { usePendingCommentsCount } from "@/hooks/use-pending-comments-count";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { Plus } from "lucide-react";

import LoadingSpinner from "@/components/ui/loading-spinner";

// Lazy load administrative components
const CTASectionEditor = lazy(() => import("@/components/admin/cta-section-editor"));
const ContactMessageManager = lazy(() => import("@/components/admin/contact-message-manager"));
const AdminCommentsModeration = lazy(() => import("@/pages/AdminCommentsModeration"));
const CourseEditor = lazy(() => import("@/components/admin/course-editor"));
const CoursesList = lazy(() => import("@/components/admin/CoursesList"));
const HeroSectionEditor = lazy(() => import("@/components/admin/hero-section-editor"));
const PerformanceMonitor = lazy(() =>
  import("@/components/admin/performance-monitor").then(m => ({ default: m.PerformanceMonitor }))
);
const PublicationEditor = lazy(() => import("@/components/admin/publication-editor"));
const PublicationsList = lazy(() => import("@/components/admin/PublicationsList"));
const YouTubeEditor = lazy(() => import("@/components/admin/youtube-editor"));
const YouTubeList = lazy(() => import("@/components/admin/YouTubeList"));
const UserManager = lazy(() => import("@/components/admin/UserManager"));
const CTAAnalyticsPage = lazy(() => import("@/pages/admin/CTAAnalyticsPage"));
const DeviceStats = lazy(() =>
  import("@/components/widgets/device-stats").then(m => ({ default: m.DeviceStats }))
);
const TrendingArticles = lazy(() =>
  import("@/components/widgets/trending-articles").then(m => ({ default: m.TrendingArticles }))
);

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const { stats: dashboardStats, fetchDashboardStats } = useDashboardStats(isAdmin, user);
  const { toast } = useToast();
  const unreadCount = useUnreadMessages();
  const { count: pendingCommentsCount } = usePendingCommentsCount();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast({
        title: "Prieigos klaida",
        description: "Jūs neturite administratoriaus teisių.",
        variant: "destructive",
      });
    }
  }, [loading, user, isAdmin, toast]);

  // If user is not admin, redirect to admin info page
  if (!loading && (!user || !isAdmin)) {
    return <Navigate to="/admin/info" />;
  }

  // Display loading state
  if (loading) {
    return (
      <>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8">Administratoriaus valdymo skydelis</h1>
          <p className="text-center">Kraunama...</p>
        </div>
      </>
    );
  }

  const handleCreateNew = (type: string) => {
    setEditingItem("new");
    setActiveTab(type);
  };

  return (
    <>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Administratoriaus valdymo skydelis</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 flex-wrap h-auto gap-1 md:gap-0">
            <TabsTrigger value="overview" className="text-xs md:text-sm">
              Apžvalga
            </TabsTrigger>
            <TabsTrigger value="publications" className="text-xs md:text-sm">
              Publikacijos
            </TabsTrigger>
            <TabsTrigger value="youtube" className="text-xs md:text-sm">
              YouTube
            </TabsTrigger>
            <TabsTrigger value="courses" className="text-xs md:text-sm">
              Kursai
            </TabsTrigger>
            <TabsTrigger value="hero-sections" className="text-xs md:text-sm">
              Hero sekcijos
            </TabsTrigger>
            <TabsTrigger value="cta-sections" className="text-xs md:text-sm">
              CTA sekcijos
            </TabsTrigger>
            <TabsTrigger value="contact-messages" className="relative text-xs md:text-sm">
              Kontaktai
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-1 md:ml-2 h-4 md:h-5 min-w-4 md:min-w-5 flex items-center justify-center px-1 md:px-1.5 text-[10px] md:text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="comments" className="relative text-xs md:text-sm">
              Komentarai
              {pendingCommentsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-1 md:ml-2 h-4 md:h-5 min-w-4 md:min-w-5 flex items-center justify-center px-1 md:px-1.5 text-[10px] md:text-xs"
                >
                  {pendingCommentsCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs md:text-sm">
              Vartotojai
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="text-xs md:text-sm">
              <span className="hidden sm:inline">Verslo užklausos</span>
              <span className="sm:hidden">Užklausos</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs md:text-sm">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-xs md:text-sm">
              Našumas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminDashboardStats stats={dashboardStats} />

            {/* Analytics Widgets */}
            <div className="mt-8 space-y-6">
              <Suspense fallback={<LoadingSpinner text="Kraunama statistika..." />}>
                <TrendingArticles days={7} limit={10} />
                <DeviceStats days={30} />
              </Suspense>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kurti naują</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleCreateNew("publications")}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Nauja publikacija
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleCreateNew("youtube")}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Naujas video
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleCreateNew("courses")}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Naujas kursas
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="publications">
            <Suspense fallback={<LoadingSpinner text="Kraunamas publikacijų redaktorius..." />}>
              {editingItem ? (
                <PublicationEditor
                  id={editingItem === "new" ? null : editingItem}
                  onCancel={() => setEditingItem(null)}
                  onSave={() => {
                    setEditingItem(null);
                    fetchDashboardStats();
                  }}
                />
              ) : (
                <Card>
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-left">
                      <CardTitle className="text-left">Publikacijų valdymas</CardTitle>
                      <CardDescription className="text-left">
                        Tvarkykite svetainės straipsnius ir naujienas
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => handleCreateNew("publications")}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Nauja publikacija
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <PublicationsList
                      onEdit={id => setEditingItem(id)}
                      onDelete={fetchDashboardStats}
                    />
                  </CardContent>
                </Card>
              )}
            </Suspense>
          </TabsContent>

          <TabsContent value="youtube">
            <Suspense fallback={<LoadingSpinner text="Kraunamas video redaktorius..." />}>
              {editingItem ? (
                <YouTubeEditor
                  id={editingItem === "new" ? null : editingItem}
                  onCancel={() => setEditingItem(null)}
                  onSave={() => {
                    setEditingItem(null);
                    fetchDashboardStats();
                  }}
                />
              ) : (
                <Card>
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-left">
                      <CardTitle className="text-left">YouTube valdymas</CardTitle>
                      <CardDescription className="text-left">
                        Tvarkykite YouTube video įrašus
                      </CardDescription>
                    </div>
                    <Button onClick={() => handleCreateNew("youtube")} className="w-full sm:w-auto">
                      <Plus className="mr-2 h-4 w-4" /> Naujas video
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <YouTubeList onEdit={id => setEditingItem(id)} onDelete={fetchDashboardStats} />
                  </CardContent>
                </Card>
              )}
            </Suspense>
          </TabsContent>

          <TabsContent value="courses">
            <Suspense fallback={<LoadingSpinner text="Kraunamas kursų redaktorius..." />}>
              {editingItem ? (
                <CourseEditor
                  id={editingItem === "new" ? null : editingItem}
                  onCancel={() => setEditingItem(null)}
                  onSave={() => {
                    setEditingItem(null);
                    fetchDashboardStats();
                  }}
                />
              ) : (
                <Card>
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-left">
                      <CardTitle className="text-left">Kursų valdymas</CardTitle>
                      <CardDescription className="text-left">
                        Tvarkykite mokymų kursus
                      </CardDescription>
                    </div>
                    <Button onClick={() => handleCreateNew("courses")} className="w-full sm:w-auto">
                      <Plus className="mr-2 h-4 w-4" /> Naujas kursas
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <CoursesList onEdit={id => setEditingItem(id)} onDelete={fetchDashboardStats} />
                  </CardContent>
                </Card>
              )}
            </Suspense>
          </TabsContent>

          <TabsContent value="hero-sections">
            <Suspense fallback={<LoadingSpinner text="Kraunamas hero redaktorius..." />}>
              <HeroSectionEditor />
            </Suspense>
          </TabsContent>

          <TabsContent value="cta-sections">
            <Suspense fallback={<LoadingSpinner text="Kraunamas CTA redaktorius..." />}>
              <CTASectionEditor />
            </Suspense>
          </TabsContent>

          <TabsContent value="contact-messages">
            <Suspense fallback={<LoadingSpinner text="Kraunamos žinutės..." />}>
              <ContactMessageManager />
            </Suspense>
          </TabsContent>

          <TabsContent value="comments">
            <Suspense fallback={<LoadingSpinner text="Kraunami komentarai..." />}>
              <AdminCommentsModeration />
            </Suspense>
          </TabsContent>

          <TabsContent value="users">
            <Suspense fallback={<LoadingSpinner text="Kraunami vartotojai..." />}>
              <Card>
                <CardHeader className="text-left">
                  <CardTitle className="text-left">Vartotojų valdymas</CardTitle>
                  <CardDescription className="text-left">
                    Tvarkykite svetainės vartotojus
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserManager onUpdate={fetchDashboardStats} />
                </CardContent>
              </Card>
            </Suspense>
          </TabsContent>

          <TabsContent value="inquiries">
            <div className="space-y-4">
              <Card>
                <CardHeader className="text-left">
                  <CardTitle className="text-left">Projekto Skaičiuoklės Užklausos</CardTitle>
                  <CardDescription className="text-left">
                    Peržiūrėkite užklausas iš projekto skaičiuoklės
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => (window.location.href = "/admin/calculator")}
                    className="button-primary"
                  >
                    Atidaryti skaičiuoklės užklausas
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-left">
                  <CardTitle className="text-left">Kontaktų Formos Užklausos</CardTitle>
                  <CardDescription className="text-left">
                    Peržiūrėkite ir tvarkykite gautą užklausą custom įrankių kūrimui
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => (window.location.href = "/admin/inquiries")}
                    className="button-primary"
                  >
                    Atidaryti kontaktų užklausų puslapį
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Suspense fallback={<LoadingSpinner text="Kraunama analizė..." />}>
              <CTAAnalyticsPage />
            </Suspense>
          </TabsContent>

          <TabsContent value="performance">
            <Suspense fallback={<LoadingSpinner text="Kraunama našumo stebėsena..." />}>
              <PerformanceMonitor />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminDashboard;
