import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, Loader2 } from 'lucide-react';
import { formatDuration } from '@/utils/formatDuration';
import { formatPrice } from '@/config/stripe';
import { ShareButton } from '@/components/ui/share-button';

interface CourseHeroProps {
  course: {
    id: string;
    title: string;
    slug: string;
    description: string;
    duration: string;
    level: string;
    highlights?: string[];
    image_url: string | null;
    price: string;
  };
  currentPrice?: {
    amount: number;
    label: string;
    description: string;
  };
  onPurchase?: () => void;
  isLoading?: boolean;
}

/**
 * Clean hero section with course information
 * Mobile-friendly with left-aligned text and mobile purchase button
 */
export function CourseHero({
  course,
  currentPrice,
  onPurchase,
  isLoading = false
}: CourseHeroProps) {
  const isStripeCourse = course.id === '3a107f1a-9c87-4291-bf90-6adf854b2116';
  const displayPrice = isStripeCourse && currentPrice
    ? formatPrice(currentPrice.amount)
    : `${course.price}€`;
  return (
    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 lg:p-8 rounded-xl mb-8 border border-primary/10">
      <div className="w-full">
        {/* Header with title and share */}
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl lg:text-4xl font-bold text-foreground flex-1 text-left">
            {course.title}
          </h1>
          <ShareButton
            title={course.title}
            description={course.description}
            url={`https://ponasobuolys.lt/kursai/${course.slug}`}
            imageUrl={course.image_url || undefined}
            variant="outline"
            size="default"
            className="ml-4 flex-shrink-0"
          />
        </div>

        {/* Description */}
        <p className="text-lg lg:text-xl text-muted-foreground mb-6 leading-relaxed text-left">
          {course.description}
        </p>

        {/* Course Meta Info */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4 text-primary" />
            <span>{formatDuration(course.duration)}</span>
          </div>
          <Badge variant="secondary" className="text-sm">
            {course.level}
          </Badge>
        </div>

        {/* Mobile-only Purchase Section - above highlights */}
        <div className="lg:hidden mt-6 mb-6">
          <div className="bg-background/50 backdrop-blur-sm p-4 rounded-xl border border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary mb-3">
                {displayPrice}
              </p>
              <Button
                className="w-full button-primary text-lg py-3"
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
              <p className="text-xs text-muted-foreground mt-2">
                Vienkartinis mokėjimas, prieiga neribotam laikui
              </p>
            </div>
          </div>
        </div>

        {/* Key highlights preview */}
        {course.highlights && course.highlights.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-foreground mb-4 text-left">Trumpai apie kursą:</h3>
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {course.highlights.slice(0, 6).map((highlight, index) => (
                <li key={index} className="flex items-start text-sm text-left">
                  <CheckCircle className="w-4 h-4 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-left">{highlight}</span>
                </li>
              ))}
            </ul>
            {course.highlights.length > 6 && (
              <p className="text-sm text-muted-foreground mt-3 text-left">
                + dar {course.highlights.length - 6} dalykų žemiau ↓
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}