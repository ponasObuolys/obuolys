import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useCoursePurchase } from '@/hooks/useCoursePurchase';
import { formatPrice } from '@/config/stripe';

interface CoursePurchaseCardProps {
  courseId: string;
  courseTitle: string;
}

/**
 * Kurso pirkimo kortelė su viena fiksuota kaina
 * Rodoma kurso detalių puslapyje
 */
export function CoursePurchaseCard({ courseId, courseTitle }: CoursePurchaseCardProps) {
  const { purchaseCourse, isLoading, currentPrice } = useCoursePurchase({
    courseId,
    courseTitle,
  });

  return (
    <div className="dark-card sticky top-24">
      {/* Kaina */}
      <div className="text-center mb-6">
        <p className="text-4xl font-bold text-primary mb-4">
          {formatPrice(currentPrice.amount)}
        </p>

        <div className="text-xs text-muted-foreground/70 mb-6">
          {currentPrice.description}
        </div>

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
      </div>

      {/* Saugumas */}
      <div className="text-center text-xs text-muted-foreground border-t border-border pt-4">
        <p>Mokėjimas saugiai apdorojamas per Stripe</p>
        <p className="mt-1">256-bit SSL šifravimas</p>
      </div>
    </div>
  );
}
