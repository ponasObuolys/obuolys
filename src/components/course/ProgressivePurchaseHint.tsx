import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/config/stripe';

interface ProgressivePurchaseHintProps {
  currentPrice: {
    amount: number;
    label: string;
    description: string;
  };
  onPurchase: () => void;
  variant?: 'reading' | 'engagement';
  className?: string;
}

/**
 * Strategic purchase hints placed throughout course content
 * Different variants for different content sections
 */
export function ProgressivePurchaseHint({
  currentPrice,
  onPurchase,
  variant = 'reading',
  className = ''
}: ProgressivePurchaseHintProps) {
  const variants = {
    reading: {
      icon: <Sparkles className="w-4 h-4 text-primary" />,
      title: 'Patinka tai, ką skaitai?',
      description: 'Pradėk mokytis jau šiandien',
      buttonText: `Įsigyti už ${formatPrice(currentPrice.amount)}`,
      bgClass: 'bg-primary/5 border-primary/20'
    },
    engagement: {
      icon: <ArrowRight className="w-4 h-4 text-secondary" />,
      title: 'Pasiruošęs gilintis?',
      description: 'Praktiniai pavyzdžiai ir užduotys laukia tavęs',
      buttonText: 'Pradėti mokytis',
      bgClass: 'bg-secondary/5 border-secondary/20'
    }
  };

  const config = variants[variant];

  return (
    <div className={`my-8 p-4 rounded-lg border ${config.bgClass} ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-0.5">
            {config.icon}
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              {config.title}
            </h4>
            <p className="text-sm text-muted-foreground">
              {config.description}
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onPurchase}
            className="w-full sm:w-auto"
          >
            {config.buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}