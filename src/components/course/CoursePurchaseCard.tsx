import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useCoursePurchase } from '@/hooks/useCoursePurchase';
import { formatPrice } from '@/config/stripe';

interface CoursePurchaseCardProps {
  courseId: string;
  courseTitle: string;
}

const STRIPE_MAIN_COURSE_ID = '3a107f1a-9c87-4291-bf90-6adf854b2116';
// Kursai vyksta 2025-12-13, timeris rodo laiką iki pirmos dienos
const COURSE_DEADLINE = new Date('2025-12-13T10:00:00+02:00');
// Pardavimų langas skaičiuojamas nuo 2025-11-14 (pirmos viešos informacijos)
const COURSE_ANNOUNCE_DATE = new Date('2025-11-14T00:00:00+02:00');

interface TimeLeft {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
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
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return {
    totalMs: diff,
    days,
    hours,
    minutes,
  };
};

/**
 * Kurso pirkimo kortelė su viena fiksuota kaina
 * Rodoma kurso detalių puslapyje
 */
export function CoursePurchaseCard({ courseId, courseTitle }: CoursePurchaseCardProps) {
  const { purchaseCourse, isLoading, currentPrice } = useCoursePurchase({
    courseId,
    courseTitle,
  });

  const isMainStripeCourse = courseId === STRIPE_MAIN_COURSE_ID;
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(COURSE_DEADLINE));
  const initialTotalMs = Math.max(
    COURSE_DEADLINE.getTime() - COURSE_ANNOUNCE_DATE.getTime(),
    1
  );
  const progressPercent = Math.min(
    100,
    Math.max(0, ((initialTotalMs - timeLeft.totalMs) / initialTotalMs) * 100)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(COURSE_DEADLINE));
    }, 60_000); // atnaujiname kas minutę

    return () => clearInterval(interval);
  }, []);

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

        {isMainStripeCourse && (
          <p className="text-xs font-semibold text-primary mb-4">
            Dabartinė kaina galioja iki 2025 m. gruodžio 7 d. Nuo tos dienos kaina kils.
          </p>
        )}

        {isMainStripeCourse && (
          <div className="border border-primary/20 rounded-lg p-4 mb-4 bg-background/40 text-left">
            <p className="text-sm font-semibold text-foreground mb-3">
              Ką gaunate šiame kurse:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span>14 val. praktinių mokymų (live + įrašai)</span>
                <span className="font-medium whitespace-nowrap">500€</span>
              </li>
              <li className="flex items-center justify-between">
                <span>AI terminų žodynas ir šablonai</span>
                <span className="font-medium whitespace-nowrap">50€</span>
              </li>
              <li className="flex items-center justify-between">
                <span>1 mėn. asmeninis palaikymas el. paštu</span>
                <span className="font-medium whitespace-nowrap">250€</span>
              </li>
              <li className="flex items-center justify-between">
                <span>3 mėn. prieiga prie visų įrašų ir medžiagos</span>
                <span className="font-medium whitespace-nowrap">100€</span>
              </li>
            </ul>
            <div className="mt-3 pt-3 border-t border-border flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Bendros vertės suma:</span>
              <span className="text-sm font-semibold text-muted-foreground line-through">900€</span>
            </div>
            <div className="mt-2 text-right">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground/80">
                Jūsų kaina šiandien
              </p>
              <p className="text-2xl font-extrabold text-primary">
                TIK {formatPrice(currentPrice.amount)}
              </p>
              {currentPrice.amount < 11700 && (
                <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground/80">
                  Kursas brangs iki <span className="font-semibold text-primary">{formatPrice(11700)}</span>
                </p>
              )}
            </div>
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
            isMainStripeCourse
              ? 'Pradėk mokytis dabar'
              : 'Įsigyti kursą'
          )}
        </Button>

        {isMainStripeCourse && timeLeft.totalMs > 0 && (
          <div className="mt-3 text-xs text-primary font-semibold">
            <div>
              Kursas prasideda už: {timeLeft.days} d. {timeLeft.hours} val. {timeLeft.minutes}{' '}
              min.
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-muted/30 overflow-hidden">
              <div
                className="h-full bg-primary/80"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {isMainStripeCourse && (
          <div className="mt-2 text-xs text-muted-foreground">
            Vietų kiekis ribotas
          </div>
        )}
      </div>

      {/* Saugumas */}
      <div className="text-center text-xs text-muted-foreground border-t border-border pt-4">
        <p>Mokėjimas saugiai apdorojamas per Stripe</p>
        <p className="mt-1">256-bit SSL šifravimas</p>
      </div>
    </div>
  );
}
