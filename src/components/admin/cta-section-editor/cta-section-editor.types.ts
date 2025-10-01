import { z } from "zod";

export const ctaSectionSchema = z.object({
  title: z.string().min(1, "Pavadinimas yra privalomas"),
  description: z.string().min(1, "Aprašymas yra privalomas"),
  button_text: z.string().min(1, "Mygtuko tekstas yra privalomas"),
  button_url: z.string().url("Nuoroda turi būti galiojanti URL"),
  active: z.boolean().default(false),
});

export type CTASectionFormData = z.infer<typeof ctaSectionSchema>;

export interface CTASection extends CTASectionFormData {
  id: string;
  created_at: string;
  updated_at: string;
}
