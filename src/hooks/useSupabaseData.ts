import { useQuery } from "@tanstack/react-query";

import type { Database } from "@/integrations/supabase/types";

type Article = Database["public"]["Tables"]["articles"]["Row"];
type Tool = Database["public"]["Tables"]["tools"]["Row"];
type Course = Database["public"]["Tables"]["courses"]["Row"];

const FETCH_TIMEOUT = 15000; // 15 seconds timeout

/**
 * Helper function to perform fetch with timeout and signal
 */
const fetchWithTimeout = async (url: string, options: RequestInit, signal?: AbortSignal) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  // If a parent signal is provided, listen to it
  if (signal) {
    signal.addEventListener("abort", () => {
      clearTimeout(timeoutId);
      controller.abort();
    });
  }

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * Custom hook artikeliams gauti iš Supabase
 * @param options - filtravimo parametrai
 * @returns React Query rezultatas su articles data
 */
export const useArticles = (options?: { featured?: boolean; limit?: number }) => {
  return useQuery({
    queryKey: ["articles", options],
    queryFn: async ({ signal }) => {
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

      const response = await fetchWithTimeout(
        `${SUPABASE_URL}/rest/v1/articles?${params}`,
        {
          method: "GET",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
          },
        },
        signal
      );

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
    queryFn: async ({ signal }) => {
      // Workaround: Use direct fetch instead of Supabase client
      // Supabase client .select() sometimes never starts the fetch request (bug)
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const params = new URLSearchParams({
        select: "*",
        order: "name.asc",
      });

      const response = await fetchWithTimeout(
        `${SUPABASE_URL}/rest/v1/tools?${params}`,
        {
          method: "GET",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
          },
        },
        signal
      );

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
    queryFn: async ({ signal }) => {
      // Workaround: Use direct fetch instead of Supabase client
      // Supabase client .select() sometimes never starts the fetch request (bug)
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const params = new URLSearchParams({
        select: "*",
        published: "eq.true",
        order: "created_at.desc",
      });

      if (limit) {
        params.append("limit", limit.toString());
      }

      const response = await fetchWithTimeout(
        `${SUPABASE_URL}/rest/v1/courses?${params}`,
        {
          method: "GET",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
          },
        },
        signal
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch courses");
      }

      const data = await response.json();
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
    queryFn: async ({ signal }) => {
      // Workaround: Use direct fetch instead of Supabase client
      // Supabase client .select() sometimes never starts the fetch request (bug)
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const params = new URLSearchParams({
        select:
          "id,title,slug,description,date,category,image_url,content_type,featured,author,read_time",
        published: "eq.true",
        order: "created_at.desc",
        limit: "3",
      });

      const response = await fetchWithTimeout(
        `${SUPABASE_URL}/rest/v1/articles?${params}`,
        {
          method: "GET",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
          },
        },
        signal
      );

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
