import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicationEditorForm } from "./publication-editor-form";
import {
  useCategories,
  usePublicationData,
  usePublicationForm,
  usePublicationSubmit,
  useReadTimeCalculation,
  useTitleSlugSync,
} from "./publication-editor.hooks";
import type { PublicationEditorProps } from "./publication-editor.types";

const PublicationEditor = ({ id, onCancel, onSave }: PublicationEditorProps) => {
  const form = usePublicationForm();
  const { categories } = useCategories();
  const { initialLoading, content, setContent, imageUrl, setImageUrl } = usePublicationData(
    id,
    form
  );
  const { setReadTimeManuallyEdited } = useReadTimeCalculation(content, form);
  const { loading, onSubmit } = usePublicationSubmit(id, content, imageUrl, onSave);
  const { onTitleChange } = useTitleSlugSync(form, id);

  if (initialLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Publikacijos redagavimas</CardTitle>
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
        <CardTitle>{id ? "Redaguoti publikaciją" : "Nauja publikacija"}</CardTitle>
      </CardHeader>
      <CardContent>
        <PublicationEditorForm
          form={form}
          id={id}
          content={content}
          setContent={setContent}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          categories={categories}
          loading={loading}
          onTitleChange={onTitleChange}
          setReadTimeManuallyEdited={setReadTimeManuallyEdited}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </CardContent>
    </Card>
  );
};

export default PublicationEditor;
