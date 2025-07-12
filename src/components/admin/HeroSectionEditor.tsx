import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import FileUpload from './FileUpload';
import { Save, Plus, Eye, EyeOff } from 'lucide-react';

const heroSectionSchema = z.object({
  title: z.string().min(1, 'Pavadinimas yra privalomas'),
  subtitle: z.string().min(1, 'Paantraštė yra privaloma'),
  button_text: z.string().min(1, 'Mygtuko tekstas yra privalomas'),
  button_url: z.string().url('Nuoroda turi būti galiojanti URL'),
  image_url: z.string().optional(),
  active: z.boolean().default(false),
});

type HeroSectionFormData = z.infer<typeof heroSectionSchema>;

interface HeroSection extends HeroSectionFormData {
  id: string;
  created_at: string;
  updated_at: string;
}

const HeroSectionEditor = () => {
  const [heroSections, setHeroSections] = useState<HeroSection[]>([]);
  const [editingSection, setEditingSection] = useState<HeroSection | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<HeroSectionFormData>({
    resolver: zodResolver(heroSectionSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      button_text: '',
      button_url: '',
      image_url: '',
      active: false,
    },
  });

  const fetchHeroSections = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hero_sections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHeroSections(data || []);
    } catch (error) {
      console.error('Error fetching hero sections:', error);
      toast({
        title: 'Klaida',
        description: 'Nepavyko gauti hero sekcijų.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchHeroSections();
  }, [fetchHeroSections]);

  const onSubmit = async (data: HeroSectionFormData) => {
    try {
      setLoading(true);

      if (editingSection) {
        // Update existing section
        const { error } = await supabase
          .from('hero_sections')
          .update(data)
          .eq('id', editingSection.id);

        if (error) throw error;

        toast({
          title: 'Sėkmė',
          description: 'Hero sekcija sėkmingai atnaujinta.',
        });
      } else {
        // Create new section
        const { error } = await supabase
          .from('hero_sections')
          .insert([data]);

        if (error) throw error;

        toast({
          title: 'Sėkmė',
          description: 'Hero sekcija sėkmingai sukurta.',
        });
      }

      await fetchHeroSections();
      handleCancelEdit();
    } catch (error) {
      console.error('Error saving hero section:', error);
      toast({
        title: 'Klaida',
        description: 'Nepavyko išsaugoti hero sekcijos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section: HeroSection) => {
    setEditingSection(section);
    setIsEditing(true);
    form.reset({
      title: section.title,
      subtitle: section.subtitle,
      button_text: section.button_text,
      button_url: section.button_url,
      image_url: section.image_url || '',
      active: section.active,
    });
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setIsEditing(false);
    form.reset({
      title: '',
      subtitle: '',
      button_text: '',
      button_url: '',
      image_url: '',
      active: false,
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Ar tikrai norite ištrinti šią hero sekciją?')) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('hero_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Sėkmė',
        description: 'Hero sekcija sėkmingai ištrinta.',
      });

      await fetchHeroSections();
    } catch (error) {
      console.error('Error deleting hero section:', error);
      toast({
        title: 'Klaida',
        description: 'Nepavyko ištrinti hero sekcijos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (section: HeroSection) => {
    try {
      const { error } = await supabase
        .from('hero_sections')
        .update({ active: !section.active })
        .eq('id', section.id);

      if (error) throw error;

      toast({
        title: 'Sėkmė',
        description: `Hero sekcija ${!section.active ? 'aktyvuota' : 'deaktyvuota'}.`,
      });

      await fetchHeroSections();
    } catch (error) {
      console.error('Error toggling hero section:', error);
      toast({
        title: 'Klaida',
        description: 'Nepavyko pakeisti hero sekcijos būklės.',
        variant: 'destructive',
      });
    }
  };

  if (loading && heroSections.length === 0) {
    return <p className="text-center py-4">Kraunama...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hero sekcijų valdymas</h2>
        <Button onClick={() => setIsEditing(true)} disabled={loading}>
          <Plus className="h-4 w-4 mr-2" />
          Nauja hero sekcija
        </Button>
      </div>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingSection ? 'Redaguoti hero sekciją' : 'Sukurti naują hero sekciją'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pavadinimas</FormLabel>
                      <FormControl>
                        <Input placeholder="Įveskite pagrindinį pavadinimą" {...field} />
                      </FormControl>
                      <FormDescription>
                        Pagrindinis hero sekcijos pavadinimas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paantraštė</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Įveskite paantraštę" {...field} />
                      </FormControl>
                      <FormDescription>
                        Aprašomasis tekstas po pavadinimu
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="button_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mygtuko tekstas</FormLabel>
                        <FormControl>
                          <Input placeholder="Pav. 'Sužinoti daugiau'" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="button_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mygtuko nuoroda</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paveikslėlis</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <FileUpload
                            bucket="site-images"
                            folder="hero-sections"
                            onUploadComplete={(url) => {
                              field.onChange(url);
                              toast({
                                title: 'Sėkmė',
                                description: 'Paveikslėlis sėkmingai įkeltas.',
                              });
                            }}
                            acceptedFileTypes="image/jpeg, image/png, image/webp"
                            maxFileSizeMB={5}
                            buttonText="Įkelti paveikslėlį"
                          />
                          {field.value && (
                            <div className="mt-4">
                              <img
                                src={field.value}
                                alt="Hero sekcijos paveikslėlis"
                                className="w-full max-w-md h-48 object-cover rounded-lg border"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Rekomenduojamas dydis: 1200x600px
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Aktyvus</FormLabel>
                        <FormDescription>
                          Ar ši hero sekcija turi būti rodoma svetainėje
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex space-x-4">
                  <Button type="submit" disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Išsaugoma...' : 'Išsaugoti'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>
                    Atšaukti
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {heroSections.map((section) => (
          <Card key={section.id} className={!section.active ? 'opacity-60' : ''}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{section.title}</h3>
                    {section.active ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{section.subtitle}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Mygtukas: {section.button_text}</span>
                    <span>•</span>
                    <span>Nuoroda: {section.button_url}</span>
                  </div>
                  {section.image_url && (
                    <div className="mt-4">
                      <img
                        src={section.image_url}
                        alt="Hero sekcijos paveikslėlis"
                        className="w-full max-w-xs h-24 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(section)}
                    disabled={loading}
                  >
                    Redaguoti
                  </Button>
                  <Button
                    variant={section.active ? "secondary" : "default"}
                    size="sm"
                    onClick={() => toggleActive(section)}
                    disabled={loading}
                  >
                    {section.active ? 'Deaktyvuoti' : 'Aktyvuoti'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(section.id)}
                    disabled={loading}
                  >
                    Ištrinti
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {heroSections.length === 0 && !loading && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Hero sekcijų nėra. Sukurkite naują hero sekciją.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HeroSectionEditor;