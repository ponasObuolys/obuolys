import { useQuery } from "@tanstack/react-query";
import { testimonialsService, type Testimonial } from "@/services/testimonials.service";

/**
 * Hook kurso atsiliepimams gauti (public)
 * Grąžina tik aktyvius atsiliepimus
 */
export const useCourseTestimonials = (courseId: string | undefined) => {
  return useQuery({
    queryKey: ["course-testimonials", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      return testimonialsService.getByCourseId(courseId);
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook visiems kurso atsiliepimams gauti (admin)
 * Grąžina visus atsiliepimus, įskaitant neaktyvius
 */
export const useAdminCourseTestimonials = (courseId: string | undefined) => {
  return useQuery({
    queryKey: ["admin-course-testimonials", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      return testimonialsService.getAllByCourseId(courseId);
    },
    enabled: !!courseId,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook visiems atsiliepimams gauti (admin)
 */
export const useAllTestimonials = () => {
  return useQuery({
    queryKey: ["all-testimonials"],
    queryFn: () => testimonialsService.getAll(),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export type { Testimonial };
