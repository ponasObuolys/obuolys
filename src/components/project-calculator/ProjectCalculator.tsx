import { useState } from 'react';
import { ChevronRight, ChevronLeft, Calculator, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StepProjectType } from './steps/StepProjectType';
import { StepFeatures } from './steps/StepFeatures';
import { StepTechStack } from './steps/StepTechStack';
import { StepResults } from './steps/StepResults';
import { calculateProjectEstimate, type ProjectData } from './calculatorLogic';
import { secureLogger } from '@/utils/browserLogger';

const STEPS = [
  { id: 1, title: 'Projekto Tipas', component: StepProjectType },
  { id: 2, title: 'Funkcionalumas', component: StepFeatures },
  { id: 3, title: 'Tech Stack', component: StepTechStack },
  { id: 4, title: 'Rezultatai', component: StepResults },
];

export function ProjectCalculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState<ProjectData>({
    projectType: null,
    features: [],
    techStack: {
      frontend: 'react-typescript',
      backend: 'supabase',
      testing: false,
      premiumDesign: false,
    },
    contactInfo: {
      email: '',
      companyName: '',
    },
  });

  const [estimate, setEstimate] = useState<ReturnType<typeof calculateProjectEstimate> | null>(
    null
  );

  const updateProjectData = (updates: Partial<ProjectData>) => {
    setProjectData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep === 3) {
      // Calculate estimate before going to results
      const calculatedEstimate = calculateProjectEstimate(projectData);
      setEstimate(calculatedEstimate);
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return projectData.projectType !== null;
      case 2:
        return projectData.features.length > 0;
      case 3:
        return true; // Tech stack has defaults
      case 4:
        return true;
      default:
        return false;
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <div className="min-h-screen py-16 md:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Calculator className="w-5 h-5" />
              <span className="font-semibold">Nemokama Skaičiuoklė</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              React/TypeScript Projekto Skaičiuoklė
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Sužinokite orientacinę kainą ir trukmę jūsų projektui per 2 minutes
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              {STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center ${index < STEPS.length - 1 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      currentStep > step.id
                        ? 'bg-primary border-primary text-white'
                        : currentStep === step.id
                        ? 'border-primary text-primary bg-primary/10'
                        : 'border-muted text-muted-foreground'
                    }`}
                  >
                    {currentStep > step.id ? '✓' : step.id}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-all ${
                        currentStep > step.id ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-foreground/60">
              {STEPS.map((step) => (
                <span key={step.id} className="w-20 text-center">
                  {step.title}
                </span>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="p-8 mb-8">
            <CurrentStepComponent
              projectData={projectData}
              updateProjectData={updateProjectData}
              estimate={estimate}
            />
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Atgal
            </Button>

            {currentStep < STEPS.length ? (
              <Button onClick={handleNext} disabled={!canProceed()} className="gap-2">
                Toliau
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  secureLogger.info('Generate PDF and send email action triggered');
                }}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Gauti Pasiūlymą
              </Button>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center text-sm text-foreground/60">
            <p>
              Turite klausimų? <a href="/kontaktai" className="text-primary hover:underline">Susisiekite</a> arba{' '}
              <a href="/verslo-sprendimai" className="text-primary hover:underline">peržiūrėkite portfolio</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
