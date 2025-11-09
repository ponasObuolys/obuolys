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
});

export type CourseFormValues = z.infer<typeof courseSchema>;

export interface CourseEditorProps {
  id: string | null;
  onCancel: () => void;
  onSave: () => void;
}
