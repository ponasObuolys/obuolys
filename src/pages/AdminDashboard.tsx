import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
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
    usersCount: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();

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
  }, [loading, user, isAdmin, toast]);

  const fetchDashboardStats = async () => {
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

      if (publicationsError || toolsError || coursesError || usersError) {
        throw new Error('Error fetching dashboard statistics');
      }

      setDashboardStats({
        publicationsCount: publicationsCount || 0,
        toolsCount: toolsCount || 0,
        coursesCount: coursesCount || 0,
        usersCount: usersCount || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Klaida",
        description: "Nepavyko gauti administravimo skydelio statistikos.",
        variant: "destructive",
      });
    }
  };

  // If user is not admin, redirect to home
  if (!loading && (!user || !isAdmin)) {
    return <Navigate to="/" />;
  }

  // Display loading state
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8">Administratoriaus valdymo skydelis</h1>
          <p className="text-center">Kraunama...</p>
        </div>
      </Layout>
    );
  }

  const handleCreateNew = (type: string) => {
    setEditingItem('new');
    setActiveTab(type);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Administratoriaus valdymo skydelis</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Apžvalga</TabsTrigger>
            <TabsTrigger value="publications">Publikacijos</TabsTrigger>
            <TabsTrigger value="tools">Įrankiai</TabsTrigger>
            <TabsTrigger value="courses">Kursai</TabsTrigger>
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
                  <div>
                    <CardTitle>Publikacijų valdymas</CardTitle>
                    <CardDescription>Tvarkykite svetainės straipsnius ir naujienas</CardDescription>
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
    </Layout>
  );
};

// Article list component for the admin dashboard
const PublicationsList = ({ onEdit, onDelete }: { onEdit: (id: string) => void, onDelete: () => void }) => {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, date, published')
        .order('date', { ascending: false });

      if (error) throw error;
      setPublications(data || []);
    } catch (error: any) {
      console.error('Error fetching publications:', error);
      toast({
        title: "Klaida",
        description: "Nepavyko gauti publikacijų sąrašo.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

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
    } catch (error: any) {
      console.error('Error deleting publication:', error);
      toast({
        title: "Klaida",
        description: "Nepavyko ištrinti publikacijos.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <p>Kraunamos publikacijos...</p>;
  }

  if (publications.length === 0) {
    return <p>Publikacijų nėra.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pavadinimas</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Statusas</TableHead>
          <TableHead>Veiksmai</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {publications.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{new Date(item.date).toLocaleDateString('lt-LT')}</TableCell>
            <TableCell>{item.published ? 'Publikuota' : 'Juodraštis'}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
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
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
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
  };

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
    return <p>Kraunami įrankiai...</p>;
  }

  if (tools.length === 0) {
    return <p>Įrankių nerasta. Sukurkite naują įrankį.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pavadinimas</TableHead>
          <TableHead>Kategorija</TableHead>
          <TableHead>Rekomenduojamas</TableHead>
          <TableHead>Publikuota</TableHead>
          <TableHead>Veiksmai</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tools.map((tool) => (
          <TableRow key={tool.id}>
            <TableCell className="font-medium">{tool.name}</TableCell>
            <TableCell>{tool.category}</TableCell>
            <TableCell>{tool.featured ? 'Taip' : 'Ne'}</TableCell>
            <TableCell>{tool.published ? 'Taip' : 'Ne'}</TableCell>
            <TableCell className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(tool.id)}>
                <FilePenLine className="h-4 w-4" />
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
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Courses list component for the admin dashboard
const CoursesList = ({ onEdit, onDelete }: { onEdit: (id: string) => void, onDelete: () => void }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
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
  };

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
    return <p>Kraunami kursai...</p>;
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
            <TableCell className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(course.id)}>
                <FilePenLine className="h-4 w-4" />
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
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminDashboard;
