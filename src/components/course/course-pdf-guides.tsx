import { FileText, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface PdfGuide {
  title: string;
  description?: string;
}

interface CoursePdfGuidesProps {
  guides: PdfGuide[];
  className?: string;
}

/**
 * Komponentas rodantis PDF gidų sąrašą kurso puslapyje
 * "Ką gausite" sekcija
 */
export function CoursePdfGuides({ guides, className = "" }: CoursePdfGuidesProps) {
  if (!guides || guides.length === 0) {
    return null;
  }

  return (
    <section className={`${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-foreground text-left">
        Ką gausite
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guides.map((guide, index) => (
          <Card 
            key={index} 
            className="border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <CardContent className="p-4 flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-left">
                  {guide.title}
                </h3>
                {guide.description && (
                  <p className="text-sm text-muted-foreground mt-1 text-left">
                    {guide.description}
                  </p>
                )}
              </div>
              <Download className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground mt-4 text-left">
        * Visi PDF gidai bus prieinami po kurso įsigijimo
      </p>
    </section>
  );
}

/**
 * Kompaktiškas PDF gidų sąrašas (sidebar)
 */
export function CoursePdfGuidesCompact({ guides, className = "" }: CoursePdfGuidesProps) {
  if (!guides || guides.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <h4 className="font-semibold text-foreground mb-3 text-left flex items-center gap-2">
        <FileText className="h-4 w-4 text-primary" />
        PDF medžiaga
      </h4>
      <ul className="space-y-2">
        {guides.map((guide, index) => (
          <li 
            key={index} 
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
            <span className="text-left">{guide.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
