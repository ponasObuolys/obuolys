import { useQuery } from '@tanstack/react-query';
import { ctaAnalyticsService } from '@/services/cta.service';

// ============================================
// CTA ANALYTICS HOOKS
// ============================================

export function useCTAPerformance() {
  return useQuery({
    queryKey: ['cta-performance'],
    queryFn: ctaAnalyticsService.getPerformanceStats,
    staleTime: 60000, // 1 min
  });
}

export function useStickyPerformance() {
  return useQuery({
    queryKey: ['sticky-performance'],
    queryFn: ctaAnalyticsService.getStickyPerformance,
    staleTime: 60000,
  });
}

export function useDailyStats(days = 30) {
  return useQuery({
    queryKey: ['cta-daily-stats', days],
    queryFn: () => ctaAnalyticsService.getDailyStats(days),
    staleTime: 60000,
  });
}

export function useTopCTAs(daysBack = 30, limit = 10) {
  return useQuery({
    queryKey: ['top-ctas', daysBack, limit],
    queryFn: () => ctaAnalyticsService.getTopCTAs(daysBack, limit),
    staleTime: 60000,
  });
}

export function useCTARecommendations() {
  return useQuery({
    queryKey: ['cta-recommendations'],
    queryFn: ctaAnalyticsService.getRecommendations,
    staleTime: 300000, // 5 min
  });
}
