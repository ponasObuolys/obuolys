import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCourseTestimonials } from "@/hooks/use-course-testimonials";

interface CourseTestimonialsProps {
  courseId: string;
  className?: string;
}

/**
 * Atsiliepimų sekcija kurso puslapyje
 * Rodo 3-4 atsiliepimų korteles grid'e
 */
export function CourseTestimonials({ courseId, className = "" }: CourseTestimonialsProps) {
  const { data: testimonials, isLoading } = useCourseTestimonials(courseId);

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <h2 className="text-2xl font-bold mb-6 text-foreground text-left">
          Ką sako dalyviai
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-foreground text-left">
        Ką sako dalyviai
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.slice(0, 4).map((testimonial) => (
          <Card 
            key={testimonial.id} 
            className="bg-background/50 border-border hover:border-primary/30 transition-colors"
          >
            <CardContent className="p-6">
              <Quote className="h-6 w-6 text-primary/40 mb-3" />
              <p className="text-foreground/80 text-sm leading-relaxed mb-4 text-left">
                "{testimonial.content}"
              </p>
              <p className="text-sm font-semibold text-foreground text-left">
                — {testimonial.name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
