import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ToolFormFields } from "./tool-form-fields";
import {
  useNameSlugSync,
  useToolData,
  useToolForm,
  useToolSubmit,
} from "./tool-editor.hooks";
import type { ToolEditorProps } from "./tool-editor.types";

const ToolEditor = ({ id, onCancel, onSave }: ToolEditorProps) => {
  const form = useToolForm();
  const { initialLoading, imageUrl, setImageUrl } = useToolData(id, form);
  const { loading, onSubmit } = useToolSubmit(id, onSave);
  const { onNameChange } = useNameSlugSync(form, id);

  if (initialLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Įrankio redagavimas</CardTitle>
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
        <CardTitle>{id ? "Redaguoti įrankį" : "Naujas įrankis"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ToolFormFields
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

export default ToolEditor;
