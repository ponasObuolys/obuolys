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
          subtitle: data.subtitle,
          button_text: data.button_text,
          button_url: data.button_url,
          image_url: data.image_url || null,
          active: data.active,
        };

        const { error } = await supabase.from("hero_sections").insert([insertPayload]);

        if (error) throw error;

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
