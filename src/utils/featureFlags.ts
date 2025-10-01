/**
 * Feature Flags Configuration
 *
 * Centralized feature flag management for enabling/disabling features
 * that are not yet fully implemented or are in beta.
 */

import { log } from './browserLogger';

export interface FeatureFlags {
  /** Enable saved publications functionality (requires DB schema) */
  savedPublications: boolean;

  /** Enable enrolled courses functionality (requires DB schema) */
  enrolledCourses: boolean;

  /** Enable external logging service (Sentry) */
  externalLogging: boolean;

  /** Enable advanced analytics */
  advancedAnalytics: boolean;
}

const featureFlags: FeatureFlags = {
  // Backend features requiring DB schema implementation
  savedPublications: false, // TODO: Implement user_saved_publications table
  enrolledCourses: false,   // TODO: Implement user_enrolled_courses table

  // External services
  externalLogging: false,   // TODO: Add Sentry integration

  // Analytics features
  advancedAnalytics: false,
};

/**
 * Check if a feature is enabled
 * @param feature - The feature flag to check
 * @returns boolean indicating if the feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return featureFlags[feature];
}

/**
 * Get all feature flags
 * @returns Complete feature flags object
 */
export function getFeatureFlags(): Readonly<FeatureFlags> {
  return { ...featureFlags };
}

/**
 * Override feature flags (useful for testing)
 * Only works in development mode
 */
export function overrideFeatureFlag(
  feature: keyof FeatureFlags,
  value: boolean
): void {
  if (import.meta.env.DEV) {
    featureFlags[feature] = value;
  } else {
    log.warn('Feature flag overrides are only allowed in development mode');
  }
}
