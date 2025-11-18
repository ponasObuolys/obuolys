import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Article = Database["public"]["Tables"]["articles"]["Row"];
type Tool = Database["public"]["Tables"]["tools"]["Row"];
type Course = Database["public"]["Tables"]["courses"]["Row"];

/**
 * Custom hook artikeliams gauti iš Supabase
 * @param options - filtravimo parametrai
 * @returns React Query rezultatas su articles data
 */
export const useArticles = (options?: { featured?: boolean; limit?: number }) => {
  return useQuery({
    queryKey: ["articles", options],
    queryFn: async () => {
      let query = supabase
        .from("articles")
        .select("*")
        .eq("published", true)
        .order("date", { ascending: false });

      if (options?.featured) {
        query = query.eq("featured", true);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as Article[];
    },
    // Duomenys laikomi "šviežiais" 5 minutes
    staleTime: 5 * 60 * 1000,
    // Visada refetch'inti kai komponentas mount'inasi
    refetchOnMount: true,
  });
};

/**
 * Custom hook įrankiams gauti iš Supabase
 * @returns React Query rezultatas su tools data
 */
export const useTools = () => {
  return useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      return [] as Tool[];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
  });
};

/**
 * Custom hook kursams gauti iš Supabase
 * @param limit - maksimalus kursų skaičius
 * @returns React Query rezultatas su courses data
 */
export const useCourses = (limit?: number) => {
  return useQuery({
    queryKey: ["courses", limit],
    queryFn: async () => {
      let query = supabase
        .from("courses")
        .select("*")
        .eq("published", true)
        .order("title", { ascending: true });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as Course[];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
  });
};

/**
 * Custom hook featured artikeliams gauti home page
 * @returns React Query rezultatas su featured articles data
 */
export const useFeaturedArticles = () => {
  return useQuery({
    queryKey: ["articles", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(
          "id, title, slug, description, date, category, image_url, content_type, featured, author, read_time"
        )
        .eq("published", true)
        .order("date", { ascending: false })
        .limit(3);

      if (error) {
        throw error;
      }

      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
  });
};
