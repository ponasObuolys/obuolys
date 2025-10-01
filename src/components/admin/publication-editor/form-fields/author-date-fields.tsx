import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { PublicationFormData } from "../publication-editor.types";

interface AuthorDateFieldsProps {
  form: UseFormReturn<PublicationFormData>;
}

export const AuthorDateFields = ({ form }: AuthorDateFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="author"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Autorius</FormLabel>
            <FormControl>
              <Input placeholder="ponas Obuolys" {...field} />
            </FormControl>
            <FormDescription>
              Pagal nutylėjimą: ponas Obuolys. Galite įrašyti kitą autorių.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
