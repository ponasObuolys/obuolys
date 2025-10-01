import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { PublicationFormData } from "../publication-editor.types";

interface MetadataFieldsProps {
  form: UseFormReturn<PublicationFormData>;
  categories: string[];
  setReadTimeManuallyEdited: (edited: boolean) => void;
}

export const MetadataFields = ({
  form,
  categories,
  setReadTimeManuallyEdited,
}: MetadataFieldsProps) => {
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FormField
        control={form.control}
        name="content_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Turinio Tipas</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Pasirinkite tipą" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Straipsnis">Straipsnis</SelectItem>
                <SelectItem value="Naujiena">Naujiena</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kategorija</FormLabel>
            <FormControl>
              <>
                <Select
                  value={isCustomCategory ? "custom" : field.value}
                  onValueChange={val => {
                    if (val === "custom") {
                      setIsCustomCategory(true);
                      setCustomCategory("");
                      form.setValue("category", "");
                    } else {
                      setIsCustomCategory(false);
                      form.setValue("category", val, { shouldValidate: true });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pasirinkite kategoriją" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">
                      <em>Įvesti naują...</em>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {isCustomCategory && (
                  <Input
                    className="mt-2"
                    placeholder="Nauja kategorija"
                    value={customCategory}
                    onChange={e => {
                      setCustomCategory(e.target.value);
                      form.setValue("category", e.target.value, { shouldValidate: true });
                    }}
                  />
                )}
              </>
            </FormControl>
            <FormDescription>
              Galite pasirinkti iš sąrašo arba sukurti naują kategoriją.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="read_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Skaitymo laikas</FormLabel>
            <FormControl>
              <Input
                placeholder="5 min"
                {...field}
                onChange={e => {
                  field.onChange(e);
                  setReadTimeManuallyEdited(true);
                }}
                onBlur={e => {
                  if (!e.target.value) setReadTimeManuallyEdited(false);
                }}
              />
            </FormControl>
            <FormDescription>
              Šis laukas pildomas automatiškai pagal teksto kiekį, bet galite jį pakeisti ranka.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
