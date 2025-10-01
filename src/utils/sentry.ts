/* eslint-disable no-console */
/**
 * Sentry Integration Configuration
 *
 * External error tracking and monitoring service for production applications.
 * Captures errors, performance metrics, and user feedback.
 * 
 * Note: console statements are used for fallback logging when Sentry is not initialized
 */

import * as Sentry from '@sentry/react';
import { isFeatureEnabled } from './featureFlags';

/**
 * Initialize Sentry error tracking
 * Only runs in production when feature flag is enabled
 */
export function initializeSentry(): void {
  // Only initialize if feature is enabled and DSN is configured
  if (!isFeatureEnabled('externalLogging')) {
    console.info('Sentry logging is disabled via feature flag');
    return;
  }

  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

  if (!sentryDsn) {
    console.warn('Sentry DSN not configured. Set VITE_SENTRY_DSN environment variable.');
    return;
  }

  // Only initialize in production
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: sentryDsn,

      // Performance monitoring
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],

      // Performance Monitoring
      tracesSampleRate: 0.1, // 10% of transactions for performance monitoring

      // Session Replay
      replaysSessionSampleRate: 0.1, // 10% of sessions
      replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

      // Environment
      environment: import.meta.env.MODE,

      // Release tracking
      release: import.meta.env.VITE_APP_VERSION || 'unknown',

      // Ignore common browser errors
      ignoreErrors: [
        'Non-Error promise rejection captured',
        'ResizeObserver loop limit exceeded',
        'ChunkLoadError',
        'Loading chunk',
      ],

      // Filter sensitive data
      beforeSend(event) {
        // Remove any PII or sensitive data
        if (event.request?.url) {
          event.request.url = event.request.url.replace(/\?.*$/, '');
        }
        return event;
      },
    });

    console.info('Sentry error tracking initialized');
  } else {
    console.info('Sentry disabled in development mode');
  }
}

/**
 * Manually capture an exception to Sentry
 * @param error - Error to capture
 * @param context - Additional context information
 */
export function captureException(error: Error, context?: Record<string, unknown>): void {
  if (isFeatureEnabled('externalLogging') && import.meta.env.PROD) {
    Sentry.captureException(error, {
      extra: context,
    });
  }
}

/**
 * Capture a message to Sentry
 * @param message - Message to log
 * @param level - Severity level
 * @param context - Additional context
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, unknown>
): void {
  if (isFeatureEnabled('externalLogging') && import.meta.env.PROD) {
    Sentry.captureMessage(message, {
      level,
      extra: context,
    });
  }
}

/**
 * Set user context for Sentry
 * @param user - User information
 */
export function setUserContext(user: { id: string; email?: string; username?: string }): void {
  if (isFeatureEnabled('externalLogging') && import.meta.env.PROD) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  }
}

/**
 * Clear user context (on logout)
 */
export function clearUserContext(): void {
  if (isFeatureEnabled('externalLogging') && import.meta.env.PROD) {
    Sentry.setUser(null);
  }
}

/**
 * Add breadcrumb for debugging
 * @param message - Breadcrumb message
 * @param category - Breadcrumb category
 * @param data - Additional data
 */
export function addBreadcrumb(
  message: string,
  category: string,
  data?: Record<string, unknown>
): void {
  if (isFeatureEnabled('externalLogging') && import.meta.env.PROD) {
    Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: 'info',
    });
  }
}
