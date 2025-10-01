import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateSlug } from "@/utils/stringUtils";
import { useEffect, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import type { ToolFormData } from "./tool-editor.types";

export const useToolForm = () => {
  return useForm<ToolFormData>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      url: "",
      image_url: "",
      category: "",
      featured: false,
      published: false,
    },
  });
};

export const useToolData = (id: string | null, form: UseFormReturn<ToolFormData>) => {
  const [initialLoading, setInitialLoading] = useState(id !== null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTool = async () => {
      if (!id || id === "new") {
        setInitialLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.from("tools").select("*").eq("id", id).single();

        if (error) throw error;

        if (data) {
          form.reset({
            name: data.name,
            slug: data.slug,
            description: data.description,
            url: data.url,
            image_url: data.image_url || "",
            category: data.category,
            featured: data.featured,
            published: data.published,
          });
          setImageUrl(data.image_url || null);
        }
      } catch {
        toast({
          title: "Klaida",
          description: "Nepavyko gauti įrankio duomenų.",
          variant: "destructive",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchTool();
  }, [id, form, toast]);

  return { initialLoading, imageUrl, setImageUrl };
};

export const useToolSubmit = (id: string | null, imageUrl: string | null, onSave: () => void) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (values: ToolFormData) => {
    try {
      setLoading(true);

      const toolData = {
        ...values,
        image_url: imageUrl,
      };

      let response;

      if (id && id !== "new") {
        response = await supabase.from("tools").update(toolData).eq("id", id);
      } else {
        response = await supabase.from("tools").insert([toolData]);
      }

      if (response.error) throw response.error;

      toast({
        title: "Sėkmingai išsaugota",
        description: id ? "Įrankis atnaujintas." : "Naujas įrankis sukurtas.",
      });

      onSave();
    } catch {
      toast({
        title: "Klaida",
        description: "Nepavyko išsaugoti įrankio.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, onSubmit };
};

export const useNameSlugSync = (form: UseFormReturn<ToolFormData>, id: string | null) => {
  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    form.setValue("name", name);

    if (!form.getValues("slug") || id === null) {
      form.setValue("slug", generateSlug(name));
    }
  };

  return { onNameChange };
};
