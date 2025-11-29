"use client";

import { useState } from "react";
import { useAccessibility } from "./AccessibilityContext";
import { Accessibility } from "lucide-react";

export default function AccessibilitySidebar() {
  const { theme, setTheme, fontSize, setFontSize } = useAccessibility();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed right-2 bottom-110 z-50 flex flex-col items-end gap-3">
      
      <button
        onClick={() => setOpen(!open)}
        aria-label="Abrir menu de acessibilidade"
        className="
          w-11 h-11
          rounded-xl
          bg-blue-600
          text-white
          shadow-[0_3px_8px_rgba(0,0,0,0.25)]
          flex items-center justify-center
          hover:scale-105 transition
          focus:outline-white focus:outline-offset-4
        "
      >
        <Accessibility size={22} strokeWidth={2.5} className="text-white" />
      </button>

      {open && (
        <div
          className="
            w-64 p-5 rounded-xl border shadow-xl
            bg-white text-black
            dark:bg-[#222] dark:text-white
            theme-contrast:bg-black theme-contrast:text-[var(--text-contrast)]
            theme-contrast:border-yellow-400
            animate-slide-up
          "
        >
          <h3 className="font-bold mb-3 text-lg">Acessibilidade</h3>

          <div className="flex flex-col gap-2 mb-4">
            <button
              onClick={() => setTheme("light")}
              className={`p-2 border rounded text-left ${
                theme === "light" ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
            >
              Claro
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`p-2 border rounded text-left ${
                theme === "dark" ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
            >
              Escuro
            </button>

            <button
              onClick={() => setTheme("contrast")}
              className={`p-2 border rounded text-left ${
                theme === "contrast" ? "bg-yellow-500 text-black" : ""
              }`}
            >
              Alto contraste
            </button>
          </div>

          <div>
            <span className="font-bold">Fonte:</span>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setFontSize(fontSize + 2)}
                className="px-3 py-1 border rounded bg-white dark:bg-gray-800"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                className="px-3 py-1 border rounded bg-white dark:bg-gray-800"
              >
                A-
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}