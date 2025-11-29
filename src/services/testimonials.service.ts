import { supabase } from "@/integrations/supabase/client";

// ============================================
// TYPES
// ============================================

export interface Testimonial {
  id: string;
  course_id: string;
  name: string;
  content: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type TestimonialInsert = Omit<Testimonial, "id" | "created_at" | "updated_at">;
export type TestimonialUpdate = Partial<TestimonialInsert>;

// ============================================
// TESTIMONIALS SERVICE
// ============================================

export const testimonialsService = {
  /**
   * Gauti visus atsiliepimus pagal kurso ID
   */
  async getByCourseId(courseId: string): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from("course_testimonials")
      .select("*")
      .eq("course_id", courseId)
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return (data || []) as Testimonial[];
  },

  /**
   * Gauti visus atsiliepimus (Admin)
   */
  async getAll(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from("course_testimonials")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return (data || []) as Testimonial[];
  },

  /**
   * Gauti visus atsiliepimus pagal kurso ID (Admin - įskaitant neaktyvius)
   */
  async getAllByCourseId(courseId: string): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from("course_testimonials")
      .select("*")
      .eq("course_id", courseId)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return (data || []) as Testimonial[];
  },

  /**
   * Sukurti naują atsiliepimą
   */
  async create(testimonial: TestimonialInsert): Promise<Testimonial> {
    const { data, error } = await supabase
      .from("course_testimonials")
      .insert(testimonial)
      .select()
      .single();

    if (error) throw error;
    return data as Testimonial;
  },

  /**
   * Atnaujinti atsiliepimą
   */
  async update(id: string, testimonial: TestimonialUpdate): Promise<Testimonial> {
    const { data, error } = await supabase
      .from("course_testimonials")
      .update({ ...testimonial, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Testimonial;
  },

  /**
   * Ištrinti atsiliepimą
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("course_testimonials")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  /**
   * Atnaujinti atsiliepimų eilės tvarką
   */
  async updateOrder(items: { id: string; display_order: number }[]): Promise<void> {
    // Atnaujinti kiekvieną atsiliepimą atskirai
    for (const item of items) {
      const { error } = await supabase
        .from("course_testimonials")
        .update({ display_order: item.display_order })
        .eq("id", item.id);

      if (error) throw error;
    }
  },
};
