
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();

  // If user is not admin, redirect to home
  if (!loading && (!user || !isAdmin)) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Administratoriaus valdymo skydelis</h1>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Apžvalga</TabsTrigger>
            <TabsTrigger value="articles">Straipsniai</TabsTrigger>
            <TabsTrigger value="news">Naujienos</TabsTrigger>
            <TabsTrigger value="tools">Įrankiai</TabsTrigger>
            <TabsTrigger value="courses">Kursai</TabsTrigger>
            <TabsTrigger value="users">Vartotojai</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Straipsniai</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Naujienos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Įrankiai</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Kursai</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Naujausi veiksmai</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Nėra naujų veiksmų.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="articles">
            <Card>
              <CardHeader>
                <CardTitle>Straipsnių valdymas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Šiuo metu nėra straipsnių. Čia galėsite kurti ir redaguoti straipsnius.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="news">
            <Card>
              <CardHeader>
                <CardTitle>Naujienų valdymas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Šiuo metu nėra naujienų. Čia galėsite kurti ir redaguoti naujienas.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tools">
            <Card>
              <CardHeader>
                <CardTitle>Įrankių valdymas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Šiuo metu nėra įrankių. Čia galėsite pridėti ir redaguoti įrankius.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Kursų valdymas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Šiuo metu nėra kursų. Čia galėsite kurti ir redaguoti kursus.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Vartotojų valdymas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Šiuo metu nėra registruotų vartotojų. Čia galėsite valdyti vartotojų paskyras.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
