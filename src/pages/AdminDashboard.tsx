import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import AdminDashboardStats from "@/components/admin/AdminDashboardStats";
import CTASectionEditor from "@/components/admin/cta-section-editor";
import ContactMessageManager from "@/components/admin/contact-message-manager";
import AdminCommentsModeration from "@/pages/AdminCommentsModeration";
import CourseEditor from "@/components/admin/course-editor";
import CoursesList from "@/components/admin/CoursesList";
import HeroSectionEditor from "@/components/admin/hero-section-editor";
import { PerformanceMonitor } from "@/components/admin/performance-monitor";
import PublicationEditor from "@/components/admin/publication-editor";
import PublicationsList from "@/components/admin/PublicationsList";
import ToolEditor from "@/components/admin/tool-editor";
import ToolsList from "@/components/admin/ToolsList";
import UserManager from "@/components/admin/UserManager";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useUnreadMessages } from "@/hooks/use-unread-messages";
import { usePendingCommentsCount } from "@/hooks/use-pending-comments-count";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState({
    publicationsCount: 0,
    toolsCount: 0,
    coursesCount: 0,
    usersCount: 0,
    heroSectionsCount: 0,
    ctaSectionsCount: 0,
    contactMessagesCount: 0,
  });
  const { toast } = useToast();
  const unreadCount = useUnreadMessages();
  const { count: pendingCommentsCount } = usePendingCommentsCount();

  const fetchDashboardStats = useCallback(async () => {
    try {
      // Fetch articles count -> publications count
      const { count: publicationsCount, error: publicationsError } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true });

      // Fetch tools count
      const { count: toolsCount, error: toolsError } = await supabase
        .from("tools")
        .select("*", { count: "exact", head: true });

      // Fetch courses count
      const { count: coursesCount, error: coursesError } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true });

      // Fetch users count
      const { count: usersCount, error: usersError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch hero sections count
      const { count: heroSectionsCount, error: heroSectionsError } = await supabase
        .from("hero_sections")
        .select("*", { count: "exact", head: true });

      // Fetch CTA sections count
      const { count: ctaSectionsCount, error: ctaSectionsError } = await supabase
        .from("cta_sections")
        .select("*", { count: "exact", head: true });

      // Fetch contact messages count
      const { count: contactMessagesCount, error: contactMessagesError } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true });

      if (
        publicationsError ||
        toolsError ||
        coursesError ||
        usersError ||
        heroSectionsError ||
        ctaSectionsError ||
        contactMessagesError
      ) {
        throw new Error("Error fetching dashboard statistics");
      }

      setDashboardStats({
        publicationsCount: publicationsCount || 0,
        toolsCount: toolsCount || 0,
        coursesCount: coursesCount || 0,
        usersCount: usersCount || 0,
        heroSectionsCount: heroSectionsCount || 0,
        ctaSectionsCount: ctaSectionsCount || 0,
        contactMessagesCount: contactMessagesCount || 0,
      });
    } catch {
      toast({
        title: "Klaida",
        description: "Nepavyko gauti administravimo skydelio statistikos.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast({
        title: "Prieigos klaida",
        description: "Jūs neturite administratoriaus teisių.",
        variant: "destructive",
      });
    } else if (!loading && user && isAdmin) {
      fetchDashboardStats();
    }
  }, [loading, user, isAdmin, toast, fetchDashboardStats]);

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
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Apžvalga</TabsTrigger>
            <TabsTrigger value="publications">Publikacijos</TabsTrigger>
            <TabsTrigger value="tools">Įrankiai</TabsTrigger>
            <TabsTrigger value="courses">Kursai</TabsTrigger>
            <TabsTrigger value="hero-sections">Hero sekcijos</TabsTrigger>
            <TabsTrigger value="cta-sections">CTA sekcijos</TabsTrigger>
            <TabsTrigger value="contact-messages" className="relative">
              Kontaktai
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 min-w-5 flex items-center justify-center px-1.5 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="comments" className="relative">
              Komentarai
              {pendingCommentsCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 min-w-5 flex items-center justify-center px-1.5 text-xs">
                  {pendingCommentsCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users">Vartotojai</TabsTrigger>
            <TabsTrigger value="inquiries">Verslo užklausos</TabsTrigger>
            <TabsTrigger value="performance">Našumas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminDashboardStats stats={dashboardStats} />

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
                    onClick={() => handleCreateNew("tools")}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Naujas įrankis
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
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="text-left">
                    <CardTitle className="text-left">Publikacijų valdymas</CardTitle>
                    <CardDescription className="text-left">
                      Tvarkykite svetainės straipsnius ir naujienas
                    </CardDescription>
                  </div>
                  <Button onClick={() => handleCreateNew("publications")}>
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
          </TabsContent>

          <TabsContent value="tools">
            {editingItem ? (
              <ToolEditor
                id={editingItem === "new" ? null : editingItem}
                onCancel={() => setEditingItem(null)}
                onSave={() => {
                  setEditingItem(null);
                  fetchDashboardStats();
                }}
              />
            ) : (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Įrankių valdymas</CardTitle>
                    <CardDescription>Tvarkykite AI įrankius</CardDescription>
                  </div>
                  <Button onClick={() => handleCreateNew("tools")}>
                    <Plus className="mr-2 h-4 w-4" /> Naujas įrankis
                  </Button>
                </CardHeader>
                <CardContent>
                  <ToolsList onEdit={id => setEditingItem(id)} onDelete={fetchDashboardStats} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="courses">
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
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Kursų valdymas</CardTitle>
                    <CardDescription>Tvarkykite mokymų kursus</CardDescription>
                  </div>
                  <Button onClick={() => handleCreateNew("courses")}>
                    <Plus className="mr-2 h-4 w-4" /> Naujas kursas
                  </Button>
                </CardHeader>
                <CardContent>
                  <CoursesList onEdit={id => setEditingItem(id)} onDelete={fetchDashboardStats} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="hero-sections">
            <HeroSectionEditor />
          </TabsContent>

          <TabsContent value="cta-sections">
            <CTASectionEditor />
          </TabsContent>

          <TabsContent value="contact-messages">
            <ContactMessageManager />
          </TabsContent>

          <TabsContent value="comments">
            <AdminCommentsModeration />
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Vartotojų valdymas</CardTitle>
                <CardDescription>Tvarkykite svetainės vartotojus</CardDescription>
              </CardHeader>
              <CardContent>
                <UserManager onUpdate={fetchDashboardStats} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inquiries">
            <Card>
              <CardHeader>
                <CardTitle>Verslo Sprendimų Užklausos</CardTitle>
                <CardDescription>
                  Peržiūrėkite ir tvarkykite gautą užklausą custom įrankių kūrimui
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => window.location.href = '/admin/inquiries'}
                  className="button-primary"
                >
                  Atidaryti užklausų valdymo puslapį
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceMonitor />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminDashboard;
