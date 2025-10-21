import type { ReactNode } from "react";
import React, { useState, useEffect } from "react";
import { ThemeContext, type Theme } from "./theme-context";

const THEME_STORAGE_KEY = "obuolys-theme-preference";

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get initial theme from localStorage or default to 'system'
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return (stored as Theme) || "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  // Function to get system preference
  const getSystemTheme = (): "light" | "dark" => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    return "dark";
  };

  // Function to apply theme to document
  const applyTheme = (appliedTheme: "light" | "dark") => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(appliedTheme);
    setResolvedTheme(appliedTheme);
  };

  // Handle theme changes
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);

    // Apply the theme immediately
    const themeToApply = newTheme === "system" ? getSystemTheme() : newTheme;
    applyTheme(themeToApply);
  };

  // Initialize theme on mount and listen for system changes
  useEffect(() => {
    const themeToApply = theme === "system" ? getSystemTheme() : theme;
    applyTheme(themeToApply);

    // Listen for system theme changes when using 'system' mode
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? "light" : "dark");
      };

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      }
      // Legacy browsers
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
