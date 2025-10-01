import { Button } from "@/components/ui/button";
import { FormDescription, FormLabel } from "@/components/ui/form";
import LazyImage from "@/components/ui/lazy-image";
import { log } from "@/utils/browserLogger";
import type { UseFormReturn } from "react-hook-form";
import FileUpload from "../FileUpload";
import type { CourseFormValues } from "./course-editor.types";

interface CourseImageUploadProps {
  form: UseFormReturn<CourseFormValues>;
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
}

export const CourseImageUpload = ({ form, imageUrl, setImageUrl }: CourseImageUploadProps) => {
  const handleImageUpload = (url: string) => {
    log.info("CourseEditor handleImageUpload gavo URL:", { url });
    setImageUrl(url);

    if (url) {
      form.setValue("image_url", url, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      log.debug("Nustatytas image_url formoje", { image_url: form.getValues("image_url") });
    }
  };

  return (
    <div className="border rounded-md p-4">
      <h3 className="text-lg font-medium mb-4">Kurso viršelio nuotrauka</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormLabel>Įkelti naują nuotrauką</FormLabel>
          <FileUpload
            bucket="site-images"
            folder="courses/covers"
            acceptedFileTypes="image/jpeg,image/png,image/webp"
            maxFileSizeMB={2}
            onUploadComplete={handleImageUpload}
          />
          <FormDescription>
            Rekomenduojamas dydis: 1200 x 800 pikselių. Maksimalus dydis: 2MB
          </FormDescription>
        </div>
        <div>
          {imageUrl ? (
            <div className="space-y-2">
              <FormLabel>Esama nuotrauka</FormLabel>
              <div className="border rounded-md overflow-hidden aspect-video">
                <LazyImage
                  src={imageUrl}
                  alt="Kurso nuotrauka"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setImageUrl(null);
                  form.setValue("image_url", "");
                }}
              >
                Pašalinti nuotrauką
              </Button>
            </div>
          ) : (
            <div className="border rounded-md p-4 h-full flex items-center justify-center bg-muted">
              <p className="text-muted-foreground text-center">Nuotrauka nepasirinkta</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
