"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AccessibilityTheme = 'light' | 'dark' | 'high-contrast';

interface AccessibilityContextProps {
  theme: AccessibilityTheme;
  setTheme: (theme: AccessibilityTheme) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  spacing: number;
  setSpacing: (spacing: number) => void;
}

const AccessibilityContext = createContext<AccessibilityContextProps | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<AccessibilityTheme>('light');
  const [fontSize, setFontSize] = useState<number>(16);
  const [spacing, setSpacing] = useState<number>(8);

  return (
    <AccessibilityContext.Provider value={{ theme, setTheme, fontSize, setFontSize, spacing, setSpacing }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
};
