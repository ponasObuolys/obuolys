import { useState, useEffect } from 'react';
import { generateSlug } from '@/utils/stringUtils';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from './RichTextEditor';
import { supabase } from '@/integrations/supabase/client';
import { FileUpload } from '@/components/ui/file-upload';
import LazyImage from '@/components/ui/lazy-image';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

const publicationSchema = z.object({
  title: z.string().min(1, { message: "Pavadinimas yra privalomas" }),
  slug: z.string().min(1, { message: "URL identifikatorius yra privalomas" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Netinkamas URL formato pavyzdys: naudoja-mazasias-raides-ir-bruksnelius" }),
  description: z.string().min(1, { message: "Aprašymas yra privalomas" }),
  category: z.string().min(1, { message: "Kategorija yra privaloma" }),
  read_time: z.string().min(1, { message: "Skaitymo laikas yra privalomas" }),
  author: z.string().min(1, { message: "Autorius yra privalomas" }),
  date: z.string().min(1, { message: "Data yra privaloma" }),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  image_url: z.string().url({ message: "Netinkamas paveikslėlio URL formatas" }).nullable().or(z.literal('')),
  content_type: z.enum(['Straipsnis', 'Naujiena'], {
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
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const form = useForm<PublicationFormData>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      category: '',
      read_time: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      featured: false,
      published: false,
      image_url: '',
      content_type: 'Straipsnis',
    }
  });

  useEffect(() => {
    const fetchPublication = async () => {
      if (!id || id === 'new') {
        setInitialLoading(false);
        return;
      }
      
      setInitialLoading(true);
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          form.reset({
            title: data.title,
            slug: data.slug,
            description: data.description,
            category: data.category,
            read_time: data.read_time,
            author: data.author,
            date: new Date(data.date).toISOString().split('T')[0],
            featured: data.featured,
            published: data.published,
            image_url: data.image_url || '',
            content_type: data.content_type as 'Straipsnis' | 'Naujiena' || 'Straipsnis',
          });
          setContent(data.content);
          setImageUrl(data.image_url || null);
        }
      } catch (error) {
        console.error('Error fetching publication:', error);
        toast({
          title: "Klaida",
          description: "Nepavyko gauti publikacijos duomenų.",
          variant: "destructive",
        });
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchPublication();
  }, [id, form, toast]);

  // Using the utility function that handles Lithuanian characters

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    form.setValue('title', title);
    
    if (!form.getValues('slug') || id === null) {
      form.setValue('slug', generateSlug(title));
    }
  };

  const handleImageUpload = (url: string) => {
    console.log("PublicationEditor handleImageUpload gavo URL:", url);
    setImageUrl(url);
    
    if (url) {
      form.setValue('image_url', url, { 
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
      console.log("Nustatytas image_url formoje:", form.getValues('image_url'));
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
      
      if (id && id !== 'new') {
        const { id: _, created_at, ...updateData } = publicationDataForSupabase;
        response = await supabase
          .from('articles')
          .update(updateData as TablesUpdate<"articles">)
          .eq('id', id);
      } else {
        response = await supabase
          .from('articles')
          .insert([publicationDataForSupabase]);
      }
      
      if (response.error) throw response.error;
      
      toast({
        title: "Sėkmingai išsaugota",
        description: id ? "Publikacija atnaujinta." : "Nauja publikacija sukurta.",
      });
      
      onSave();
    } catch (error) {
      console.error('Error saving publication:', error);
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
        <CardTitle>{id ? 'Redaguoti publikaciją' : 'Nauja publikacija'}</CardTitle>
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
                      <Input placeholder="Dirbtinis intelektas" {...field} />
                    </FormControl>
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
                      <Input placeholder="5 min" {...field} />
                    </FormControl>
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
                      <Input placeholder="Vardenis Pavardenis" {...field} />
                    </FormControl>
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
                <RichTextEditor 
                  value={content} 
                  onChange={setContent} 
                />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>Pagrindinis paveikslėlis</FormLabel>
              <FormControl>
                <FileUpload 
                  bucket="site-images"
                  folder={`articles/covers/${form.getValues('slug') || 'new-publication'}`}
                  acceptedFileTypes="image/jpeg,image/png,image/webp"
                  maxSizeMB={2}
                  onUploadComplete={handleImageUpload}
                />
              </FormControl>
              {imageUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Esamas paveikslėlis:</p>
                  <LazyImage src={imageUrl} alt="Esamas paveikslėlis" className="max-w-xs rounded-md" />
                </div>
              )}
              <FormMessage>{form.formState.errors.image_url?.message}</FormMessage>
            </FormItem>

            <div className="flex items-center space-x-4">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Rodyti pagrindiniame puslapyje</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Publikuoti</FormLabel>
                      <FormDescription>
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
                {loading ? 'Išsaugoma...' : (id ? 'Atnaujinti' : 'Sukurti')}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PublicationEditor;
