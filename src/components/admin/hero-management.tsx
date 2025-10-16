import { useState } from 'react';
import { useHeroSections, useCreateHeroSection, useUpdateHeroSection, useDeleteHeroSection } from '@/hooks/use-cta';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { HeroSection } from '@/types/cta';

export function HeroManagement() {
  const { data: sections, isLoading } = useHeroSections();
  const createMutation = useCreateHeroSection();
  const updateMutation = useUpdateHeroSection();
  const deleteMutation = useDeleteHeroSection();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<HeroSection>>({
    title: '',
    subtitle: '',
    button_text: '',
    button_url: '',
    secondary_button_text: '',
    secondary_button_url: '',
    badge_text: '',
    image_url: '',
    priority: 100,
    show_stats: true,
    active: true,
  });

  const handleCreate = async () => {
    if (!formData.title || !formData.subtitle) return;
    
    await createMutation.mutateAsync(formData as Omit<HeroSection, 'id' | 'created_at' | 'updated_at'>);
    setIsCreating(false);
    resetForm();
  };

  const handleUpdate = async (id: string) => {
    await updateMutation.mutateAsync({ id, data: formData });
    setEditingId(null);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Ar tikrai norite ištrinti šią hero sekciją?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const startEdit = (section: HeroSection) => {
    setEditingId(section.id);
    setFormData(section);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      button_text: '',
      button_url: '',
      secondary_button_text: '',
      secondary_button_url: '',
      badge_text: '',
      image_url: '',
      priority: 100,
      show_stats: true,
      active: true,
    });
  };

  if (isLoading) {
    return <div className="p-6">Kraunama...</div>;
  }

  const FormFields = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Pavadinimas</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="AI naujienos, įrankiai ir sprendimai Lietuvoje"
        />
      </div>

      <div className="space-y-2">
        <Label>Paantraštė</Label>
        <Textarea
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          placeholder="Atraskite naujausias dirbtinio intelekto naujienas..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Badge tekstas (virš pavadinimo)</Label>
        <Input
          value={formData.badge_text || ''}
          onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
          placeholder="🚀 Naujausia AI informacija"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Pagrindinis mygtukas</Label>
          <Input
            value={formData.button_text || ''}
            onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
            placeholder="Naršyti naujienas"
          />
        </div>
        <div className="space-y-2">
          <Label>Pagrindinio mygtuko URL</Label>
          <Input
            value={formData.button_url || ''}
            onChange={(e) => setFormData({ ...formData, button_url: e.target.value })}
            placeholder="/publikacijos"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Antrinis mygtukas (optional)</Label>
          <Input
            value={formData.secondary_button_text || ''}
            onChange={(e) => setFormData({ ...formData, secondary_button_text: e.target.value })}
            placeholder="Verslo sprendimai"
          />
        </div>
        <div className="space-y-2">
          <Label>Antrinio mygtuko URL</Label>
          <Input
            value={formData.secondary_button_url || ''}
            onChange={(e) => setFormData({ ...formData, secondary_button_url: e.target.value })}
            placeholder="/verslo-sprendimai"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Paveiksliuko URL (optional)</Label>
        <Input
          value={formData.image_url || ''}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Prioritetas</Label>
          <Input
            type="number"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
          />
        </div>
        <div className="flex items-center space-x-2 md:pt-8">
          <Switch
            checked={formData.show_stats}
            onCheckedChange={(checked) => setFormData({ ...formData, show_stats: checked })}
          />
          <Label>Rodyti statistiką</Label>
        </div>
        <div className="flex items-center space-x-2 md:pt-8">
          <Switch
            checked={formData.active}
            onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
          />
          <Label>Aktyvi</Label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Hero sekcijų valdymas</h2>
          <p className="text-muted-foreground">Valdykite pagrindinio puslapio hero sekcijas</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Pridėti naują
        </Button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Nauja hero sekcija</CardTitle>
          </CardHeader>
          <CardContent>
            <FormFields />
            <div className="flex gap-2 mt-4">
              <Button onClick={handleCreate} className="gap-2">
                <Save className="h-4 w-4" />
                Išsaugoti
              </Button>
              <Button onClick={cancelEdit} variant="outline" className="gap-2">
                <X className="h-4 w-4" />
                Atšaukti
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <div className="grid gap-4">
        {sections?.map((section) => (
          <Card key={section.id}>
            <CardContent className="pt-6">
              {editingId === section.id ? (
                <div>
                  <FormFields />
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => handleUpdate(section.id)} className="gap-2">
                      <Save className="h-4 w-4" />
                      Išsaugoti
                    </Button>
                    <Button onClick={cancelEdit} variant="outline" className="gap-2">
                      <X className="h-4 w-4" />
                      Atšaukti
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {section.badge_text && (
                        <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                          {section.badge_text}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded ${section.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {section.active ? 'Aktyvi' : 'Neaktyvi'}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800">
                        Priority: {section.priority}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{section.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{section.subtitle}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>Mygtukas: {section.button_text}</span>
                      {section.secondary_button_text && (
                        <>
                          <span>•</span>
                          <span>Antrinis: {section.secondary_button_text}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>Stats: {section.show_stats ? 'Taip' : 'Ne'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={() => startEdit(section)} variant="outline" size="sm" className="gap-2">
                      <Pencil className="h-4 w-4" />
                      Redaguoti
                    </Button>
                    <Button onClick={() => handleDelete(section.id)} variant="destructive" size="sm" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Ištrinti
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {sections?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nėra hero sekcijų. Sukurkite naują!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
