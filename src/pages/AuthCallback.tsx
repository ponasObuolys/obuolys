import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { log } from "@/utils/browserLogger";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Wait for Supabase to process the OAuth callback
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the session after OAuth callback
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          log.error("Auth callback error:", error);
          navigate("/auth?error=oauth_failed");
          return;
        }

        if (session) {
          log.info("OAuth callback successful, session established");
          // Wait a bit more to ensure user context is updated
          await new Promise(resolve => setTimeout(resolve, 500));
          // Successful authentication - redirect to home
          navigate("/", { replace: true });
        } else {
          log.warn("No session after OAuth callback");
          // No session - redirect to auth page
          navigate("/auth");
        }
      } catch (error) {
        log.error("Unexpected error in auth callback:", error);
        navigate("/auth?error=unexpected");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Jungiamasi...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
