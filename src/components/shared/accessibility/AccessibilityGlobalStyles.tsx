"use client"

import { useEffect } from "react";
import { useAccessibility } from "./AccessibilityContext";

const themeVars = {
  light: {
    "--access-bg": "#fff",
    "--access-color": "#222",
    "--access-outline": "none",
  },
  dark: {
    "--access-bg": "#222",
    "--access-color": "#fff",
    "--access-outline": "none",
  },
  "high-contrast": {
    "--access-bg": "#000",
    "--access-color": "#FFD700",
    "--access-outline": "2px solid #FFD700",
  },
};

export default function AccessibilityGlobalStyles() {
  const { theme, fontSize, spacing } = useAccessibility();

  useEffect(() => {
    const root = document.documentElement;
    const vars = themeVars[theme];
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.style.setProperty("--access-font-size", fontSize + "px");
    root.style.setProperty("--access-spacing", spacing + "px");
  }, [theme, fontSize, spacing]);

  return null;
}
