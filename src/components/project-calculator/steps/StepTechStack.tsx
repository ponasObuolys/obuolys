import { type ProjectData } from '../calculatorLogic';

interface StepTechStackProps {
  projectData: ProjectData;
  updateProjectData: (updates: Partial<ProjectData>) => void;
}

export function StepTechStack({ projectData, updateProjectData }: StepTechStackProps) {
  const updateTechStack = <K extends keyof ProjectData['techStack']>(
    key: K,
    value: ProjectData['techStack'][K]
  ) => {
    updateProjectData({
      techStack: {
        ...projectData.techStack,
        [key]: value,
      } as ProjectData['techStack'],
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-foreground">Technologijų Pasirinkimas</h2>
      <p className="text-foreground/70 mb-6">
        Rekomenduojame mūsų išbandytą technologijų rinkinį, bet galite pritaikyti pagal poreikius.
      </p>

      <div className="space-y-6">
        {/* Frontend */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Priekinio Galo Karkasas
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => updateTechStack('frontend', 'react-typescript')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                projectData.techStack.frontend === 'react-typescript'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-foreground">React 18 + TypeScript</h4>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded">
                  Rekomenduojama
                </span>
              </div>
              <p className="text-sm text-foreground/70 mb-2">
                Vite + Tailwind CSS. Greičiausias kūrimas, išbandytas rinkinys.
              </p>
              <p className="text-sm font-semibold text-foreground">€0 (bazinė kaina)</p>
            </button>

            <button
              onClick={() => updateTechStack('frontend', 'next-typescript')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                projectData.techStack.frontend === 'next-typescript'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <h4 className="font-bold text-foreground mb-2">Next.js 14 + TypeScript</h4>
              <p className="text-sm text-foreground/70 mb-2">
                SSR, SEO optimizacija, API maršrutai. Tinka SEO reikalaujančiems projektams.
              </p>
              <p className="text-sm font-semibold text-primary">+€1,000</p>
            </button>
          </div>
        </div>

        {/* Backend */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Galinis Galas ir Duomenų Bazė
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => updateTechStack('backend', 'supabase')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                projectData.techStack.backend === 'supabase'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-foreground">Supabase</h4>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded">
                  Rekomenduojama
                </span>
              </div>
              <p className="text-sm text-foreground/70 mb-2">
                PostgreSQL + Autentifikacija + Saugykla + Realaus laiko funkcijos. Greičiausias pristatymas.
              </p>
              <p className="text-sm font-semibold text-foreground">€0 (bazinė kaina)</p>
            </button>

            <button
              onClick={() => updateTechStack('backend', 'custom-nodejs')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                projectData.techStack.backend === 'custom-nodejs'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <h4 className="font-bold text-foreground mb-2">Individualus Node.js Galinis Galas</h4>
              <p className="text-sm text-foreground/70 mb-2">
                Individuali API, individuali duomenų bazės struktūra. Pilna kontrolė, bet ilgesnis kūrimas.
              </p>
              <p className="text-sm font-semibold text-primary">+€3,000</p>
            </button>
          </div>
        </div>

        {/* Additional Options */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Papildomos Parinktys
          </label>
          <div className="space-y-3">
            <button
              onClick={() => updateTechStack('testing', !projectData.techStack.testing)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                projectData.techStack.testing
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-foreground mb-1">
                    Išsami Testavimo Sistema
                  </h4>
                  <p className="text-sm text-foreground/70">
                    Vitest (vienetų testai) + Playwright (E2E testai). Tikslas: 95% testų aprėptis.
                  </p>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-primary">+€1,500</p>
                  <div
                    className={`mt-2 w-5 h-5 rounded border-2 flex items-center justify-center ${
                      projectData.techStack.testing
                        ? 'bg-primary border-primary'
                        : 'border-muted-foreground/30'
                    }`}
                  >
                    {projectData.techStack.testing && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() =>
                updateTechStack('premiumDesign', !projectData.techStack.premiumDesign)
              }
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                projectData.techStack.premiumDesign
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-foreground mb-1">Premium Dizaino Sistema</h4>
                  <p className="text-sm text-foreground/70">
                    Individuali dizaino sistema, animacijos, mikro-sąveikos, pažangus UI.
                  </p>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-primary">+€2,000</p>
                  <div
                    className={`mt-2 w-5 h-5 rounded border-2 flex items-center justify-center ${
                      projectData.techStack.premiumDesign
                        ? 'bg-primary border-primary'
                        : 'border-muted-foreground/30'
                    }`}
                  >
                    {projectData.techStack.premiumDesign && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
        <h4 className="font-semibold text-foreground mb-2">Pasirinktos Technologijos:</h4>
        <ul className="text-sm text-foreground/70 space-y-1">
          <li>
            • Priekinis galas:{' '}
            {projectData.techStack.frontend === 'react-typescript'
              ? 'React 18 + TypeScript + Vite'
              : 'Next.js 14 + TypeScript'}
          </li>
          <li>
            • Galinis galas:{' '}
            {projectData.techStack.backend === 'supabase'
              ? 'Supabase (PostgreSQL + Autentifikacija + Saugykla)'
              : 'Individualus Node.js + PostgreSQL'}
          </li>
          <li>
            • Testavimas: {projectData.techStack.testing ? 'Vitest + Playwright (95% aprėptis)' : 'Standartinis testavimas'}
          </li>
          <li>• Dizainas: {projectData.techStack.premiumDesign ? 'Premium individuali dizaino sistema' : 'Standartinis Tailwind UI'}</li>
          <li>• Talpinimas: Vercel (greitasis talpinimas, globalus CDN)</li>
        </ul>
      </div>
    </div>
  );
}
