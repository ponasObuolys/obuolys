import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCourseFaq } from "@/hooks/use-course-faq";

interface CourseFaqProps {
  courseId: string;
  className?: string;
}

/**
 * FAQ accordion komponentas kurso puslapyje
 * Rodo dažniausiai užduodamus klausimus
 */
export function CourseFaq({ courseId, className = "" }: CourseFaqProps) {
  const { data: faqItems, isLoading } = useCourseFaq(courseId);

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <h2 className="text-2xl font-bold mb-6 text-foreground text-left">
          Dažniausiai užduodami klausimai
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse border rounded-lg p-4">
              <div className="h-5 bg-muted rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!faqItems || faqItems.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-foreground text-left">
        Dažniausiai užduodami klausimai
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-left font-medium">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-left">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
