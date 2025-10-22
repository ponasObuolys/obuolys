import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextProps, ProfileUpdateData } from "./auth-context.types";
import * as authHooks from "./auth-context.hooks";
import { secureLogger } from "@/utils/browserLogger";

export type { ProfileUpdateData } from "./auth-context.types";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Check admin status immediately, without setTimeout
        await authHooks.checkAdminStatus(session.user.id, setIsAdmin);
      } else {
        setIsAdmin(false);
      }
    });

    // THEN check for existing session
    (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await authHooks.checkAdminStatus(session.user.id, setIsAdmin);
        }
      } catch (error) {
        secureLogger.error("Error checking session", { error });
      } finally {
        setLoading(false);
      }
    })();

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        signIn: (email: string, password: string) => authHooks.signIn(email, password),
        signInWithGoogle: () => authHooks.signInWithGoogle(),
        signUp: (email: string, password: string, username: string) =>
          authHooks.signUp(email, password, username),
        signOut: () => authHooks.signOut(),
        updateUserProfile: (data: ProfileUpdateData) => authHooks.updateUserProfile(user, data),
        updatePassword: (currentPassword: string, newPassword: string) =>
          authHooks.updatePassword(currentPassword, newPassword),
        uploadProfileImage: (imageFile: File) =>
          authHooks.uploadProfileImage(user, imageFile, data =>
            authHooks.updateUserProfile(user, data)
          ),
        getUserProfile: () => authHooks.getUserProfile(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
