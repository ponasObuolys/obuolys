import { describe, it, expect, beforeEach, vi } from "vitest";
import { isFeatureEnabled, getFeatureFlags, overrideFeatureFlag } from "../featureFlags";

describe("featureFlags", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("isFeatureEnabled", () => {
    it("should return false for disabled features by default", () => {
      expect(isFeatureEnabled("savedPublications")).toBe(false);
      expect(isFeatureEnabled("enrolledCourses")).toBe(false);
      expect(isFeatureEnabled("externalLogging")).toBe(false);
      expect(isFeatureEnabled("advancedAnalytics")).toBe(false);
    });
  });

  describe("getFeatureFlags", () => {
    it("should return all feature flags", () => {
      const flags = getFeatureFlags();

      expect(flags).toHaveProperty("savedPublications");
      expect(flags).toHaveProperty("enrolledCourses");
      expect(flags).toHaveProperty("externalLogging");
      expect(flags).toHaveProperty("advancedAnalytics");
    });

    it("should return a copy of flags (immutable)", () => {
      const flags1 = getFeatureFlags();
      const flags2 = getFeatureFlags();

      expect(flags1).not.toBe(flags2);
      expect(flags1).toEqual(flags2);
    });
  });

  describe("overrideFeatureFlag", () => {
    it("should allow overriding in development mode", () => {
      // Mock DEV environment
      vi.stubGlobal("import", {
        meta: {
          env: { DEV: true },
        },
      });

      overrideFeatureFlag("savedPublications", true);
      expect(isFeatureEnabled("savedPublications")).toBe(true);

      overrideFeatureFlag("savedPublications", false);
      expect(isFeatureEnabled("savedPublications")).toBe(false);
    });

    it("should warn and not override in production mode", () => {
      // Mock production environment
      vi.stubGlobal("import", {
        meta: {
          env: { DEV: false },
        },
      });

      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      overrideFeatureFlag("externalLogging", true);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Feature flag overrides are only allowed in development mode"
      );
      expect(isFeatureEnabled("externalLogging")).toBe(false);
    });
  });

  describe("feature flag validation", () => {
    it("should have consistent types for all flags", () => {
      const flags = getFeatureFlags();

      Object.values(flags).forEach(value => {
        expect(typeof value).toBe("boolean");
      });
    });
  });
});
