import type { Session, User } from "@supabase/supabase-js";

// Profilio atnaujinimo tipas
export interface ProfileUpdateData {
  username?: string;
  email?: string;
  avatarUrl?: string;
}

export interface AuthContextProps {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: ProfileUpdateData) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  uploadProfileImage: (imageFile: File) => Promise<string>;
  getUserProfile: () => Promise<{ username?: string; avatarUrl?: string } | null>;
}
