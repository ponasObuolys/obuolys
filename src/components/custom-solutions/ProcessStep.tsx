interface ProcessStepData {
  number: number;
  title: string;
  duration: string;
  icon: string;
  description: string;
  output: string;
}

interface ProcessStepProps {
  step: ProcessStepData;
}

const ProcessStep = ({ step }: ProcessStepProps) => {
  return (
    <div className="dark-card">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">{step.number}</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground mb-1 text-left">
            {step.title}
          </h3>
          <p className="text-sm text-foreground/60 text-left">{step.duration}</p>
        </div>
        <div className="text-4xl">{step.icon}</div>
      </div>

      <p className="text-foreground/80 mb-4 text-left leading-relaxed">
        {step.description}
      </p>

      <div className="border-t border-border pt-4">
        <p className="text-sm text-foreground/70 text-left">
          <span className="font-bold text-foreground">Išeiga: </span>
          {step.output}
        </p>
      </div>
    </div>
  );
};

export default ProcessStep;
