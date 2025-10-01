import { z } from "zod";

export const publicationSchema = z.object({
  title: z.string().min(1, { message: "Pavadinimas yra privalomas" }),
  slug: z
    .string()
    .min(1, { message: "URL identifikatorius yra privalomas" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Netinkamas URL formato pavyzdys: naudoja-mazasias-raides-ir-bruksnelius",
    }),
  description: z.string().min(1, { message: "Aprašymas yra privalomas" }),
  category: z.string().min(1, { message: "Kategorija yra privaloma" }),
  read_time: z.string().min(1, { message: "Skaitymo laikas yra privalomas" }),
  author: z.string().min(1, { message: "Autorius yra privalomas" }),
  date: z.string().min(1, { message: "Data yra privaloma" }),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  image_url: z
    .string()
    .url({ message: "Netinkamas paveikslėlio URL formatas" })
    .nullable()
    .or(z.literal("")),
  content_type: z.enum(["Straipsnis", "Naujiena"], {
    required_error: "Turinio tipas yra privalomas",
    invalid_type_error: "Netinkamas turinio tipas",
  }),
});

export type PublicationFormData = z.infer<typeof publicationSchema>;

export interface PublicationEditorProps {
  id: string | null;
  onCancel: () => void;
  onSave: () => void;
}
