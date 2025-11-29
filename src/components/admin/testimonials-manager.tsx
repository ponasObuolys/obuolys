import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminCourseTestimonials, type Testimonial } from "@/hooks/use-course-testimonials";
import { testimonialsService, type TestimonialInsert } from "@/services/testimonials.service";

interface TestimonialsManagerProps {
  courseId: string;
}

/**
 * Admin komponentas atsiliepimų valdymui
 * Leidžia kurti, redaguoti, trinti ir pertvarkyti atsiliepimus
 */
export function TestimonialsManager({ courseId }: TestimonialsManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: testimonials, isLoading } = useAdminCourseTestimonials(courseId);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTestimonial, setNewTestimonial] = useState<Partial<TestimonialInsert>>({
    name: "",
    content: "",
    is_active: true,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: TestimonialInsert) => testimonialsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-testimonials", courseId] });
      queryClient.invalidateQueries({ queryKey: ["course-testimonials", courseId] });
      setNewTestimonial({ name: "", content: "", is_active: true });
      toast({ title: "Sėkmė", description: "Atsiliepimas sukurtas" });
    },
    onError: () => {
      toast({ title: "Klaida", description: "Nepavyko sukurti atsiliepimo", variant: "destructive" });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Testimonial> }) =>
      testimonialsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-testimonials", courseId] });
      queryClient.invalidateQueries({ queryKey: ["course-testimonials", courseId] });
      setEditingId(null);
      toast({ title: "Sėkmė", description: "Atsiliepimas atnaujintas" });
    },
    onError: () => {
      toast({ title: "Klaida", description: "Nepavyko atnaujinti atsiliepimo", variant: "destructive" });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => testimonialsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-testimonials", courseId] });
      queryClient.invalidateQueries({ queryKey: ["course-testimonials", courseId] });
      toast({ title: "Sėkmė", description: "Atsiliepimas ištrintas" });
    },
    onError: () => {
      toast({ title: "Klaida", description: "Nepavyko ištrinti atsiliepimo", variant: "destructive" });
    },
  });

  const handleCreate = () => {
    if (!newTestimonial.name?.trim() || !newTestimonial.content?.trim()) {
      toast({ title: "Klaida", description: "Užpildykite visus laukus", variant: "destructive" });
      return;
    }

    const maxOrder = testimonials?.reduce((max, t) => Math.max(max, t.display_order), 0) || 0;

    createMutation.mutate({
      course_id: courseId,
      name: newTestimonial.name.trim(),
      content: newTestimonial.content.trim(),
      display_order: maxOrder + 1,
      is_active: newTestimonial.is_active ?? true,
    });
  };

  const handleUpdate = (testimonial: Testimonial) => {
    updateMutation.mutate({
      id: testimonial.id,
      data: {
        name: testimonial.name,
        content: testimonial.content,
        is_active: testimonial.is_active,
      },
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Ar tikrai norite ištrinti šį atsiliepimą?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Kraunama...</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Atsiliepimai</h3>

      {/* Esami atsiliepimai */}
      <div className="space-y-3">
        {testimonials?.map((testimonial) => (
          <Card key={testimonial.id} className={!testimonial.is_active ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-grab" />
                <div className="flex-1 space-y-3">
                  {editingId === testimonial.id ? (
                    <>
                      <Input
                        value={testimonial.name}
                        onChange={(e) => {
                          const updated = testimonials?.map((t) =>
                            t.id === testimonial.id ? { ...t, name: e.target.value } : t
                          );
                          queryClient.setQueryData(["admin-course-testimonials", courseId], updated);
                        }}
                        placeholder="Vardas"
                      />
                      <Textarea
                        value={testimonial.content}
                        onChange={(e) => {
                          const updated = testimonials?.map((t) =>
                            t.id === testimonial.id ? { ...t, content: e.target.value } : t
                          );
                          queryClient.setQueryData(["admin-course-testimonials", courseId], updated);
                        }}
                        placeholder="Atsiliepimo tekstas"
                        rows={3}
                      />
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={testimonial.is_active}
                            onCheckedChange={(checked) => {
                              const updated = testimonials?.map((t) =>
                                t.id === testimonial.id ? { ...t, is_active: checked } : t
                              );
                              queryClient.setQueryData(["admin-course-testimonials", courseId], updated);
                            }}
                          />
                          <Label>Aktyvus</Label>
                        </div>
                        <Button size="sm" onClick={() => handleUpdate(testimonial)}>
                          <Save className="h-4 w-4 mr-1" /> Išsaugoti
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          Atšaukti
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{testimonial.name}</span>
                        <div className="flex items-center gap-2">
                          {!testimonial.is_active && (
                            <span className="text-xs text-muted-foreground">Neaktyvus</span>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(testimonial.id)}>
                            Redaguoti
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => handleDelete(testimonial.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">"{testimonial.content}"</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Naujas atsiliepimas */}
      <Card className="border-dashed">
        <CardContent className="p-4 space-y-3">
          <h4 className="font-medium">Pridėti naują atsiliepimą</h4>
          <Input
            value={newTestimonial.name || ""}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
            placeholder="Dalyvio vardas (pvz. Jonas P.)"
          />
          <Textarea
            value={newTestimonial.content || ""}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
            placeholder="Atsiliepimo tekstas..."
            rows={3}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={newTestimonial.is_active ?? true}
                onCheckedChange={(checked) => setNewTestimonial({ ...newTestimonial, is_active: checked })}
              />
              <Label>Aktyvus</Label>
            </div>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              <Plus className="h-4 w-4 mr-1" /> Pridėti
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
