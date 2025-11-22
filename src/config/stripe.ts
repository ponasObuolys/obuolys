/**
 * Stripe konfigūracija ir kainų valdymas
 */

export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  productId: 'prod_TNxxapWX108lqE', // KAIP PRADĖTI PROGRAMUOTI SU DI
} as const;

// Datos logikai (Lietuvos laiku, UTC+02)
const EARLY_BIRD_END = new Date('2025-12-07T00:00:00+02:00'); // iki 2025-12-06 imtinai

type CoursePriceInfo = {
  priceId: string;
  amount: number;
  label: string;
  description: string;
};

const EARLY_BIRD_PRICE: CoursePriceInfo = {
  priceId: 'price_1SRC1QLP0H1tP3DjR1FRtzNX', // 97 EUR price ID
  amount: 9700,
  label: '97€',
  description: 'Dabartinė kaina iki 2025-12-07. Kursų prieiga 3 mėn.',
};

const STANDARD_PRICE: CoursePriceInfo = {
  priceId: 'price_1SRC2uLP0H1tP3DjZYEK5R7z', // 117 EUR price ID
  amount: 11700,
  label: '117€',
  description: 'Kaina galioja nuo 2025-12-07 iki kurso pradžios. Kursų prieiga 3 mėn.',
};

/**
 * Grąžina dabartinę kurso kainą pagal datą:
 * - iki 2025-12-07 (neįskaitytinai) – 97€
 * - nuo 2025-12-07 – 117€
 */
export function getCurrentPrice(): CoursePriceInfo {
  const now = new Date();

  if (now < EARLY_BIRD_END) {
    return EARLY_BIRD_PRICE;
  }

  return STANDARD_PRICE;
}

/**
 * Formatuoja kainą centais į EUR su dviem skaičiais po kablelio
 */
export function formatPrice(amountInCents: number): string {
  return `${(amountInCents / 100).toFixed(2)}€`;
}
