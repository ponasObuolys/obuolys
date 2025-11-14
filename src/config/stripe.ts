/**
 * Stripe konfigūracija ir kainų valdymas
 */

export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  productId: 'prod_TNxxapWX108lqE', // KAIP PRADĖTI PROGRAMUOTI SU DI
} as const;

/**
 * Kurso kaina - viena fiksuota kaina visam laikui
 */
export const COURSE_PRICE = {
  priceId: 'price_1SRC1QLP0H1tP3DjR1FRtzNX', // 97 EUR price ID
  amount: 9700, // 97 EUR
  label: '97€',
  description: 'Vienkartinis mokėjimas, prieiga neribotam laikui',
} as const;

/**
 * Grąžina dabartinę kurso kainą (visada 97 EUR)
 */
export function getCurrentPrice(): {
  priceId: string;
  amount: number;
  label: string;
  description: string;
} {
  return COURSE_PRICE;
}

/**
 * Formatuoja kainą centais į EUR su dviem skaičiais po kablelio
 */
export function formatPrice(amountInCents: number): string {
  return `${(amountInCents / 100).toFixed(2)}€`;
}
