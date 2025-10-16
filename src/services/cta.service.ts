import { supabase } from '@/integrations/supabase/client';
import type { CTASection, StickyMessage, HeroSection, CTAContext } from '@/types/cta';

// ============================================
// ANALYTICS & TRACKING
// ============================================

export const ctaAnalyticsService = {
  // Track CTA click
  async trackClick(
    ctaId: string, 
    ctaType: 'cta_section' | 'sticky_message',
    context?: string,
    pageUrl?: string
  ) {
    try {
      // Generate session ID jei nėra
      let sessionId = sessionStorage.getItem('cta_session_id');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('cta_session_id', sessionId);
      }

      const { error } = await supabase
        .from('cta_clicks')
        .insert({
          cta_id: ctaId,
          cta_type: ctaType,
          clicked_at: new Date().toISOString(),
          user_session_id: sessionId,
          page_url: pageUrl || window.location.pathname,
          context: context
        });

      if (error) throw error;
    } catch (error) {
      // Silent fail - analytics neturi trukdyti UX
      // eslint-disable-next-line no-console
      console.error('Failed to track CTA click:', error);
    }
  },

  // Get CTA performance stats
  async getPerformanceStats() {
    const { data, error } = await supabase
      .from('cta_performance')
      .select('*')
      .order('total_clicks', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get sticky messages performance
  async getStickyPerformance() {
    const { data, error } = await supabase
      .from('sticky_performance')
      .select('*')
      .order('total_clicks', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get daily stats
  async getDailyStats(days = 30) {
    const { data, error } = await supabase
      .from('cta_daily_stats')
      .select('*')
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get top performing CTAs
  async getTopCTAs(daysBack = 30, limit = 10) {
    const { data, error } = await supabase
      .rpc('get_top_ctas', { days_back: daysBack, limit_count: limit });
    
    if (error) throw error;
    return data || [];
  },

  // Get optimization recommendations
  async getRecommendations() {
    const { data, error } = await supabase
      .rpc('get_cta_recommendations');
    
    if (error) throw error;
    return data || [];
  }
};

// ============================================
// CTA SECTIONS
// ============================================

export const ctaSectionService = {
  // Gauti visas CTA sekcijas
  async getAll(): Promise<CTASection[]> {
    const { data, error } = await supabase
      .from('cta_sections')
      .select('*')
      .order('priority', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Gauti aktyvias CTA sekcijas pagal kontekstą
  async getByContext(context: CTAContext): Promise<CTASection[]> {
    const { data, error } = await supabase
      .from('cta_sections')
      .select('*')
      .eq('context', context)
      .eq('active', true)
      .order('priority', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Gauti random CTA pagal kontekstą
  async getRandomByContext(context: CTAContext): Promise<CTASection | null> {
    const sections = await this.getByContext(context);
    if (sections.length === 0) return null;
    
    // Weighted random pagal priority
    const totalPriority = sections.reduce((sum, s) => sum + s.priority, 0);
    let random = Math.random() * totalPriority;
    
    for (const section of sections) {
      random -= section.priority;
      if (random <= 0) return section;
    }
    
    return sections[0];
  },

  // Sukurti naują CTA sekciją
  async create(data: Omit<CTASection, 'id' | 'created_at' | 'updated_at'>): Promise<CTASection> {
    const { data: newSection, error } = await supabase
      .from('cta_sections')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return newSection;
  },

  // Atnaujinti CTA sekciją
  async update(id: string, data: Partial<CTASection>): Promise<CTASection> {
    const { data: updated, error } = await supabase
      .from('cta_sections')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return updated;
  },

  // Ištrinti CTA sekciją
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('cta_sections')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// ============================================
// STICKY MESSAGES
// ============================================

export const stickyMessageService = {
  // Gauti visas sticky žinutes
  async getAll(): Promise<StickyMessage[]> {
    const { data, error } = await supabase
      .from('sticky_cta_messages')
      .select('*')
      .order('priority', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Gauti aktyvias sticky žinutes
  async getActive(): Promise<StickyMessage[]> {
    const { data, error } = await supabase
      .from('sticky_cta_messages')
      .select('*')
      .eq('active', true)
      .order('priority', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Sukurti naują sticky žinutę
  async create(data: Omit<StickyMessage, 'id' | 'created_at' | 'updated_at'>): Promise<StickyMessage> {
    const { data: newMessage, error } = await supabase
      .from('sticky_cta_messages')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return newMessage;
  },

  // Atnaujinti sticky žinutę
  async update(id: string, data: Partial<StickyMessage>): Promise<StickyMessage> {
    const { data: updated, error } = await supabase
      .from('sticky_cta_messages')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return updated;
  },

  // Ištrinti sticky žinutę
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('sticky_cta_messages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// ============================================
// HERO SECTIONS
// ============================================

export const heroSectionService = {
  // Gauti visas hero sekcijas
  async getAll(): Promise<HeroSection[]> {
    const { data, error } = await supabase
      .from('hero_sections')
      .select('*')
      .order('priority', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Gauti aktyvią hero sekciją
  async getActive(): Promise<HeroSection | null> {
    const { data, error } = await supabase
      .from('hero_sections')
      .select('*')
      .eq('active', true)
      .order('priority', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // No rows
      throw error;
    }
    return data;
  },

  // Sukurti naują hero sekciją
  async create(data: Omit<HeroSection, 'id' | 'created_at' | 'updated_at'>): Promise<HeroSection> {
    const { data: newHero, error } = await supabase
      .from('hero_sections')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return newHero;
  },

  // Atnaujinti hero sekciją
  async update(id: string, data: Partial<HeroSection>): Promise<HeroSection> {
    const { data: updated, error } = await supabase
      .from('hero_sections')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return updated;
  },

  // Ištrinti hero sekciją
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('hero_sections')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
