"use client";

import { useTranslation } from "@/components/providers/LanguageProvider";
import type { Locale } from "@/lib/i18n";

export interface LanguageSwitcherProps {
  className?: string;
  size?: "sm" | "md";
}

export function LanguageSwitcher({
  className = "",
  size = "sm",
}: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useTranslation();

  const handleSelect = (lang: Locale) => {
    if (lang !== language) {
      setLanguage(lang);
    }
  };

  const isSmall = size === "sm";

  return (
    <div
      role="group"
      aria-label={t("nav.languageSelection")}
      className={`inline-flex items-center p-0.5 rounded border border-border bg-surface select-none transition-colors ${className}`}
    >
      {/* English Toggle */}
      <button
        type="button"
        role="button"
        aria-pressed={language === "en"}
        aria-label={t("nav.switchToEn")}
        onClick={() => handleSelect("en")}
        className={`inline-flex items-center justify-center rounded text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
          isSmall ? "px-2 py-0.5" : "px-2.5 py-1"
        } ${
          language === "en"
            ? "bg-primary text-white shadow-xs"
            : "text-muted hover:text-foreground hover:bg-background/60"
        }`}
      >
        {t("nav.langEn")}
      </button>

      <span className="text-border px-0.5 pointer-events-none text-xs">|</span>

      {/* Urdu Toggle */}
      <button
        type="button"
        role="button"
        aria-pressed={language === "ur"}
        aria-label={t("nav.switchToUr")}
        onClick={() => handleSelect("ur")}
        className={`inline-flex items-center justify-center rounded text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
          isSmall ? "px-2 py-0.5" : "px-2.5 py-1"
        } ${
          language === "ur"
            ? "bg-primary text-white shadow-xs"
            : "text-muted hover:text-foreground hover:bg-background/60"
        }`}
      >
        {t("nav.langUr")}
      </button>
    </div>
  );
}
