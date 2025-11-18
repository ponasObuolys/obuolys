import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

export interface DashboardStats {
  publicationsCount: number;
  toolsCount: number;
  coursesCount: number;
  usersCount: number;
  heroSectionsCount: number;
  ctaSectionsCount: number;
  contactMessagesCount: number;
}

export const useDashboardStats = (isAdmin: boolean, user: User | null) => {
  const [stats, setStats] = useState<DashboardStats>({
    publicationsCount: 0,
    toolsCount: 0,
    coursesCount: 0,
    usersCount: 0,
    heroSectionsCount: 0,
    ctaSectionsCount: 0,
    contactMessagesCount: 0,
  });
  const { toast } = useToast();

  const fetchDashboardStats = useCallback(async () => {
    if (!user || !isAdmin) return;

    try {
      // Fetch articles count -> publications count
      const { count: publicationsCount, error: publicationsError } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true });

      // Fetch tools count
      const { count: toolsCount, error: toolsError } = await supabase
        .from("tools")
        .select("*", { count: "exact", head: true });

      // Fetch courses count
      const { count: coursesCount, error: coursesError } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true });

      // Fetch users count
      const { count: usersCount, error: usersError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch hero sections count
      const { count: heroSectionsCount, error: heroSectionsError } = await supabase
        .from("hero_sections")
        .select("*", { count: "exact", head: true });

      // Fetch CTA sections count
      const { count: ctaSectionsCount, error: ctaSectionsError } = await supabase
        .from("cta_sections")
        .select("*", { count: "exact", head: true });

      // Fetch contact messages count
      const { count: contactMessagesCount, error: contactMessagesError } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true });

      if (
        publicationsError ||
        toolsError ||
        coursesError ||
        usersError ||
        heroSectionsError ||
        ctaSectionsError ||
        contactMessagesError
      ) {
        throw new Error("Error fetching dashboard statistics");
      }

      setStats({
        publicationsCount: publicationsCount || 0,
        toolsCount: toolsCount || 0,
        coursesCount: coursesCount || 0,
        usersCount: usersCount || 0,
        heroSectionsCount: heroSectionsCount || 0,
        ctaSectionsCount: ctaSectionsCount || 0,
        contactMessagesCount: contactMessagesCount || 0,
      });
    } catch {
      toast({
        title: "Klaida",
        description: "Nepavyko gauti administravimo skydelio statistikos.",
        variant: "destructive",
      });
    }
  }, [isAdmin, user, toast]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  return { stats, fetchDashboardStats };
};
