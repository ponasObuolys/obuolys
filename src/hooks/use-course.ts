import { useQuery } from "@tanstack/react-query";

// Course type matching the database schema
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  price: string;
  duration: string;
  level: string;
  highlights: string[];
  published: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  promote_in_popup?: boolean;
  regular_price?: string | null;
  discount_price?: string | null;
  next_price?: string | null;
  next_price_date?: string | null;
  value_items?: { title: string; value: string }[] | null;
  total_value?: string | null;
  stripe_product_id?: string | null;
  stripe_price_id?: string | null;
  countdown_enabled?: boolean | null;
  countdown_end_date?: string | null;
  countdown_text?: string | null;
  // Nauji laukai vietų skaičiavimui
  max_spots?: number | null;
  course_start_date?: string | null;
  pdf_guides?: { title: string; description?: string }[] | null;
  cta_button_text?: string | null;
}

const FETCH_TIMEOUT = 15000; // 15 seconds timeout

/**
 * Helper function to perform fetch with timeout
 * Prevents infinite loading on mobile devices where Supabase client sometimes hangs
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  signal?: AbortSignal
): Promise<Response> => {
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
 * Custom hook for fetching a single course by slug
 * 
 * Features:
 * - Uses direct REST API instead of Supabase client (fixes mobile hanging issue)
 * - 15 second timeout to prevent infinite loading
 * - Automatic retry with exponential backoff (3 attempts)
 * - Proper error handling
 * 
 * @param slug - Course slug to fetch
 * @returns React Query result with course data
 */
export const useCourse = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["course", slug],
    queryFn: async ({ signal }) => {
      if (!slug) {
        throw new Error("Course slug is required");
      }

      // Use direct REST API instead of Supabase client
      // Supabase client .select() sometimes never starts the fetch request on mobile (known bug)
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error("Supabase configuration is missing");
      }

      const params = new URLSearchParams({
        select: "*",
        slug: `eq.${slug}`,
        published: "eq.true",
        limit: "1",
      });

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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch course: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || data.length === 0) {
        return null; // Course not found
      }

      return data[0] as Course;
    },
    enabled: !!slug,
    // Retry configuration for reliability
    retry: 3,
    retryDelay: (attemptIndex) => {
      // Exponential backoff: 1s, 2s, 4s
      return Math.min(1000 * 2 ** attemptIndex, 8000);
    },
    // Keep data fresh for 1 minute
    staleTime: 60 * 1000,
    // Cache for 5 minutes
    gcTime: 5 * 60 * 1000,
    // Always refetch on mount to ensure fresh data
    refetchOnMount: true,
    // Refetch when window regains focus (useful for mobile)
    refetchOnWindowFocus: true,
  });
};

/**
 * Custom hook for fetching a promoted course (for popup)
 * 
 * @param courseId - Optional specific course ID, otherwise fetches promoted course
 * @returns React Query result with course data
 */
export const usePromotedCourse = (courseId?: string) => {
  return useQuery({
    queryKey: ["promoted-course", courseId],
    queryFn: async ({ signal }) => {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error("Supabase configuration is missing");
      }

      const params = new URLSearchParams({
        select: "id,title,description,image_url,slug",
        published: "eq.true",
        limit: "1",
      });

      // If courseId provided, fetch that specific course
      // Otherwise, fetch the promoted course
      if (courseId) {
        params.append("id", `eq.${courseId}`);
      } else {
        params.append("promote_in_popup", "eq.true");
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch promoted course");
      }

      const data = await response.json();
      
      if (!data || data.length === 0) {
        return null;
      }

      return data[0] as Pick<Course, "id" | "title" | "description" | "image_url" | "slug">;
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 4000),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
