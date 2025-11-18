import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { YouTubeFormFields } from "./youtube-form-fields";
import {
  useNameSlugSync,
  useYouTubeData,
  useYouTubeForm,
  useYouTubeSubmit,
} from "./youtube-editor.hooks";
import type { YouTubeEditorProps } from "./youtube-editor.types";

const YouTubeEditor = ({ id, onCancel, onSave }: YouTubeEditorProps) => {
  const form = useYouTubeForm();
  const { initialLoading, imageUrl, setImageUrl } = useYouTubeData(id, form);
  const { loading, onSubmit } = useYouTubeSubmit(id, onSave);
  const { onNameChange } = useNameSlugSync(form, id);

  if (initialLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Video įrašo redagavimas</CardTitle>
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
        <CardTitle>{id ? "Redaguoti video įrašą" : "Naujas video įrašas"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <YouTubeFormFields
              form={form}
              onNameChange={onNameChange}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
            />

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

export default YouTubeEditor;
