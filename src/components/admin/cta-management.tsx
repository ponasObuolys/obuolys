import { useState } from 'react';
import { useCTASections, useCreateCTASection, useUpdateCTASection, useDeleteCTASection } from '@/hooks/use-cta';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { CTASection, CTAContext, CTAVariant, CTAIcon } from '@/types/cta';

export function CTAManagement() {
  const { data: sections, isLoading } = useCTASections();
  const createMutation = useCreateCTASection();
  const updateMutation = useUpdateCTASection();
  const deleteMutation = useDeleteCTASection();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<CTASection>>({
    title: '',
    description: '',
    button_text: '',
    button_url: '/verslo-sprendimai',
    context: 'article',
    variant: 'default',
    icon: 'Target',
    priority: 50,
    active: true,
  });

  const contexts: CTAContext[] = ['article', 'tools', 'publications'];
  const variants: CTAVariant[] = ['default', 'compact', 'inline'];
  const icons: CTAIcon[] = ['Target', 'Rocket', 'Sparkles', 'Brain', 'Zap', 'TrendingUp'];

  const handleCreate = async () => {
    if (!formData.title || !formData.description || !formData.button_text) return;
    
    await createMutation.mutateAsync(formData as Omit<CTASection, 'id' | 'created_at' | 'updated_at'>);
    setIsCreating(false);
    resetForm();
  };

  const handleUpdate = async (id: string) => {
    await updateMutation.mutateAsync({ id, data: formData });
    setEditingId(null);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Ar tikrai norite ištrinti šią CTA sekciją?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const startEdit = (section: CTASection) => {
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
      description: '',
      button_text: '',
      button_url: '/verslo-sprendimai',
      context: 'article',
      variant: 'default',
      icon: 'Target',
      priority: 50,
      active: true,
    });
  };

  if (isLoading) {
    return <div className="p-6">Kraunama...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">CTA Sekcijų valdymas</h2>
          <p className="text-muted-foreground">Valdykite Call-to-Action sekcijas</p>
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
            <CardTitle>Nauja CTA sekcija</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pavadinimas</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Pvz: Norite AI sprendimo?"
                />
              </div>
              <div className="space-y-2">
                <Label>Mygtuko tekstas</Label>
                <Input
                  value={formData.button_text}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  placeholder="Pvz: Aptarti projektą"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Aprašymas</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Trumpas aprašymas..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Kontekstas</Label>
                <Select value={formData.context} onValueChange={(value: CTAContext) => setFormData({ ...formData, context: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contexts.map(ctx => (
                      <SelectItem key={ctx} value={ctx}>{ctx}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Variantas</Label>
                <Select value={formData.variant} onValueChange={(value: CTAVariant) => setFormData({ ...formData, variant: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {variants.map(v => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ikona</Label>
                <Select value={formData.icon} onValueChange={(value: CTAIcon) => setFormData({ ...formData, icon: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {icons.map(icon => (
                      <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prioritetas</Label>
                <Input
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <Label>Aktyvi</Label>
            </div>

            <div className="flex gap-2">
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
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Pavadinimas</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mygtuko tekstas</Label>
                      <Input
                        value={formData.button_text}
                        onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Aprašymas</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Kontekstas</Label>
                      <Select value={formData.context} onValueChange={(value: CTAContext) => setFormData({ ...formData, context: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {contexts.map(ctx => (
                            <SelectItem key={ctx} value={ctx}>{ctx}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Ikona</Label>
                      <Select value={formData.icon} onValueChange={(value: CTAIcon) => setFormData({ ...formData, icon: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {icons.map(icon => (
                            <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

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
                        checked={formData.active}
                        onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                      />
                      <Label>Aktyvi</Label>
                    </div>
                  </div>

                  <div className="flex gap-2">
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
                      <h3 className="font-semibold">{section.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${section.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {section.active ? 'Aktyvi' : 'Neaktyvi'}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                        {section.context}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800">
                        Priority: {section.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{section.description}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>Mygtukas: {section.button_text}</span>
                      <span>•</span>
                      <span>Ikona: {section.icon}</span>
                      <span>•</span>
                      <span>Variantas: {section.variant}</span>
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
            <p className="text-muted-foreground">Nėra CTA sekcijų. Sukurkite naują!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
