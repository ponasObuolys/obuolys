import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const inquirySchema = z.object({
  full_name: z.string().min(2, "Vardas turi būti bent 2 simbolių"),
  email: z.string().email("Neteisingas el. pašto adresas"),
  phone: z.string().optional(),
  company_name: z.string().optional(),
  company_size: z.enum(["small", "medium", "large", "enterprise"]).optional(),
  project_type: z.enum([
    "crm",
    "logistics",
    "automation",
    "analytics",
    "scheduling",
    "accounting",
    "other",
  ]),
  budget_range: z.enum(["under_5k", "5k_12k", "12k_25k", "over_25k", "not_sure"]).optional(),
  timeline: z.enum(["urgent", "1_2_months", "2_3_months", "flexible"]).optional(),
  description: z.string().min(20, "Aprašymas turi būti bent 20 simbolių"),
  current_solution: z.string().optional(),
  gdpr_consent: z.boolean().refine(val => val === true, {
    message: "Privalote sutikti su privatumo politika",
  }),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
  onClose: () => void;
}

const InquiryForm = ({ onClose }: InquiryFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
  });

  const gdprConsent = watch("gdpr_consent");

  const onSubmit = async (data: InquiryFormData) => {
    try {
      // Insert inquiry into database
      const { error: insertError } = await supabase.from("custom_tool_inquiries").insert([
        {
          ...data,
          source: "website",
          ip_address: null, // Could be captured if needed
          user_agent: navigator.userAgent,
        },
      ]);

      if (insertError) throw insertError;

      // Send email notification
      try {
        await fetch("/api/send-inquiry-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } catch {
        // Don't fail the whole submission if email fails
      }

      setIsSubmitted(true);
    } catch {
      toast({
        title: "Klaida",
        description:
          "Nepavyko išsiųsti užklausos. Bandykite dar kartą arba susisiekite tiesiogiai el. paštu: labas@ponasobuolys.lt",
        variant: "destructive",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-background border border-border rounded-lg p-8 max-w-md w-full shadow-xl">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-foreground">Užklausa Gauta!</h3>
            <p className="text-foreground/80 mb-6">
              Ačiū už jūsų užklausą. Susisieksiu su jumis per 24 valandas darbo dienomis.
              Pasitikrinkite savo el. paštą - išsiuntęs patvirtinimo laišką.
            </p>
            <ShinyButton onClick={onClose} className="w-full">
              Uždaryti
            </ShinyButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-background border border-border rounded-lg p-6 md:p-8 max-w-3xl w-full my-8 shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground">Nemokama Konsultacija</h3>
            <p className="text-foreground/70 mt-1">
              Užpildykite formą ir per 24 val susisieksiu su jumis
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-bold text-foreground">Kontaktinė informacija</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Vardas Pavardė *</Label>
                <Input
                  id="full_name"
                  {...register("full_name")}
                  placeholder="Jonas Jonaitis"
                  className={errors.full_name ? "border-red-500" : ""}
                />
                {errors.full_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">El. paštas *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="jonas@imone.lt"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Telefonas</Label>
                <Input id="phone" {...register("phone")} placeholder="+370 600 00000" />
              </div>

              <div>
                <Label htmlFor="company_name">Įmonės pavadinimas</Label>
                <Input id="company_name" {...register("company_name")} placeholder="UAB Pavyzdys" />
              </div>
            </div>

            <div>
              <Label htmlFor="company_size">Įmonės dydis</Label>
              <Select
                onValueChange={value =>
                  setValue("company_size", value as "small" | "medium" | "large" | "enterprise")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pasirinkite..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Iki 10 darbuotojų</SelectItem>
                  <SelectItem value="medium">10-50 darbuotojų</SelectItem>
                  <SelectItem value="large">50+ darbuotojų</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Project Information */}
          <div className="space-y-4">
            <h4 className="font-bold text-foreground">Projekto informacija</h4>

            <div>
              <Label htmlFor="project_type">Projekto tipas *</Label>
              <Select
                onValueChange={value =>
                  setValue(
                    "project_type",
                    value as
                      | "crm"
                      | "logistics"
                      | "automation"
                      | "analytics"
                      | "scheduling"
                      | "accounting"
                      | "other"
                  )
                }
              >
                <SelectTrigger className={errors.project_type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Pasirinkite projekto tipą..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crm">CRM Sistema</SelectItem>
                  <SelectItem value="logistics">Logistikos Sprendimas</SelectItem>
                  <SelectItem value="automation">Automatizacija</SelectItem>
                  <SelectItem value="analytics">Analitika</SelectItem>
                  <SelectItem value="scheduling">Grafikų Planavimas</SelectItem>
                  <SelectItem value="accounting">Buhalterija</SelectItem>
                  <SelectItem value="other">Kita</SelectItem>
                </SelectContent>
              </Select>
              {errors.project_type && (
                <p className="text-red-500 text-sm mt-1">{errors.project_type.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget_range">Biudžeto rėžis</Label>
                <Select
                  onValueChange={value =>
                    setValue(
                      "budget_range",
                      value as "under_5k" | "5k_12k" | "12k_25k" | "over_25k" | "not_sure"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pasirinkite..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_5k">Iki €5,000</SelectItem>
                    <SelectItem value="5k_12k">€5,000 - €12,000</SelectItem>
                    <SelectItem value="12k_25k">€12,000 - €25,000</SelectItem>
                    <SelectItem value="over_25k">Virš €25,000</SelectItem>
                    <SelectItem value="not_sure">Dar nežinau</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timeline">Laiko rėmai</Label>
                <Select
                  onValueChange={value =>
                    setValue(
                      "timeline",
                      value as "urgent" | "1_2_months" | "2_3_months" | "flexible"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pasirinkite..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Skubu (iki 1 mėn)</SelectItem>
                    <SelectItem value="1_2_months">1-2 mėnesiai</SelectItem>
                    <SelectItem value="2_3_months">2-3 mėnesiai</SelectItem>
                    <SelectItem value="flexible">Lanksčiai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Projekto aprašymas *</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Aprašykite savo iššūkius, ko tikitės iš sistemos..."
                rows={4}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="current_solution">Kokius įrankius naudojate dabar?</Label>
              <Textarea
                id="current_solution"
                {...register("current_solution")}
                placeholder="Excel, konkretūs CRM/ERP, arba nieko..."
                rows={2}
              />
            </div>
          </div>

          {/* GDPR Consent */}
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <Checkbox
              id="gdpr_consent"
              checked={gdprConsent}
              onCheckedChange={checked => setValue("gdpr_consent", checked as boolean)}
              className={errors.gdpr_consent ? "border-red-500" : ""}
            />
            <div className="flex-1">
              <Label htmlFor="gdpr_consent" className="text-sm cursor-pointer">
                Sutinku, kad mano duomenys būtų apdorojami pagal{" "}
                <a href="/privatumo-politika" target="_blank" className="text-primary underline">
                  privatumo politiką
                </a>{" "}
                konsultacijos tikslais *
              </Label>
              {errors.gdpr_consent && (
                <p className="text-red-500 text-sm mt-1">{errors.gdpr_consent.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <ShinyButton type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Siunčiama...
                </>
              ) : (
                "Siųsti užklausą"
              )}
            </ShinyButton>
            <Button type="button" onClick={onClose} variant="outline" className="button-outline">
              Atšaukti
            </Button>
          </div>

          <p className="text-xs text-foreground/60 text-center">
            Jūsų duomenys saugūs. Nesidalinsiu su trečiosiomis šalimis. Susisieksiu per 24 val darbo
            dienomis.
          </p>
        </form>
      </div>
    </div>
  );
};

export default InquiryForm;
