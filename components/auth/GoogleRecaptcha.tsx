"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getLocale } from "@/lib/i18n";

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

export const GoogleRecaptcha = forwardRef<
  GoogleRecaptchaRef,
  GoogleRecaptchaProps
>(function GoogleRecaptcha(
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

  // Determine active site key and language
  const resolvedSiteKey =
    siteKey || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
  const resolvedHl = hl || getLocale() || "en";

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

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !window.grecaptcha || !resolvedSiteKey) return;

    // If already rendered in this container, skip
    if (widgetIdRef.current !== null) {
      return;
    }

    try {
      // Clear container children if any leftovers
      containerRef.current.innerHTML = "";

      const id = window.grecaptcha.render(containerRef.current, {
        sitekey: resolvedSiteKey,
        callback: (token: string) => {
          onVerify?.(token);
        },
        "expired-callback": () => {
          onExpire?.();
        },
        "error-callback": () => {
          onError?.();
        },
        theme: "light",
      });

      widgetIdRef.current = id;
      setIsLoaded(true);
    } catch (err) {
      console.error("Error rendering reCAPTCHA widget:", err);
    }
  }, [resolvedSiteKey, onVerify, onExpire, onError]);

  useEffect(() => {
    if (!resolvedSiteKey) {
      console.warn(
        "reCAPTCHA: NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not defined. Widget cannot render."
      );
      return;
    }

    const scriptId = `${SCRIPT_ID_PREFIX}-${resolvedHl}`;

    // Handle when script is loaded
    const onScriptReady = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          renderWidget();
        });
      }
    };

    // If grecaptcha is already available and current script matches language
    const existingScript = document.getElementById(scriptId);
    if (window.grecaptcha && existingScript) {
      onScriptReady();
      return;
    }

    // Set global callback
    window.onGoogleRecaptchaLoad = () => {
      onScriptReady();
    };

    // If a script for a different language exists, remove it
    const oldScripts = document.querySelectorAll(`script[id^="${SCRIPT_ID_PREFIX}"]`);
    oldScripts.forEach((s) => s.remove());
    widgetIdRef.current = null;

    // Inject dynamic script tag
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://www.google.com/recaptcha/api.js?onload=onGoogleRecaptchaLoad&render=explicit&hl=${resolvedHl}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error("Failed to load Google reCAPTCHA script.");
      onError?.();
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup widget ID ref on unmount
      widgetIdRef.current = null;
    };
  }, [resolvedSiteKey, resolvedHl, renderWidget, onError]);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* reCAPTCHA standard container (304x78px) */}
      <div className="min-h-[78px] min-w-[304px] flex items-center justify-center">
        {/* Skeleton while script is loading */}
        {!isLoaded && (
          <div className="w-[304px] h-[78px] bg-surface border border-border rounded flex items-center justify-between px-3.5 py-2 animate-pulse">
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

        {/* reCAPTCHA target container */}
        <div
          ref={containerRef}
          className={!isLoaded ? "hidden" : "block"}
          aria-label="Google reCAPTCHA verification"
        />
      </div>

      {/* Error message */}
      {errorMessage && (
        <p
          role="alert"
          className="text-xs text-red-600 pl-1 font-medium"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
});
