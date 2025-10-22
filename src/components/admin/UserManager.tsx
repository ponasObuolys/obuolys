import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Ban, CheckCircle, User as UserIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface UserManagerProps {
  onUpdate: () => void;
}

// Define proper types for the User displayed in the UI
interface User {
  id: string;
  username: string | null;
  email: string;
  created_at_auth: string;
  is_admin: boolean;
  avatar_url?: string;
}

const UserManager = ({ onUpdate }: UserManagerProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      // Use user_profiles view to get email data from auth.users
      const { data: profilesData, error: profilesError } = await supabase
        .from("user_profiles")
        .select("*");

      if (profilesError) {
        // Fallback to profiles table if user_profiles view is not accessible
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("profiles")
          .select("*");

        if (fallbackError) throw fallbackError;

        // Supabase returns nullable fields
        type ProfileData = {
          id: string;
          username: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
          avatar_url: string | null;
        };

        const transformedData =
          fallbackData?.map((profile: ProfileData) => ({
            id: profile.id || "",
            username: profile.username,
            email: "Nėra prieigos", // We can't access auth.users directly
            created_at_auth: profile.created_at || "",
            is_admin: profile.is_admin || false,
            avatar_url: profile.avatar_url || undefined,
          })) || [];

        setUsers(transformedData);
        return;
      }

      // Transform the data using user_profiles view
      // user_profiles view returns all nullable fields
      type UserProfileView = {
        id: string | null;
        username: string | null;
        is_admin: boolean | null;
        created_at: string | null;
        updated_at: string | null;
        avatar_url: string | null;
        email: string | null;
        auth_created_at: string | null;
      };

      const transformedData =
        profilesData?.map((profile: UserProfileView) => ({
          id: profile.id || "",
          username: profile.username,
          email: profile.email || "Nenurodytas",
          created_at_auth: profile.auth_created_at || profile.created_at || "",
          is_admin: profile.is_admin || false,
          avatar_url: profile.avatar_url || undefined,
        })) || [];

      setUsers(transformedData);
    } catch {
      toast({
        title: "Klaida",
        description: "Nepavyko gauti vartotojų sąrašo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_admin: !currentStatus })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Sėkmingai atnaujinta",
        description: `Administratoriaus statusas ${!currentStatus ? "suteiktas" : "panaikintas"}.`,
      });

      fetchUsers();
      onUpdate();
    } catch {
      toast({
        title: "Klaida",
        description: "Nepavyko atnaujinti administratoriaus statuso.",
        variant: "destructive",
      });
    }
  };

  // Since we can't directly delete auth users without admin access to Supabase dashboard,
  // we'll just indicate how it would be done
  const suspendUser = (_userId: string) => {
    toast({
      title: "Pranešimas",
      description:
        "Vartotojų šalinimui reikalingas tiesioginis prisijungimas prie Supabase valdymo skydelio.",
    });
  };

  if (loading) {
    return <p className="text-center py-4">Kraunama...</p>;
  }

  if (users.length === 0) {
    return <p className="text-center py-4">Vartotojų nerasta.</p>;
  }

  return (
    <>
      {/* Desktop lentelė */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Vartotojo vardas</TableHead>
              <TableHead className="text-left">El. paštas</TableHead>
              <TableHead className="text-left w-32">Registracijos data</TableHead>
              <TableHead className="text-left w-28">Administratorius</TableHead>
              <TableHead className="text-right w-48">Veiksmai</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-left">
                  <div className="flex items-center space-x-3">
                    {user.avatar_url && (
                      <img src={user.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full" />
                    )}
                    <div>
                      <div className="font-medium">{user.username || "Nenurodytas"}</div>
                      <div className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-left">
                  <span className="text-sm">{user.email}</span>
                </TableCell>
                <TableCell className="text-left whitespace-nowrap">
                  <span className="text-sm">
                    {new Date(user.created_at_auth).toLocaleDateString("lt-LT")}
                  </span>
                </TableCell>
                <TableCell className="text-left">
                  <span
                    className={`inline-flex px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                      user.is_admin ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.is_admin ? "Taip" : "Ne"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant={user.is_admin ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                    >
                      {user.is_admin ? (
                        <>
                          <Ban className="h-4 w-4 mr-1" /> Atimti teises
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" /> Suteikti teises
                        </>
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => suspendUser(user.id)}
                      disabled
                    >
                      <Ban className="h-4 w-4 mr-1" /> Suspenduoti
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile kortelės */}
      <div className="md:hidden grid gap-3">
        {users.map(user => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="h-6 w-6 text-gray-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{user.username || "Nenurodytas"}</div>
                  <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    ID: {user.id.slice(0, 8)}...
                  </div>
                </div>
                <Badge
                  variant={user.is_admin ? "destructive" : "secondary"}
                  className="flex-shrink-0"
                >
                  {user.is_admin ? "Admin" : "Vartotojas"}
                </Badge>
              </div>

              <div className="flex flex-col gap-2 pt-3 border-t">
                <div className="text-xs text-muted-foreground">
                  Registracija: {new Date(user.created_at_auth).toLocaleDateString("lt-LT")}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={user.is_admin ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                    className="flex-1"
                  >
                    {user.is_admin ? (
                      <>
                        <Ban className="h-4 w-4 mr-1" /> Atimti
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" /> Suteikti
                      </>
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => suspendUser(user.id)}
                    disabled
                  >
                    <Ban className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default UserManager;
