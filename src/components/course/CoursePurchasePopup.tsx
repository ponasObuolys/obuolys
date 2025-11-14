import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { formatPrice } from '@/config/stripe';

interface CoursePurchasePopupProps {
  course: {
    title: string;
    highlights?: string[];
    duration: string;
  };
  currentPrice: {
    amount: number;
    label: string;
    savings: number;
  };
  nextPrice?: {
    amount: number;
    label: string;
  };
  onPurchase: () => void;
  onClose: () => void;
  isVisible: boolean;
  isLoading: boolean;
}

/**
 * Smart purchase popup for mobile devices
 * Appears after user engagement to promote course purchase
 */
export function CoursePurchasePopup({
  course,
  currentPrice,
  nextPrice,
  onPurchase,
  onClose,
  isVisible,
  isLoading
}: CoursePurchasePopupProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end lg:hidden">
      <div className="w-full bg-background rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[60vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h3 className="text-lg font-bold">🚀 Pasiruošęs pradėti?</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* Course Title & Duration */}
          <div className="text-center mb-4">
            <h4 className="font-semibold text-foreground mb-2">{course.title}</h4>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
          </div>

          {/* Price with savings */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <p className="text-3xl font-bold text-primary">
                {formatPrice(currentPrice.amount)}
              </p>
              {currentPrice.savings > 0 && (
                <Badge variant="default" className="bg-green-600 text-white">
                  Sutaupai {currentPrice.savings}€
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-1">{currentPrice.label}</p>
            <p className="text-xs text-muted-foreground/70">
              Vienkartinis mokėjimas, prieiga neribotam laikui
            </p>
          </div>

          {/* Next price warning */}
          {nextPrice && (
            <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-center gap-2 text-sm text-orange-800 dark:text-orange-200">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">
                  {nextPrice.label}: {formatPrice(nextPrice.amount)}
                </span>
              </div>
              <p className="text-xs text-orange-700 dark:text-orange-300 mt-1 text-center">
                Kaina pakils! Įsigyk dabar ir sutaupyk.
              </p>
            </div>
          )}

          {/* Quick highlights */}
          {course.highlights && course.highlights.length > 0 && (
            <div className="mb-6">
              <h5 className="font-semibold text-sm text-foreground mb-3 text-center">
                Kas tavęs laukia:
              </h5>
              <ul className="space-y-2">
                {course.highlights.slice(0, 3).map((highlight, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80">{highlight}</span>
                  </li>
                ))}
              </ul>
              {course.highlights.length > 3 && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  + dar {course.highlights.length - 3} dalykų
                </p>
              )}
            </div>
          )}

          {/* Purchase Button */}
          <Button
            className="w-full button-primary text-lg py-6 mb-4"
            onClick={onPurchase}
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

          <p className="text-xs text-muted-foreground text-center mb-4">
            Vienkartinis mokėjimas, prieiga neribotam laikui
          </p>

          {/* Full Pricing Schedule like desktop */}
          <div className="border-t border-border pt-4 mb-4">
            <h4 className="font-semibold mb-3 text-sm text-muted-foreground text-center">
              Kainų grafikas:
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-2 px-3 rounded bg-primary/10 font-semibold">
                <span className="text-xs">Iki lapkričio 10 d.</span>
                <span className="text-primary">97.00€</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded text-muted-foreground">
                <span className="text-xs">Lapkričio 11-17 d.</span>
                <span>117.00€</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded text-muted-foreground">
                <span className="text-xs">Lapkričio 18-21 d.</span>
                <span>137.00€</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 rounded text-muted-foreground">
                <span className="text-xs">Kurso dieną (lapkričio 22 d.)</span>
                <span>147.00€</span>
              </div>
            </div>
          </div>

          {/* Security note */}
          <div className="text-center text-xs text-muted-foreground border-t border-border pt-4">
            <p>Mokėjimas saugiai apdorojamas per Stripe</p>
            <p className="mt-1">256-bit SSL šifravimas</p>
          </div>
        </div>
      </div>
    </div>
  );
}