import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminDashboardStatsProps {
  stats: {
    publicationsCount: number;
    toolsCount: number;
    coursesCount: number;
    usersCount: number;
    heroSectionsCount: number;
    ctaSectionsCount: number;
    contactMessagesCount: number;
  };
}

const AdminDashboardStats = ({ stats }: AdminDashboardStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Publikacijos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.publicationsCount}</div>
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

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Hero sekcijos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.heroSectionsCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">CTA sekcijos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.ctaSectionsCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Kontaktai</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.contactMessagesCount}</div>
        </CardContent>
      </Card>

      <Card>
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
