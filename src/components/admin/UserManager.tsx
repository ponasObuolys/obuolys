
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Ban, CheckCircle } from 'lucide-react';

interface UserManagerProps {
  onUpdate: () => void;
}

const UserManager = ({ onUpdate }: UserManagerProps) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Fetch profiles along with auth metadata
      const { data, error } = await supabase
        .from('profiles')
        .select('*, auth_user:id(email, created_at)');
        
      if (error) throw error;
      
      // Transform the data to include email from auth
      const transformedData = data?.map(profile => ({
        ...profile,
        email: profile.auth_user?.email || 'N/A',
        created_at_auth: profile.auth_user?.created_at || profile.created_at,
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
