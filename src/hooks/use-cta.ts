import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ctaSectionService, stickyMessageService, heroSectionService } from '@/services/cta.service';
import type { CTASection, StickyMessage, HeroSection, CTAContext } from '@/types/cta';
import { useToast } from '@/components/ui/use-toast';

// ============================================
// CTA SECTIONS HOOKS
// ============================================

export function useCTASections() {
  return useQuery({
    queryKey: ['cta-sections'],
    queryFn: ctaSectionService.getAll,
  });
}

export function useCTASectionsByContext(context: CTAContext) {
  return useQuery({
    queryKey: ['cta-sections', context],
    queryFn: () => ctaSectionService.getByContext(context),
  });
}

export function useRandomCTA(context: CTAContext) {
  return useQuery({
    queryKey: ['cta-random', context],
    queryFn: () => ctaSectionService.getRandomByContext(context),
    staleTime: 0, // Visada gauti naują random
    refetchOnMount: true,
  });
}

export function useCreateCTASection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<CTASection, 'id' | 'created_at' | 'updated_at'>) =>
      ctaSectionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cta-sections'] });
      toast({
        title: 'Sėkmė',
        description: 'CTA sekcija sukurta',
      });
    },
    onError: (error) => {
      toast({
        title: 'Klaida',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateCTASection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CTASection> }) =>
      ctaSectionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cta-sections'] });
      toast({
        title: 'Sėkmė',
        description: 'CTA sekcija atnaujinta',
      });
    },
    onError: (error) => {
      toast({
        title: 'Klaida',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteCTASection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => ctaSectionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cta-sections'] });
      toast({
        title: 'Sėkmė',
        description: 'CTA sekcija ištrinta',
      });
    },
    onError: (error) => {
      toast({
        title: 'Klaida',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// ============================================
// STICKY MESSAGES HOOKS
// ============================================

export function useStickyMessages() {
  return useQuery({
    queryKey: ['sticky-messages'],
    queryFn: stickyMessageService.getAll,
  });
}

export function useActiveStickyMessages() {
  return useQuery({
    queryKey: ['sticky-messages', 'active'],
    queryFn: stickyMessageService.getActive,
  });
}

export function useCreateStickyMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<StickyMessage, 'id' | 'created_at' | 'updated_at'>) =>
      stickyMessageService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sticky-messages'] });
      toast({
        title: 'Sėkmė',
        description: 'Sticky žinutė sukurta',
      });
    },
    onError: (error) => {
      toast({
        title: 'Klaida',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateStickyMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StickyMessage> }) =>
      stickyMessageService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sticky-messages'] });
      toast({
        title: 'Sėkmė',
        description: 'Sticky žinutė atnaujinta',
      });
    },
    onError: (error) => {
      toast({
        title: 'Klaida',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteStickyMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => stickyMessageService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sticky-messages'] });
      toast({
        title: 'Sėkmė',
        description: 'Sticky žinutė ištrinta',
      });
    },
    onError: (error) => {
      toast({
        title: 'Klaida',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// ============================================
// HERO SECTIONS HOOKS
// ============================================

export function useHeroSections() {
  return useQuery({
    queryKey: ['hero-sections'],
    queryFn: heroSectionService.getAll,
  });
}

export function useActiveHeroSection() {
  return useQuery({
    queryKey: ['hero-section', 'active'],
    queryFn: heroSectionService.getActive,
  });
}

export function useCreateHeroSection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<HeroSection, 'id' | 'created_at' | 'updated_at'>) =>
      heroSectionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-sections'] });
      toast({
        title: 'Sėkmė',
        description: 'Hero sekcija sukurta',
      });
    },
    onError: (error) => {
      toast({
        title: 'Klaida',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateHeroSection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HeroSection> }) =>
      heroSectionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-sections'] });
      toast({
        title: 'Sėkmė',
        description: 'Hero sekcija atnaujinta',
      });
    },
    onError: (error) => {
      toast({
        title: 'Klaida',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteHeroSection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => heroSectionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-sections'] });
      toast({
        title: 'Sėkmė',
        description: 'Hero sekcija ištrinta',
      });
    },
    onError: (error) => {
      toast({
        title: 'Klaida',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
