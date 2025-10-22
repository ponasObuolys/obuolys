import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { PublicationFormData } from "../publication-editor.types";

interface PublicationCheckboxesProps {
  form: UseFormReturn<PublicationFormData>;
}

export const PublicationCheckboxes = ({ form }: PublicationCheckboxesProps) => {
  return (
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
              <FormDescription className="text-xs">Rodyti pagrindiniame puslapyje</FormDescription>
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
              <FormLabel className="text-sm font-medium">Publikuoti</FormLabel>
              <FormDescription className="text-xs">
                Ar ši publikacija matoma lankytojams?
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};
