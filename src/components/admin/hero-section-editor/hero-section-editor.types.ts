import { z } from "zod";

export const heroSectionSchema = z.object({
  title: z.string().min(1, "Pavadinimas yra privalomas"),
  subtitle: z.string().min(1, "Paantraštė yra privaloma"),
  description: z.string().min(1, "Aprašymas yra privalomas"),
  button_text: z.string().min(1, "Mygtuko tekstas yra privalomas"),
  button_url: z.string().url("Nuoroda turi būti galiojanti URL"),
  image_url: z.string().optional(),
  active: z.boolean().default(false),
});

export type HeroSectionFormData = z.infer<typeof heroSectionSchema>;

export interface HeroSection extends HeroSectionFormData {
  id: string;
  created_at: string;
  updated_at: string;
}
