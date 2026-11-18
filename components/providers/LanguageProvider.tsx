"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import {
  type Locale,
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE_NAME,
  LANGUAGE_STORAGE_KEY,
  COOKIE_MAX_AGE,
  isValidLocale,
  getLocaleDir,
  setLocale,
  t as universalT,
} from "@/lib/i18n";

export interface LanguageContextValue {
  language: Locale;
  setLanguage: (newLang: Locale) => void;
  dir: "ltr" | "rtl";
  isRTL: boolean;
  t: (
    key: string,
    fallbackOrParams?: string | Record<string, string | number>,
    params?: Record<string, string | number>
  ) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export interface LanguageProviderProps {
  initialLanguage: Locale;
  children: React.ReactNode;
}

export function LanguageProvider({
  initialLanguage,
  children,
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const match = document.cookie.match(
        new RegExp(`(?:^|; )${LANGUAGE_COOKIE_NAME}=([^;]+)`)
      );
      if (match && isValidLocale(match[1])) {
        return match[1] as Locale;
      }
      try {
        const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored && isValidLocale(stored)) {
          return stored as Locale;
        }
      } catch {
        // Ignore storage access error
      }
    }
    return isValidLocale(initialLanguage) ? initialLanguage : DEFAULT_LANGUAGE;
  });

  const router = useRouter();

  // Sync global variable and ensure localStorage matches cookie on initial mount
  useEffect(() => {
    setLocale(language);
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored !== language) {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      }
    } catch {
      // localStorage may be restricted in some environments
    }
  }, [language]);

  const setLanguage = useCallback(
    (newLang: Locale) => {
      if (!isValidLocale(newLang) || newLang === language) {
        return;
      }

      // (a) update React state immediately so all client components re-render at once
      setLanguageState(newLang);
      setLocale(newLang);

      // (b) write the cookie and localStorage
      try {
        document.cookie = `${LANGUAGE_COOKIE_NAME}=${newLang}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
        localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      } catch {
        // Handle cookie / localStorage restrictions
      }

      // (c) update document.documentElement.lang and .dir
      if (typeof document !== "undefined") {
        document.documentElement.lang = newLang;
        document.documentElement.dir = getLocaleDir(newLang);
      }

      // (d) call router.refresh() so Server Components re-render with the new cookie
      // WITHOUT a page reload and WITHOUT losing client state
      router.refresh();
    },
    [language, router]
  );

  const dir = getLocaleDir(language);
  const isRTL = dir === "rtl";

  const boundT = useCallback(
    (
      key: string,
      fallbackOrParams?: string | Record<string, string | number>,
      params?: Record<string, string | number>
    ) => {
      return universalT(key, fallbackOrParams, params, language);
    },
    [language]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      dir,
      isRTL,
      t: boundT,
    }),
    [language, setLanguage, dir, isRTL, boundT]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook for consuming the active internationalization state in Client Components.
 */
export function useTranslation(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside of LanguageProvider
    const current = DEFAULT_LANGUAGE;
    const dir = getLocaleDir(current);
    return {
      language: current,
      setLanguage: setLocale,
      dir,
      isRTL: dir === "rtl",
      t: (key, fallbackOrParams, params) =>
        universalT(key, fallbackOrParams, params, current),
    };
  }
  return context;
}
