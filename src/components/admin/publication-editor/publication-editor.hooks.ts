import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { createErrorReport, reportError } from "@/utils/errorReporting";
import { generateSlug } from "@/utils/stringUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { publicationSchema, type PublicationFormData } from "./publication-editor.types";

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("category")
      .not("category", "is", null);
    if (!error && data) {
      // Flatten all categories from all articles (since category is now an array)
      const allCategories = data.flatMap((a: { category: string[] | null }) => a.category || []);
      const unique = Array.from(new Set(allCategories.filter(Boolean)));
      setCategories(unique);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories };
};

export const usePublicationForm = () => {
  const form = useForm<PublicationFormData>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      category: [],
      read_time: "",
      author: "ponas Obuolys",
      date: new Date().toISOString().split("T")[0],
      featured: false,
      published: false,
      image_url: "",
      content_type: "Straipsnis",
    },
    mode: "onChange",
  });

  // Užtikrina, kad autorius visada būtų 'ponas Obuolys', jei laukas tuščias
  useEffect(() => {
    const author = form.getValues("author");
    if (!author || !author.trim()) {
      form.setValue("author", "ponas Obuolys");
    }
  }, [form]);

  return form;
};

export const usePublicationData = (id: string | null, form: UseFormReturn<PublicationFormData>) => {
  const [initialLoading, setInitialLoading] = useState(id !== null);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPublication = useCallback(async () => {
    if (!id || id === "new") {
      setInitialLoading(false);
      return;
    }

    setInitialLoading(true);
    try {
      const { data, error } = await supabase.from("articles").select("*").eq("id", id).single();

      if (error) throw error;

      if (data) {
        form.reset({
          title: data.title,
          slug: data.slug,
          description: data.description,
          category: Array.isArray(data.category)
            ? data.category
            : data.category
              ? [data.category]
              : [],
          read_time: data.read_time,
          author: data.author && data.author.trim() ? data.author : "ponas Obuolys",
          date: new Date(data.date).toISOString().split("T")[0],
          featured: data.featured,
          published: data.published,
          image_url: data.image_url || "",
          content_type: (data.content_type as "Straipsnis" | "Naujiena") || "Straipsnis",
        });
        setContent(data.content);
        setImageUrl(data.image_url || null);
      }
    } catch (error) {
      reportError(
        createErrorReport(error as Error, {
          additionalData: { source: "PublicationEditor.fetchPublication", id },
        })
      );
      toast({
        title: "Klaida",
        description: "Nepavyko gauti publikacijos duomenų.",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  }, [id, form, toast]);

  useEffect(() => {
    fetchPublication();
  }, [fetchPublication]);

  return { initialLoading, content, setContent, imageUrl, setImageUrl };
};

export const useReadTimeCalculation = (
  content: string,
  form: UseFormReturn<PublicationFormData>
) => {
  const [readTimeManuallyEdited, setReadTimeManuallyEdited] = useState(false);

  useEffect(() => {
    if (readTimeManuallyEdited) return;
    const text = content.replace(/<[^>]+>/g, " ");
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(wordCount / 200));
    if (form.getValues("read_time") !== `${minutes} min`) {
      form.setValue("read_time", `${minutes} min`, { shouldValidate: true });
    }
  }, [content, readTimeManuallyEdited, form]);

  return { readTimeManuallyEdited, setReadTimeManuallyEdited };
};

export const usePublicationSubmit = (id: string | null, content: string, onSave: () => void) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (values: PublicationFormData) => {
    if (!content.trim()) {
      toast({
        title: "Klaida",
        description: "Įveskite publikacijos turinį.",
        variant: "destructive",
      });
      return;
    }

    // Check content size (approximate)
    const contentSize = new Blob([content]).size;
    if (contentSize > 500 * 1024) {
      // 500KB limit
      toast({
        title: "Klaida",
        description:
          "Publikacijos turinis per didelis. Venkite kelti didelius paveikslėlius tiesiai į tekstą (naudokite 'Pagrindinis paveikslėlis' arba išorinius nuorodas).",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const publicationDataForSupabase: TablesInsert<"articles"> = {
        title: values.title,
        slug: values.slug,
        description: values.description,
        category: values.category,
        read_time: values.read_time,
        author: values.author,
        date: values.date,
        featured: values.featured || false,
        published: values.published || false,
        content_type: values.content_type,
        content: content,
        image_url: values.image_url || null,
      };

      // Timeout promise to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Užklausos laikas baigėsi. Patikrinkite interneto ryšį.")),
          15000
        )
      );

      let responsePromise;

      if (id && id !== "new") {
        const {
          id: _omitId,
          created_at: _omitCreatedAt,
          ...updateData
        } = publicationDataForSupabase;
        responsePromise = supabase
          .from("articles")
          .update(updateData as TablesUpdate<"articles">)
          .eq("id", id);
      } else {
        responsePromise = supabase.from("articles").insert([publicationDataForSupabase]);
      }

      // Race between Supabase request and timeout
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = (await Promise.race([responsePromise, timeoutPromise])) as any;

      if (response.error) throw response.error;

      toast({
        title: "Sėkmingai išsaugota",
        description: id ? "Publikacija atnaujinta." : "Nauja publikacija sukurta.",
      });

      onSave();
    } catch (error) {
      reportError(
        createErrorReport(error as Error, {
          additionalData: { source: "PublicationEditor.onSubmit", id },
        })
      );
      toast({
        title: "Klaida",
        description: error instanceof Error ? error.message : "Nepavyko išsaugoti publikacijos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, onSubmit };
};

export const useTitleSlugSync = (form: UseFormReturn<PublicationFormData>, id: string | null) => {
  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    form.setValue("title", title);

    if (!form.getValues("slug") || id === null) {
      form.setValue("slug", generateSlug(title));
    }
  };

  return { onTitleChange };
};
