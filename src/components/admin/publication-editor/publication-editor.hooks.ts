import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
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
    // eslint-disable-next-line no-console
    console.log("[DEBUG] onSubmit called", {
      values_summary: { ...values, content: content?.substring(0, 50) + "..." },
    });

    if (!content.trim()) {
      // eslint-disable-next-line no-console
      console.log("[DEBUG] Content is empty");
      toast({
        title: "Klaida",
        description: "Įveskite publikacijos turinį.",
        variant: "destructive",
      });
      return;
    }

    // Check content size (approximate)
    const contentSize = new Blob([content]).size;
    // eslint-disable-next-line no-console
    console.log(`[DEBUG] Content size: ${contentSize} bytes`);

    if (contentSize > 500 * 1024) {
      // 500KB limit
      // eslint-disable-next-line no-console
      console.log("[DEBUG] Content too large");
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

      // eslint-disable-next-line no-console
      console.log("[DEBUG] Preparing Supabase request", { id, isNew: !id || id === "new" });

      const operationPromise = async () => {
        let response;

        if (id && id !== "new") {
          // eslint-disable-next-line no-console
          console.log("[DEBUG] Updating existing article via Supabase client", id);
          const {
            id: _omitId,
            created_at: _omitCreatedAt,
            updated_at: _omitUpdatedAt,
            ...updateData
          } = publicationDataForSupabase;

          const { data, error } = await supabase
            .from("articles")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

          response = { data, error };
        } else {
          // Workaround: Use direct fetch instead of Supabase client
          // Supabase client .insert() never starts the fetch request (bug)
          const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
          const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

          try {
            const fetchResponse = await fetch(`${SUPABASE_URL}/rest/v1/articles`, {
              method: 'POST',
              headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation',
              },
              body: JSON.stringify(publicationDataForSupabase),
            });

            if (!fetchResponse.ok) {
              const errorData = await fetchResponse.json();
              response = { data: null, error: errorData };
            } else {
              const data = await fetchResponse.json();
              // PostgREST returns an array, get first item
              response = { data: Array.isArray(data) ? data[0] : data, error: null };
            }
          } catch (fetchError) {
            response = {
              data: null,
              error: {
                message: fetchError instanceof Error ? fetchError.message : 'Network error',
                details: fetchError
              }
            };
          }
        }

        return response;
      };

      const timeoutMs = 20000;
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () =>
            reject(
              new Error("Operacija užtruko per ilgai (20s). Patikrinkite interneto ryšį arba bandykite dar kartą.")
            ),
          timeoutMs
        );
      });

      // eslint-disable-next-line no-console
      console.log("[DEBUG] Awaiting Supabase operation with timeout...", { timeoutMs });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = (await Promise.race([operationPromise(), timeoutPromise])) as any;

      // eslint-disable-next-line no-console
      console.log("[DEBUG] Response received", response);

      if (response.error) {
        // eslint-disable-next-line no-console
        console.error("[DEBUG] Supabase error:", response.error);
        throw response.error;
      }

      // eslint-disable-next-line no-console
      console.log("[DEBUG] Success!");
      toast({
        title: "Sėkmingai išsaugota",
        description: id ? "Publikacija atnaujinta." : "Nauja publikacija sukurta.",
      });

      onSave();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[DEBUG] Caught error in onSubmit:", error);
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
      // eslint-disable-next-line no-console
      console.log("[DEBUG] Finally block - stopping loading");
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
