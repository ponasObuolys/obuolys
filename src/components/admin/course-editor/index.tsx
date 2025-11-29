import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import RichTextEditor from "../RichTextEditor";
import { CourseFormFields } from "./course-form-fields";
import { CourseHighlights } from "./course-highlights";
import { CourseImageUpload } from "./course-image-upload";
import {
  useCourseData,
  useCourseForm,
  useCourseSubmit,
  useHighlights,
  useTitleSlugSync,
} from "./course-editor.hooks";
import type { CourseEditorProps } from "./course-editor.types";

const CourseEditor = ({ id, onCancel, onSave }: CourseEditorProps) => {
  const form = useCourseForm();
  const { initialLoading, content, setContent, highlights, setHighlights, imageUrl, setImageUrl } =
    useCourseData(id, form);
  const { newHighlight, setNewHighlight, addHighlight, removeHighlight } = useHighlights(
    highlights,
    setHighlights
  );
  const { loading, onSubmit } = useCourseSubmit(id, content, highlights, onSave);
  const { onTitleChange } = useTitleSlugSync(form, id);

  if (initialLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kurso redagavimas</CardTitle>
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
        <CardTitle>{id ? "Redaguoti kursą" : "Naujas kursas"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CourseFormFields form={form} onTitleChange={onTitleChange} courseId={id} />

            <CourseHighlights
              highlights={highlights}
              newHighlight={newHighlight}
              setNewHighlight={setNewHighlight}
              addHighlight={addHighlight}
              removeHighlight={removeHighlight}
            />

            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Kurso turinys</h3>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Įveskite kurso turinį..."
              />
            </div>

            <CourseImageUpload form={form} imageUrl={imageUrl} setImageUrl={setImageUrl} />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Atšaukti
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saugoma..." : "Išsaugoti"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CourseEditor;
