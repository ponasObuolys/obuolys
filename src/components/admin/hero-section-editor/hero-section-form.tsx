import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "../FileUpload";
import type { UseFormReturn } from "react-hook-form";
import type { HeroSection, HeroSectionFormData } from "./hero-section-editor.types";

interface HeroSectionFormProps {
  form: UseFormReturn<HeroSectionFormData>;
  editingSection: HeroSection | null;
  loading: boolean;
  onSubmit: (data: HeroSectionFormData) => void;
  onCancel: () => void;
}

export const HeroSectionForm = ({
  form,
  editingSection,
  loading,
  onSubmit,
  onCancel,
}: HeroSectionFormProps) => {
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingSection ? "Redaguoti hero sekciją" : "Sukurti naują hero sekciją"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pavadinimas</FormLabel>
                  <FormControl>
                    <Input placeholder="Įveskite pagrindinį pavadinimą" {...field} />
                  </FormControl>
                  <FormDescription>Pagrindinis hero sekcijos pavadinimas</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paantraštė</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Įveskite paantraštę" {...field} />
                  </FormControl>
                  <FormDescription>Aprašomasis tekstas po pavadinimu</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aprašymas</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Įveskite detalų aprašymą" {...field} />
                  </FormControl>
                  <FormDescription>Išsamus hero sekcijos aprašymas</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="button_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mygtuko tekstas</FormLabel>
                    <FormControl>
                      <Input placeholder="Pav. 'Sužinoti daugiau'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="button_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mygtuko nuoroda</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paveikslėlis</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <FileUpload
                        bucket="site-images"
                        folder="hero-sections"
                        onUploadComplete={url => {
                          field.onChange(url);
                          toast({
                            title: "Sėkmė",
                            description: "Paveikslėlis sėkmingai įkeltas.",
                          });
                        }}
                        acceptedFileTypes="image/jpeg, image/png, image/webp"
                        maxFileSizeMB={5}
                        buttonText="Įkelti paveikslėlį"
                      />
                      {field.value && (
                        <div className="mt-4">
                          <img
                            src={field.value}
                            alt="Hero sekcijos paveikslėlis"
                            className="w-full max-w-md h-48 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>Rekomenduojamas dydis: 1200x600px</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Aktyvus</FormLabel>
                    <FormDescription>
                      Ar ši hero sekcija turi būti rodoma svetainėje
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Išsaugoma..." : "Išsaugoti"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Atšaukti
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
