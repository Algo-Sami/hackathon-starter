// Rule: add every new key to BOTH locales/en.json and locales/ur.json files.

import en from "@/locales/en.json";
import ur from "@/locales/ur.json";

export type Locale = "en" | "ur";

export const DEFAULT_LANGUAGE: Locale = "en";
export const SUPPORTED_LANGUAGES: Locale[] = ["en", "ur"];
export const LANGUAGE_COOKIE_NAME = "app_lang";
export const LANGUAGE_STORAGE_KEY = "app_lang";
export const COOKIE_MAX_AGE = 31536000; // 365 days in seconds

const dictionaries: Record<Locale, Record<string, unknown>> = {
  en,
  ur,
};

let currentGlobalLocale: Locale = DEFAULT_LANGUAGE;

export function isValidLocale(val: unknown): val is Locale {
  return typeof val === "string" && SUPPORTED_LANGUAGES.includes(val as Locale);
}

export function getLocaleDir(locale: Locale): "ltr" | "rtl" {
  return locale === "ur" ? "rtl" : "ltr";
}

export function setLocale(locale: Locale): void {
  if (isValidLocale(locale)) {
    currentGlobalLocale = locale;
  }
}

export function getLocale(): Locale {
  return currentGlobalLocale;
}

const missingKeyWarnings = new Set<string>();

function logMissingKeyWarning(key: string, locale: Locale): void {
  if (process.env.NODE_ENV === "development") {
    const warningKey = `${locale}:${key}`;
    if (!missingKeyWarnings.has(warningKey)) {
      missingKeyWarnings.add(warningKey);
      console.warn(`[i18n] Missing key "${key}" for locale "${locale}".`);
    }
  }
}

function resolveNestedKey(obj: unknown, key: string): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  const parts = key.split(".");
  let current: unknown = obj;

  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  if (typeof current === "string" && current.trim() !== "") {
    return current;
  }
  return undefined;
}

function interpolate(
  text: string,
  params?: Record<string, string | number>
): string {
  if (!params) return text;
  let result = text;
  for (const [paramKey, paramValue] of Object.entries(params)) {
    result = result.replaceAll(`{${paramKey}}`, String(paramValue));
  }
  return result;
}

/**
 * Universal translation helper.
 * Fallback order:
 * 1. Selected language
 * 2. English
 * 3. Fallback string (if provided)
 * 4. The translation key itself
 */
export function t(
  key: string,
  fallbackOrParams?: string | Record<string, string | number>,
  params?: Record<string, string | number>,
  locale?: Locale
): string {
  const activeLocale: Locale = locale || currentGlobalLocale || DEFAULT_LANGUAGE;

  let fallbackString: string | undefined;
  let interpolationParams: Record<string, string | number> | undefined;

  if (typeof fallbackOrParams === "string") {
    fallbackString = fallbackOrParams;
    interpolationParams = params;
  } else if (typeof fallbackOrParams === "object" && fallbackOrParams !== null) {
    interpolationParams = fallbackOrParams;
  }

  // 1. Try active language
  const activeDict = dictionaries[activeLocale] || dictionaries[DEFAULT_LANGUAGE];
  const foundInActive = resolveNestedKey(activeDict, key);

  if (foundInActive !== undefined) {
    return interpolate(foundInActive, interpolationParams);
  }

  // 2. Try English if active locale is not English
  if (activeLocale !== "en") {
    const foundInEnglish = resolveNestedKey(dictionaries.en, key);
    if (foundInEnglish !== undefined) {
      logMissingKeyWarning(key, activeLocale);
      return interpolate(foundInEnglish, interpolationParams);
    }
  }

  // If not found in either dictionary, log warning in dev
  logMissingKeyWarning(key, activeLocale);

  // 3. Try provided fallback string
  if (fallbackString !== undefined) {
    return interpolate(fallbackString, interpolationParams);
  }

  // 4. Return the key itself
  return key;
}

/**
 * Format a Date using Intl based on the active or requested language.
 */
export function formatDate(
  date: Date | string | number,
  language: Locale = currentGlobalLocale,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "object" ? date : new Date(date);
  const localeStr = language === "ur" ? "ur-PK" : "en-US";
  return new Intl.DateTimeFormat(localeStr, options).format(d);
}

/**
 * Format a Number using Intl based on the active or requested language.
 */
export function formatNumber(
  num: number,
  language: Locale = currentGlobalLocale,
  options?: Intl.NumberFormatOptions
): string {
  const localeStr = language === "ur" ? "ur-PK" : "en-US";
  return new Intl.NumberFormat(localeStr, options).format(num);
}

/**
 * Helper pattern for reading localized fields from database records or API responses.
 * Example item: { title_en: "Product", title_ur: "پروڈکٹ" }
 * Usage: getLocalizedField(item, "title", language)
 */
export function getLocalizedField<T extends Record<string, unknown>>(
  item: T | null | undefined,
  field: string,
  language: Locale = currentGlobalLocale
): string {
  if (!item) return "";
  const targetKey = `${field}_${language}`;
  const fallbackKey = `${field}_${language === "ur" ? "en" : "ur"}`;
  const val = item[targetKey] ?? item[fallbackKey] ?? item[field];
  return typeof val === "string" ? val : String(val ?? "");
}

// ==========================================
// SERVER-SIDE TRANSLATION HELPER
// ==========================================

export interface ServerTranslationResult {
  t: (
    key: string,
    fallbackOrParams?: string | Record<string, string | number>,
    params?: Record<string, string | number>
  ) => string;
  language: Locale;
  dir: "ltr" | "rtl";
  isRTL: boolean;
}

/**
 * Server Component translation helper.
 * Reads the language cookie through next/headers cookies().
 */
export async function getServerTranslation(): Promise<ServerTranslationResult> {
  let language: Locale = DEFAULT_LANGUAGE;

  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieVal = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value;
    if (isValidLocale(cookieVal)) {
      language = cookieVal;
    }
  } catch {
    // If called outside request context (e.g. static generation fallback)
    language = currentGlobalLocale;
  }

  const dir = getLocaleDir(language);

  return {
    t: (
      key: string,
      fallbackOrParams?: string | Record<string, string | number>,
      params?: Record<string, string | number>
    ) => t(key, fallbackOrParams, params, language),
    language,
    dir,
    isRTL: dir === "rtl",
  };
}
