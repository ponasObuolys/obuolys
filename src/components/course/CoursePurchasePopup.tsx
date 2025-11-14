import { Button } from '@/components/ui/button';
import { CheckCircle, X, Clock, Loader2 } from 'lucide-react';
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
    description: string;
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

          {/* Price */}
          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-primary mb-2">
              {formatPrice(currentPrice.amount)}
            </p>
            <p className="text-xs text-muted-foreground/70">
              {currentPrice.description}
            </p>
          </div>

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