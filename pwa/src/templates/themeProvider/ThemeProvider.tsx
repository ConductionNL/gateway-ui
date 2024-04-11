import * as React from "react";
import "./../../styling/design-tokens/component-overrides.css";
interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => <>{children}</>;
