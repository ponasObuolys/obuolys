import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  useHeroSectionForm,
  useHeroSections,
  useHeroSectionSubmit,
  useHeroSectionActions,
} from "./hero-section-editor.hooks";
import { HeroSectionForm } from "./hero-section-form";
import { HeroSectionList } from "./hero-section-list";
import type { HeroSection } from "./hero-section-editor.types";

const HeroSectionEditor = () => {
  const [editingSection, setEditingSection] = useState<HeroSection | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const form = useHeroSectionForm();
  const { heroSections, loading: sectionsLoading, fetchHeroSections } = useHeroSections();

  const handleSuccess = () => {
    setEditingSection(null);
    setIsEditing(false);
    form.reset({
      title: "",
      subtitle: "",
      button_text: "",
      button_url: "",
      image_url: "",
      active: false,
    });
  };

  const { loading: submitLoading, onSubmit } = useHeroSectionSubmit(
    editingSection,
    handleSuccess,
    fetchHeroSections
  );
  const {
    loading: actionsLoading,
    handleDelete,
    toggleActive,
  } = useHeroSectionActions(fetchHeroSections);

  const handleEdit = (section: HeroSection) => {
    setEditingSection(section);
    setIsEditing(true);
    form.reset({
      title: section.title,
      subtitle: section.subtitle,
      button_text: section.button_text,
      button_url: section.button_url,
      image_url: section.image_url || "",
      active: section.active,
    });
  };

  const loading = sectionsLoading || actionsLoading || submitLoading;

  if (sectionsLoading && heroSections.length === 0) {
    return <p className="text-center py-4">Kraunama...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Hero sekcijų valdymas</h2>
        <Button onClick={() => setIsEditing(true)} disabled={loading} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nauja hero sekcija
        </Button>
      </div>

      {isEditing && (
        <HeroSectionForm
          form={form}
          editingSection={editingSection}
          loading={loading}
          onSubmit={onSubmit}
          onCancel={handleSuccess}
        />
      )}

      <HeroSectionList
        heroSections={heroSections}
        loading={loading}
        onEdit={handleEdit}
        onToggleActive={toggleActive}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default HeroSectionEditor;
