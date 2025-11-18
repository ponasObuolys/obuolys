import { useEffect, useState, lazy, Suspense } from "react";
import { Search } from "lucide-react";

// Lazy load the modal component
const GlobalSearchModal = lazy(() => import("./GlobalSearchModal"));

interface GlobalSearchProps {
  trigger?: React.ReactNode;
  className?: string;
}

export function GlobalSearch({ trigger, className }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      {/* Search trigger */}
      {trigger ? (
        <div onClick={() => setOpen(true)} className={className}>
          {trigger}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className={`flex items-center justify-center w-9 h-9 rounded-full text-foreground/70 hover:text-foreground bg-muted/60 hover:bg-muted transition-colors border border-border ${className || ""}`}
          aria-label="Atidaryti paiešką"
        >
          <Search className="h-4 w-4" />
        </button>
      )}

      {open && (
        <Suspense fallback={null}>
          <GlobalSearchModal open={open} onOpenChange={setOpen} />
        </Suspense>
      )}
    </>
  );
}
