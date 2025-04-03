
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Profilio atnaujinimo tipas
export interface ProfileUpdateData {
  username?: string;
  email?: string;
}

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: ProfileUpdateData) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            checkAdminStatus(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminStatus(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setIsAdmin(data?.is_admin || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast({
        title: "Prisijungimas sėkmingas",
        description: "Sveiki sugrįžę!",
      });
    } catch (error: any) {
      toast({
        title: "Klaida",
        description: error.message || "Įvyko klaida prisijungiant",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      if (error) throw error;
      toast({
        title: "Registracija sėkminga",
        description: "Prašome patvirtinti savo el. paštą.",
      });
    } catch (error: any) {
      toast({
        title: "Klaida",
        description: error.message || "Įvyko klaida registruojantis",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Atsijungta",
        description: "Sėkmingai atsijungėte nuo sistemos.",
      });
    } catch (error: any) {
      toast({
        title: "Klaida",
        description: error.message || "Įvyko klaida atsijungiant",
        variant: "destructive",
      });
    }
  };



  // Atnaujinti vartotojo profilį
  const updateUserProfile = async (data: ProfileUpdateData) => {
    try {
      if (!user) throw new Error('Vartotojas neprisijungęs');

      // Atnaujinti profilio lentelėje
      const { error } = await supabase
        .from('profiles')
        .update({
          username: data.username
        })
        .eq('id', user.id);

      if (error) throw error;

      // Atnaujinti el. paštą, jei jis pakeistas
      if (data.email && data.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: data.email
        });
        if (emailError) throw emailError;
      }

      toast({
        title: "Profilis atnaujintas",
        description: "Jūsų profilis buvo sėkmingai atnaujintas.",
      });
    } catch (error: any) {
      toast({
        title: "Klaida",
        description: error.message || "Įvyko klaida atnaujinant profilį",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Atnaujinti slaptažodį
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Slaptažodis pakeistas",
        description: "Jūsų slaptažodis buvo sėkmingai pakeistas.",
      });
    } catch (error: any) {
      toast({
        title: "Klaida",
        description: error.message || "Įvyko klaida keičiant slaptažodį",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        signIn,
        signUp,
        signOut,
        updateUserProfile,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
