import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(1, { message: "Pavadinimas yra privalomas" }),
  slug: z
    .string()
    .min(1, { message: "URL identifikatorius yra privalomas" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Netinkamas URL formato pavyzdys: naudoja-mazasias-raides-ir-bruksnelius",
    }),
  description: z.string().min(1, { message: "Aprašymas yra privalomas" }),
  price: z.string().min(1, { message: "Kaina yra privaloma" }),
  duration: z.string().min(1, { message: "Trukmė yra privaloma" }),
  level: z.string().min(1, { message: "Lygis yra privalomas" }),
  published: z.boolean().optional(),
  promote_in_popup: z.boolean().optional(),
  image_url: z
    .string()
    .url({ message: "Netinkamas paveikslėlio URL formatas" })
    .nullable()
    .or(z.literal("")),

  // Kainų informacija
  regular_price: z.string().optional(),
  discount_price: z.string().optional(),
  next_price: z.string().optional(),
  next_price_date: z.string().optional(),

  // Vertės skaičiavimas
  value_items: z.array(z.object({
    title: z.string().min(1, { message: "Pavadinimas yra privalomas" }),
    value: z.string().min(1, { message: "Vertė yra privaloma" })
  })).optional(),
  total_value: z.string().optional(),

  // Stripe integracija
  stripe_product_id: z.string().optional(),
  stripe_price_id: z.string().optional(),

  // Countdown
  countdown_enabled: z.boolean().optional(),
  countdown_end_date: z.string().optional(),
  countdown_text: z.string().optional(),

  // Vietų skaičiavimas
  max_spots: z.coerce.number().min(0).optional().nullable(),
  course_start_date: z.string().optional().nullable(),

  // PDF gidai
  pdf_guides: z.array(z.object({
    title: z.string().min(1, { message: "Pavadinimas yra privalomas" }),
    description: z.string().optional()
  })).optional(),

  // CTA mygtukas
  cta_button_text: z.string().optional().nullable(),
});

export type CourseFormValues = z.infer<typeof courseSchema>;

export interface CourseEditorProps {
  id: string | null;
  onCancel: () => void;
  onSave: () => void;
}
