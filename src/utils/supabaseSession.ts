import { supabase } from '@/integrations/supabase/client';
import { secureLogger } from '@/utils/browserLogger';

export interface SessionRecoveryResult {
  success: boolean;
  error?: string;
  sessionRefreshed?: boolean;
}

/**
 * Sesijos atkūrimo ir token'o atnaujinimo utilitas admin operacijoms
 */
export class SupabaseSessionManager {
  private static refreshPromise: Promise<SessionRecoveryResult> | null = null;
  private static readonly MAX_RETRY_ATTEMPTS = 3;
  private static readonly RETRY_DELAY = 1000; // 1 sekundė

  /**
   * Patikrinti ir atnaujinti sesiją jei reikia
   */
  static async ensureValidSession(): Promise<SessionRecoveryResult> {
    // Jei jau vyksta refresh, laukti to pačio
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performSessionRefresh();
    const result = await this.refreshPromise;
    this.refreshPromise = null;

    return result;
  }

  private static async performSessionRefresh(): Promise<SessionRecoveryResult> {
    try {
      // 1. Paimti dabartinę sesiją
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        secureLogger.error('Session check failed', { error: sessionError });
        return { success: false, error: sessionError.message };
      }

      if (!session) {
        return { success: false, error: 'Nėra autentifikacijos sesijos' };
      }

      // 2. Patikrinti ar token'as nebeveiks artimiausiu metu (< 5 min)
      const now = Math.floor(Date.now() / 1000);
      const tokenExpiry = session.expires_at || 0;
      const timeUntilExpiry = tokenExpiry - now;

      secureLogger.debug('Token expiry check', {
        timeUntilExpiry,
        willExpireSoon: timeUntilExpiry < 300
      });

      // 3. Jei token'as baigiasi per 5 min, atnaujinti
      if (timeUntilExpiry < 300) {
        const { data: { session: refreshedSession }, error: refreshError } =
          await supabase.auth.refreshSession();

        if (refreshError) {
          secureLogger.error('Session refresh failed', { error: refreshError });
          return { success: false, error: refreshError.message };
        }

        if (!refreshedSession) {
          return { success: false, error: 'Nepavyko atnaujinti sesijos' };
        }

        secureLogger.info('Session refreshed successfully');
        return { success: true, sessionRefreshed: true };
      }

      return { success: true, sessionRefreshed: false };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Nežinoma klaida';
      secureLogger.error('Session management error', { error });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Patikrinti admin teises su sesijos valdymu
   */
  static async ensureAdminAccess(): Promise<SessionRecoveryResult> {
    try {
      // 1. Atnaujinti sesiją jei reikia
      const sessionResult = await this.ensureValidSession();
      if (!sessionResult.success) {
        return sessionResult;
      }

      // 2. Patikrinti admin teises
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Nėra autentifikuoto vartotojo' };
      }

      // 3. Patikrinti admin statusą per RLS funkciją
      const { data: adminCheck, error: adminError } = await supabase
        .rpc('is_admin');

      if (adminError) {
        secureLogger.error('Admin check failed', { error: adminError });
        return { success: false, error: adminError.message };
      }

      if (!adminCheck) {
        return { success: false, error: 'Neturite administratoriaus teisių' };
      }

      return { success: true };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Nežinoma klaida';
      secureLogger.error('Admin access check error', { error });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Atlikti admin operaciją su automatišku sesijos valdymu
   */
  static async executeAdminOperation<T>(
    operation: () => Promise<T>,
    operationName = 'admin operation'
  ): Promise<{ success: boolean; data?: T; error?: string }> {

    for (let attempt = 1; attempt <= this.MAX_RETRY_ATTEMPTS; attempt++) {
      try {
        // 1. Užtikrinti admin prieigą
        const adminResult = await this.ensureAdminAccess();
        if (!adminResult.success) {
          return { success: false, error: adminResult.error };
        }

        // 2. Vykdyti operaciją
        const data = await operation();
        secureLogger.info(`${operationName} completed successfully`);
        return { success: true, data };

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Nežinoma klaida';

        // 3. Jei auth klaida ir ne paskutinis bandymas - bandyti iš naujo
        if (this.isAuthError(error) && attempt < this.MAX_RETRY_ATTEMPTS) {
          secureLogger.warn(`${operationName} failed (attempt ${attempt}), retrying...`, {
            error: errorMessage
          });

          // Palaukti prieš bandant iš naujo
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * attempt));
          continue;
        }

        // 4. Galutinė klaida
        secureLogger.error(`${operationName} failed after ${attempt} attempts`, { error });
        return { success: false, error: errorMessage };
      }
    }

    return { success: false, error: `Nepavyko atlikti ${operationName} po ${this.MAX_RETRY_ATTEMPTS} bandymų` };
  }

  private static isAuthError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;

    const errorMessage = 'message' in error ? String(error.message).toLowerCase() : '';
    const authErrorIndicators = [
      'jwt',
      'token',
      'expired',
      'unauthorized',
      'authentication',
      'session',
      'invalid_grant'
    ];

    return authErrorIndicators.some(indicator => errorMessage.includes(indicator));
  }
}

/**
 * Hook'as admin operacijoms su automatišku sesijos valdymu
 */
export const withSessionRecovery = <T extends unknown[]>(
  fn: (...args: T) => Promise<unknown>,
  operationName?: string
) => {
  return async (...args: T) => {
    return SupabaseSessionManager.executeAdminOperation(
      () => fn(...args),
      operationName || fn.name
    );
  };
};