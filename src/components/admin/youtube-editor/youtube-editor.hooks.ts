import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateSlug } from "@/utils/stringUtils";
import { useEffect, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import type { YouTubeFormData } from "./youtube-editor.types";

export const useYouTubeForm = () => {
  return useForm<YouTubeFormData>({
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

export const useYouTubeData = (id: string | null, form: UseFormReturn<YouTubeFormData>) => {
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
          description: "Nepavyko gauti video įrašo duomenų.",
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

export const useYouTubeSubmit = (id: string | null, onSave: () => void) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (values: YouTubeFormData) => {
    try {
      setLoading(true);

      const toolData = {
        ...values,
        image_url: values.image_url || null,
      };

      let response;

      if (id && id !== "new") {
        response = await supabase.from("tools").update(toolData).eq("id", id);
      } else {
        // Workaround: Use direct fetch instead of Supabase client
        // Supabase client .insert() never starts the fetch request (bug)
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
        const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

        const fetchResponse = await fetch(`${SUPABASE_URL}/rest/v1/tools`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
          },
          body: JSON.stringify(toolData),
        });

        if (!fetchResponse.ok) {
          const errorData = await fetchResponse.json();
          response = { error: errorData };
        } else {
          const data = await fetchResponse.json();
          response = { data: Array.isArray(data) ? data[0] : data, error: null };
        }
      }

      if (response.error) throw response.error;

      toast({
        title: "Sėkmingai išsaugota",
        description: id ? "Video įrašas atnaujintas." : "Naujas video įrašas sukurtas.",
      });

      onSave();
    } catch {
      toast({
        title: "Klaida",
        description: "Nepavyko išsaugoti video įrašo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, onSubmit };
};

export const useNameSlugSync = (form: UseFormReturn<YouTubeFormData>, id: string | null) => {
  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    form.setValue("name", name);

    if (!form.getValues("slug") || id === null) {
      form.setValue("slug", generateSlug(name));
    }
  };

  return { onNameChange };
};
