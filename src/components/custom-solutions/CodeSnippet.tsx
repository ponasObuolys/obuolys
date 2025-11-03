import { useState } from "react";
import { Copy, Check, Code } from "lucide-react";

interface CodeSnippetProps {
  title: string;
  language: string;
  code: string;
  description?: string;
  blurred?: boolean; // For sensitive/proprietary code
}

export function CodeSnippet({
  title,
  language,
  code,
  description,
  blurred = false
}: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);
  const [isBlurred, setIsBlurred] = useState(blurred);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dark-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Code className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-foreground">{title}</h4>
            <span className="text-xs text-foreground/60">{language}</span>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted hover:bg-muted/70 transition-colors text-sm"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-foreground/70">Nukopijuota!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-foreground/60" />
              <span className="text-foreground/70">Kopijuoti</span>
            </>
          )}
        </button>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-foreground/70 mb-4">{description}</p>
      )}

      {/* Code Block */}
      <div className="relative">
        <pre
          className={`bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed ${
            isBlurred ? "blur-sm select-none" : ""
          }`}
        >
          <code>{code}</code>
        </pre>

        {/* Blur Overlay for Sensitive Code */}
        {blurred && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setIsBlurred(!isBlurred)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
            >
              {isBlurred ? "Rodyti Kodą" : "Paslėpti Kodą"}
            </button>
          </div>
        )}
      </div>

      {/* Language Badge */}
      <div className="mt-3 flex items-center gap-2">
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          {language}
        </span>
        {blurred && (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Jautrus kodas
          </span>
        )}
      </div>
    </div>
  );
}

interface CodeShowcaseProps {
  projectTitle: string;
  snippets: Array<{
    title: string;
    language: string;
    code: string;
    description?: string;
    blurred?: boolean;
  }>;
}

/**
 * Komponentas rodyti kelis kodo fragmentus iš projekto
 */
export function CodeShowcase({ projectTitle, snippets }: CodeShowcaseProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Kodo Pavyzdžiai: {projectTitle}
        </h3>
        <p className="text-foreground/70">
          Realūs kodo fragmentai iš projekto (jautrūs duomenys pašalinti)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {snippets.map((snippet, idx) => (
          <CodeSnippet key={idx} {...snippet} />
        ))}
      </div>
    </div>
  );
}
