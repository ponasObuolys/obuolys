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
import { useAdminCourseFaq, type FAQ } from "@/hooks/use-course-faq";
import { faqService, type FAQInsert } from "@/services/faq.service";

interface FaqManagerProps {
  courseId: string;
}

/**
 * Admin komponentas FAQ valdymui
 * Leidžia kurti, redaguoti, trinti ir pertvarkyti FAQ
 */
export function FaqManager({ courseId }: FaqManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: faqItems, isLoading } = useAdminCourseFaq(courseId);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newFaq, setNewFaq] = useState<Partial<FAQInsert>>({
    question: "",
    answer: "",
    is_active: true,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: FAQInsert) => faqService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-faq", courseId] });
      queryClient.invalidateQueries({ queryKey: ["course-faq", courseId] });
      setNewFaq({ question: "", answer: "", is_active: true });
      toast({ title: "Sėkmė", description: "FAQ sukurtas" });
    },
    onError: () => {
      toast({ title: "Klaida", description: "Nepavyko sukurti FAQ", variant: "destructive" });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FAQ> }) =>
      faqService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-faq", courseId] });
      queryClient.invalidateQueries({ queryKey: ["course-faq", courseId] });
      setEditingId(null);
      toast({ title: "Sėkmė", description: "FAQ atnaujintas" });
    },
    onError: () => {
      toast({ title: "Klaida", description: "Nepavyko atnaujinti FAQ", variant: "destructive" });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => faqService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-faq", courseId] });
      queryClient.invalidateQueries({ queryKey: ["course-faq", courseId] });
      toast({ title: "Sėkmė", description: "FAQ ištrintas" });
    },
    onError: () => {
      toast({ title: "Klaida", description: "Nepavyko ištrinti FAQ", variant: "destructive" });
    },
  });

  const handleCreate = () => {
    if (!newFaq.question?.trim() || !newFaq.answer?.trim()) {
      toast({ title: "Klaida", description: "Užpildykite visus laukus", variant: "destructive" });
      return;
    }

    const maxOrder = faqItems?.reduce((max, f) => Math.max(max, f.display_order), 0) || 0;

    createMutation.mutate({
      course_id: courseId,
      question: newFaq.question.trim(),
      answer: newFaq.answer.trim(),
      display_order: maxOrder + 1,
      is_active: newFaq.is_active ?? true,
    });
  };

  const handleUpdate = (faq: FAQ) => {
    updateMutation.mutate({
      id: faq.id,
      data: {
        question: faq.question,
        answer: faq.answer,
        is_active: faq.is_active,
      },
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Ar tikrai norite ištrinti šį FAQ?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Kraunama...</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Dažniausiai užduodami klausimai (FAQ)</h3>

      {/* Esami FAQ */}
      <div className="space-y-3">
        {faqItems?.map((faq) => (
          <Card key={faq.id} className={!faq.is_active ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-grab" />
                <div className="flex-1 space-y-3">
                  {editingId === faq.id ? (
                    <>
                      <Input
                        value={faq.question}
                        onChange={(e) => {
                          const updated = faqItems?.map((f) =>
                            f.id === faq.id ? { ...f, question: e.target.value } : f
                          );
                          queryClient.setQueryData(["admin-course-faq", courseId], updated);
                        }}
                        placeholder="Klausimas"
                      />
                      <Textarea
                        value={faq.answer}
                        onChange={(e) => {
                          const updated = faqItems?.map((f) =>
                            f.id === faq.id ? { ...f, answer: e.target.value } : f
                          );
                          queryClient.setQueryData(["admin-course-faq", courseId], updated);
                        }}
                        placeholder="Atsakymas"
                        rows={3}
                      />
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={faq.is_active}
                            onCheckedChange={(checked) => {
                              const updated = faqItems?.map((f) =>
                                f.id === faq.id ? { ...f, is_active: checked } : f
                              );
                              queryClient.setQueryData(["admin-course-faq", courseId], updated);
                            }}
                          />
                          <Label>Aktyvus</Label>
                        </div>
                        <Button size="sm" onClick={() => handleUpdate(faq)}>
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
                        <span className="font-medium">{faq.question}</span>
                        <div className="flex items-center gap-2">
                          {!faq.is_active && (
                            <span className="text-xs text-muted-foreground">Neaktyvus</span>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(faq.id)}>
                            Redaguoti
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => handleDelete(faq.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Naujas FAQ */}
      <Card className="border-dashed">
        <CardContent className="p-4 space-y-3">
          <h4 className="font-medium">Pridėti naują FAQ</h4>
          <Input
            value={newFaq.question || ""}
            onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
            placeholder="Klausimas"
          />
          <Textarea
            value={newFaq.answer || ""}
            onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
            placeholder="Atsakymas"
            rows={3}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={newFaq.is_active ?? true}
                onCheckedChange={(checked) => setNewFaq({ ...newFaq, is_active: checked })}
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
