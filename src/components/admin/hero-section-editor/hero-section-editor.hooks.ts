import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { log } from "@/utils/browserLogger";
import {
  heroSectionSchema,
  type HeroSection,
  type HeroSectionFormData,
} from "./hero-section-editor.types";

export const useHeroSectionForm = () => {
  return useForm<HeroSectionFormData>({
    resolver: zodResolver(heroSectionSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      button_text: "",
      button_url: "",
      active: false,
    },
  });
};

export const useHeroSections = () => {
  const [heroSections, setHeroSections] = useState<HeroSection[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchHeroSections = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("hero_sections")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHeroSections(
        (data || []).map(section => ({
          ...section,
          subtitle: section.subtitle || "",
          description: section.description || "",
          button_text: section.button_text || "",
          button_url: section.button_url || "",
          image_url: section.image_url || undefined,
        }))
      );
    } catch (error) {
      log.error("Error fetching hero sections:", error);
      toast({
        title: "Klaida",
        description: "Nepavyko gauti hero sekcijų.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchHeroSections();
  }, [fetchHeroSections]);

  return { heroSections, loading, fetchHeroSections };
};

export const useHeroSectionSubmit = (
  editingSection: HeroSection | null,
  onSuccess: () => void,
  refetch: () => void
) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data: HeroSectionFormData) => {
    try {
      setLoading(true);

      if (editingSection) {
        const { error } = await supabase
          .from("hero_sections")
          .update(data)
          .eq("id", editingSection.id);

        if (error) throw error;

        toast({
          title: "Sėkmė",
          description: "Hero sekcija sėkmingai atnaujinta.",
        });
      } else {
        const insertPayload: TablesInsert<"hero_sections"> = {
          title: data.title,
          subtitle: data.subtitle || "",
          description: data.description,
          button_text: data.button_text,
          button_url: data.button_url,
          image_url: data.image_url || null,
          active: data.active,
        };

        // Workaround: Use direct fetch instead of Supabase client
        // Supabase client .insert() never starts the fetch request (bug)
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
        const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

        const fetchResponse = await fetch(`${SUPABASE_URL}/rest/v1/hero_sections`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
          },
          body: JSON.stringify(insertPayload),
        });

        if (!fetchResponse.ok) {
          const errorData = await fetchResponse.json();
          throw errorData;
        }

        toast({
          title: "Sėkmė",
          description: "Hero sekcija sėkmingai sukurta.",
        });
      }

      await refetch();
      onSuccess();
    } catch (error) {
      log.error("Error saving hero section:", error);
      toast({
        title: "Klaida",
        description: "Nepavyko išsaugoti hero sekcijos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, onSubmit };
};

export const useHeroSectionActions = (refetch: () => void) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!window.confirm("Ar tikrai norite ištrinti šią hero sekciją?")) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from("hero_sections").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Sėkmė",
        description: "Hero sekcija sėkmingai ištrinta.",
      });

      await refetch();
    } catch (error) {
      log.error("Error deleting hero section:", error);
      toast({
        title: "Klaida",
        description: `Nepavyko ištrinti hero sekcijos: ${error instanceof Error ? error.message : typeof error === "string" ? error : "nežinoma klaida"}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (section: HeroSection) => {
    try {
      const { error } = await supabase
        .from("hero_sections")
        .update({ active: !section.active })
        .eq("id", section.id);

      if (error) throw error;

      toast({
        title: "Sėkmė",
        description: `Hero sekcija ${!section.active ? "aktyvuota" : "deaktyvuota"}.`,
      });

      await refetch();
    } catch (error) {
      log.error("Error toggling hero section:", error);
      toast({
        title: "Klaida",
        description: "Nepavyko pakeisti hero sekcijos būklės.",
        variant: "destructive",
      });
    }
  };

  return { loading, handleDelete, toggleActive };
};
