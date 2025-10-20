export const CONSENT_KEY = "obuolys_cookie_consent";
export const CONSENT_VERSION = "1.0";

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  version: string;
  timestamp: number;
}

/**
 * Check if user has given analytics consent
 */
export function hasAnalyticsConsent(): boolean {
  try {
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    if (!savedConsent) return false;

    const consent: ConsentPreferences = JSON.parse(savedConsent);
    return consent.analytics === true;
  } catch {
    return false;
  }
}

/**
 * Check if user has given any consent (to hide banner)
 */
export function hasGivenConsent(): boolean {
  try {
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    return savedConsent !== null;
  } catch {
    return false;
  }
}
