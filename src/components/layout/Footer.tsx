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
        <div className="text-center">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">Susisiekite su manimi</h2>
          <SocialLinks className="justify-center" />
        </div>

        {/* Navigation & legal links */}
        <div className="border-t border-border mt-6 pt-6">
          <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
            <nav aria-label="Pagrindinės nuorodos">
              <ul className="flex flex-col items-center gap-2 md:flex-row md:flex-wrap md:justify-center md:gap-4">
                {primaryLinks.map(item => (
                  <li
                    key={item.label}
                    className="md:inline-flex md:items-center md:after:mx-2 md:after:text-muted-foreground/50 md:after:content-['•'] md:last:after:hidden"
                  >
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
              <ul className="flex flex-col items-center gap-2 md:flex-row md:flex-wrap md:justify-center md:gap-4">
                {legalLinks.map(item => (
                  <li
                    key={item.label}
                    className="md:inline-flex md:items-center md:after:mx-2 md:after:text-muted-foreground/50 md:after:content-['•'] md:last:after:hidden"
                  >
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
