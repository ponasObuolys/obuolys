import { useState } from 'react';
import { useStickyMessages, useCreateStickyMessage, useUpdateStickyMessage, useDeleteStickyMessage } from '@/hooks/use-cta';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { StickyMessage } from '@/types/cta';

export function StickyMessagesManagement() {
  const { data: messages, isLoading } = useStickyMessages();
  const createMutation = useCreateStickyMessage();
  const updateMutation = useUpdateStickyMessage();
  const deleteMutation = useDeleteStickyMessage();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<StickyMessage>>({
    title: '',
    description: '',
    cta: '',
    emoji: '🚀',
    priority: 50,
    active: true,
  });

  const handleCreate = async () => {
    if (!formData.title || !formData.description || !formData.cta) return;
    
    await createMutation.mutateAsync(formData as Omit<StickyMessage, 'id' | 'created_at' | 'updated_at'>);
    setIsCreating(false);
    resetForm();
  };

  const handleUpdate = async (id: string) => {
    await updateMutation.mutateAsync({ id, data: formData });
    setEditingId(null);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Ar tikrai norite ištrinti šią sticky žinutę?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const startEdit = (message: StickyMessage) => {
    setEditingId(message.id);
    setFormData(message);
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
      cta: '',
      emoji: '🚀',
      priority: 50,
      active: true,
    });
  };

  if (isLoading) {
    return <div className="p-6">Kraunama...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sticky žinučių valdymas</h2>
          <p className="text-muted-foreground">Valdykite sticky sidebar žinutes</p>
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
            <CardTitle>Nauja sticky žinutė</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Pavadinimas</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Pvz: Greitas AI įrankis?"
                />
              </div>
              <div className="space-y-2">
                <Label>CTA tekstas</Label>
                <Input
                  value={formData.cta}
                  onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                  placeholder="Pvz: Užsakyti"
                />
              </div>
              <div className="space-y-2">
                <Label>Emoji</Label>
                <Input
                  value={formData.emoji}
                  onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                  placeholder="🚀"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Aprašymas</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Trumpas aprašymas..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prioritetas</Label>
                <Input
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label>Aktyvi</Label>
              </div>
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
        {messages?.map((message) => (
          <Card key={message.id}>
            <CardContent className="pt-6">
              {editingId === message.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Pavadinimas</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CTA tekstas</Label>
                      <Input
                        value={formData.cta}
                        onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Emoji</Label>
                      <Input
                        value={formData.emoji}
                        onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Aprašymas</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Prioritetas</Label>
                      <Input
                        type="number"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                      <Switch
                        checked={formData.active}
                        onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                      />
                      <Label>Aktyvi</Label>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdate(message.id)} className="gap-2">
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
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{message.emoji}</span>
                      <h3 className="font-semibold">{message.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${message.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {message.active ? 'Aktyvi' : 'Neaktyvi'}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800">
                        Priority: {message.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{message.description}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>CTA: {message.cta}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => startEdit(message)} variant="outline" size="sm" className="gap-2">
                      <Pencil className="h-4 w-4" />
                      Redaguoti
                    </Button>
                    <Button onClick={() => handleDelete(message.id)} variant="destructive" size="sm" className="gap-2">
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

      {messages?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nėra sticky žinučių. Sukurkite naują!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
