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

interface BasicFieldsProps {
  form: UseFormReturn<PublicationFormData>;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BasicFields = ({ form, onTitleChange }: BasicFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pavadinimas</FormLabel>
              <FormControl>
                <Input placeholder="Publikacijos pavadinimas" {...field} onChange={onTitleChange} />
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
                <Input placeholder="publikacijos-pavadinimas" {...field} />
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
              <Input placeholder="Trumpas publikacijos aprašymas" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
