import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from './RichTextEditor';
import { supabase } from '@/integrations/supabase/client';
import { FileUpload } from '@/components/ui/file-upload';
import LazyImage from '@/components/ui/lazy-image';

interface ArticleEditorProps {
  id: string | null;
  onCancel: () => void;
  onSave: () => void;
}

const ArticleEditor = ({ id, onCancel, onSave }: ArticleEditorProps) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(id !== null);
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const form = useForm({
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
    }
  });

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id || id === 'new') return;
      
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
          });
          setContent(data.content);
          setImageUrl(data.image_url || null);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        toast({
          title: "Klaida",
          description: "Nepavyko gauti straipsnio duomenų.",
          variant: "destructive",
        });
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchArticle();
  }, [id, form, toast]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    form.setValue('title', title);
    
    // Only auto-generate slug if it's empty or if this is a new article
    if (!form.getValues('slug') || id === null) {
      form.setValue('slug', generateSlug(title));
    }
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    form.setValue('image_url', url);
  };

  const onSubmit = async (values: any) => {
    if (!content.trim()) {
      toast({
        title: "Klaida",
        description: "Įveskite straipsnio turinį.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const articleData = {
        ...values,
        content,
        image_url: imageUrl,
      };
      
      let response;
      
      if (id && id !== 'new') {
        // Update existing article
        response = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', id);
      } else {
        // Create new article
        response = await supabase
          .from('articles')
          .insert([articleData]);
      }
      
      if (response.error) throw response.error;
      
      toast({
        title: "Sėkmingai išsaugota",
        description: id ? "Straipsnis atnaujintas." : "Naujas straipsnis sukurtas.",
      });
      
      onSave();
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: "Klaida",
        description: "Nepavyko išsaugoti straipsnio.",
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
          <CardTitle>Straipsnio redagavimas</CardTitle>
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
        <CardTitle>{id ? 'Redaguoti straipsnį' : 'Naujas straipsnis'}</CardTitle>
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
                        placeholder="Straipsnio pavadinimas" 
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
                      <Input placeholder="straipsnio-pavadinimas" {...field} />
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
                    <Input placeholder="Trumpas straipsnio aprašymas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategorija</FormLabel>
                    <FormControl>
                      <Input placeholder="Straipsnio kategorija" {...field} />
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
                      <Input placeholder="pvz. 5 min" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Autorius</FormLabel>
                    <FormControl>
                      <Input placeholder="Straipsnio autorius" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publikavimo data</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Straipsnio viršelio nuotrauka</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormLabel>Įkelti naują nuotrauką</FormLabel>
                  <FileUpload
                    bucket="site-images"
                    folder="articles/covers"
                    acceptedFileTypes="image/jpeg,image/png,image/webp"
                    maxSizeMB={2}
                    onUploadComplete={handleImageUpload}
                  />
                  <FormDescription>
                    Rekomenduojamas dydis: 1200 x 800 pikselių. Maksimalus dydis: 2MB
                  </FormDescription>
                </div>
                <div>
                  {imageUrl ? (
                    <div className="space-y-2">
                      <FormLabel>Esama nuotrauka</FormLabel>
                      <div className="border rounded-md overflow-hidden aspect-video">
                        <LazyImage
                          src={imageUrl}
                          alt="Straipsnio nuotrauka"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setImageUrl(null);
                          form.setValue('image_url', '');
                        }}
                      >
                        Pašalinti nuotrauką
                      </Button>
                    </div>
                  ) : (
                    <div className="border rounded-md p-4 h-full flex items-center justify-center bg-muted">
                      <p className="text-muted-foreground text-center">
                        Nuotrauka nepasirinkta
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Straipsnio turinys</h3>
              <RichTextEditor 
                value={content} 
                onChange={setContent} 
                placeholder="Įveskite straipsnio turinį..." 
              />
            </div>

            <div className="flex space-x-6">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Rekomenduojamas straipsnis
                      </FormLabel>
                      <FormDescription>
                        Rodomas pagrindiniame puslapyje
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Publikuotas
                      </FormLabel>
                      <FormDescription>
                        Matomas viešai
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Atšaukti
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saugoma...' : 'Išsaugoti'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ArticleEditor;
