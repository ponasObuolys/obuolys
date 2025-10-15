import { supabase } from '@/integrations/supabase/client';
import type { CTASection, StickyMessage, HeroSection, CTAContext } from '@/types/cta';

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
