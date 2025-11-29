import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { log } from "@/utils/browserLogger";
import { generateSlug } from "@/utils/stringUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { courseSchema, type CourseFormValues } from "./course-editor.types";

export const useCourseForm = () => {
  return useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      price: "",
      duration: "",
      level: "",
      published: false,
      promote_in_popup: false,
      image_url: "",
    },
    mode: "onChange",
  });
};

export const useCourseData = (id: string | null, form: UseFormReturn<CourseFormValues>) => {
  const [initialLoading, setInitialLoading] = useState(id !== null);
  const [content, setContent] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id || id === "new") {
        setInitialLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.from("courses").select("*").eq("id", id).single();

        if (error) throw error;

        if (data) {
          form.reset({
            title: data.title,
            slug: data.slug,
            description: data.description,
            price: data.price,
            duration: data.duration,
            level: data.level,
            published: data.published,
            promote_in_popup: data.promote_in_popup || false,
            image_url: data.image_url || "",
            max_spots: data.max_spots || null,
            course_start_date: data.course_start_date || null,
            pdf_guides: (data.pdf_guides as { title: string; description?: string }[]) || [],
            cta_button_text: data.cta_button_text || null,
          });
          setContent(data.content || "");
          setHighlights(data.highlights || []);
          setImageUrl(data.image_url || null);
        }
      } catch (error) {
        log.error("Error fetching course:", error);
        toast({
          title: "Klaida",
          description: "Nepavyko gauti kurso duomenų.",
          variant: "destructive",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCourse();
  }, [id, form, toast]);

  return { initialLoading, content, setContent, highlights, setHighlights, imageUrl, setImageUrl };
};

export const useHighlights = (
  highlights: string[],
  setHighlights: (highlights: string[]) => void
) => {
  const [newHighlight, setNewHighlight] = useState("");

  const addHighlight = () => {
    if (newHighlight.trim() !== "") {
      setHighlights([...highlights, newHighlight.trim()]);
      setNewHighlight("");
    }
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  return { newHighlight, setNewHighlight, addHighlight, removeHighlight };
};

export const useCourseSubmit = (
  id: string | null,
  content: string,
  highlights: string[],
  onSave: () => void
) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (values: CourseFormValues) => {
    if (!content.trim()) {
      toast({
        title: "Klaida",
        description: "Įveskite kurso turinį.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const courseDataForSupabase: TablesInsert<"courses"> = {
        title: values.title,
        slug: values.slug,
        description: values.description,
        price: values.price,
        duration: values.duration,
        level: values.level,
        published: values.published || false,
        promote_in_popup: values.promote_in_popup || false,
        image_url: values.image_url || null,
        content: content,
        highlights: highlights,
        max_spots: values.max_spots || null,
        course_start_date: values.course_start_date || null,
        pdf_guides: values.pdf_guides || null,
        cta_button_text: values.cta_button_text || null,
      };

      log.info("Siunčiami kurso duomenys", { course: courseDataForSupabase });

      let response;

      if (id && id !== "new") {
        const updateData: TablesUpdate<"courses"> = {
          title: courseDataForSupabase.title,
          slug: courseDataForSupabase.slug,
          description: courseDataForSupabase.description,
          price: courseDataForSupabase.price,
          duration: courseDataForSupabase.duration,
          level: courseDataForSupabase.level,
          published: courseDataForSupabase.published,
          promote_in_popup: courseDataForSupabase.promote_in_popup,
          image_url: values.image_url || null,
          content: courseDataForSupabase.content,
          highlights: courseDataForSupabase.highlights,
          max_spots: courseDataForSupabase.max_spots,
          course_start_date: courseDataForSupabase.course_start_date,
          pdf_guides: courseDataForSupabase.pdf_guides,
          cta_button_text: courseDataForSupabase.cta_button_text,
        };
        response = await supabase.from("courses").update(updateData).eq("id", id);
      } else {
        // Workaround: Use direct fetch instead of Supabase client
        // Supabase client .insert() never starts the fetch request (bug)
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
        const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

        const fetchResponse = await fetch(`${SUPABASE_URL}/rest/v1/courses`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
          },
          body: JSON.stringify(courseDataForSupabase),
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
        description: id ? "Kursas atnaujintas." : "Naujas kursas sukurtas.",
      });

      onSave();
    } catch (error) {
      log.error("Error saving course:", error);
      toast({
        title: "Klaida",
        description: "Nepavyko išsaugoti kurso.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, onSubmit };
};

export const useTitleSlugSync = (form: UseFormReturn<CourseFormValues>, id: string | null) => {
  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    form.setValue("title", title);

    if (!form.getValues("slug") || id === null) {
      form.setValue("slug", generateSlug(title));
    }
  };

  return { onTitleChange };
};
