import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { User } from "@supabase/supabase-js";
import type { ProfileUpdateData } from "./auth-context.types";

// Patikrinti administratoriaus statusą
export const checkAdminStatus = async (
  userId: string,
  setIsAdmin: (isAdmin: boolean) => void
) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single();

    if (error) throw error;
    setIsAdmin(data?.is_admin || false);
  } catch {
    toast({
      title: "Klaida",
      description: "Nepavyko patikrinti administratoriaus statuso.",
      variant: "destructive",
    });
    setIsAdmin(false);
  }
};

// Gauti vartotojo profilio duomenis
export const getUserProfile = async (user: User | null) => {
  try {
    if (!user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .single();

    if (error) throw error;

    return {
      username: data?.username || undefined,
      avatarUrl: data?.avatar_url || undefined,
    };
  } catch {
    toast({
      title: "Klaida",
      description: "Nepavyko gauti vartotojo profilio.",
      variant: "destructive",
    });
    return null;
  }
};

// Prisijungimas
export const signIn = async (email: string, password: string) => {
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Įvyko klaida prisijungiant";
    toast({
      title: "Klaida",
      description: errorMessage,
      variant: "destructive",
    });
    throw error;
  }
};

// Prisijungimas su Google
export const signInWithGoogle = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) throw error;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Įvyko klaida prisijungiant su Google";
    toast({
      title: "Klaida",
      description: errorMessage,
      variant: "destructive",
    });
    throw error;
  }
};

// Registracija
export const signUp = async (email: string, password: string, username: string) => {
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Įvyko klaida registruojantis";
    toast({
      title: "Klaida",
      description: errorMessage,
      variant: "destructive",
    });
    throw error;
  }
};

// Atsijungimas
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    toast({
      title: "Atsijungta",
      description: "Sėkmingai atsijungėte nuo sistemos.",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Įvyko klaida atsijungiant";
    toast({
      title: "Klaida",
      description: errorMessage,
      variant: "destructive",
    });
  }
};

// Atnaujinti vartotojo profilį
export const updateUserProfile = async (user: User | null, data: ProfileUpdateData) => {
  try {
    if (!user) throw new Error("Vartotojas neprisijungęs");

    // Paruošiame atnaujinimo objektą
    type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
    const updates: ProfileUpdate = {};
    if (data.username) updates.username = data.username;
    if (data.avatarUrl) updates.avatar_url = data.avatarUrl;

    // Atnaujinti profilio lentelėje
    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);

    if (error) throw error;

    // Atnaujinti el. paštą, jei jis pakeistas
    if (data.email && data.email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: data.email,
      });
      if (emailError) throw emailError;
    }

    toast({
      title: "Profilis atnaujintas",
      description: "Jūsų profilis buvo sėkmingai atnaujintas.",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Įvyko klaida atnaujinant profilį";
    toast({
      title: "Klaida",
      description: errorMessage,
      variant: "destructive",
    });
    throw error;
  }
};

// Atnaujinti slaptažodį
export const updatePassword = async (_currentPassword: string, newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    toast({
      title: "Slaptažodis pakeistas",
      description: "Jūsų slaptažodis buvo sėkmingai pakeistas.",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Įvyko klaida keičiant slaptažodį";
    toast({
      title: "Klaida",
      description: errorMessage,
      variant: "destructive",
    });
    throw error;
  }
};

// Įkelti profilio nuotrauką
export const uploadProfileImage = async (
  user: User | null,
  imageFile: File,
  onUpdateProfile: (data: ProfileUpdateData) => Promise<void>
): Promise<string> => {
  try {
    if (!user) throw new Error("Vartotojas neprisijungęs");

    // Sukurti unikalų failo pavadinimą
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Įkelti failą į storage
    const { error: uploadError } = await supabase.storage
      .from("site-images")
      .upload(filePath, imageFile, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Gauti viešą URL
    const { data } = supabase.storage.from("site-images").getPublicUrl(filePath);

    const avatarUrl = data.publicUrl;

    // Atnaujinti vartotojo profilį su nauju avatarUrl
    await onUpdateProfile({ avatarUrl });

    return avatarUrl;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Įvyko klaida įkeliant nuotrauką";
    toast({
      title: "Klaida",
      description: errorMessage,
      variant: "destructive",
    });
    throw error;
  }
};
