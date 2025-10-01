import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, ExternalLink, User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminInfo = () => {
  const { user, isAdmin } = useAuth();

  if (isAdmin) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-green-600 mb-4" />
            <CardTitle className="text-green-800">Administratoriaus teisės aktyvios</CardTitle>
            <CardDescription>
              Jūs turite administratoriaus teises ir galite naudoti visas admin funkcijas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Settings className="h-4 w-4" />
              <AlertDescription>
                <strong>Vartotojas:</strong> {user?.email}<br />
                <strong>Admin statusas:</strong> Aktyvus
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild className="h-auto p-4">
                <Link to="/admin" className="flex flex-col items-center space-y-2">
                  <Shield className="h-6 w-6" />
                  <span>Administravimo skydelis</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto p-4">
                <Link to="/profilis" className="flex flex-col items-center space-y-2">
                  <User className="h-6 w-6" />
                  <span>Profilio nustatymai</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 mx-auto text-amber-600 mb-4" />
          <CardTitle>Admin panelės prieiga</CardTitle>
          <CardDescription>
            Instrukcijos, kaip gauti prieigą prie administravimo skydelio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!user ? (
            <Alert>
              <User className="h-4 w-4" />
              <AlertDescription>
                Pirmiausia turite prisijungti prie sistemos.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <User className="h-4 w-4" />
              <AlertDescription>
                <strong>Prisijungęs vartotojas:</strong> {user.email}<br />
                <strong>Admin teisės:</strong> Neaktyvios
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Kaip gauti admin teises:</h3>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                <div>
                  <p className="font-medium">Automatinis būdas (jei RLS leidžia):</p>
                  <p className="text-sm text-muted-foreground">Naudokite admin setup puslapį automatiniam admin teisių suteikimui.</p>
                  {user && (
                    <Button asChild variant="outline" className="mt-2">
                      <Link to="/admin/setup" className="flex items-center space-x-2">
                        <Settings className="h-4 w-4" />
                        <span>Admin Setup</span>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                <div>
                  <p className="font-medium">Rankinis būdas per Supabase:</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Eikite į Supabase dashboard</p>
                    <p>• Atidarykite "Table Editor" → "profiles"</p>
                    <p>• Surasite savo vartotoją pagal email</p>
                    <p>• Nustatykite "is_admin" lauką į "true"</p>
                    <p>• Perkraukite puslapį</p>
                  </div>
                  <Button asChild variant="outline" className="mt-2">
                    <a
                      href="https://supabase.com/dashboard/project/jzixoslapmlqafrlbvpk/editor/28540"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Supabase profiles lentelė</span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {!user && (
            <Button asChild className="w-full">
              <Link to="/auth">Prisijungti prie sistemos</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInfo;