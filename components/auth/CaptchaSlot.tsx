"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { t } from "@/lib/i18n";

// PLACEHOLDER - replace with Google reCAPTCHA v2 after the production domain is registered

export interface CaptchaSlotProps {
  onVerify?: (token: string) => void;
  onExpire?: () => void;
  errorMessage?: string;
  className?: string;
}

export function CaptchaSlot({
  onVerify,
  onExpire,
  errorMessage,
  className = "",
}: CaptchaSlotProps) {
  const [checked, setChecked] = useState(false);

  const handleToggle = () => {
    const nextState = !checked;
    setChecked(nextState);
    if (nextState) {
      // Mock token for placeholder verification without blocking
      onVerify?.("mock-captcha-token");
    } else {
      onExpire?.();
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* 304px x 78px bounding box, responsive down to 360px mobile */}
      <div className="w-full max-w-[304px] h-[78px] bg-surface border border-border rounded flex items-center justify-between px-3.5 py-2 select-none transition-colors">
        {/* Left: Checkbox & Label */}
        <label
          htmlFor="captcha-placeholder-checkbox"
          className="flex items-center gap-3 cursor-pointer"
        >
          <div
            className={`w-7 h-7 rounded-xs border flex items-center justify-center transition-colors ${
              checked
                ? "bg-primary border-primary text-white"
                : "bg-background border-border hover:border-muted"
            }`}
          >
            {checked && <Check className="w-4 h-4 stroke-[3]" />}
          </div>
          <input
            id="captcha-placeholder-checkbox"
            type="checkbox"
            checked={checked}
            onChange={handleToggle}
            className="sr-only"
            aria-label={t("auth.captcha.label")}
          />
          <span className="text-sm font-medium text-foreground">
            {t("auth.captcha.label")}
          </span>
        </label>

        {/* Right: reCAPTCHA badge icon & branding */}
        <div className="flex flex-col items-center justify-center pl-2 text-right">
          <svg
            className="w-8 h-8 text-muted/60"
            viewBox="0 0 48 48"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 6c4.42 0 8.35 1.94 11.02 5.02L29.5 20.5H42V8l-5.06 5.06C33.38 8.89 28.97 6.5 24 6.5c-8.56 0-15.68 6.17-17.15 14.33l3.96 1.32C12.02 15.35 17.52 10 24 10zm-14.96 19.5L4 34.56C7.56 39.11 12.03 41.5 17 41.5c8.56 0 15.68-6.17 17.15-14.33l-3.96-1.32C28.98 32.65 23.48 38 17 38c-4.42 0-8.35-1.94-11.02-5.02L11.5 27.5H4v2z" />
          </svg>
          <span className="text-[10px] font-medium text-muted/80 tracking-tight">
            reCAPTCHA
          </span>
          <span className="text-[9px] text-muted/60 leading-none">
            Privacy · Terms
          </span>
        </div>
      </div>

      {/* Error Message Space */}
      {errorMessage && (
        <p className="text-xs text-red-600 pl-1">{errorMessage}</p>
      )}
    </div>
  );
}
