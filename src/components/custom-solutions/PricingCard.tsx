import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShinyButton } from "@/components/ui/shiny-button";

interface PricingPlan {
  name: string;
  priceRange: string;
  duration: string;
  features: string[];
  bestFor: string;
  roi?: string;
  popular: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
  onCTAClick: () => void;
}

const PricingCard = ({ plan, onCTAClick }: PricingCardProps) => {
  return (
    <div
      className={`dark-card flex flex-col h-full ${
        plan.popular ? "border-2 border-primary scale-105" : ""
      }`}
    >
      {plan.popular && (
        <div className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg mb-4 text-center">
          ⭐ Populiariausias
        </div>
      )}

      <h3 className="text-2xl font-bold mb-2 text-foreground text-left">{plan.name}</h3>

      <div className="mb-4">
        <div className="text-3xl font-bold text-primary mb-1 text-left">{plan.priceRange}</div>
        <div className="text-sm text-foreground/60 text-left">Trukmė: {plan.duration}</div>
      </div>

      <div className="mb-6 flex-1">
        <h4 className="text-sm font-bold text-foreground/80 mb-3 text-left">APIMA:</h4>
        <ul className="space-y-2">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-left">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground/70 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ROI Section */}
      {plan.roi && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-xs font-bold text-primary text-left">{plan.roi}</p>
        </div>
      )}

      <div className="p-4 bg-muted/50 rounded-lg mb-4">
        <p className="text-sm text-foreground/70 text-left">
          <span className="font-bold text-foreground">Tinka jei: </span>
          {plan.bestFor}
        </p>
      </div>

      {plan.popular ? (
        <ShinyButton onClick={onCTAClick} className="w-full">
          Gauti kainų pasiūlymą
          <ArrowRight className="w-4 h-4 ml-2" />
        </ShinyButton>
      ) : (
        <Button onClick={onCTAClick} className="w-full button-outline">
          Aptarti projektą
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
};

export default PricingCard;
