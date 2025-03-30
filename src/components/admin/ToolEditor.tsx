
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ToolEditorProps {
  id: string | null;
  onCancel: () => void;
  onSave: () => void;
}

const ToolEditor = ({ id, onCancel, onSave }: ToolEditorProps) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(id !== null);
  const { toast } = useToast();
  
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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    form.setValue('name', name);
    
    // Only auto-generate slug if it's empty or if this is a new tool
    if (!form.getValues('slug') || id === null) {
      form.setValue('slug', generateSlug(name));
    }
  };

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      let response;
      
      if (id && id !== 'new') {
        // Update existing tool
        response = await supabase
          .from('tools')
          .update(values)
          .eq('id', id);
      } else {
        // Create new tool
        response = await supabase
          .from('tools')
          .insert([values]);
      }
      
      if (response.error) throw response.error;
      
      toast({
        title: "Sėkmingai išsaugota",
        description: id ? "Įrankis atnaujintas." : "Naujas įrankis sukurtas.",
      });
      
      onSave();
    } catch (error) {
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
                    <FormLabel>Paveikslėlio URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Nuoroda į įrankio paveikslėlį (neprivaloma)
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
                        Rekomenduojamas
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

export default ToolEditor;
