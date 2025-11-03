import { type ProjectData, type Feature } from '../calculatorLogic';
import {
  Shield,
  Zap,
  Upload,
  CreditCard,
  FileText,
  Smartphone,
  Link,
  Workflow
} from 'lucide-react';

interface StepFeaturesProps {
  projectData: ProjectData;
  updateProjectData: (updates: Partial<ProjectData>) => void;
}

const FEATURES = [
  {
    id: 'auth' as Feature,
    icon: Shield,
    title: 'Vartotojų Autentifikacija',
    description: 'Prisijungimas, registracija, slaptažodžio atstatymas, vartotojų vaidmenys',
    price: 800,
    recommended: true,
  },
  {
    id: 'realtime' as Feature,
    icon: Zap,
    title: 'Realaus Laiko Atnaujinimai',
    description: 'Tiesioginė duomenų sinchronizacija, WebSocket ryšiai',
    price: 1500,
  },
  {
    id: 'fileUpload' as Feature,
    icon: Upload,
    title: 'Failų Įkėlimas',
    description: 'Paveikslėlių ir dokumentų įkėlimas, saugyklos valdymas',
    price: 1000,
  },
  {
    id: 'payments' as Feature,
    icon: CreditCard,
    title: 'Mokėjimų Integracija',
    description: 'Stripe/PayPal integracija, sąskaitų išrašymas',
    price: 2000,
  },
  {
    id: 'reports' as Feature,
    icon: FileText,
    title: 'Sudėtingos Ataskaitos',
    description: 'PDF generavimas, duomenų eksportavimas, grafikai',
    price: 1500,
  },
  {
    id: 'mobileApp' as Feature,
    icon: Smartphone,
    title: 'Mobili Aplikacija',
    description: 'React Native iOS/Android programėlė',
    price: 5000,
  },
  {
    id: 'apiIntegrations' as Feature,
    icon: Link,
    title: 'API Integracijos',
    description: 'Išorinių paslaugų integracijos (kaina už integraciją)',
    price: 1000,
    perItem: true,
  },
  {
    id: 'customWorkflows' as Feature,
    icon: Workflow,
    title: 'Verslo Procesų Automatizavimas',
    description: 'Automatizuoti verslo procesai ir darbo srautai',
    price: 2000,
  },
];

export function StepFeatures({ projectData, updateProjectData }: StepFeaturesProps) {
  const toggleFeature = (featureId: Feature) => {
    const currentFeatures = projectData.features;
    const isSelected = currentFeatures.includes(featureId);

    updateProjectData({
      features: isSelected
        ? currentFeatures.filter((f) => f !== featureId)
        : [...currentFeatures, featureId],
    });
  };

  const totalFeaturesPrice = projectData.features.reduce((total, featureId) => {
    const feature = FEATURES.find((f) => f.id === featureId);
    return total + (feature?.price || 0);
  }, 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-foreground">
        Kokios funkcijos reikalingos?
      </h2>
      <p className="text-foreground/70 mb-6">
        Pasirinkite visas funkcijas, kurių reikės jūsų projektui. Galite pasirinkti keletą.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          const isSelected = projectData.features.includes(feature.id);

          return (
            <button
              key={feature.id}
              onClick={() => toggleFeature(feature.id)}
              className={`relative p-5 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/50'
              } ${feature.recommended ? 'ring-1 ring-primary/20' : ''}`}
            >
              {feature.recommended && (
                <div className="absolute -top-2 right-4 px-2 py-0.5 bg-primary text-white text-xs font-bold rounded">
                  Rekomenduojama
                </div>
              )}

              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isSelected ? 'bg-primary text-white' : 'bg-muted text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-bold mb-1 text-foreground">{feature.title}</h3>
                  <p className="text-xs text-foreground/60 mb-2">{feature.description}</p>
                  <p className="text-sm font-semibold text-primary">
                    +€{feature.price.toLocaleString()}
                    {feature.perItem && ' /vnt'}
                  </p>
                </div>

                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-primary border-primary'
                      : 'border-muted-foreground/30'
                  }`}
                >
                  {isSelected && <span className="text-white text-xs">✓</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Pasirinktos funkcijos: {projectData.features.length}
            </p>
            {projectData.features.length > 0 && (
              <p className="text-xs text-foreground/60 mt-1">
                {projectData.features
                  .map((fId) => FEATURES.find((f) => f.id === fId)?.title)
                  .join(', ')}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">
              +€{totalFeaturesPrice.toLocaleString()}
            </p>
            <p className="text-xs text-foreground/60">papildoma kaina</p>
          </div>
        </div>
      </div>

      {projectData.features.length === 0 && (
        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-sm text-amber-600 dark:text-amber-400">
            ⚠️ Pasirinkite bent vieną funkciją, kad tęstumėte
          </p>
        </div>
      )}
    </div>
  );
}
