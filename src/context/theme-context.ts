import { createContext } from "react";

export type Theme = "light" | "dark" | "system";

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark"; // Actual applied theme (system resolves to light or dark)
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
