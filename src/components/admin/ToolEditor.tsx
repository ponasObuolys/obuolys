import { useState, useEffect } from 'react';
import { generateSlug } from '@/utils/stringUtils';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import FileUpload from './FileUpload';
import LazyImage from '@/components/ui/lazy-image';

interface ToolEditorProps {
  id: string | null;
  onCancel: () => void;
  onSave: () => void;
}

const ToolEditor = ({ id, onCancel, onSave }: ToolEditorProps) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(id !== null);
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const form = useForm({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      url: '',
      image_url: '',
      category: '',
      featured: false,
      published: false,
    }
  });

  useEffect(() => {
    const fetchTool = async () => {
      if (!id || id === 'new') return;
      
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          form.reset({
            name: data.name,
            slug: data.slug,
            description: data.description,
            url: data.url,
            image_url: data.image_url || '',
            category: data.category,
            featured: data.featured,
            published: data.published,
          });
          setImageUrl(data.image_url || null);
        }
      } catch (error) {
        console.error('Error fetching tool:', error);
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

  // Using the imported generateSlug utility function that handles Lithuanian characters

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    form.setValue('name', name);
    
    // Only auto-generate slug if it's empty or if this is a new tool
    if (!form.getValues('slug') || id === null) {
      form.setValue('slug', generateSlug(name));
    }
  };

  const onSubmit = async (values: Record<string, unknown>) => {
    try {
      setLoading(true);
      
      // Užtikrinti, kad image_url būtų įtrauktas
      const toolData = {
        ...values,
        image_url: imageUrl, // Eksplicitiškai nurodome image_url reikšmę
      };
      
      console.log("Siunčiami įrankio duomenys:", toolData); // Pridėta diagnostinė informacija
      
      let response;
      
      if (id && id !== 'new') {
        // Update existing tool
        response = await supabase
          .from('tools')
          .update(toolData)
          .eq('id', id);
      } else {
        // Create new tool
        response = await supabase
          .from('tools')
          .insert([toolData]);
      }
      
      if (response.error) throw response.error;
      
      toast({
        title: "Sėkmingai išsaugota",
        description: id ? "Įrankis atnaujintas." : "Naujas įrankis sukurtas.",
      });
      
      onSave();
    } catch (error: unknown) {
      console.error('Error saving tool:', error);
      toast({
        title: "Klaida",
        description: "Nepavyko išsaugoti įrankio.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    console.log("ToolEditor handleImageUpload gavo URL:", url);
    setImageUrl(url);
    
    // Eksplicitiškai nustatyti form.setValue su gautu URL
    if (url) {
      form.setValue('image_url', url, { 
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
      console.log("Nustatytas image_url formoje:", form.getValues('image_url'));
    }
  };

  if (initialLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Įrankio redagavimas</CardTitle>
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
        <CardTitle>{id ? 'Redaguoti įrankį' : 'Naujas įrankis'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pavadinimas</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Įrankio pavadinimas" 
                        {...field}
                        onChange={onNameChange}
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
                      <Input placeholder="irankio-pavadinimas" {...field} />
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
                    <Textarea 
                      placeholder="Įrankio aprašymas" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Įrankio URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Nuoroda į įrankį (gali būti affiliate nuoroda)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Įrankio nuotrauka</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <FileUpload
                          bucket="site-images"
                          folder="tools"
                          acceptedFileTypes="image/jpeg,image/png,image/webp"
                          maxFileSizeMB={2}
                          onUploadComplete={handleImageUpload}
                        />
                        {imageUrl && (
                          <div className="mt-2 space-y-2">
                            <div className="border rounded-md overflow-hidden aspect-video w-full max-w-md">
                              <LazyImage
                                src={imageUrl}
                                alt="Įrankio nuotrauka"
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
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Įrankio nuotrauka (rekomenduojama)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategorija</FormLabel>
                  <FormControl>
                    <Input placeholder="Įrankio kategorija" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium">
                        Rekomenduojamas
                      </FormLabel>
                      <FormDescription className="text-xs">
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
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium">
                        Publikuotas
                      </FormLabel>
                      <FormDescription className="text-xs">
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

export default ToolEditor;
