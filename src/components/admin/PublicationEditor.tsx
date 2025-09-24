import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LazyImage from "@/components/ui/lazy-image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { createErrorReport, reportError } from "@/utils/errorReporting";
import { generateSlug } from "@/utils/stringUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FileUpload from "./FileUpload";
import RichTextEditor from "./RichTextEditor";

const publicationSchema = z.object({
  title: z.string().min(1, { message: "Pavadinimas yra privalomas" }),
  slug: z
    .string()
    .min(1, { message: "URL identifikatorius yra privalomas" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Netinkamas URL formato pavyzdys: naudoja-mazasias-raides-ir-bruksnelius",
    }),
  description: z.string().min(1, { message: "Aprašymas yra privalomas" }),
  category: z.string().min(1, { message: "Kategorija yra privaloma" }),
  read_time: z.string().min(1, { message: "Skaitymo laikas yra privalomas" }),
  author: z.string().min(1, { message: "Autorius yra privalomas" }),
  date: z.string().min(1, { message: "Data yra privaloma" }),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  image_url: z
    .string()
    .url({ message: "Netinkamas paveikslėlio URL formatas" })
    .nullable()
    .or(z.literal("")),
  content_type: z.enum(["Straipsnis", "Naujiena"], {
    required_error: "Turinio tipas yra privalomas",
    invalid_type_error: "Netinkamas turinio tipas",
  }),
});

type PublicationFormData = z.infer<typeof publicationSchema>;

interface PublicationEditorProps {
  id: string | null;
  onCancel: () => void;
  onSave: () => void;
}

const PublicationEditor = ({ id, onCancel, onSave }: PublicationEditorProps) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(id !== null);
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [readTimeManuallyEdited, setReadTimeManuallyEdited] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  // Gauti unikalias kategorijas iš Supabase
  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("category")
      .neq("category", "")
      .neq("category", null);
    if (!error && data) {
      const unique = Array.from(
        new Set(data.map((a: { category: string }) => a.category).filter(Boolean))
      );
      setCategories(unique);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const form = useForm<PublicationFormData>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      category: "",
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
          category: data.category,
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
      // Struktūrizuota klaidos registracija vietoje console.error
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

  // Automatinis skaitymo laiko paskaičiavimas
  useEffect(() => {
    if (readTimeManuallyEdited) return;
    // Ištrauk žodžius iš content (be HTML žymų)
    const text = content.replace(/<[^>]+>/g, " ");
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(wordCount / 200));
    if (form.getValues("read_time") !== `${minutes} min`) {
      form.setValue("read_time", `${minutes} min`, { shouldValidate: true });
    }
  }, [content, readTimeManuallyEdited, form]);

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    form.setValue("title", title);

    if (!form.getValues("slug") || id === null) {
      form.setValue("slug", generateSlug(title));
    }
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);

    if (url) {
      form.setValue("image_url", url, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  const onSubmit = async (values: PublicationFormData) => {
    if (!content.trim()) {
      toast({
        title: "Klaida",
        description: "Įveskite publikacijos turinį.",
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
        image_url: imageUrl,
      };

      let response;

      if (id && id !== "new") {
        // Pašaliname laukus, kurių negalima atnaujinti (id, created_at)
        const {
          id: _omitId,
          created_at: _omitCreatedAt,
          ...updateData
        } = publicationDataForSupabase;
        response = await supabase
          .from("articles")
          .update(updateData as TablesUpdate<"articles">)
          .eq("id", id);
      } else {
        response = await supabase.from("articles").insert([publicationDataForSupabase]);
      }

      if (response.error) throw response.error;

      toast({
        title: "Sėkmingai išsaugota",
        description: id ? "Publikacija atnaujinta." : "Nauja publikacija sukurta.",
      });

      onSave();
    } catch (error) {
      // Struktūrizuota klaidos registracija vietoje console.error
      reportError(
        createErrorReport(error as Error, {
          additionalData: { source: "PublicationEditor.onSubmit", id },
        })
      );
      toast({
        title: "Klaida",
        description: "Nepavyko išsaugoti publikacijos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Publikacijos redagavimas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4">Kraunami duomenys...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{id ? "Redaguoti publikaciją" : "Nauja publikacija"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pavadinimas</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Publikacijos pavadinimas"
                        {...field}
                        onChange={onTitleChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL identifikatorius (slug)</FormLabel>
                    <FormControl>
                      <Input placeholder="publikacijos-pavadinimas" {...field} />
                    </FormControl>
                    <FormDescription>
                      Unikalus identifikatorius naudojamas URL adrese
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aprašymas</FormLabel>
                  <FormControl>
                    <Input placeholder="Trumpas publikacijos aprašymas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="content_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turinio Tipas</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pasirinkite tipą" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Straipsnis">Straipsnis</SelectItem>
                        <SelectItem value="Naujiena">Naujiena</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategorija</FormLabel>
                    <FormControl>
                      <>
                        <Select
                          value={isCustomCategory ? "custom" : field.value}
                          onValueChange={val => {
                            if (val === "custom") {
                              setIsCustomCategory(true);
                              setCustomCategory("");
                              form.setValue("category", "");
                            } else {
                              setIsCustomCategory(false);
                              form.setValue("category", val, { shouldValidate: true });
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pasirinkite kategoriją" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                            <SelectItem value="custom">
                              <em>Įvesti naują...</em>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {isCustomCategory && (
                          <Input
                            className="mt-2"
                            placeholder="Nauja kategorija"
                            value={customCategory}
                            onChange={e => {
                              setCustomCategory(e.target.value);
                              form.setValue("category", e.target.value, { shouldValidate: true });
                            }}
                          />
                        )}
                      </>
                    </FormControl>
                    <FormDescription>
                      Galite pasirinkti iš sąrašo arba sukurti naują kategoriją.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="read_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skaitymo laikas</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="5 min"
                        {...field}
                        onChange={e => {
                          field.onChange(e);
                          setReadTimeManuallyEdited(true);
                        }}
                        onBlur={e => {
                          // Jei laukas tuščias, vėl įjungiam automatinį skaičiavimą
                          if (!e.target.value) setReadTimeManuallyEdited(false);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Šis laukas pildomas automatiškai pagal teksto kiekį, bet galite jį pakeisti
                      ranka.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Autorius</FormLabel>
                    <FormControl>
                      <Input placeholder="ponas Obuolys" {...field} />
                    </FormControl>
                    <FormDescription>
                      Pagal nutylėjimą: ponas Obuolys. Galite įrašyti kitą autorių.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormItem>
              <FormLabel>Turinys</FormLabel>
              <FormControl>
                <RichTextEditor value={content} onChange={setContent} />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>Pagrindinis paveikslėlis</FormLabel>
              <FormControl>
                <FileUpload
                  bucket="site-images"
                  folder={`articles/covers/${form.getValues("slug") || "new-publication"}`}
                  acceptedFileTypes="image/jpeg,image/png,image/webp"
                  maxFileSizeMB={2}
                  onUploadComplete={handleImageUpload}
                />
              </FormControl>
              {imageUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Esamas paveikslėlis:</p>
                  <LazyImage
                    src={imageUrl}
                    alt="Esamas paveikslėlis"
                    className="max-w-xs rounded-md"
                  />
                </div>
              )}
              <FormMessage>{form.formState.errors.image_url?.message}</FormMessage>
            </FormItem>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium">Rekomenduojamas</FormLabel>
                      <FormDescription className="text-xs">
                        Rodyti pagrindiniame puslapyje
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium">Publikuoti</FormLabel>
                      <FormDescription className="text-xs">
                        Ar ši publikacija matoma lankytojams?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="flex justify-end space-x-4 p-0 pt-6">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Atšaukti
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Išsaugoma..." : id ? "Atnaujinti" : "Sukurti"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PublicationEditor;
