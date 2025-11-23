import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Clock, TrendingUp } from 'lucide-react';
import { useCoursePurchase } from '@/hooks/useCoursePurchase';
import type { Course } from '@/types/course';

interface CoursePurchaseCardEnhancedProps {
  course: Course;
}

interface TimeLeft {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const getTimeLeft = (targetDate: Date): TimeLeft => {
  const now = new Date().getTime();
  const diff = targetDate.getTime() - now;

  if (diff <= 0) {
    return {
      totalMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    totalMs: diff,
    days,
    hours,
    minutes,
    seconds,
  };
};

const formatCurrency = (amount: string) => {
  if (!amount) return '';

  // Jei jau yra formatas "€XX.XX" arba "XX€"
  if (amount.includes('€')) return amount;

  // Jei yra skaičius su taškais/kableliais
  const numericAmount = parseFloat(amount.replace(/[^\d.,]/g, '').replace(',', '.'));
  if (!isNaN(numericAmount)) {
    return `${numericAmount.toFixed(2)}€`;
  }

  return amount;
};

/**
 * Patobulinta kurso pirkimo kortelė su duomenų bazės konfigūracija
 */
export function CoursePurchaseCardEnhanced({ course }: CoursePurchaseCardEnhancedProps) {
  const { purchaseCourse, isLoading } = useCoursePurchase({
    courseId: course.id,
    courseTitle: course.title,
  });

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  const countdownDate = useMemo(() =>
    course.countdown_end_date ? new Date(course.countdown_end_date) : null,
    [course.countdown_end_date]
  );

  const nextPriceDate = useMemo(() =>
    course.next_price_date ? new Date(course.next_price_date) : null,
    [course.next_price_date]
  );

  // Countdown logic
  useEffect(() => {
    if (!course.countdown_enabled || !countdownDate) return;

    const updateCountdown = () => {
      setTimeLeft(getTimeLeft(countdownDate));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [course.countdown_enabled, countdownDate]);

  // Nustatyti kaina pagal prioritetą
  const displayPrice = course.discount_price || course.regular_price || course.price;
  const hasDiscount = course.discount_price && course.regular_price && course.discount_price !== course.regular_price;

  return (
    <Card className="sticky top-24 shadow-lg">
      <CardContent className="p-6">
        {/* Kaina */}
        <div className="text-center mb-6">
          <div className="mb-4">
            {hasDiscount && course.regular_price && (
              <p className="text-lg text-muted-foreground line-through mb-1">
                {formatCurrency(course.regular_price)}
              </p>
            )}
            <p className="text-4xl font-bold text-primary">
              {formatCurrency(displayPrice)}
            </p>
          </div>

          {/* Countdown */}
          {course.countdown_enabled && timeLeft && timeLeft.totalMs > 0 && (
            <div className="mb-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {course.countdown_text || 'Akcija baigiasi už:'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold">{timeLeft.days}</div>
                  <div className="text-xs text-muted-foreground">d.</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{timeLeft.hours}</div>
                  <div className="text-xs text-muted-foreground">val.</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{timeLeft.minutes}</div>
                  <div className="text-xs text-muted-foreground">min.</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{timeLeft.seconds}</div>
                  <div className="text-xs text-muted-foreground">sek.</div>
                </div>
              </div>
            </div>
          )}

          {/* Kainos kėlimo informacija */}
          {nextPriceDate && course.next_price && (
            <p className="text-sm text-primary font-medium mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              Po {nextPriceDate.toLocaleDateString('lt-LT')} kaina kils iki {formatCurrency(course.next_price)}
            </p>
          )}

          {/* Vertės skaičiavimas */}
          {course.value_items && course.value_items.length > 0 && (
            <div className="border border-primary/20 rounded-lg p-4 mb-4 bg-background/40 text-left">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">
                  Ką gaunate šiame kurse:
                </p>
              </div>

              <ul className="space-y-2 text-sm">
                {course.value_items.map((item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{item.title}</span>
                    <span className="font-medium whitespace-nowrap">
                      {formatCurrency(item.value)}
                    </span>
                  </li>
                ))}
              </ul>

              {course.total_value && (
                <>
                  <div className="mt-3 pt-3 border-t border-border flex items-baseline justify-between">
                    <span className="text-xs text-muted-foreground">Bendros vertės suma:</span>
                    <span className="text-sm font-semibold text-muted-foreground line-through">
                      {formatCurrency(course.total_value)}
                    </span>
                  </div>
                  <div className="mt-2 text-right">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground/80">
                      Jūsų kaina šiandien
                    </p>
                    <p className="text-2xl font-extrabold text-primary">
                      TIK {formatCurrency(displayPrice)}
                    </p>
                    {course.next_price && (
                      <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground/80">
                        Netrukus brangs iki <span className="font-semibold text-primary">
                          {formatCurrency(course.next_price)}
                        </span>
                      </p>
                    )}
                  </div>
                </>
              )}
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
              'Pradėk mokytis dabar'
            )}
          </Button>

          {/* Papildoma informacija */}
          {course.promote_in_popup && (
            <Badge variant="secondary" className="mt-3">
              Populiariausias kursas
            </Badge>
          )}
        </div>

        {/* Saugumas */}
        <div className="text-center text-xs text-muted-foreground border-t border-border pt-4">
          <p>Mokėjimas saugiai apdorojamas per Stripe</p>
          <p className="mt-1">256-bit SSL šifravimas</p>
        </div>
      </CardContent>
    </Card>
  );
}