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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoursePricingFields } from "./course-pricing-fields";
import { TestimonialsManager } from "../testimonials-manager";
import { FaqManager } from "../faq-manager";
import type { UseFormReturn } from "react-hook-form";
import type { CourseFormValues } from "./course-editor.types";

interface CourseFormFieldsProps {
  form: UseFormReturn<CourseFormValues>;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  courseId?: string | null;
}

export const CourseFormFields = ({ form, onTitleChange, courseId }: CourseFormFieldsProps) => {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Pagrindinė informacija</TabsTrigger>
        <TabsTrigger value="pricing">Kainų nustatymai</TabsTrigger>
        <TabsTrigger value="extra">Papildomi</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-6 mt-6">
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
                <FormLabel>Pagrindinė kaina (legacy)</FormLabel>
                <FormControl>
                  <Input placeholder="€99.99" {...field} />
                </FormControl>
                <FormDescription>Naudojama senajai sistemai</FormDescription>
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

        <div className="space-y-4">
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

          <FormField
            control={form.control}
            name="promote_in_popup"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 bg-primary/5">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium">
                    🎯 Rodyti popup reklamoje
                  </FormLabel>
                  <FormDescription className="text-xs">
                    Rodyti šį kursą reklaminiame popup lange pagrindiniame puslapyje. Tik vienas
                    kursas gali būti promoted vienu metu.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </TabsContent>

      <TabsContent value="pricing" className="space-y-6 mt-6">
        <CoursePricingFields form={form} />
      </TabsContent>

      <TabsContent value="extra" className="space-y-6 mt-6">
        {courseId ? (
          <>
            <TestimonialsManager courseId={courseId} />
            <div className="border-t pt-6">
              <FaqManager courseId={courseId} />
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Pirmiausia išsaugokite kursą, kad galėtumėte valdyti atsiliepimus ir FAQ.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
