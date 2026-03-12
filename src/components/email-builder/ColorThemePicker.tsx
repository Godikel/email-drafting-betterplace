/**
 * Shared color theme definitions and picker component for cards and hero.
 */

export interface ColorTheme {
  key: string;
  label: string;
  gradient: string;       // Card header / hero background
  accent: string;         // Accent color for pills/highlights
  accentLight: string;    // Light accent for text on dark bg
  checkBg: string;        // Check circle background
  checkColor: string;     // Check circle tick color
  iconBg: string;         // Icon background for feature cards
  swatch: string;         // Color swatch for the picker UI
}

export const CARD_THEMES: ColorTheme[] = [
  { key: "teal", label: "Teal", gradient: "linear-gradient(135deg, #0c2752, #1a4a8a)", accent: "#4db8c8", accentLight: "#7de8f4", checkBg: "#d5f1f4", checkColor: "#0f7c90", iconBg: "#dceff2", swatch: "#0f7c90" },
  { key: "navy", label: "Navy", gradient: "linear-gradient(135deg, #0c2752, #1a4a8a)", accent: "#2457d6", accentLight: "#93b4ff", checkBg: "#dae6ff", checkColor: "#2457d6", iconBg: "#dfe7f5", swatch: "#2457d6" },
  { key: "purple", label: "Purple", gradient: "linear-gradient(135deg, #3b1a7a, #5a38ae)", accent: "#8b5cf6", accentLight: "#ddd6fe", checkBg: "#ece6ff", checkColor: "#6d28d9", iconBg: "#ede9fe", swatch: "#6d28d9" },
  { key: "emerald", label: "Emerald", gradient: "linear-gradient(135deg, #064e3b, #047857)", accent: "#10b981", accentLight: "#a7f3d0", checkBg: "#d1fae5", checkColor: "#059669", iconBg: "#dcfce7", swatch: "#059669" },
  { key: "rose", label: "Rose", gradient: "linear-gradient(135deg, #4c0519, #be123c)", accent: "#f43f5e", accentLight: "#fecdd3", checkBg: "#ffe4e6", checkColor: "#e11d48", iconBg: "#fff1f2", swatch: "#e11d48" },
  { key: "amber", label: "Amber", gradient: "linear-gradient(135deg, #78350f, #b45309)", accent: "#f59e0b", accentLight: "#fde68a", checkBg: "#fef3c7", checkColor: "#d97706", iconBg: "#fffbeb", swatch: "#d97706" },
  { key: "slate", label: "Slate", gradient: "linear-gradient(135deg, #1e293b, #334155)", accent: "#64748b", accentLight: "#cbd5e1", checkBg: "#e2e8f0", checkColor: "#475569", iconBg: "#f1f5f9", swatch: "#475569" },
  { key: "indigo", label: "Indigo", gradient: "linear-gradient(135deg, #312e81, #4338ca)", accent: "#6366f1", accentLight: "#c7d2fe", checkBg: "#e0e7ff", checkColor: "#4f46e5", iconBg: "#eef2ff", swatch: "#4f46e5" },
];

export const HERO_BACKGROUNDS = [
  { key: "navy", label: "Navy Blue", gradient: "linear-gradient(155deg, #0c2752 0%, #1a4a8a 55%, #1568a8 100%)", pillBg: "rgba(77,184,200,0.16)", pillBorder: "rgba(77,184,200,0.38)", pillColor: "#7de8f4", highlightColor: "#4db8c8", swatch: "#1a4a8a" },
  { key: "purple", label: "Deep Purple", gradient: "linear-gradient(155deg, #2e1065 0%, #5b21b6 55%, #7c3aed 100%)", pillBg: "rgba(167,139,250,0.18)", pillBorder: "rgba(167,139,250,0.38)", pillColor: "#c4b5fd", highlightColor: "#a78bfa", swatch: "#5b21b6" },
  { key: "emerald", label: "Emerald", gradient: "linear-gradient(155deg, #064e3b 0%, #047857 55%, #059669 100%)", pillBg: "rgba(52,211,153,0.18)", pillBorder: "rgba(52,211,153,0.38)", pillColor: "#6ee7b7", highlightColor: "#34d399", swatch: "#047857" },
  { key: "charcoal", label: "Charcoal", gradient: "linear-gradient(155deg, #0f172a 0%, #1e293b 55%, #334155 100%)", pillBg: "rgba(148,163,184,0.18)", pillBorder: "rgba(148,163,184,0.38)", pillColor: "#94a3b8", highlightColor: "#cbd5e1", swatch: "#1e293b" },
  { key: "rose", label: "Rose", gradient: "linear-gradient(155deg, #4c0519 0%, #be123c 55%, #f43f5e 100%)", pillBg: "rgba(251,113,133,0.18)", pillBorder: "rgba(251,113,133,0.38)", pillColor: "#fda4af", highlightColor: "#fb7185", swatch: "#be123c" },
  { key: "sunset", label: "Sunset", gradient: "linear-gradient(155deg, #7c2d12 0%, #c2410c 40%, #ea580c 70%, #f97316 100%)", pillBg: "rgba(251,191,36,0.18)", pillBorder: "rgba(251,191,36,0.38)", pillColor: "#fcd34d", highlightColor: "#fbbf24", swatch: "#c2410c" },
  { key: "ocean", label: "Ocean", gradient: "linear-gradient(155deg, #0c4a6e 0%, #0369a1 55%, #0ea5e9 100%)", pillBg: "rgba(125,211,252,0.18)", pillBorder: "rgba(125,211,252,0.38)", pillColor: "#7dd3fc", highlightColor: "#38bdf8", swatch: "#0369a1" },
  { key: "indigo", label: "Indigo", gradient: "linear-gradient(155deg, #1e1b4b 0%, #3730a3 55%, #4f46e5 100%)", pillBg: "rgba(165,180,252,0.18)", pillBorder: "rgba(165,180,252,0.38)", pillColor: "#a5b4fc", highlightColor: "#818cf8", swatch: "#3730a3" },
];

export function getCardTheme(key: string): ColorTheme {
  return CARD_THEMES.find((t) => t.key === key) || CARD_THEMES[0];
}

export function getHeroBg(key: string) {
  return HERO_BACKGROUNDS.find((t) => t.key === key) || HERO_BACKGROUNDS[0];
}

interface ThemePickerProps {
  themes: { key: string; label: string; swatch: string }[];
  value: string;
  onChange: (key: string) => void;
  label?: string;
}

export function ThemePicker({ themes, value, onChange, label }: ThemePickerProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap" title={label}>
      {themes.map((t) => (
        <button
          key={t.key}
          className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${value === t.key ? "border-white ring-2 ring-offset-1 ring-primary scale-110" : "border-transparent opacity-70 hover:opacity-100"}`}
          style={{ background: t.swatch }}
          title={t.label}
          onClick={(e) => { e.stopPropagation(); onChange(t.key); }}
        />
      ))}
    </div>
  );
}
