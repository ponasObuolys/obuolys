import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Wrench, GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "article" | "tool" | "course";
  slug: string;
  category?: string;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);

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

  // Search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const searchTerm = `%${searchQuery}%`;

      // Search articles
      const { data: articles } = await supabase
        .from("articles")
        .select("id, title, slug, description, category")
        .eq("published", true)
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm},content.ilike.${searchTerm}`)
        .limit(5);

      // Search tools
      const { data: tools } = await supabase
        .from("tools")
        .select("id, name, slug, description, category")
        .eq("published", true)
        .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(5);

      // Search courses
      const { data: courses } = await supabase
        .from("courses")
        .select("id, title, slug, description")
        .eq("published", true)
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm},content.ilike.${searchTerm}`)
        .limit(5);

      const combinedResults: SearchResult[] = [
        ...(articles || []).map(a => ({
          id: a.id,
          title: a.title,
          description: a.description || "",
          type: "article" as const,
          slug: a.slug,
          category: Array.isArray(a.category) ? a.category[0] : a.category,
        })),
        ...(tools || []).map(t => ({
          id: t.id,
          title: t.name,
          description: t.description || "",
          type: "tool" as const,
          slug: t.slug,
          category: t.category || undefined,
        })),
        ...(courses || []).map(c => ({
          id: c.id,
          title: c.title,
          description: c.description || "",
          type: "course" as const,
          slug: c.slug,
        })),
      ];

      setResults(combinedResults);
    } catch {
      // Handle search errors silently
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  const handleSelect = (result: SearchResult) => {
    const routes = {
      article: `/publikacijos/${result.slug}`,
      tool: `/irankiai/${result.slug}`,
      course: `/kursai/${result.slug}`,
    };

    navigate(routes[result.type]);
    setOpen(false);
    setQuery("");
  };

  const getIcon = (type: SearchResult["type"]) => {
    const icons = {
      article: FileText,
      tool: Wrench,
      course: GraduationCap,
    };
    const Icon = icons[type];
    return <Icon className="h-4 w-4 mr-2" />;
  };

  // Group results by type
  const groupedResults = results.reduce(
    (acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = [];
      }
      acc[result.type].push(result);
      return acc;
    },
    {} as Record<SearchResult["type"], SearchResult[]>
  );

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/60 hover:text-foreground bg-muted/50 hover:bg-muted rounded-lg transition-colors border border-border"
      >
        <Search className="h-4 w-4" />
        <span className="hidden md:inline">Paieška...</span>
        <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-card px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">Globali Paieška</DialogTitle>
        <CommandInput
          placeholder="Ieškoti straipsnių, įrankių, kursų..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {isSearching && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isSearching && query && results.length === 0 && (
            <CommandEmpty>Nieko nerasta. Pabandykite kitą užklausą.</CommandEmpty>
          )}

          {!isSearching && results.length > 0 && (
            <>
              {groupedResults.article && groupedResults.article.length > 0 && (
                <CommandGroup heading="Straipsniai">
                  {groupedResults.article.map(result => (
                    <CommandItem
                      key={result.id}
                      value={`${result.title} ${result.description}`}
                      onSelect={() => handleSelect(result)}
                      className="cursor-pointer"
                    >
                      {getIcon(result.type)}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{result.title}</div>
                        {result.description && (
                          <div className="text-xs text-muted-foreground truncate">
                            {result.description}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 ml-2 text-muted-foreground" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {groupedResults.tool && groupedResults.tool.length > 0 && (
                <CommandGroup heading="Įrankiai">
                  {groupedResults.tool.map(result => (
                    <CommandItem
                      key={result.id}
                      value={`${result.title} ${result.description}`}
                      onSelect={() => handleSelect(result)}
                      className="cursor-pointer"
                    >
                      {getIcon(result.type)}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{result.title}</div>
                        {result.description && (
                          <div className="text-xs text-muted-foreground truncate">
                            {result.description}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 ml-2 text-muted-foreground" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {groupedResults.course && groupedResults.course.length > 0 && (
                <CommandGroup heading="Kursai">
                  {groupedResults.course.map(result => (
                    <CommandItem
                      key={result.id}
                      value={`${result.title} ${result.description}`}
                      onSelect={() => handleSelect(result)}
                      className="cursor-pointer"
                    >
                      {getIcon(result.type)}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{result.title}</div>
                        {result.description && (
                          <div className="text-xs text-muted-foreground truncate">
                            {result.description}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 ml-2 text-muted-foreground" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}

          {!query && (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              Pradėkite rašyti, kad rastumėte straipsnius, įrankius ir kursus...
            </div>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
