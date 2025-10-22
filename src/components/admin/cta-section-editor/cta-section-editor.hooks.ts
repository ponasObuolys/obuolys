import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { log } from "@/utils/browserLogger";
import {
  ctaSectionSchema,
  type CTASection,
  type CTASectionFormData,
} from "./cta-section-editor.types";

export const useCTASectionForm = () => {
  return useForm<CTASectionFormData>({
    resolver: zodResolver(ctaSectionSchema),
    defaultValues: {
      title: "",
      description: "",
      button_text: "",
      button_url: "",
      active: false,
    },
  });
};

export const useCTASections = () => {
  const [ctaSections, setCTASections] = useState<CTASection[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCTASections = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("cta_sections")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCTASections(data || []);
    } catch (error) {
      log.error("Error fetching CTA sections:", error);
      toast({
        title: "Klaida",
        description: "Nepavyko gauti CTA sekcijų.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCTASections();
  }, [fetchCTASections]);

  return { ctaSections, loading, fetchCTASections };
};

export const useCTASectionSubmit = (
  editingSection: CTASection | null,
  onSuccess: () => void,
  refetch: () => void
) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data: CTASectionFormData) => {
    try {
      setLoading(true);

      if (editingSection) {
        const { error } = await supabase
          .from("cta_sections")
          .update(data)
          .eq("id", editingSection.id);

        if (error) throw error;

        toast({
          title: "Sėkmė",
          description: "CTA sekcija sėkmingai atnaujinta.",
        });
      } else {
        const payload: TablesInsert<"cta_sections"> = {
          title: data.title,
          description: data.description,
          button_text: data.button_text,
          button_url: data.button_url,
          active: data.active,
        };

        const { error } = await supabase.from("cta_sections").insert(payload);

        if (error) throw error;

        toast({
          title: "Sėkmė",
          description: "CTA sekcija sėkmingai sukurta.",
        });
      }

      await refetch();
      onSuccess();
    } catch (error) {
      log.error("Error saving CTA section:", error);
      toast({
        title: "Klaida",
        description: "Nepavyko išsaugoti CTA sekcijos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, onSubmit };
};

export const useCTASectionActions = (refetch: () => void) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!window.confirm("Ar tikrai norite ištrinti šią CTA sekciją?")) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from("cta_sections").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Sėkmė",
        description: "CTA sekcija sėkmingai ištrinta.",
      });

      await refetch();
    } catch (error) {
      log.error("Error deleting CTA section:", error);
      toast({
        title: "Klaida",
        description: `Nepavyko ištrinti CTA sekcijos: ${error instanceof Error ? error.message : typeof error === "string" ? error : "nežinoma klaida"}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (section: CTASection) => {
    try {
      const { error } = await supabase
        .from("cta_sections")
        .update({ active: !section.active })
        .eq("id", section.id);

      if (error) throw error;

      toast({
        title: "Sėkmė",
        description: `CTA sekcija ${!section.active ? "aktyvuota" : "deaktyvuota"}.`,
      });

      await refetch();
    } catch (error) {
      log.error("Error toggling CTA section:", error);
      toast({
        title: "Klaida",
        description: "Nepavyko pakeisti CTA sekcijos būklės.",
        variant: "destructive",
      });
    }
  };

  return { loading, handleDelete, toggleActive };
};
