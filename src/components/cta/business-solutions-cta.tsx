import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Target, Rocket, TrendingUp, Brain } from "lucide-react";
import { useMemo } from "react";
import type { CTAContext, CTAVariant } from "@/types/cta";
import { useRandomCTA } from "@/hooks/use-cta";
import { ctaAnalyticsService } from "@/services/cta.service";

interface BusinessSolutionsCTAProps {
  variant?: CTAVariant;
  context?: CTAContext;
  centered?: boolean;
}

import { contentVariants } from "@/data/ctaContent";

export function BusinessSolutionsCTA({
  variant = "default",
  context = "article",
  centered = false,
}: BusinessSolutionsCTAProps) {
  // Bandome gauti iš DB
  const { data: dbCTA } = useRandomCTA(context);

  // Fallback į hardcoded tekstus
  const fallbackContent = useMemo(() => {
    const variants = contentVariants[context];
    return variants[Math.floor(Math.random() * variants.length)];
  }, [context]);

  // Helper funkcija ikonoms iš DB
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, typeof Target> = {
      Target,
      Rocket,
      Sparkles,
      Brain,
      Zap,
      TrendingUp,
    };
    return icons[iconName] || Target;
  };

  // Naudojame DB duomenis arba fallback
  const content = useMemo(() => {
    if (dbCTA) {
      return {
        title: dbCTA.title,
        description: dbCTA.description,
        cta: dbCTA.button_text,
        icon: getIconComponent(dbCTA.icon),
      };
    }
    return fallbackContent;
  }, [dbCTA, fallbackContent]);

  const IconComponent = content.icon;

  // Click tracking handler
  const handleClick = () => {
    if (dbCTA?.id) {
      ctaAnalyticsService.trackClick(dbCTA.id, "cta_section", context);
    }
  };

  if (variant === "compact") {
    return (
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{content.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{content.description}</p>
            <Link
              to="/verslo-sprendimai"
              className="inline-block w-full sm:w-auto"
              onClick={handleClick}
            >
              <Button className="gap-2 w-full sm:w-auto">
                {content.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left w-full sm:w-auto">
            <IconComponent className="h-5 w-5 text-primary flex-shrink-0 hidden sm:block" />
            <div className="flex-1">
              <p className="font-medium text-sm mb-1">{content.title}</p>
              <p className="text-xs text-muted-foreground">{content.description}</p>
            </div>
          </div>
          <Link to="/verslo-sprendimai" className="w-full sm:w-auto">
            <Button size="sm" className="gap-2 w-full sm:w-auto whitespace-nowrap">
              {content.cta}
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Default variant
  const textAlign = centered ? "text-center" : "text-center md:text-left";
  const justifyContent = centered ? "justify-center" : "justify-center md:justify-start";
  const marginAuto = centered ? "mx-auto" : "mx-auto md:mx-0";

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 rounded-xl p-6 md:p-12">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className={`relative z-10 ${textAlign}`}>
        <div className={`flex items-center ${justifyContent} gap-2 mb-4`}>
          <IconComponent className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary">Verslo Sprendimai</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-4">{content.title}</h2>

        <p className={`text-base md:text-lg text-muted-foreground mb-6 max-w-2xl ${marginAuto}`}>
          {content.description}
        </p>

        <div className={`flex flex-col sm:flex-row gap-3 ${justifyContent} mb-8`}>
          <Link to="/verslo-sprendimai" className="w-full sm:w-auto">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              {content.cta}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/kontaktai?type=CUSTOM_TOOL" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
              Greita užklausa
              <Sparkles className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl ${marginAuto}`}>
          <div
            className={`flex flex-col sm:flex-row items-center sm:items-start gap-3 ${textAlign}`}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-lg">1</span>
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">Konsultacija</p>
              <p className="text-xs text-muted-foreground">Aptariame jūsų poreikius</p>
            </div>
          </div>
          <div
            className={`flex flex-col sm:flex-row items-center sm:items-start gap-3 ${textAlign}`}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-lg">2</span>
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">Kūrimas</p>
              <p className="text-xs text-muted-foreground">Kuriame sprendimą</p>
            </div>
          </div>
          <div
            className={`flex flex-col sm:flex-row items-center sm:items-start gap-3 ${textAlign}`}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-lg">3</span>
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">Diegimas</p>
              <p className="text-xs text-muted-foreground">Integruojame į verslą</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
