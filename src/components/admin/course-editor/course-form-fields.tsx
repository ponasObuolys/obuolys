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
import { Textarea } from "@/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";
import type { CourseFormValues } from "./course-editor.types";

interface CourseFormFieldsProps {
  form: UseFormReturn<CourseFormValues>;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CourseFormFields = ({ form, onTitleChange }: CourseFormFieldsProps) => {
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
                <Input placeholder="Kurso pavadinimas" {...field} onChange={onTitleChange} />
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
                <Input placeholder="kurso-pavadinimas" {...field} />
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
              <Textarea
                placeholder="Trumpas kurso aprašymas"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kaina</FormLabel>
              <FormControl>
                <Input placeholder="€99.99" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trukmė</FormLabel>
              <FormControl>
                <Input placeholder="8 savaitės" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lygis</FormLabel>
              <FormControl>
                <Input placeholder="Pradedantysis" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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
    </>
  );
};
