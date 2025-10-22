// CTA ir Hero sekcijų TypeScript tipai

export type CTAContext = "article" | "tools" | "publications";
export type CTAVariant = "default" | "compact" | "inline";
export type CTAIcon = "Target" | "Rocket" | "Sparkles" | "Brain" | "Zap" | "TrendingUp";

export interface CTASection {
  id: string;
  title: string;
  description: string;
  button_text: string;
  button_url: string;
  context: string; // Changed from CTAContext to string to match DB
  variant: string; // Changed from CTAVariant to string to match DB
  icon: string; // Changed from CTAIcon to string to match DB
  priority: number;
  is_sticky: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StickyMessage {
  id: string;
  title: string;
  description: string;
  cta: string;
  emoji: string;
  priority: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroSection {
  id: string;
  title: string;
  subtitle: string;
  button_text: string | null; // Changed to match DB
  button_url: string | null; // Changed to match DB
  secondary_button_text: string | null;
  secondary_button_url: string | null;
  badge_text: string | null;
  image_url: string | null;
  priority: number;
  show_stats: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Form tipai
export interface CTASectionFormData {
  title: string;
  description: string;
  button_text: string;
  button_url: string;
  context: CTAContext;
  variant: CTAVariant;
  icon: CTAIcon;
  priority: number;
  active: boolean;
}

export interface StickyMessageFormData {
  title: string;
  description: string;
  cta: string;
  emoji: string;
  priority: number;
  active: boolean;
}

export interface HeroSectionFormData {
  title: string;
  subtitle: string;
  button_text: string;
  button_url: string;
  secondary_button_text: string;
  secondary_button_url: string;
  badge_text: string;
  image_url: string;
  priority: number;
  show_stats: boolean;
  active: boolean;
}
