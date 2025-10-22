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
import type { UseFormReturn } from "react-hook-form";
import type { CTASection, CTASectionFormData } from "./cta-section-editor.types";

interface CTASectionFormProps {
  form: UseFormReturn<CTASectionFormData>;
  editingSection: CTASection | null;
  loading: boolean;
  onSubmit: (data: CTASectionFormData) => void;
  onCancel: () => void;
}

export const CTASectionForm = ({
  form,
  editingSection,
  loading,
  onSubmit,
  onCancel,
}: CTASectionFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingSection ? "Redaguoti CTA sekciją" : "Sukurti naują CTA sekciją"}
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
                    <Input placeholder="Įveskite CTA pavadinimą" {...field} />
                  </FormControl>
                  <FormDescription>Pagrindinis CTA sekcijos pavadinimas</FormDescription>
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
                    <Textarea
                      placeholder="Įveskite CTA aprašymą"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Aprašomasis tekstas, kuris skatina veiksmus</FormDescription>
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
                      <Input placeholder="Pav. 'Pradėti dabar'" {...field} />
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
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Aktyvus</FormLabel>
                    <FormDescription>Ar ši CTA sekcija turi būti rodoma svetainėje</FormDescription>
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
