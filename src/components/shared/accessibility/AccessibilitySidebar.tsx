"use client"
import React from "react";
import { useAccessibility } from "./AccessibilityContext";

const themes = [
  { key: "light", label: "Claro" },
  { key: "dark", label: "Escuro" },
  { key: "high-contrast", label: "Alto Contraste" },
];

export default function AccessibilitySidebar() {
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
  } = useAccessibility();

  const [open, setOpen] = React.useState(false);

  return (
    <div
      className="fixed top-8 right-0 z-[1000] flex flex-row items-center gap-3"
    >
      <button
        aria-label="Abrir recursos assistivos"
        onClick={() => setOpen((o) => !o)}
        className={`w-12 h-12 bg-[#003b8e] text-white border-none rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] cursor-pointer transition-[outline] duration-200 ${open ? "outline-2 outline-[#FFD700]" : "outline-none"}`}
        tabIndex={0}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="5" r="2" fill="#fff" />
          <rect x="11" y="7" width="2" height="7" rx="1" fill="#fff" />
          <rect x="7" y="10" width="10" height="2" rx="1" fill="#fff" />
          <rect x="10" y="14" width="1.5" height="5" rx="0.75" fill="#fff" />
          <rect x="12.5" y="14" width="1.5" height="5" rx="0.75" fill="#fff" />
        </svg>
      </button>
      {open && (
        <aside
          className="ml-2 w-[260px] bg-[var(--access-bg,#fff)] text-[var(--access-color,#222)] border-l border-[#ccc] rounded-l-[16px] p-8 pt-8 pb-8 shadow-[0_-2px_8px_rgba(0,0,0,0.08)] flex flex-col gap-6 text-base items-start transition-opacity duration-200"
          aria-label="Sidebar de acessibilidade visual"
        >
          <div className="flex justify-between items-center w-full">
            <h2 className="font-bold text-[1.2rem] mb-4">Acessibilidade</h2>
            <button
              aria-label="Fechar sidebar"
              onClick={() => setOpen(false)}
              className="bg-transparent border-none text-[1.5rem] cursor-pointer text-[#222] ml-auto"
            >
              ×
            </button>
          </div>
          <div>
            <span className="font-bold">Tema:</span>
            <div className="flex flex-col gap-[0.2rem] mt-[0.3rem]">
              {themes.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTheme(t.key as import("./AccessibilityContext").AccessibilityTheme)}
                  className={`border border-[#bbb] rounded py-[0.35rem] px-2 cursor-pointer ${theme === t.key ? "bg-[#e0e0e0] outline-2 outline-[#0070f3]" : "bg-[#f9f9f9] outline-none"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="font-bold">Fonte:</span>
            <div className="flex gap-[0.2rem] mt-[0.3rem]">
              <button className="cursor-pointer py-[0.35rem] px-2" onClick={() => setFontSize(fontSize + 10)}>A+</button>
              <button className="cursor-pointer py-[0.35rem] px-2" onClick={() => setFontSize(fontSize - 10)} disabled={fontSize <= 12}>A-</button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
