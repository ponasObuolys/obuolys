import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import { AuthorDateFields } from "./form-fields/author-date-fields";
import { BasicFields } from "./form-fields/basic-fields";
import { ContentImageFields } from "./form-fields/content-image-fields";
import { MetadataFields } from "./form-fields/metadata-fields";
import { PublicationCheckboxes } from "./form-fields/publication-checkboxes";
import type { PublicationFormData } from "./publication-editor.types";

interface PublicationEditorFormProps {
  form: UseFormReturn<PublicationFormData>;
  id: string | null;
  content: string;
  setContent: (content: string) => void;
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
  categories: string[];
  loading: boolean;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setReadTimeManuallyEdited: (edited: boolean) => void;
  onSubmit: (values: PublicationFormData) => void;
  onCancel: () => void;
}

export const PublicationEditorForm = ({
  form,
  id,
  content,
  setContent,
  imageUrl,
  setImageUrl,
  categories,
  loading,
  onTitleChange,
  setReadTimeManuallyEdited,
  onSubmit,
  onCancel,
}: PublicationEditorFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicFields form={form} onTitleChange={onTitleChange} />

        <MetadataFields
          form={form}
          categories={categories}
          setReadTimeManuallyEdited={setReadTimeManuallyEdited}
        />

        <AuthorDateFields form={form} />

        <ContentImageFields
          form={form}
          content={content}
          setContent={setContent}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
        />

        <PublicationCheckboxes form={form} />

        <CardFooter className="flex justify-end space-x-4 p-0 pt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Atšaukti
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Išsaugoma..." : id ? "Atnaujinti" : "Sukurti"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};
