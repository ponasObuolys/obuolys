import { SocialLinks } from "@/components/ui/SocialLinks";
import { Link } from "react-router-dom";

const primaryLinks: { to: string; label: string; className?: string }[] = [
  {
    to: "/skaiciuokle",
    label: "📊 Projekto Skaičiuoklė",
    className: "font-medium",
  },
  { to: "/verslo-sprendimai", label: "Verslo Sprendimai" },
  { to: "/kontaktai", label: "Kontaktai" },
];

type FooterLegalLink =
  | { type: "internal"; to: string; label: string }
  | { type: "external"; href: string; label: string };

const legalLinks: FooterLegalLink[] = [
  { type: "internal", to: "/privatumas", label: "Privatumo politika" },
  { type: "internal", to: "/slapukai", label: "Slapukų politika" },
  { type: "external", href: "mailto:labas@ponasobuolys.lt", label: "labas@ponasobuolys.lt" },
];

const Footer = () => {
  return (
    <footer
      className="bg-secondary text-white mt-16 w-full"
      itemScope
      itemType="https://schema.org/WPFooter"
      role="contentinfo"
    >
      <div className="container mx-auto py-6">
        {/* SEO-optimized structured data */}
        <div itemScope itemType="https://schema.org/Person" className="hidden">
          <meta itemProp="name" content="ponas Obuolys" />
          <meta itemProp="jobTitle" content="AI specialistas" />
          <meta
            itemProp="description"
            content="Dirbtinio intelekto naujienos, įrankiai, kursai ir straipsniai lietuvių kalba"
          />
          <meta itemProp="email" content="labas@ponasobuolys.lt" />
          <meta itemProp="url" content="https://ponasobuolys.lt" />
        </div>

        {/* Compact social links section */}
        <div className="text-center mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">Susisiekite su manimi</h2>
          <SocialLinks className="justify-center" />
        </div>

        {/* Main footer content - 3 columns on desktop */}
        <div className="border-t border-border pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column - Tech Stack */}
            <div className="text-center md:text-left">
              <h3 className="text-xs font-semibold text-foreground mb-3">Technologijos</h3>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 text-xs">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  React 18
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  TypeScript
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Supabase
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Tailwind CSS
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Vercel
                </span>
              </div>
            </div>

            {/* Center Column - Navigation */}
            <div className="text-center">
              <nav aria-label="Pagrindinės nuorodos" className="mb-4">
                <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
                  {primaryLinks.map(item => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className={`hover:text-primary transition-colors ${item.className ?? ""}`.trim()}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <nav aria-label="Teisinės nuorodos">
                <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
                  {legalLinks.map(item => (
                    <li key={item.label}>
                      {item.type === "internal" ? (
                        <Link to={item.to} className="hover:text-primary transition-colors">
                          {item.label}
                        </Link>
                      ) : (
                        <a href={item.href} className="hover:text-primary transition-colors">
                          {item.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Right Column - Quick Start */}
            <div className="text-center md:text-right">
              <h3 className="text-xs font-semibold text-foreground mb-3">Greitas Startas</h3>
              <div className="flex flex-col gap-2 text-xs text-muted-foreground items-center md:items-end">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary font-bold text-[10px]">
                    1
                  </span>
                  <Link to="/skaiciuokle" className="text-primary hover:underline">
                    Skaičiuoklė
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary font-bold text-[10px]">
                    2
                  </span>
                  <span>Kainų pasiūlymas (24h)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary font-bold text-[10px]">
                    3
                  </span>
                  <span>Projektas (1-2 sav.)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
