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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Euro, Calendar, TrendingUp } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { CourseFormValues } from "./course-editor.types";

interface CoursePricingFieldsProps {
  form: UseFormReturn<CourseFormValues>;
}

export const CoursePricingFields = ({ form }: CoursePricingFieldsProps) => {
  const valueItems = form.watch("value_items") || [];

  const addValueItem = () => {
    const currentItems = form.getValues("value_items") || [];
    form.setValue("value_items", [...currentItems, { title: "", value: "" }]);
  };

  const removeValueItem = (index: number) => {
    const currentItems = form.getValues("value_items") || [];
    form.setValue("value_items", currentItems.filter((_, i) => i !== index));
  };

  const calculateTotalValue = () => {
    const items = valueItems || [];
    const total = items.reduce((sum, item) => {
      const value = parseInt(item.value?.replace(/[^\d]/g, '') || '0');
      return sum + value;
    }, 0);
    form.setValue("total_value", `${total}€`);
  };

  return (
    <div className="space-y-8">
      {/* Pagrindinė kainų informacija */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5" />
            Kainų informacija
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="regular_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reguliari kaina</FormLabel>
                  <FormControl>
                    <Input placeholder="€197.00" {...field} />
                  </FormControl>
                  <FormDescription>Įprastinė kurso kaina</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Akcijos kaina</FormLabel>
                  <FormControl>
                    <Input placeholder="€97.00" {...field} />
                  </FormControl>
                  <FormDescription>Dabartinė akcijos kaina</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="next_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kita kaina</FormLabel>
                  <FormControl>
                    <Input placeholder="€117.00" {...field} />
                  </FormControl>
                  <FormDescription>Kaina po akcijos pabaigos</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="next_price_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kainos kėlimo data</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormDescription>Kada kaina kils</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Vertės skaičiavimas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Vertės skaičiavimas
            <Badge variant="secondary" className="ml-2">
              "Ką gaunate" sekcija
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {valueItems.map((_item, index) => (
              <div key={index} className="flex gap-4 p-4 border rounded-lg bg-muted/30">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`value_items.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pavadinimas</FormLabel>
                        <FormControl>
                          <Input placeholder="14 val. praktinių mokymų" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`value_items.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vertė</FormLabel>
                        <FormControl>
                          <Input placeholder="500€" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeValueItem(index)}
                  className="mt-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={addValueItem}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Pridėti vertės elementą
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={calculateTotalValue}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Apskaičiuoti bendrą vertę
            </Button>
          </div>

          <Separator />

          <FormField
            control={form.control}
            name="total_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bendra vertė</FormLabel>
                <FormControl>
                  <Input placeholder="900€" {...field} />
                </FormControl>
                <FormDescription>
                  Automatiškai apskaičiuojama arba nurodykite rankiniu būdu
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Stripe integracija */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💳 Stripe integracija
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="stripe_product_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stripe Product ID</FormLabel>
                  <FormControl>
                    <Input placeholder="prod_xxxxx" {...field} />
                  </FormControl>
                  <FormDescription>Stripe produkto identifikatorius</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stripe_price_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stripe Price ID</FormLabel>
                  <FormControl>
                    <Input placeholder="price_xxxxx" {...field} />
                  </FormControl>
                  <FormDescription>Stripe kainos identifikatorius</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Countdown nustatymai */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Countdown nustatymai
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="countdown_enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium">
                    ⏰ Įjungti countdown'ą
                  </FormLabel>
                  <FormDescription className="text-xs">
                    Rodyti countdown'ą iki kainos pakilimo
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {form.watch("countdown_enabled") && (
            <div className="space-y-4 border-l-4 border-primary/20 pl-4">
              <FormField
                control={form.control}
                name="countdown_end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Countdown pabaigos data</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription>Kada baigiasi countdown'as</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="countdown_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Countdown tekstas</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Dabartinė kaina galioja iki..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Tekstas rodomas su countdown'u</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};