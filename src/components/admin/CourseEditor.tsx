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
import RichTextEditor from './RichTextEditor';
import { supabase } from '@/integrations/supabase/client';
import { X, Plus } from 'lucide-react';
import FileUpload from './FileUpload';
import LazyImage from '@/components/ui/lazy-image';

interface CourseEditorProps {
  id: string | null;
  onCancel: () => void;
  onSave: () => void;
}

const CourseEditor = ({ id, onCancel, onSave }: CourseEditorProps) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(id !== null);
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const form = useForm({
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      price: '',
      duration: '',
      level: '',
      published: false,
      image_url: '',
    }
  });

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id || id === 'new') return;
      
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();
          
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
            image_url: data.image_url || '',
          });
          setContent(data.content);
          setHighlights(data.highlights || []);
          setImageUrl(data.image_url || null);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
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

  // Using the imported generateSlug utility function that handles Lithuanian characters

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    form.setValue('title', title);
    
    // Only auto-generate slug if it's empty or if this is a new course
    if (!form.getValues('slug') || id === null) {
      form.setValue('slug', generateSlug(title));
    }
  };

  const addHighlight = () => {
    if (newHighlight.trim() !== '') {
      setHighlights([...highlights, newHighlight.trim()]);
      setNewHighlight('');
    }
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleImageUpload = (url: string) => {
    console.log("CourseEditor handleImageUpload gavo URL:", url);
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

  const onSubmit = async (values: Record<string, unknown>) => {
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
      
      const courseData = {
        ...values,
        content,
        highlights,
        image_url: imageUrl,
      };
      
      console.log("Siunčiami kurso duomenys:", courseData);
      
      let response;
      
      if (id && id !== 'new') {
        // Update existing course
        response = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', id);
      } else {
        // Create new course
        response = await supabase
          .from('courses')
          .insert([courseData]);
      }
      
      if (response.error) throw response.error;
      
      toast({
        title: "Sėkmingai išsaugota",
        description: id ? "Kursas atnaujintas." : "Naujas kursas sukurtas.",
      });
      
      onSave();
    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: "Klaida",
        description: "Nepavyko išsaugoti kurso.",
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
          <CardTitle>Kurso redagavimas</CardTitle>
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
        <CardTitle>{id ? 'Redaguoti kursą' : 'Naujas kursas'}</CardTitle>
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
                        placeholder="Kurso pavadinimas" 
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
                      <Input placeholder="kurso-pavadinimas" {...field} />
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
                      placeholder="Trumpas kurso aprašymas" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kaina</FormLabel>
                    <FormControl>
                      <Input placeholder="€99.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trukmė</FormLabel>
                    <FormControl>
                      <Input placeholder="8 savaitės" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lygis</FormLabel>
                    <FormControl>
                      <Input placeholder="Pradedantysis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Kurso ypatybės</h3>
              <div className="space-y-2 mb-4">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center">
                    <span className="flex-grow">{highlight}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeHighlight(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Pridėti naują ypatybę..."
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addHighlight();
                    }
                  }}
                />
                <Button type="button" onClick={addHighlight}>
                  <Plus className="h-4 w-4 mr-1" /> Pridėti
                </Button>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Kurso turinys</h3>
              <RichTextEditor 
                value={content} 
                onChange={setContent} 
                placeholder="Įveskite kurso turinį..." 
              />
            </div>

            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Kurso viršelio nuotrauka</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormLabel>Įkelti naują nuotrauką</FormLabel>
                  <FileUpload
                    bucket="site-images"
                    folder="courses/covers"
                    acceptedFileTypes="image/jpeg,image/png,image/webp"
                    maxFileSizeMB={2}
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
                          alt="Kurso nuotrauka"
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

export default CourseEditor;
