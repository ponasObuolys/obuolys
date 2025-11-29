import { Badge } from '@/components/ui/badge';
import { ShinyButton } from '@/components/ui/shiny-button';
import { Clock, CheckCircle, Loader2 } from 'lucide-react';
import { formatDuration } from '@/utils/formatDuration';
import { formatPrice } from '@/config/stripe';
import { ShareButton } from '@/components/ui/share-button';
import { CourseSpotsBadge } from './course-spots-badge';

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
    max_spots?: number | null;
    course_start_date?: string | null;
    cta_button_text?: string | null;
    value_items?: { title: string; value: string }[] | null;
    total_value?: string | null;
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

        {/* Mobile-only Purchase Section - toks pat stilius kaip CoursePurchaseCard */}
        <div className="lg:hidden mt-6 mb-6">
          <div className="bg-background/50 backdrop-blur-sm p-4 rounded-xl border border-border">
            {/* Kaina viršuje */}
            <div className="text-center mb-4">
              <p className="text-2xl font-bold text-primary">
                {displayPrice}
              </p>
            </div>

            {/* Pirkimo mygtukas */}
            <ShinyButton
              className="w-full text-lg py-3"
              onClick={onPurchase}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Kraunama...
                </>
              ) : (
                course.cta_button_text || (isStripeCourse ? 'Registruokis į kursą' : 'Įsigyti kursą')
              )}
            </ShinyButton>

            <p className="text-xs text-muted-foreground mt-2 text-center">
              {isStripeCourse
                ? "Kursų prieiga 3 mėn. + visų įrašų archyvas šiuo laikotarpiu"
                : "Vienkartinis mokėjimas, prieiga neribotam laikui"}
            </p>

            {/* Vietų badge */}
            {course.max_spots && course.course_start_date && (
              <div className="mt-3 flex justify-center">
                <CourseSpotsBadge 
                  maxSpots={course.max_spots} 
                  courseStartDate={course.course_start_date}
                  size="sm"
                />
              </div>
            )}

            {/* Vertės breakdown - toks pat stilius kaip CoursePurchaseCard */}
            {course.value_items && course.value_items.length > 0 && (
              <div className="border border-primary/20 rounded-lg p-4 mt-4 bg-background/40 text-left">
                <p className="text-sm font-semibold text-foreground mb-3">
                  Ką gaunate:
                </p>
                <ul className="space-y-2 text-sm">
                  {course.value_items.map((item, index) => (
                    <li key={index} className="flex items-start justify-between gap-2">
                      <span className="flex items-center gap-2 min-w-0">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-foreground/80">{item.title}</span>
                      </span>
                      <span className="font-medium whitespace-nowrap text-primary">{item.value}</span>
                    </li>
                  ))}
                </ul>
                {course.total_value && (
                  <div className="mt-3 pt-3 border-t border-border flex items-baseline justify-between">
                    <span className="text-xs text-muted-foreground">Bendra vertė:</span>
                    <span className="text-sm font-semibold text-muted-foreground line-through">{course.total_value}</span>
                  </div>
                )}
              </div>
            )}
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