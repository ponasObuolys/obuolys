
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Išplėstas vartotojo tipas su papildomais laukais
interface ExtendedUser extends User {
  username?: string;
  avatarUrl?: string;
  isAdmin?: boolean;
}

// Profilio atnaujinimo tipas
export interface ProfileUpdateData {
  username?: string;
  email?: string;
  avatarUrl?: string;
}

interface AuthContextProps {
  user: ExtendedUser | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: ProfileUpdateData) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  uploadProfileImage: (imageFile: File) => Promise<string>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Gauti išplėstus vartotojo duomenis iš profiles lentelės
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Gauti išplėstus vartotojo duomenis
  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url, is_admin')
        .eq('id', authUser.id)
        .single();
      
      if (error) throw error;
      
      const extendedUser: ExtendedUser = {
        ...authUser,
        username: data?.username || null,
        avatarUrl: data?.avatar_url || null,
        isAdmin: data?.is_admin || false
      };
      
      setUser(extendedUser);
      setIsAdmin(data?.is_admin || false);
    } catch (error) {
      console.error('Klaida gaunant vartotojo profilį:', error);
      setUser(authUser);
      setIsAdmin(false);
    }
  };

  // Ši funkcija nebereikalinga, nes admin statusas gaunamas fetchUserProfile funkcijoje

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

      // Paruošiame atnaujinimo objektą
      const updates: any = {};
      if (data.username) updates.username = data.username;
      if (data.avatarUrl) updates.avatar_url = data.avatarUrl;

      // Atnaujinti profilio lentelėje
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      // Atnaujinti el. paštą, jei jis pakeistas
      if (data.email && data.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: data.email
        });
        if (emailError) throw emailError;
      }

      // Atnaujinti vartotojo objektą lokaliai
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          username: data.username || prev.username,
          avatarUrl: data.avatarUrl || prev.avatarUrl,
          email: data.email || prev.email
        };
      });

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

  // Įkelti profilio nuotrauką
  const uploadProfileImage = async (imageFile: File): Promise<string> => {
    try {
      if (!user) throw new Error('Vartotojas neprisijungęs');

      // Sukurti unikalų failo pavadinimą
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Įkelti failą į storage
      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Gauti viešą URL
      const { data } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      const avatarUrl = data.publicUrl;

      // Atnaujinti vartotojo profilį su nauju avatarUrl
      await updateUserProfile({ avatarUrl });

      return avatarUrl;
    } catch (error: any) {
      toast({
        title: "Klaida",
        description: error.message || "Įvyko klaida įkeliant nuotrauką",
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
        updatePassword,
        uploadProfileImage
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
