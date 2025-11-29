import { useQuery } from "@tanstack/react-query";
import { faqService, type FAQ } from "@/services/faq.service";

/**
 * Hook kurso FAQ gauti (public)
 * Grąžina tik aktyvius FAQ
 */
export const useCourseFaq = (courseId: string | undefined) => {
  return useQuery({
    queryKey: ["course-faq", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      return faqService.getByCourseId(courseId);
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook visiems kurso FAQ gauti (admin)
 * Grąžina visus FAQ, įskaitant neaktyvius
 */
export const useAdminCourseFaq = (courseId: string | undefined) => {
  return useQuery({
    queryKey: ["admin-course-faq", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      return faqService.getAllByCourseId(courseId);
    },
    enabled: !!courseId,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export type { FAQ };
