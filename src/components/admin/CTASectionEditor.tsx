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
import { Save, Plus, Eye, EyeOff } from 'lucide-react';
import type { TablesInsert } from '@/integrations/supabase/types';
import { log } from '@/utils/browserLogger';

const ctaSectionSchema = z.object({
  title: z.string().min(1, 'Pavadinimas yra privalomas'),
  description: z.string().min(1, 'Aprašymas yra privalomas'),
  button_text: z.string().min(1, 'Mygtuko tekstas yra privalomas'),
  button_url: z.string().url('Nuoroda turi būti galiojanti URL'),
  active: z.boolean().default(false),
});

type CTASectionFormData = z.infer<typeof ctaSectionSchema>;

interface CTASection extends CTASectionFormData {
  id: string;
  created_at: string;
  updated_at: string;
}

const CTASectionEditor = () => {
  const [ctaSections, setCTASections] = useState<CTASection[]>([]);
  const [editingSection, setEditingSection] = useState<CTASection | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CTASectionFormData>({
    resolver: zodResolver(ctaSectionSchema),
    defaultValues: {
      title: '',
      description: '',
      button_text: '',
      button_url: '',
      active: false,
    },
  });

  const fetchCTASections = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cta_sections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCTASections(data || []);
    } catch (error) {
      log.error('Error fetching CTA sections:', error);
      toast({
        title: 'Klaida',
        description: 'Nepavyko gauti CTA sekcijų.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCTASections();
  }, [fetchCTASections]);

  const onSubmit = async (data: CTASectionFormData) => {
    try {
      setLoading(true);

      if (editingSection) {
        // Update existing section
        const { error } = await supabase
          .from('cta_sections')
          .update(data)
          .eq('id', editingSection.id);

        if (error) throw error;

        toast({
          title: 'Sėkmė',
          description: 'CTA sekcija sėkmingai atnaujinta.',
        });
      } else {
        // Create new section
        const payload: TablesInsert<'cta_sections'> = {
          title: data.title,
          description: data.description,
          button_text: data.button_text,
          button_url: data.button_url,
          active: data.active,
        };

        const { error } = await supabase
          .from('cta_sections')
          .insert(payload);

        if (error) throw error;

        toast({
          title: 'Sėkmė',
          description: 'CTA sekcija sėkmingai sukurta.',
        });
      }

      await fetchCTASections();
      handleCancelEdit();
    } catch (error) {
      log.error('Error saving CTA section:', error);
      toast({
        title: 'Klaida',
        description: 'Nepavyko išsaugoti CTA sekcijos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section: CTASection) => {
    setEditingSection(section);
    setIsEditing(true);
    form.reset({
      title: section.title,
      description: section.description,
      button_text: section.button_text,
      button_url: section.button_url,
      active: section.active,
    });
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setIsEditing(false);
    form.reset({
      title: '',
      description: '',
      button_text: '',
      button_url: '',
      active: false,
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Ar tikrai norite ištrinti šią CTA sekciją?')) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('cta_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Sėkmė',
        description: 'CTA sekcija sėkmingai ištrinta.',
      });

      await fetchCTASections();
    } catch (error) {
      log.error('Error deleting CTA section:', error);
      toast({
        title: 'Klaida',
        description: `Nepavyko ištrinti CTA sekcijos: ${error instanceof Error ? error.message : typeof error === 'string' ? error : 'nežinoma klaida'}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (section: CTASection) => {
    try {
      const { error } = await supabase
        .from('cta_sections')
        .update({ active: !section.active })
        .eq('id', section.id);

      if (error) throw error;

      toast({
        title: 'Sėkmė',
        description: `CTA sekcija ${!section.active ? 'aktyvuota' : 'deaktyvuota'}.`,
      });

      await fetchCTASections();
    } catch (error) {
      log.error('Error toggling CTA section:', error);
      toast({
        title: 'Klaida',
        description: 'Nepavyko pakeisti CTA sekcijos būklės.',
        variant: 'destructive',
      });
    }
  };

  if (loading && ctaSections.length === 0) {
    return <p className="text-center py-4">Kraunama...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">CTA sekcijų valdymas</h2>
        <Button onClick={() => setIsEditing(true)} disabled={loading}>
          <Plus className="h-4 w-4 mr-2" />
          Nauja CTA sekcija
        </Button>
      </div>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingSection ? 'Redaguoti CTA sekciją' : 'Sukurti naują CTA sekciją'}
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
                        <Input placeholder="Įveskite CTA pavadinimą" {...field} />
                      </FormControl>
                      <FormDescription>
                        Pagrindinis CTA sekcijos pavadinimas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aprašymas</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Įveskite CTA aprašymą" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Aprašomasis tekstas, kuris skatina veiksmus
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
                          <Input placeholder="Pav. 'Pradėti dabar'" {...field} />
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
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Aktyvus</FormLabel>
                        <FormDescription>
                          Ar ši CTA sekcija turi būti rodoma svetainėje
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
        {ctaSections.map((section) => (
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
                  <p className="text-gray-600 mb-3">{section.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Mygtukas: {section.button_text}</span>
                    <span>•</span>
                    <span>Nuoroda: {section.button_url}</span>
                  </div>
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

        {ctaSections.length === 0 && !loading && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">CTA sekcijų nėra. Sukurkite naują CTA sekciją.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CTASectionEditor;