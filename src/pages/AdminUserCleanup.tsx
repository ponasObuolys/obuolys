import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, RefreshCw, Users, Database } from 'lucide-react';
import { toast } from 'sonner';

interface TestUser {
  id: string;
  email: string;
  created_at: string;
}

interface ProfileSummary {
  id: string;
  username: string | null;
  created_at: string;
}

export default function AdminUserCleanup() {
  const [authUsers, setAuthUsers] = useState<TestUser[]>([]);
  const [userProfiles, setUserProfiles] = useState<TestUser[]>([]);
  const [profiles, setProfiles] = useState<ProfileSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Užkrauname auth_users_view peržiūrą
      const { data: authData, error: authError } = await supabase
        .from('auth_users_view')
        .select('id, email, created_at')
        .or('email.like.%test-%,email.like.%@example.com%')
        .order('created_at', { ascending: false });

      if (authError) {
        console.error('Auth users error:', authError);
        toast.error(`Klaida kraunant autentifikuotus vartotojus: ${authError.message}`);
      } else {
        setAuthUsers(authData || []);
      }

      // Užkrauname user_profiles peržiūrą
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, email, created_at')
        .or('email.like.%test-%,email.like.%@example.com%')
        .order('created_at', { ascending: false });

      if (profileError) {
        console.error('User profiles error:', profileError);
        toast.error(`Klaida kraunant naudotojų profilius: ${profileError.message}`);
      } else {
        setUserProfiles(profileData || []);
      }

      // Užkrauname profiles lentelę
      const { data: allProfiles, error: allProfilesError } = await supabase
        .from('profiles')
        .select('id, username, created_at')
        .order('created_at', { ascending: false });

      if (allProfilesError) {
        console.error('Profiles error:', allProfilesError);
        toast.error(`Klaida kraunant profilius: ${allProfilesError.message}`);
      } else {
        setProfiles(allProfiles || []);
      }

    } catch (error) {
      console.error('Load error:', error);
      toast.error('Klaida kraunant duomenis');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string, email: string) => {
    setDeleting(prev => [...prev, userId]);

    try {
      // Pirmiausia bandoma šalinti iš profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        throw new Error(`Profile deletion failed: ${profileError.message}`);
      }

      // Pastaba: anon raktu negalime šalinti iš auth.users
      // Tam reikalingas service role raktas

      toast.success(`Profilis pašalintas: ${email}`);
      await loadData(); // Refresh data

    } catch (error) {
      console.error('Delete error:', error);
      toast.error(`Nepavyko pašalinti ${email}: ${error instanceof Error ? error.message : 'Nežinoma klaida'}`);
    } finally {
      setDeleting(prev => prev.filter(id => id !== userId));
    }
  };

  const bulkDeleteProfiles = async () => {
    if (!authUsers.length) {
      toast.error('Nėra testinių vartotojų, kurių profilius būtų galima šalinti');
      return;
    }

    if (!confirm(`Ar tikrai norite pašalinti ${authUsers.length} testinių vartotojų profilius?`)) {
      return;
    }

    setLoading(true);
    let deleted = 0;
    let failed = 0;

    for (const user of authUsers) {
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', user.id);

        if (error) {
          console.error(`Nepavyko pašalinti ${user.email}:`, error);
          failed++;
        } else {
          deleted++;
        }
      } catch (error) {
        console.error(`Klaida šalinant ${user.email}:`, error);
        failed++;
      }
    }

    toast.success(`Pašalinta ${deleted} profilių${failed > 0 ? `, ${failed} nepavyko` : ''}`);
    await loadData();
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Vartotojų valymo administravimo skydelis</h1>
        <Button onClick={loadData} disabled={loading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atnaujinti
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Auth Users View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Auth vartotojų peržiūra
              <Badge variant="secondary">{authUsers.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Testiniai vartotojai auth sistemoje (tik skaitymui)
            </p>

            {authUsers.length > 0 && (
              <Button
                onClick={bulkDeleteProfiles}
                disabled={loading}
                variant="destructive"
                size="sm"
                className="mb-4"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Pašalinti visus profilius
              </Button>
            )}

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {authUsers.map((user) => (
                <div key={user.id} className="p-3 border rounded-lg">
                  <div className="text-sm font-medium truncate">{user.email}</div>
                  <div className="text-xs text-muted-foreground">{user.created_at}</div>
                  <Button
                    onClick={() => deleteUser(user.id, user.email)}
                    disabled={deleting.includes(user.id) || loading}
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Pašalinti profilį
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Profiles View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Naudotojų profilių peržiūra
              <Badge variant="secondary">{userProfiles.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Sujungti auth + profilio duomenys (tik skaitymui)
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {userProfiles.map((user) => (
                <div key={user.id} className="p-3 border rounded-lg">
                  <div className="text-sm font-medium truncate">{user.email}</div>
                  <div className="text-xs text-muted-foreground">{user.created_at}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Profiles Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Profilių lentelė
              <Badge variant="secondary">{profiles.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Naudotojų profiliai (redaguojama lentelė)
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {profiles.map((profile) => (
                <div key={profile.id} className="p-3 border rounded-lg">
                  <div className="text-sm font-medium">{profile.username || 'Vartotojo vardas nenurodytas'}</div>
                  <div className="text-xs text-muted-foreground">{profile.created_at}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Svarbios pastabos:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>auth_users_view</strong> ir <strong>user_profiles</strong> yra tik skaitymui skirti vaizdai</li>
            <li>• Su anon raktu redaguoti galima tik <strong>profiles</strong> lentelę</li>
            <li>• Šalinimui iš auth.users reikalingas service role raktas (admin prieiga)</li>
            <li>• Testiniai vartotojai auth sistemoje liks be profilių (našlaičiai)</li>
            <li>• Ši sąsaja leidžia sutvarkyti tiek, kiek leidžia dabartinės teisės</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}