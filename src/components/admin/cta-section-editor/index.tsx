import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  useCTASectionForm,
  useCTASections,
  useCTASectionSubmit,
  useCTASectionActions,
} from "./cta-section-editor.hooks";
import { CTASectionForm } from "./cta-section-form";
import { CTASectionList } from "./cta-section-list";
import type { CTASection } from "./cta-section-editor.types";

const CTASectionEditor = () => {
  const [editingSection, setEditingSection] = useState<CTASection | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const form = useCTASectionForm();
  const { ctaSections, loading: sectionsLoading, fetchCTASections } = useCTASections();

  const handleSuccess = () => {
    setEditingSection(null);
    setIsEditing(false);
    form.reset({
      title: "",
      description: "",
      button_text: "",
      button_url: "",
      active: false,
    });
  };

  const { loading: submitLoading, onSubmit } = useCTASectionSubmit(
    editingSection,
    handleSuccess,
    fetchCTASections
  );
  const {
    loading: actionsLoading,
    handleDelete,
    toggleActive,
  } = useCTASectionActions(fetchCTASections);

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

  const loading = sectionsLoading || actionsLoading || submitLoading;

  if (sectionsLoading && ctaSections.length === 0) {
    return <p className="text-center py-4">Kraunama...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold">CTA sekcijų valdymas</h2>
        <Button onClick={() => setIsEditing(true)} disabled={loading} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nauja CTA sekcija
        </Button>
      </div>

      {isEditing && (
        <CTASectionForm
          form={form}
          editingSection={editingSection}
          loading={loading}
          onSubmit={onSubmit}
          onCancel={handleSuccess}
        />
      )}

      <CTASectionList
        ctaSections={ctaSections}
        loading={loading}
        onEdit={handleEdit}
        onToggleActive={toggleActive}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CTASectionEditor;
