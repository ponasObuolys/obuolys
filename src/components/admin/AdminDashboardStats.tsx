import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminDashboardStatsProps {
  stats: {
    articlesCount: number;
    toolsCount: number;
    coursesCount: number;
    usersCount: number;
  };
}

const AdminDashboardStats = ({ stats }: AdminDashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Straipsniai</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.articlesCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Įrankiai</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.toolsCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Kursai</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.coursesCount}</div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Vartotojai</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.usersCount}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardStats;
