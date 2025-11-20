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
      // Workaround: Use direct fetch instead of Supabase client
      // Supabase client .select() sometimes never starts the fetch request (bug)
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const params = new URLSearchParams({
        select: "*",
        published: "eq.true",
        order: "date.desc",
      });

      if (options?.featured) {
        params.append("featured", "eq.true");
      }

      if (options?.limit) {
        params.append("limit", options.limit.toString());
      }

      const response = await fetch(`${SUPABASE_URL}/rest/v1/articles?${params}`, {
        method: "GET",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch articles");
      }

      const data = await response.json();
      return data as Article[];
    },
    // Duomenys laikomi "šviežiais" 1 minutę (sumažinta nuo 5)
    staleTime: 60 * 1000,
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
      // Workaround: Use direct fetch instead of Supabase client
      // Supabase client .select() sometimes never starts the fetch request (bug)
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const params = new URLSearchParams({
        select: "*",
        order: "name.asc",
      });

      const response = await fetch(`${SUPABASE_URL}/rest/v1/tools?${params}`, {
        method: "GET",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch tools");
      }

      const data = await response.json();
      return data as Tool[];
    },
    staleTime: 60 * 1000,
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
    staleTime: 60 * 1000,
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
      // Workaround: Use direct fetch instead of Supabase client
      // Supabase client .select() sometimes never starts the fetch request (bug)
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const params = new URLSearchParams({
        select:
          "id,title,slug,description,date,category,image_url,content_type,featured,author,read_time",
        published: "eq.true",
        order: "date.desc",
        limit: "3",
      });

      const response = await fetch(`${SUPABASE_URL}/rest/v1/articles?${params}`, {
        method: "GET",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch featured articles");
      }

      const data = await response.json();
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
  });
};
