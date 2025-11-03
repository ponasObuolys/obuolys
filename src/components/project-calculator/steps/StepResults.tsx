import { useState } from 'react';
import { type ProjectData } from '../calculatorLogic';
import { formatCurrency, formatTimeline } from '../calculatorLogic';
import { Check, Mail, TrendingUp, Clock, Zap, Shield, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { submitCalculatorData } from '@/services/calculator.service';
import { toast } from 'sonner';
import { secureLogger } from '@/utils/browserLogger';

interface StepResultsProps {
  projectData: ProjectData;
  updateProjectData: (updates: Partial<ProjectData>) => void;
  estimate: ReturnType<typeof import('../calculatorLogic').calculateProjectEstimate> | null;
}

export function StepResults({ projectData, updateProjectData, estimate }: StepResultsProps) {
  const [emailSent, setEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!estimate) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/70">Skaičiuojama...</p>
      </div>
    );
  }

  const handleEmailChange = (email: string) => {
    updateProjectData({
      contactInfo: {
        ...projectData.contactInfo,
        email,
      },
    });
  };

  const handleCompanyChange = (companyName: string) => {
    updateProjectData({
      contactInfo: {
        ...projectData.contactInfo,
        companyName,
      },
    });
  };

  const handleSubmitEmail = async () => {
    // Validation
    if (!projectData.contactInfo.email) {
      toast.error('Įveskite el. pašto adresą');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(projectData.contactInfo.email)) {
      toast.error('Netinkamas el. pašto formato');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitCalculatorData(projectData);

      if (result.success) {
        setEmailSent(true);
        toast.success('Pasiūlymas sėkmingai išsiųstas!', {
          description: 'Tikrinkite savo el. paštą. Atsakysime per 24 valandas.',
        });
      } else {
        toast.error('Klaida išsiunčiant pasiūlymą', {
          description: result.error || 'Bandykite dar kartą',
        });
      }
    } catch (error) {
      secureLogger.error('Calculator submission send error', error);
      toast.error('Įvyko nenumatyta klaida', {
        description: 'Bandykite dar kartą arba susisiekite tiesiogiai el. paštu',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-foreground">Jūsų Projekto Įvertinimas</h2>
      <p className="text-foreground/70 mb-6">
        Orientacinė kaina ir trukmė pagal pasirinktus parametrus
      </p>

      {/* Main Estimate Card */}
      <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-foreground/60 mb-1">Orientacinė Kaina</p>
            <p className="text-4xl font-bold text-foreground">
              {formatCurrency(estimate.minCost)} - {formatCurrency(estimate.maxCost)}
            </p>
          </div>
          <div>
            <p className="text-sm text-foreground/60 mb-1">Trukmė</p>
            <p className="text-4xl font-bold text-foreground">
              {formatTimeline(estimate.minWeeks, estimate.maxWeeks)}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-card">
          <p className="text-sm font-semibold text-foreground mb-2">
            Rekomenduojamas Paketas
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white font-bold">
            <TrendingUp className="w-4 h-4" />
            {estimate.recommendedPackage}
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="mb-6 p-5 rounded-lg border border-border bg-card">
        <h3 className="font-bold text-foreground mb-4">Kainos Struktūra</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground/70">Bazinė kaina ({projectData.projectType})</span>
            <span className="font-semibold">{formatCurrency(estimate.breakdown.basePrice)}</span>
          </div>
          {estimate.breakdown.featuresPrice > 0 && (
            <div className="flex justify-between">
              <span className="text-foreground/70">Funkcionalumas ({projectData.features.length} funkcijos)</span>
              <span className="font-semibold">+{formatCurrency(estimate.breakdown.featuresPrice)}</span>
            </div>
          )}
          {estimate.breakdown.techStackPrice > 0 && (
            <div className="flex justify-between">
              <span className="text-foreground/70">Tech stack parinktys</span>
              <span className="font-semibold">+{formatCurrency(estimate.breakdown.techStackPrice)}</span>
            </div>
          )}
          {estimate.breakdown.testingPrice > 0 && (
            <div className="flex justify-between">
              <span className="text-foreground/70">Testavimo sistema</span>
              <span className="font-semibold">+{formatCurrency(estimate.breakdown.testingPrice)}</span>
            </div>
          )}
          {estimate.breakdown.designPrice > 0 && (
            <div className="flex justify-between">
              <span className="text-foreground/70">Premium dizainas</span>
              <span className="font-semibold">+{formatCurrency(estimate.breakdown.designPrice)}</span>
            </div>
          )}
          <div className="pt-2 mt-2 border-t border-border flex justify-between font-bold text-base">
            <span>Viso:</span>
            <span className="text-primary">
              {formatCurrency(estimate.minCost)} - {formatCurrency(estimate.maxCost)}
            </span>
          </div>
        </div>
      </div>

      {/* Tech Stack Breakdown */}
      <div className="mb-6 p-5 rounded-lg border border-border bg-card">
        <h3 className="font-bold text-foreground mb-4">Technologijos</h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-foreground mb-1">Priekinis galas</p>
            <p className="text-foreground/70">{estimate.techStackBreakdown.frontend}</p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">Galinis galas ir duomenų bazė</p>
            <p className="text-foreground/70">{estimate.techStackBreakdown.backend}</p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">Testavimas</p>
            <p className="text-foreground/70">{estimate.techStackBreakdown.testing}</p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">Talpinimas</p>
            <p className="text-foreground/70">{estimate.techStackBreakdown.deployment}</p>
          </div>
        </div>
      </div>

      {/* What's Included */}
      <div className="mb-6 p-5 rounded-lg border border-border bg-card">
        <h3 className="font-bold text-foreground mb-4">Kas Įskaičiuota</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-foreground/70">Visas source code</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-foreground/70">Deployment į Vercel</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-foreground/70">Dokumentacija</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-foreground/70">30 dienų palaikymas</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-foreground/70">Mokymai komandai</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-foreground/70">Kodo peržiūros sesijos</span>
          </div>
        </div>
      </div>

      {/* Why This Stack */}
      <div className="mb-6 p-5 rounded-lg bg-muted/50 border border-border">
        <h3 className="font-bold text-foreground mb-4">Kodėl Šios Technologijos?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Greitas Pristatymas</p>
              <p className="text-foreground/60">MVP per 2-4 savaites. Gamybai paruoštas kodas.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Enterprise Saugumas</p>
              <p className="text-foreground/60">Eilučių lygmens saugumas, tipų saugumas, GDPR atitiktis.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Lengvas Skalabilumas</p>
              <p className="text-foreground/60">Nuo MVP iki 10,000+ vartotojų be problemų.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Email Collection */}
      <div className="p-6 rounded-lg border-2 border-primary/20 bg-primary/5">
        <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          Gauti Detalų Pasiūlymą
        </h3>
        <p className="text-sm text-foreground/70 mb-4">
          Išsiųsime PDF su skaičiavimo rezultatais, technologijų paaiškinimais ir portfolio projektų nuorodomis.
        </p>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">El. paštas *</Label>
            <Input
              id="email"
              type="email"
              placeholder="jusu@email.lt"
              value={projectData.contactInfo.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="company">Įmonės pavadinimas (neprivaloma)</Label>
            <Input
              id="company"
              type="text"
              placeholder="UAB Jūsų Įmonė"
              value={projectData.contactInfo.companyName}
              onChange={(e) => handleCompanyChange(e.target.value)}
            />
          </div>

          {emailSent ? (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Pasiūlymas išsiųstas į {projectData.contactInfo.email}!
              </p>
            </div>
          ) : (
            <>
              <Button
                onClick={handleSubmitEmail}
                disabled={isSubmitting || !projectData.contactInfo.email}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Siunčiama...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Gauti Pasiūlymą El. Paštu
                  </>
                )}
              </Button>
              <p className="text-xs text-foreground/60">
                Susisieksime per 24 val su individualizuotu pasiūlymu ir atsakysime į klausimus.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <div className="mt-6 p-5 rounded-lg bg-muted/30">
        <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Kiti Žingsniai
        </h4>
        <ol className="space-y-2 text-sm text-foreground/70">
          <li>1. Gausi detalų PDF pasiūlymą el. paštu</li>
          <li>2. Nemokama 30min konsultacija (vaizdo skambutis)</li>
          <li>3. Tikslesnė kaina ir trukmė po reikalavimų analizės</li>
          <li>4. Sutartis ir pradedame darbą</li>
        </ol>
      </div>
    </div>
  );
}
