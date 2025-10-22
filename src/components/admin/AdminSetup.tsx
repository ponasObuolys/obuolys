import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, UserPlus } from "lucide-react";
import { secureLogger } from "@/utils/browserLogger";

const AdminSetup = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const makeCurrentUserAdmin = async () => {
    if (!user) {
      toast({
        title: "Klaida",
        description: "Prašome prisijungti prie sistemos.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      // Atnaujinti esamo vartotojo admin statusą
      const { error } = await supabase
        .from("profiles")
        .update({ is_admin: true })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Sėkmingai atnaujinta",
        description: "Jūs dabar turite administratoriaus teises. Perkraukite puslapį.",
      });

      // Perkrauti puslapį po 2 sekundžių
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      secureLogger.error("Admin setup error", { error });
      toast({
        title: "Klaida",
        description: "Nepavyko suteikti administratoriaus teisių.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
            <CardTitle>Admin Setup</CardTitle>
            <CardDescription>
              Prašome prisijungti prie sistemos, kad galėtumėte gauti administratoriaus teises.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <a href="/auth">Prisijungti</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <UserPlus className="h-12 w-12 mx-auto text-primary mb-4" />
          <CardTitle>Admin teisių suteikimas</CardTitle>
          <CardDescription>
            Suteikite administratoriaus teises šiam vartotojui: {user.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
            <strong>Vartotojas:</strong> {user.email}
            <br />
            <strong>ID:</strong> {user.id}
          </div>

          <Button onClick={makeCurrentUserAdmin} disabled={isUpdating} className="w-full">
            {isUpdating ? "Atnaujinama..." : "Suteikti admin teises"}
          </Button>

          <div className="text-xs text-muted-foreground text-center">
            Šis mygtukas veiks tik jei turite teises redaguoti profiles lentelę arba jei RLS nėra
            įjungtas šiai operacijai.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;
