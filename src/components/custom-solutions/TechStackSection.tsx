import { Code, Database, TestTube, Rocket } from 'lucide-react';
import { TechBadge, TechCategory } from './TechBadge';

export function TechStackSection() {
  return (
    <section className="py-16 md:py-20 bg-muted/30" id="tech-stack">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Modernios Technologijos, Patikimi Rezultatai
            </h2>
            <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
              Naudoju naujausią tech stack greičiui, saugumui ir skalabilumui.
              Kiekviena technologija parinkta pagal geriausiapraktikas ir ilgalaikę palaikymą.
            </p>
          </div>

          {/* Tech Stack Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Frontend */}
            <TechCategory name="Frontend" icon="🎨">
              <TechBadge
                name="React 18"
                badge="⚛️"
                level="Expert"
                description="Moderniausia React versija su Concurrent Features"
              />
              <TechBadge
                name="TypeScript"
                badge="📘"
                level="Expert"
                description="Type-safe kodas, mažiau klaidų production'e"
              />
              <TechBadge
                name="Vite"
                badge="⚡"
                level="Advanced"
                description="Greičiausias build tool, instant hot reload"
              />
              <TechBadge
                name="Tailwind CSS"
                badge="🎨"
                level="Expert"
                description="Utility-first CSS, responsive dizainas"
              />
              <TechBadge
                name="React Query"
                badge="🔄"
                level="Advanced"
                description="Server state management, auto-refetch"
              />
              <TechBadge
                name="React Hook Form"
                badge="📝"
                level="Advanced"
                description="Performance forms su Zod validation"
              />
            </TechCategory>

            {/* Backend & Database */}
            <TechCategory name="Backend & Database" icon="🗄️">
              <TechBadge
                name="Supabase"
                badge="⚡"
                level="Expert"
                description="PostgreSQL + Auth + Storage + Realtime"
              />
              <TechBadge
                name="PostgreSQL"
                badge="🐘"
                level="Advanced"
                description="Patikimiausias relational database"
              />
              <TechBadge
                name="Row Level Security"
                badge="🔒"
                level="Advanced"
                description="Database-level security, ultra safe"
              />
              <TechBadge
                name="Edge Functions"
                badge="⚙️"
                level="Intermediate"
                description="Serverless backend logic, Deno runtime"
              />
              <TechBadge
                name="Prisma"
                badge="🔷"
                level="Intermediate"
                description="Type-safe database client (kai reikia)"
              />
              <TechBadge
                name="REST & GraphQL"
                badge="🌐"
                level="Advanced"
                description="API design, Supabase PostgREST"
              />
            </TechCategory>

            {/* Testing & Quality */}
            <TechCategory name="Testing & Quality" icon="✅">
              <TechBadge
                name="Vitest"
                badge="🧪"
                level="Advanced"
                description="Greitas unit testing, Vite integration"
              />
              <TechBadge
                name="Playwright"
                badge="🎭"
                level="Advanced"
                description="E2E testing, real browser automation"
              />
              <TechBadge
                name="Testing Library"
                badge="🐙"
                level="Advanced"
                description="Component testing, user-centric"
              />
              <TechBadge
                name="TypeScript ESLint"
                badge="📋"
                level="Expert"
                description="Code quality, auto-fix issues"
              />
              <TechBadge
                name="Prettier"
                badge="💅"
                level="Expert"
                description="Code formatting, consistent style"
              />
              <TechBadge
                name="Husky + lint-staged"
                badge="🐶"
                level="Advanced"
                description="Pre-commit hooks, quality gates"
              />
            </TechCategory>

            {/* Deployment & DevOps */}
            <TechCategory name="Deployment & DevOps" icon="🚀">
              <TechBadge
                name="Vercel"
                badge="▲"
                level="Expert"
                description="Instant deployment, global CDN, 99.99% uptime"
              />
              <TechBadge
                name="GitHub Actions"
                badge="🔄"
                level="Advanced"
                description="CI/CD pipelines, automated testing"
              />
              <TechBadge
                name="Docker"
                badge="🐳"
                level="Intermediate"
                description="Containerization (jei reikia custom hosting)"
              />
              <TechBadge
                name="Sentry"
                badge="🐛"
                level="Intermediate"
                description="Error tracking, performance monitoring"
              />
              <TechBadge
                name="Cloudflare"
                badge="☁️"
                level="Intermediate"
                description="CDN, DDoS protection, caching"
              />
              <TechBadge
                name="Git & GitHub"
                badge="📦"
                level="Expert"
                description="Version control, collaboration"
              />
            </TechCategory>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="dark-card text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                <Code className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-foreground">
                Greitas Development
              </h4>
              <p className="text-foreground/70">
                React + Vite = instant hot reload. TypeScript = mažiau klaidų.
                Supabase = instant backend. MVP per 2-4 savaites.
              </p>
            </div>

            <div className="dark-card text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-foreground">
                Enterprise Saugumas
              </h4>
              <p className="text-foreground/70">
                Row Level Security duomenų bazėje. Type-safe API calls. Automatinės
                atsarginės kopijos. BDAR compliance.
              </p>
            </div>

            <div className="dark-card text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                <Rocket className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-foreground">
                Lengvas Skalabilumas
              </h4>
              <p className="text-foreground/70">
                Nuo MVP iki 10,000+ vartotojų be architektūros pakeitimų.
                Vercel Edge Network. Supabase auto-scaling.
              </p>
            </div>
          </div>

          {/* Why This Stack */}
          <div className="mt-12 dark-card">
            <h3 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
              <TestTube className="w-6 h-6 text-primary" />
              Kodėl būtent šis tech stack?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-foreground/70">
              <div>
                <h4 className="font-bold text-foreground mb-2">✅ Įrodyta praktikoje</h4>
                <p className="text-sm">
                  Visi mano 5+ projektai naudoja šį stack'ą. Veikia stabiliai, greičiau
                  release'inu features, mažiau bug'ų.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">🚀 Moderniausias rinkoje</h4>
                <p className="text-sm">
                  React 18 Concurrent Features, TypeScript 5.x, Vite 5. Ne pasenusios
                  technologijos iš 2015 metų.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">💰 Cost-effective</h4>
                <p className="text-sm">
                  Supabase free tier iki 500MB duomenų. Vercel Hobby plan €0. Production
                  hosting nuo €20/mėn.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">👨‍💻 Developer Experience</h4>
                <p className="text-sm">
                  TypeScript autocomplete, Vite hot reload, Supabase Studio GUI,
                  Vercel instant preview URLs. Produktyvumas +200%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
