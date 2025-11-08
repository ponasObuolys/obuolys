import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Clock, TrendingUp } from 'lucide-react';
import { useCoursePurchase } from '@/hooks/useCoursePurchase';
import { formatPrice, getAllPricesWithStatus } from '@/config/stripe';

interface CoursePurchaseCardProps {
  courseId: string;
  courseTitle: string;
}

/**
 * Kurso pirkimo kortelė su kaina, kurios artėja deadline
 * Rodoma kurso detalių puslapyje
 */
export function CoursePurchaseCard({ courseId, courseTitle }: CoursePurchaseCardProps) {
  const { purchaseCourse, isLoading, currentPrice } = useCoursePurchase({
    courseId,
    courseTitle,
  });

  const allPrices = getAllPricesWithStatus();
  const nextPrice = allPrices.find((p) => !p.isActive && !p.isPast);

  return (
    <div className="dark-card sticky top-24">
      {/* Kaina su badge */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <p className="text-4xl font-bold text-primary">
            {formatPrice(currentPrice.amount)}
          </p>
          {currentPrice.savings > 0 && (
            <Badge variant="default" className="bg-green-600 text-white">
              Sutaupai {currentPrice.savings}€
            </Badge>
          )}
        </div>

        {/* Dabartinio periodo aprašymas */}
        <div className="text-sm text-muted-foreground mb-1">
          <Clock className="inline w-4 h-4 mr-1" />
          {currentPrice.label}
        </div>
        <div className="text-xs text-muted-foreground/70 mb-4">
          {currentPrice.description}
        </div>

        {/* Kitos kainos įspėjimas */}
        {nextPrice && (
          <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-center gap-2 text-sm text-orange-800 dark:text-orange-200">
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">
                {nextPrice.label}: {formatPrice(nextPrice.amount)}
              </span>
            </div>
            <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
              Kaina pakils! Įsigyk dabar ir sutaupyk.
            </p>
          </div>
        )}

        {/* Pirkimo mygtukas */}
        <Button
          className="w-full button-primary text-lg py-6"
          onClick={purchaseCourse}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Kraunama...
            </>
          ) : (
            'Įsigyti kursą'
          )}
        </Button>

        <div className="text-xs text-muted-foreground mt-3">
          Vienkartinis mokėjimas, prieiga neribotam laikui
        </div>
      </div>

      {/* Kainos lentelė */}
      <div className="border-t border-border pt-4 mb-4">
        <h4 className="font-semibold mb-3 text-sm text-muted-foreground">
          Kainų grafikas:
        </h4>
        <div className="space-y-2 text-sm">
          {allPrices.map((price) => (
            <div
              key={price.tier}
              className={`flex justify-between items-center py-1.5 px-2 rounded ${
                price.isActive
                  ? 'bg-primary/10 font-semibold'
                  : price.isPast
                  ? 'text-muted-foreground/50 line-through'
                  : 'text-muted-foreground'
              }`}
            >
              <span className="text-xs">{price.label}</span>
              <span className={price.isActive ? 'text-primary' : ''}>
                {formatPrice(price.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Saugumas */}
      <div className="text-center text-xs text-muted-foreground border-t border-border pt-4">
        <p>Mokėjimas saugiai apdorojamas per Stripe</p>
        <p className="mt-1">256-bit SSL šifravimas</p>
      </div>
    </div>
  );
}
