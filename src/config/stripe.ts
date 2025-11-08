/**
 * Stripe konfigūracija ir kainų valdymas
 */

export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  productId: 'prod_TNxxapWX108lqE', // KAIP PRADĖTI PROGRAMUOTI SU DI
} as const;

/**
 * Kurso kainos pagal datos intervalus
 */
export const COURSE_PRICES = {
  earlyBird: {
    priceId: 'price_1SRC1QLP0H1tP3DjR1FRtzNX',
    amount: 9700, // 97 EUR
    label: 'Iki lapkričio 10 d.',
    description: 'Ankstyvasis paukštis - sutaupai 50€',
    endDate: new Date('2025-11-10T23:59:59'),
  },
  midBird: {
    priceId: 'price_1SRC2uLP0H1tP3DjZYEK5R7z',
    amount: 11700, // 117 EUR
    label: 'Lapkričio 11-17 d.',
    description: 'Vidutinė kaina - sutaupai 30€',
    startDate: new Date('2025-11-11T00:00:00'),
    endDate: new Date('2025-11-17T23:59:59'),
  },
  lateBird: {
    priceId: 'price_1SRC2uLP0H1tP3Djb7k6VkSv',
    amount: 13700, // 137 EUR
    label: 'Lapkričio 18-21 d.',
    description: 'Vėlyvoji kaina - sutaupai 10€',
    startDate: new Date('2025-11-18T00:00:00'),
    endDate: new Date('2025-11-21T23:59:59'),
  },
  courseDay: {
    priceId: 'price_1SRC2uLP0H1tP3DjybonjssY',
    amount: 14700, // 147 EUR
    label: 'Kurso dieną (lapkričio 22 d.)',
    description: 'Pilna kaina',
    startDate: new Date('2025-11-22T00:00:00'),
    endDate: new Date('2025-11-22T23:59:59'),
  },
} as const;

export type PriceTier = keyof typeof COURSE_PRICES;

/**
 * Grąžina aktyvią kainą pagal dabartinę datą
 */
export function getCurrentPrice(): {
  priceId: string;
  amount: number;
  label: string;
  description: string;
  tier: PriceTier;
  savings: number;
} {
  const now = new Date();

  // Early bird (iki lapkričio 10)
  if (now <= COURSE_PRICES.earlyBird.endDate) {
    return {
      ...COURSE_PRICES.earlyBird,
      tier: 'earlyBird',
      savings: 50,
    };
  }

  // Mid bird (lapkričio 11-17)
  if (
    COURSE_PRICES.midBird.startDate &&
    now >= COURSE_PRICES.midBird.startDate &&
    now <= COURSE_PRICES.midBird.endDate
  ) {
    return {
      ...COURSE_PRICES.midBird,
      tier: 'midBird',
      savings: 30,
    };
  }

  // Late bird (lapkričio 18-21)
  if (
    COURSE_PRICES.lateBird.startDate &&
    now >= COURSE_PRICES.lateBird.startDate &&
    now <= COURSE_PRICES.lateBird.endDate
  ) {
    return {
      ...COURSE_PRICES.lateBird,
      tier: 'lateBird',
      savings: 10,
    };
  }

  // Course day (lapkričio 22)
  return {
    ...COURSE_PRICES.courseDay,
    tier: 'courseDay',
    savings: 0,
  };
}

/**
 * Formatuoja kainą centais į EUR su dviem skaičiais po kablelio
 */
export function formatPrice(amountInCents: number): string {
  return `${(amountInCents / 100).toFixed(2)}€`;
}

/**
 * Grąžina visas kainas su aktyvumo statusu
 */
export function getAllPricesWithStatus() {
  const currentTier = getCurrentPrice().tier;

  return Object.entries(COURSE_PRICES).map(([tier, price]) => ({
    tier: tier as PriceTier,
    ...price,
    isActive: tier === currentTier,
    isPast: currentTier !== tier && new Date() > price.endDate,
  }));
}
