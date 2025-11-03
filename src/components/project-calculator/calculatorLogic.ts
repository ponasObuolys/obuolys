export type ProjectType =
  | 'mvp'
  | 'crm'
  | 'ecommerce'
  | 'logistics'
  | 'analytics'
  | 'custom';

export type Feature =
  | 'auth'
  | 'realtime'
  | 'fileUpload'
  | 'payments'
  | 'reports'
  | 'mobileApp'
  | 'apiIntegrations'
  | 'customWorkflows';

export interface ProjectData {
  projectType: ProjectType | null;
  features: Feature[];
  techStack: {
    frontend: 'react-typescript' | 'next-typescript';
    backend: 'supabase' | 'custom-nodejs';
    testing: boolean;
    premiumDesign: boolean;
  };
  contactInfo: {
    email: string;
    companyName: string;
  };
}

export interface ProjectEstimate {
  minCost: number;
  maxCost: number;
  minWeeks: number;
  maxWeeks: number;
  recommendedPackage: 'MVP' | 'Standard' | 'Enterprise';
  breakdown: {
    basePrice: number;
    featuresPrice: number;
    techStackPrice: number;
    testingPrice: number;
    designPrice: number;
  };
  techStackBreakdown: {
    frontend: string;
    backend: string;
    testing: string;
    deployment: string;
  };
}

// Base pricing by project type (in EUR)
const BASE_PRICING: Record<ProjectType, { min: number; max: number; weeks: [number, number] }> = {
  mvp: { min: 2500, max: 5000, weeks: [2, 4] },
  crm: { min: 8000, max: 15000, weeks: [6, 10] },
  ecommerce: { min: 10000, max: 20000, weeks: [8, 12] },
  logistics: { min: 12000, max: 25000, weeks: [10, 16] },
  analytics: { min: 6000, max: 12000, weeks: [4, 8] },
  custom: { min: 5000, max: 30000, weeks: [4, 20] },
};

// Feature pricing (in EUR)
const FEATURE_PRICING: Record<Feature, number> = {
  auth: 800,
  realtime: 1500,
  fileUpload: 1000,
  payments: 2000,
  reports: 1500,
  mobileApp: 5000,
  apiIntegrations: 1000, // per integration
  customWorkflows: 2000,
};

// Tech stack pricing adjustments
const TECH_STACK_PRICING = {
  frontend: {
    'react-typescript': 0, // baseline
    'next-typescript': 1000, // SSR complexity
  },
  backend: {
    supabase: 0, // recommended, fastest
    'custom-nodejs': 3000, // custom backend adds complexity
  },
  testing: 1500, // Vitest + Playwright setup
  premiumDesign: 2000, // Custom design system
};

export function calculateProjectEstimate(data: ProjectData): ProjectEstimate {
  if (!data.projectType) {
    throw new Error('Project type is required');
  }

  const basePrice = BASE_PRICING[data.projectType];

  // Calculate features cost
  const featuresPrice = data.features.reduce((total, feature) => {
    return total + FEATURE_PRICING[feature];
  }, 0);

  // Calculate tech stack adjustments
  const techStackPrice =
    TECH_STACK_PRICING.frontend[data.techStack.frontend] +
    TECH_STACK_PRICING.backend[data.techStack.backend];

  const testingPrice = data.techStack.testing ? TECH_STACK_PRICING.testing : 0;
  const designPrice = data.techStack.premiumDesign ? TECH_STACK_PRICING.premiumDesign : 0;

  // Total calculation
  const totalMinCost = basePrice.min + featuresPrice + techStackPrice + testingPrice + designPrice;
  const totalMaxCost = basePrice.max + featuresPrice + techStackPrice + testingPrice + designPrice;

  // Adjust timeline based on features
  const featureComplexityWeeks = Math.floor(data.features.length * 0.5);
  const minWeeks = basePrice.weeks[0] + featureComplexityWeeks;
  const maxWeeks = basePrice.weeks[1] + featureComplexityWeeks + (data.techStack.testing ? 1 : 0);

  // Determine recommended package
  let recommendedPackage: 'MVP' | 'Standard' | 'Enterprise';
  if (totalMinCost < 6000) {
    recommendedPackage = 'MVP';
  } else if (totalMinCost < 15000) {
    recommendedPackage = 'Standard';
  } else {
    recommendedPackage = 'Enterprise';
  }

  // Tech stack breakdown for display
  const techStackBreakdown = {
    frontend:
      data.techStack.frontend === 'react-typescript'
        ? 'React 18 + TypeScript + Vite'
        : 'Next.js 14 + TypeScript',
    backend:
      data.techStack.backend === 'supabase'
        ? 'Supabase (PostgreSQL + Autentifikacija + Saugykla + Realaus laiko funkcijos)'
        : 'Individualus Node.js + PostgreSQL',
    testing: data.techStack.testing
      ? 'Vitest (Vienetų testai) + Playwright (E2E testai) + 95% aprėptis'
      : 'Standartinis testavimas įskaičiuotas',
    deployment: 'Vercel (greitas talpinimas, globalus CDN, 99.99% veikimo laikas)',
  };

  return {
    minCost: Math.round(totalMinCost),
    maxCost: Math.round(totalMaxCost),
    minWeeks,
    maxWeeks,
    recommendedPackage,
    breakdown: {
      basePrice: basePrice.min,
      featuresPrice,
      techStackPrice,
      testingPrice,
      designPrice,
    },
    techStackBreakdown,
  };
}

// Helper to format currency
export function formatCurrency(amount: number): string {
  return `€${amount.toLocaleString('lt-LT')}`;
}

// Helper to format timeline
export function formatTimeline(minWeeks: number, maxWeeks: number): string {
  if (minWeeks === maxWeeks) {
    return `${minWeeks} ${minWeeks === 1 ? 'savaitė' : minWeeks < 10 ? 'savaitės' : 'savaičių'}`;
  }
  return `${minWeeks}-${maxWeeks} ${maxWeeks < 10 ? 'savaitės' : 'savaičių'}`;
}
