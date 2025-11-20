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
  const currentSlug = form.watch("slug");
  const hasValidSlug = currentSlug && currentSlug.trim() !== "";

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
        {!hasValidSlug && (
          <p className="text-sm text-muted-foreground mb-2">
            ℹ️ Pirmiausia įveskite publikacijos pavadinimą, kad galėtumėte įkelti paveikslėlį
          </p>
        )}
        <FormControl>
          {hasValidSlug ? (
            <FileUpload
              bucket="site-images"
              folder={`articles/covers/${currentSlug}`}
              acceptedFileTypes="image/jpeg,image/png,image/webp"
              maxFileSizeMB={2}
              onUploadComplete={handleImageUpload}
            />
          ) : (
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
              <p className="text-muted-foreground">
                Įveskite publikacijos pavadinimą, kad aktyvuotumėte paveikslėlio įkėlimą
              </p>
            </div>
          )}
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
