import { supabase } from "@/integrations/supabase/client";

// ============================================
// TYPES
// ============================================

export interface FAQ {
  id: string;
  course_id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type FAQInsert = Omit<FAQ, "id" | "created_at" | "updated_at">;
export type FAQUpdate = Partial<FAQInsert>;

// ============================================
// FAQ SERVICE
// ============================================

export const faqService = {
  /**
   * Gauti visus FAQ pagal kurso ID (public - tik aktyvūs)
   */
  async getByCourseId(courseId: string): Promise<FAQ[]> {
    const { data, error } = await supabase
      .from("course_faq")
      .select("*")
      .eq("course_id", courseId)
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return (data || []) as FAQ[];
  },

  /**
   * Gauti visus FAQ (Admin)
   */
  async getAll(): Promise<FAQ[]> {
    const { data, error } = await supabase
      .from("course_faq")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return (data || []) as FAQ[];
  },

  /**
   * Gauti visus FAQ pagal kurso ID (Admin - įskaitant neaktyvius)
   */
  async getAllByCourseId(courseId: string): Promise<FAQ[]> {
    const { data, error } = await supabase
      .from("course_faq")
      .select("*")
      .eq("course_id", courseId)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return (data || []) as FAQ[];
  },

  /**
   * Sukurti naują FAQ
   */
  async create(faq: FAQInsert): Promise<FAQ> {
    const { data, error } = await supabase
      .from("course_faq")
      .insert(faq)
      .select()
      .single();

    if (error) throw error;
    return data as FAQ;
  },

  /**
   * Atnaujinti FAQ
   */
  async update(id: string, faq: FAQUpdate): Promise<FAQ> {
    const { data, error } = await supabase
      .from("course_faq")
      .update({ ...faq, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as FAQ;
  },

  /**
   * Ištrinti FAQ
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("course_faq")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  /**
   * Atnaujinti FAQ eilės tvarką
   */
  async updateOrder(items: { id: string; display_order: number }[]): Promise<void> {
    for (const item of items) {
      const { error } = await supabase
        .from("course_faq")
        .update({ display_order: item.display_order })
        .eq("id", item.id);

      if (error) throw error;
    }
  },
};
