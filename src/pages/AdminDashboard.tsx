import { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import PublicationEditor from '@/components/admin/PublicationEditor';
import ToolEditor from '@/components/admin/ToolEditor';
import CourseEditor from '@/components/admin/CourseEditor';
import UserManager from '@/components/admin/UserManager';
import AdminDashboardStats from '@/components/admin/AdminDashboardStats';
import HeroSectionEditor from '@/components/admin/HeroSectionEditor';
import CTASectionEditor from '@/components/admin/CTASectionEditor';
import ContactMessageManager from '@/components/admin/ContactMessageManager';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, FilePenLine, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState({
    publicationsCount: 0,
    toolsCount: 0,
    coursesCount: 0,
    usersCount: 0,
    heroSectionsCount: 0,
    ctaSectionsCount: 0,
    contactMessagesCount: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchDashboardStats = useCallback(async () => {
    try {
      // Fetch articles count -> publications count
      const { count: publicationsCount, error: publicationsError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });

      // Fetch tools count
      const { count: toolsCount, error: toolsError } = await supabase
        .from('tools')
        .select('*', { count: 'exact', head: true });

      // Fetch courses count
      const { count: coursesCount, error: coursesError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      // Fetch users count
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch hero sections count
      const { count: heroSectionsCount, error: heroSectionsError } = await supabase
        .from('hero_sections')
        .select('*', { count: 'exact', head: true });

      // Fetch CTA sections count
      const { count: ctaSectionsCount, error: ctaSectionsError } = await supabase
        .from('cta_sections')
        .select('*', { count: 'exact', head: true });

      // Fetch contact messages count
      const { count: contactMessagesCount, error: contactMessagesError } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true });

      if (publicationsError || toolsError || coursesError || usersError || 
          heroSectionsError || ctaSectionsError || contactMessagesError) {
        throw new Error('Error fetching dashboard statistics');
      }

      setDashboardStats({
        publicationsCount: publicationsCount || 0,
        toolsCount: toolsCount || 0,
        coursesCount: coursesCount || 0,
        usersCount: usersCount || 0,
        heroSectionsCount: heroSectionsCount || 0,
        ctaSectionsCount: ctaSectionsCount || 0,
        contactMessagesCount: contactMessagesCount || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
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

  // If user is not admin, redirect to home
  if (!loading && (!user || !isAdmin)) {
    return <Navigate to="/" />;
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
    setEditingItem('new');
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
            <TabsTrigger value="contact-messages">Kontaktai</TabsTrigger>
            <TabsTrigger value="users">Vartotojai</TabsTrigger>
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
                    onClick={() => handleCreateNew('publications')}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Nauja publikacija
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => handleCreateNew('tools')}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Naujas įrankis
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => handleCreateNew('courses')}
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
                id={editingItem === 'new' ? null : editingItem} 
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
                    <CardDescription className="text-left">Tvarkykite svetainės straipsnius ir naujienas</CardDescription>
                  </div>
                  <Button onClick={() => handleCreateNew('publications')}>
                    <Plus className="mr-2 h-4 w-4" /> Nauja publikacija
                  </Button>
                </CardHeader>
                <CardContent>
                  <PublicationsList 
                    onEdit={(id) => setEditingItem(id)} 
                    onDelete={fetchDashboardStats}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="tools">
            {editingItem ? (
              <ToolEditor 
                id={editingItem === 'new' ? null : editingItem} 
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
                  <Button onClick={() => handleCreateNew('tools')}>
                    <Plus className="mr-2 h-4 w-4" /> Naujas įrankis
                  </Button>
                </CardHeader>
                <CardContent>
                  <ToolsList 
                    onEdit={(id) => setEditingItem(id)} 
                    onDelete={fetchDashboardStats}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="courses">
            {editingItem ? (
              <CourseEditor 
                id={editingItem === 'new' ? null : editingItem} 
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
                  <Button onClick={() => handleCreateNew('courses')}>
                    <Plus className="mr-2 h-4 w-4" /> Naujas kursas
                  </Button>
                </CardHeader>
                <CardContent>
                  <CoursesList 
                    onEdit={(id) => setEditingItem(id)} 
                    onDelete={fetchDashboardStats}
                  />
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
        </Tabs>
      </div>
    </>
  );
};

// Article list component for the admin dashboard
const PublicationsList = ({ onEdit, onDelete }: { onEdit: (id: string) => void, onDelete: () => void }) => {
  const [publications, setPublications] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPublications = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, date, published, featured, content_type, description, content')
        .order('date', { ascending: false });

      if (error) throw error;
      setPublications(data || []);
    } catch (error: unknown) {
      console.error('Error fetching publications:', error);
      toast({
        title: "Klaida",
        description: "Nepavyko gauti publikacijų sąrašo.",
        variant: "destructive",
      });
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Ar tikrai norite ištrinti šią publikaciją?")) return;
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .match({ id });

      if (error) throw error;
      toast({
        title: "Sėkmingai ištrinta",
        description: "Publikacija buvo sėkmingai ištrinta.",
      });
      fetchPublications();
      onDelete();
    } catch (error: unknown) {
      console.error('Error deleting publication:', error);
      toast({
        title: "Klaida",
        description: "Nepavyko ištrinti publikacijos.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <p className="text-center py-4">Kraunama...</p>;
  }

  if (publications.length === 0) {
    return <p>Publikacijų nėra.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Pavadinimas</TableHead>
          <TableHead className="text-left w-32">Data</TableHead>
          <TableHead className="text-left w-28">Statusas</TableHead>
          <TableHead className="text-left w-24">Tipas</TableHead>
          <TableHead className="text-left w-32">Rekomenduojama</TableHead>
          <TableHead className="text-right w-48">Veiksmai</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {publications.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium text-left">
              <div className="max-w-xs">
                <div className="truncate">{item.title}</div>
                {item.description && (
                  <div className="text-sm text-gray-500 truncate">{item.description}</div>
                )}
              </div>
            </TableCell>
            <TableCell className="text-left whitespace-nowrap">
              {new Date(item.date).toLocaleDateString('lt-LT')}
            </TableCell>
            <TableCell className="text-left">
              <span className={`inline-flex px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                item.published 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {item.published ? 'Publikuota' : 'Juodraštis'}
              </span>
            </TableCell>
            <TableCell className="text-left">
              <span className="text-sm whitespace-nowrap">
                {item.content_type === 'news' ? 'Naujiena' : 'Straipsnis'}
              </span>
            </TableCell>
            <TableCell className="text-left">
              <span className={`inline-flex px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                item.featured 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {item.featured ? 'Taip' : 'Ne'}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(item.id)}>
                  <FilePenLine className="h-4 w-4 mr-1" /> Redaguoti
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Ištrinti
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Tools list component for the admin dashboard
const ToolsList = ({ onEdit, onDelete }: { onEdit: (id: string) => void, onDelete: () => void }) => {
  const [tools, setTools] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTools = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setTools(data || []);
    } catch (error) {
      console.error('Error fetching tools:', error);
      toast({
        title: "Klaida",
        description: "Nepavyko gauti įrankių sąrašo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Sėkmingai ištrinta",
        description: "Įrankis buvo sėkmingai ištrintas.",
      });
      
      fetchTools();
      onDelete();
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast({
        title: "Klaida",
        description: "Nepavyko ištrinti įrankio.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <p className="text-center py-4">Kraunama...</p>;
  }

  if (tools.length === 0) {
    return <p>Įrankių nerasta. Sukurkite naują įrankį.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Pavadinimas</TableHead>
          <TableHead className="text-left w-32">Kategorija</TableHead>
          <TableHead className="text-left w-32">Rekomenduojamas</TableHead>
          <TableHead className="text-left w-28">Publikuota</TableHead>
          <TableHead className="text-left w-20">URL</TableHead>
          <TableHead className="text-right w-48">Veiksmai</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tools.map((tool) => (
          <TableRow key={tool.id}>
            <TableCell className="font-medium text-left">
              <div className="max-w-xs">
                <div className="truncate">{tool.name}</div>
                {tool.description && (
                  <div className="text-sm text-gray-500 truncate">{tool.description}</div>
                )}
              </div>
            </TableCell>
            <TableCell className="text-left">
              <span className="text-sm whitespace-nowrap">
                {tool.category || 'Nenurodyta'}
              </span>
            </TableCell>
            <TableCell className="text-left">
              <span className={`inline-flex px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                tool.featured 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {tool.featured ? 'Taip' : 'Ne'}
              </span>
            </TableCell>
            <TableCell className="text-left">
              <span className={`inline-flex px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                tool.published 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {tool.published ? 'Taip' : 'Ne'}
              </span>
            </TableCell>
            <TableCell className="text-left">
              {tool.url && (
                <a 
                  href={tool.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-xs truncate max-w-20 block"
                >
                  Lankytis
                </a>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(tool.id)}>
                  <FilePenLine className="h-4 w-4 mr-1" /> Redaguoti
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => {
                    if (window.confirm('Ar tikrai norite ištrinti šį įrankį?')) {
                      handleDelete(tool.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Ištrinti
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Courses list component for the admin dashboard
const CoursesList = ({ onEdit, onDelete }: { onEdit: (id: string) => void, onDelete: () => void }) => {
  const [courses, setCourses] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Klaida",
        description: "Nepavyko gauti kursų sąrašo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Sėkmingai ištrinta",
        description: "Kursas buvo sėkmingai ištrintas.",
      });
      
      fetchCourses();
      onDelete();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Klaida",
        description: "Nepavyko ištrinti kurso.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <p className="text-center py-4">Kraunama...</p>;
  }

  if (courses.length === 0) {
    return <p>Kursų nerasta. Sukurkite naują kursą.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pavadinimas</TableHead>
          <TableHead>Kaina</TableHead>
          <TableHead>Lygis</TableHead>
          <TableHead>Publikuota</TableHead>
          <TableHead>Veiksmai</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course) => (
          <TableRow key={course.id}>
            <TableCell className="font-medium">{course.title}</TableCell>
            <TableCell>{course.price}</TableCell>
            <TableCell>{course.level}</TableCell>
            <TableCell>{course.published ? 'Taip' : 'Ne'}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(course.id)}>
                  <FilePenLine className="h-4 w-4 mr-1" /> Redaguoti
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => {
                    if (window.confirm('Ar tikrai norite ištrinti šį kursą?')) {
                      handleDelete(course.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Ištrinti
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminDashboard;
