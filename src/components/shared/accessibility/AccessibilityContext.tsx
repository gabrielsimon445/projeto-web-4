"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type AccessibilityTheme = "light" | "dark" | "contrast";

interface Ctx {
  theme: AccessibilityTheme;
  setTheme: (t: AccessibilityTheme) => void;
  fontSize: number;
  setFontSize: (n: number) => void;
}

const AccessibilityContext = createContext<Ctx | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AccessibilityTheme>("light");
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    document.body.classList.remove("theme-light", "theme-dark", "theme-contrast");
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--access-font-size", fontSize + "px");
  }, [fontSize]);

  return (
    <AccessibilityContext.Provider value={{ theme, setTheme, fontSize, setFontSize }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be inside provider");
  return ctx;
}