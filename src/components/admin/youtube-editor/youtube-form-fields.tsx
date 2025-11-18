import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LazyImage from "@/components/ui/lazy-image";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "../FileUpload";
import type { YouTubeFormData } from "./youtube-editor.types";

interface YouTubeFormFieldsProps {
  form: ReturnType<typeof import("react-hook-form").useForm<YouTubeFormData>>;
  onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
}

export const YouTubeFormFields = ({
  form,
  onNameChange,
  imageUrl,
  setImageUrl,
}: YouTubeFormFieldsProps) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pavadinimas</FormLabel>
              <FormControl>
                <Input placeholder="Video pavadinimas" {...field} onChange={onNameChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL identifikatorius (slug)</FormLabel>
              <FormControl>
                <Input placeholder="video-pavadinimas" {...field} />
              </FormControl>
              <FormDescription>Unikalus identifikatorius naudojamas URL adrese</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Aprašymas</FormLabel>
            <FormControl>
              <Textarea placeholder="Video aprašymas" className="min-h-[100px]" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>Nuoroda į YouTube video</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field: _field }) => (
            <FormItem>
              <FormLabel>Video nuotrauka</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <FileUpload
                    bucket="site-images"
                    folder="tools"
                    acceptedFileTypes="image/jpeg,image/png,image/webp"
                    maxFileSizeMB={2}
                    onUploadComplete={handleImageUpload}
                  />
                  {imageUrl && (
                    <div className="mt-2 space-y-2">
                      <div className="border rounded-md overflow-hidden aspect-video w-full max-w-md">
                        <LazyImage
                          src={imageUrl}
                          alt="Video nuotrauka"
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
                  )}
                </div>
              </FormControl>
              <FormDescription>Video nuotrauka (rekomenduojama)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kategorija</FormLabel>
            <FormControl>
              <Input placeholder="Video kategorija" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-medium">Rekomenduojamas</FormLabel>
                <FormDescription className="text-xs">
                  Rodomas pagrindiniame puslapyje
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-medium">Publikuotas</FormLabel>
                <FormDescription className="text-xs">Matomas viešai</FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </>
  );
};
