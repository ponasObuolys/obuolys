import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Timer } from 'lucide-react';
import { formatPrice } from '@/config/stripe';

interface ProgressivePurchaseHintProps {
  currentPrice: {
    amount: number;
    label: string;
    savings: number;
  };
  onPurchase: () => void;
  variant?: 'reading' | 'engagement' | 'value';
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
    },
    value: {
      icon: <Timer className="w-4 h-4 text-green-600" />,
      title: 'Kodėl laukti?',
      description: `Sutaupyk ${currentPrice.savings}€ įsigydamas šiandien`,
      buttonText: `${formatPrice(currentPrice.amount)} vietoj ${formatPrice(14700)}`, // 147€ final price
      bgClass: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
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
            variant={variant === 'value' ? 'default' : 'outline'}
            size="sm"
            onClick={onPurchase}
            className={`w-full sm:w-auto ${
              variant === 'value'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : ''
            }`}
          >
            {config.buttonText}
          </Button>
        </div>
      </div>

      {variant === 'value' && currentPrice.savings > 0 && (
        <div className="mt-3 pt-3 border-t border-green-200/50 dark:border-green-800/50">
          <p className="text-xs text-green-700 dark:text-green-300 text-center">
            🎯 Akcija baigiasi netrukus! {currentPrice.label}
          </p>
        </div>
      )}
    </div>
  );
}