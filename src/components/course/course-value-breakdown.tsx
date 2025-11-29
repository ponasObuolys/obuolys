import { CheckCircle } from "lucide-react";

export interface ValueItem {
  title: string;
  value: string;
}

interface CourseValueBreakdownProps {
  items: ValueItem[];
  totalValue?: string | null;
  className?: string;
}

/**
 * Kompaktiškas vertės breakdown komponentas
 * Rodomas mobile versijoje CourseHero viduje
 */
export function CourseValueBreakdownCompact({ 
  items, 
  totalValue,
  className = "" 
}: CourseValueBreakdownProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`bg-background/60 rounded-lg p-3 border border-border/50 ${className}`}>
      <p className="text-xs font-medium text-muted-foreground mb-2">Ką gaunate:</p>
      <ul className="space-y-1.5">
        {items.slice(0, 4).map((item, index) => (
          <li key={index} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-foreground/80">
              <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
              <span className="truncate">{item.title}</span>
            </span>
            <span className="font-medium text-primary/80 ml-2">{item.value}</span>
          </li>
        ))}
      </ul>
      {totalValue && (
        <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Bendra vertė:</span>
          <span className="text-sm font-semibold text-muted-foreground line-through">{totalValue}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Pilnas vertės breakdown komponentas
 * Rodomas sidebar arba atskiroje sekcijoje
 */
export function CourseValueBreakdown({ 
  items, 
  totalValue,
  className = "" 
}: CourseValueBreakdownProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`border border-primary/20 rounded-lg p-4 bg-background/40 ${className}`}>
      <p className="text-sm font-semibold text-foreground mb-3">
        Ką gaunate šiame kurse:
      </p>
      <ul className="space-y-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center justify-between">
            <span className="text-foreground/80">{item.title}</span>
            <span className="font-medium whitespace-nowrap text-foreground">{item.value}</span>
          </li>
        ))}
      </ul>
      {totalValue && (
        <div className="mt-3 pt-3 border-t border-border flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">Bendros vertės suma:</span>
          <span className="text-sm font-semibold text-muted-foreground line-through">{totalValue}</span>
        </div>
      )}
    </div>
  );
}
