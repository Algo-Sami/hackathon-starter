import en from "@/locales/en.json";
import ur from "@/locales/ur.json";

export type Locale = "en" | "ur";

const dictionaries: Record<Locale, Record<string, unknown>> = {
  en,
  ur,
};

let currentLocale: Locale = "en";

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

/**
 * Translation helper that looks up nested keys like "home.hero.title".
 * If key is missing or empty in the active locale, falls back to English.
 * Supports placeholder interpolation, e.g. t("footer.copyright", { year: 2026, name: "YourApp" }).
 */
export function t(
  key: string,
  params?: Record<string, string | number>,
  locale?: Locale
): string {
  const activeLocale = locale || currentLocale;
  const dict = dictionaries[activeLocale] || dictionaries.en;
  const parts = key.split(".");

  let current: unknown = dict;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      current = undefined;
      break;
    }
  }

  // Fallback to English if empty string or not found
  if (typeof current !== "string" || current.trim() === "") {
    let fallback: unknown = dictionaries.en;
    for (const part of parts) {
      if (fallback && typeof fallback === "object" && part in fallback) {
        fallback = (fallback as Record<string, unknown>)[part];
      } else {
        fallback = undefined;
        break;
      }
    }
    if (typeof fallback === "string") {
      current = fallback;
    } else {
      return key;
    }
  }

  let text = current as string;
  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      text = text.replaceAll(`{${paramKey}}`, String(paramValue));
    }
  }

  return text;
}
