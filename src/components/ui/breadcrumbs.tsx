import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

export function Breadcrumbs({ items, showHome = true }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-2 text-sm text-muted-foreground mb-6"
    >
      {showHome && (
        <>
          <Link
            to="/"
            className="flex items-center hover:text-foreground transition-colors"
            aria-label="Grįžti į pradžią"
          >
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
        </>
      )}

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center space-x-2">
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="hover:text-foreground transition-colors truncate max-w-[200px]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`truncate max-w-[200px] ${isLast ? "text-foreground font-medium" : ""}`}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}

            {!isLast && <ChevronRight className="h-4 w-4 flex-shrink-0" />}
          </div>
        );
      })}
    </nav>
  );
}
