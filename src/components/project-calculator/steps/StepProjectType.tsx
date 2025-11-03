import { type ProjectData, type ProjectType } from '../calculatorLogic';
import { Rocket, Users, ShoppingCart, Truck, BarChart3, Code } from 'lucide-react';

interface StepProjectTypeProps {
  projectData: ProjectData;
  updateProjectData: (updates: Partial<ProjectData>) => void;
}

const PROJECT_TYPES = [
  {
    id: 'mvp' as ProjectType,
    icon: Rocket,
    title: 'MVP / Prototipas',
    description: 'Greitas startui, testuoti idėją rinkoje',
    examples: 'Landing page + formos, Basic CRM, Booking sistema',
    priceRange: '€2,500 - €5,000',
  },
  {
    id: 'crm' as ProjectType,
    icon: Users,
    title: 'CRM Sistema',
    description: 'Klientų valdymas, pardavimų sekimas',
    examples: 'Potencialių klientų sekimas, pardavimų valdymas, el. pašto integracija',
    priceRange: '€8,000 - €15,000',
  },
  {
    id: 'ecommerce' as ProjectType,
    icon: ShoppingCart,
    title: 'E-commerce Platforma',
    description: 'Internetinė parduotuvė, produktų katalogas',
    examples: 'Produktų sąrašai, pirkinių krepšelis, mokėjimų sistema',
    priceRange: '€10,000 - €20,000',
  },
  {
    id: 'logistics' as ProjectType,
    icon: Truck,
    title: 'Logistikos Sistema',
    description: 'Krovinių valdymas, maršrutų planavimas',
    examples: 'Siuntų sekimas, maršrutų optimizavimas, sandėlio valdymas',
    priceRange: '€12,000 - €25,000',
    featured: true,
  },
  {
    id: 'analytics' as ProjectType,
    icon: BarChart3,
    title: 'Analitikos Dashboard',
    description: 'Realaus laiko ataskaitos, KPI stebėjimas',
    examples: 'Duomenų vizualizacija, individualios ataskaitos, metrikų sekimas',
    priceRange: '€6,000 - €12,000',
  },
  {
    id: 'custom' as ProjectType,
    icon: Code,
    title: 'Kita / Individualus',
    description: 'Individualus sprendimas jūsų poreikiams',
    examples: 'Konsultacija padės nustatyti tikslią kainą',
    priceRange: '€5,000+',
  },
];

export function StepProjectType({ projectData, updateProjectData }: StepProjectTypeProps) {
  const handleSelect = (type: ProjectType) => {
    updateProjectData({ projectType: type });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-foreground">
        Kokio tipo projektą planuojate?
      </h2>
      <p className="text-foreground/70 mb-6">
        Pasirinkite artimiausią variantą. Galėsite pritaikyti funkcionalumą kituose žingsniuose.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROJECT_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = projectData.projectType === type.id;

          return (
            <button
              key={type.id}
              onClick={() => handleSelect(type.id)}
              className={`relative p-6 rounded-lg border-2 transition-all text-left hover:shadow-lg ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/50'
              } ${type.featured ? 'ring-2 ring-primary/20' : ''}`}
            >
              {type.featured && (
                <div className="absolute -top-3 left-4 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                  ⭐ Specializacija
                </div>
              )}

              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    isSelected ? 'bg-primary text-white' : 'bg-muted text-foreground'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1 text-foreground">{type.title}</h3>
                  <p className="text-sm text-foreground/70 mb-2">{type.description}</p>
                  <p className="text-xs text-foreground/60 mb-3">{type.examples}</p>
                  <p className="text-sm font-semibold text-primary">{type.priceRange}</p>
                </div>

                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                    ✓
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {projectData.projectType && (
        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-foreground/70">
            ✓ Pasirinkote:{' '}
            <span className="font-semibold text-foreground">
              {PROJECT_TYPES.find((t) => t.id === projectData.projectType)?.title}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
