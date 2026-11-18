"use client";

import {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "@/components/providers/LanguageProvider";

export interface GoogleRecaptchaRef {
  reset: () => void;
  getResponse: () => string;
}

export interface GoogleRecaptchaProps {
  siteKey?: string;
  onVerify?: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  hl?: string;
  className?: string;
  errorMessage?: string;
}

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      render: (
        container: HTMLElement | string,
        parameters: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark";
          size?: "normal" | "compact";
          tabindex?: number;
          hl?: string;
        }
      ) => number;
      reset: (opt_widget_id?: number) => void;
      getResponse: (opt_widget_id?: number) => string;
    };
    onGoogleRecaptchaLoad?: () => void;
  }
}

const SCRIPT_ID_PREFIX = "google-recaptcha-v2-script";

export const GoogleRecaptcha = memo(
  forwardRef<GoogleRecaptchaRef, GoogleRecaptchaProps>(function GoogleRecaptcha(
    {
      siteKey,
      onVerify,
      onExpire,
      onError,
      hl,
      className = "",
      errorMessage,
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<number | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const { language } = useTranslation();

    // Store callbacks in ref so changes in parent re-renders don't retrigger effects
    const callbacksRef = useRef({ onVerify, onExpire, onError });
    useEffect(() => {
      callbacksRef.current = { onVerify, onExpire, onError };
    });

    // Determine active site key and language
    const resolvedSiteKey =
      siteKey || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
    const resolvedHl = hl || language || "en";

    // Expose reset and getResponse imperative handles
    useImperativeHandle(
      ref,
      () => ({
        reset: () => {
          if (
            typeof window !== "undefined" &&
            window.grecaptcha &&
            widgetIdRef.current !== null
          ) {
            try {
              window.grecaptcha.reset(widgetIdRef.current);
            } catch (e) {
              console.error("Failed to reset reCAPTCHA widget:", e);
            }
          }
        },
        getResponse: () => {
          if (
            typeof window !== "undefined" &&
            window.grecaptcha &&
            widgetIdRef.current !== null
          ) {
            try {
              return window.grecaptcha.getResponse(widgetIdRef.current);
            } catch (e) {
              console.error("Failed to get reCAPTCHA response:", e);
            }
          }
          return "";
        },
      }),
      []
    );

    useEffect(() => {
      if (!resolvedSiteKey) {
        console.warn(
          "reCAPTCHA: NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not defined. Widget cannot render."
        );
        return;
      }

      let isMounted = true;
      const scriptId = `${SCRIPT_ID_PREFIX}-${resolvedHl}`;

      const doRender = () => {
        if (!isMounted || !containerRef.current || !window.grecaptcha) return;

        // If already rendered with this widget id, don't re-render
        if (widgetIdRef.current !== null) {
          return;
        }

        // If the DOM container already has child elements, avoid duplicate render
        if (containerRef.current.hasChildNodes()) {
          setIsLoaded(true);
          return;
        }

        try {
          const id = window.grecaptcha.render(containerRef.current, {
            sitekey: resolvedSiteKey,
            callback: (token: string) => {
              callbacksRef.current.onVerify?.(token);
            },
            "expired-callback": () => {
              callbacksRef.current.onExpire?.();
            },
            "error-callback": () => {
              callbacksRef.current.onError?.();
            },
            theme: "light",
            hl: resolvedHl,
          });

          if (isMounted) {
            widgetIdRef.current = id;
            setIsLoaded(true);
          }
        } catch (err) {
          console.warn("reCAPTCHA render notice:", err);
        }
      };

      const onScriptReady = () => {
        if (window.grecaptcha) {
          window.grecaptcha.ready(doRender);
        }
      };

      // Clean up any script loaded for an alternate language
      const oldScripts = document.querySelectorAll(
        `script[id^="${SCRIPT_ID_PREFIX}"]`
      );
      let needNewScript = true;
      oldScripts.forEach((s) => {
        if (s.id === scriptId) {
          needNewScript = false;
        } else {
          s.remove();
          widgetIdRef.current = null;
          if (containerRef.current) {
            containerRef.current.innerHTML = "";
          }
        }
      });

      // If script for active language already exists and grecaptcha is ready
      const existingScript = document.getElementById(scriptId);
      if (window.grecaptcha && existingScript && !needNewScript) {
        onScriptReady();
        return;
      }

      // Assign global callback
      window.onGoogleRecaptchaLoad = () => {
        onScriptReady();
      };

      if (needNewScript && !document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = `https://www.google.com/recaptcha/api.js?onload=onGoogleRecaptchaLoad&render=explicit&hl=${resolvedHl}`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
          console.error("Failed to load Google reCAPTCHA script.");
          callbacksRef.current.onError?.();
        };
        document.head.appendChild(script);
      } else {
        onScriptReady();
      }

      return () => {
        isMounted = false;
      };
    }, [resolvedSiteKey, resolvedHl]);

    return (
      <div className={`space-y-1.5 ${className}`}>
        {/*
          Fixed 304x78px container.
          The target container div is ALWAYS present with stable positioning
          so React 19 re-renders never shift or unseat the reCAPTCHA iframe.
        */}
        <div className="relative min-h-[78px] min-w-[304px] flex items-center justify-center">
          {/* Skeleton placeholder shown only while loading */}
          {!isLoaded && (
            <div className="absolute inset-0 z-0 w-[304px] h-[78px] bg-surface border border-border rounded flex items-center justify-between px-3.5 py-2 animate-pulse pointer-events-none">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xs bg-border/50" />
                <div className="w-24 h-4 rounded bg-border/50" />
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="w-8 h-8 rounded-full bg-border/40" />
                <div className="w-12 h-2 rounded bg-border/40" />
              </div>
            </div>
          )}

          {/* Persistent reCAPTCHA target container */}
          <div
            key="recaptcha-widget-target"
            ref={containerRef}
            className="relative z-10 w-[304px] h-[78px]"
            aria-label="Google reCAPTCHA verification"
          />
        </div>

        {/* Error message */}
        {errorMessage && (
          <p
            role="alert"
            className="text-xs text-red-600 ps-1 font-medium"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  })
);
