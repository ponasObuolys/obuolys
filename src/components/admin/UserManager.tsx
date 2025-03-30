import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Ban, CheckCircle } from 'lucide-react';

interface UserManagerProps {
  onUpdate: () => void;
}

// Define proper types for the Supabase query results
interface Profile {
  id: string;
  username: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  avatar_url: string;
}

interface User {
  id: string;
  username: string | null;
  email: string;
  created_at_auth: string;
  is_admin: boolean;
}

const UserManager = ({ onUpdate }: UserManagerProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get profiles data
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
        
      if (profilesError) throw profilesError;
      
      // Transform the data - we won't try to get emails from auth
      const transformedData = profilesData?.map((profile: Profile) => ({
        ...profile,
        email: 'N/A', // We can't access auth.users directly
        created_at_auth: profile.created_at,
      })) || [];
      
      setUsers(transformedData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Klaida",
        description: "Nepavyko gauti vartotojų sąrašo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);
        
      if (error) throw error;
      
      toast({
        title: "Sėkmingai atnaujinta",
        description: `Administratoriaus statusas ${!currentStatus ? 'suteiktas' : 'panaikintas'}.`,
      });
      
      fetchUsers();
      onUpdate();
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast({
        title: "Klaida",
        description: "Nepavyko atnaujinti administratoriaus statuso.",
        variant: "destructive",
      });
    }
  };

  // Since we can't directly delete auth users without admin access to Supabase dashboard,
  // we'll just indicate how it would be done
  const suspendUser = (userId: string) => {
    toast({
      title: "Pranešimas",
      description: "Vartotojų šalinimui reikalingas tiesioginis prisijungimas prie Supabase valdymo skydelio.",
    });
  };

  if (loading) {
    return <p>Kraunami vartotojai...</p>;
  }

  if (users.length === 0) {
    return <p>Vartotojų nerasta.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vartotojo vardas</TableHead>
          <TableHead>El. paštas</TableHead>
          <TableHead>Registracijos data</TableHead>
          <TableHead>Administratorius</TableHead>
          <TableHead>Veiksmai</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.username || 'Nenurodytas'}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{new Date(user.created_at_auth).toLocaleDateString('lt-LT')}</TableCell>
            <TableCell>{user.is_admin ? 'Taip' : 'Ne'}</TableCell>
            <TableCell className="flex space-x-2">
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
                variant="destructive" 
                size="sm" 
                onClick={() => suspendUser(user.id)}
              >
                <Ban className="h-4 w-4 mr-1" /> Suspenduoti
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserManager;
