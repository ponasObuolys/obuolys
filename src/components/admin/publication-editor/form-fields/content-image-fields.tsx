import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import LazyImage from "@/components/ui/lazy-image";
import type { UseFormReturn } from "react-hook-form";
import FileUpload from "../../FileUpload";
import RichTextEditor from "../../RichTextEditor";
import type { PublicationFormData } from "../publication-editor.types";

interface ContentImageFieldsProps {
  form: UseFormReturn<PublicationFormData>;
  content: string;
  setContent: (content: string) => void;
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
}

export const ContentImageFields = ({
  form,
  content,
  setContent,
  imageUrl,
  setImageUrl,
}: ContentImageFieldsProps) => {
  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    if (url) {
      form.setValue("image_url", url, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  return (
    <>
      <FormItem>
        <FormLabel>Turinys</FormLabel>
        <FormControl>
          <RichTextEditor value={content} onChange={setContent} />
        </FormControl>
      </FormItem>

      <FormItem>
        <FormLabel>Pagrindinis paveikslėlis</FormLabel>
        <FormControl>
          <FileUpload
            bucket="site-images"
            folder={`articles/covers/${form.getValues("slug") || "new-publication"}`}
            acceptedFileTypes="image/jpeg,image/png,image/webp"
            maxFileSizeMB={2}
            onUploadComplete={handleImageUpload}
          />
        </FormControl>
        {imageUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Esamas paveikslėlis:</p>
            <LazyImage src={imageUrl} alt="Esamas paveikslėlis" className="max-w-xs rounded-md" />
          </div>
        )}
        <FormMessage>{form.formState.errors.image_url?.message}</FormMessage>
      </FormItem>
    </>
  );
};
