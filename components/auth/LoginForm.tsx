"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { loginAction } from "@/app/actions/auth";
import { GoogleButton } from "@/components/auth/GoogleButton";
import {
  GoogleRecaptcha,
  type GoogleRecaptchaRef,
} from "@/components/auth/GoogleRecaptcha";
import { t } from "@/lib/i18n";

export function LoginForm({ next = "/" }: { next?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recaptchaRef = useRef<GoogleRecaptchaRef>(null);

  const handleCaptchaVerify = useCallback((token: string) => {
    setRecaptchaToken(token);
    setCaptchaError(null);
  }, []);

  const handleCaptchaExpire = useCallback(() => {
    setRecaptchaToken("");
  }, []);

  const handleCaptchaError = useCallback(() => {
    setRecaptchaToken("");
  }, []);

  const validate = (): boolean => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errs.email = t("auth.errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = t("auth.errors.emailInvalid");
    }

    if (!password) {
      errs.password = t("auth.errors.passwordRequired");
    }

    setFieldErrors(errs);

    if (!recaptchaToken.trim()) {
      setCaptchaError(t("auth.captcha.errorMessage"));
      return false;
    } else {
      setCaptchaError(null);
    }

    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorKey(null);

    if (!validate()) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("next", next);
    formData.append("recaptchaToken", recaptchaToken);

    try {
      const res = await loginAction(formData);
      if (res && !res.success) {
        setErrorKey(res.errorKey || "auth.errors.invalidCredentials");
        setIsSubmitting(false);
        // Reset reCAPTCHA on failure so user must re-verify
        recaptchaRef.current?.reset();
        setRecaptchaToken("");
      }
    } catch {
      // If Next.js redirect threw or network error, let redirect proceed or handle error
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Global error banner */}
      {errorKey && (
        <div
          role="alert"
          className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{t(errorKey)}</span>
        </div>
      )}

      {/* Email input */}
      <div>
        <label
          htmlFor="login-email"
          className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5"
        >
          {t("auth.login.emailLabel")}
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
          }}
          placeholder={t("auth.login.emailPlaceholder")}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
          className={`w-full text-sm bg-surface border rounded px-3.5 py-2 text-foreground placeholder:text-muted transition-colors focus:bg-background focus:outline-none ${
            fieldErrors.email
              ? "border-red-500 focus:border-red-500"
              : "border-border focus:border-primary"
          }`}
        />
        {fieldErrors.email && (
          <p id="login-email-error" className="mt-1 text-xs text-red-600">
            {fieldErrors.email}
          </p>
        )}
      </div>

      {/* Password input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="login-password"
            className="block text-xs font-semibold text-foreground uppercase tracking-wider"
          >
            {t("auth.login.passwordLabel")}
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-primary hover:underline"
          >
            {t("auth.login.forgotPassword")}
          </Link>
        </div>
        <div className="relative">
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
            }}
            placeholder={t("auth.login.passwordPlaceholder")}
            aria-invalid={!!fieldErrors.password}
            aria-describedby={fieldErrors.password ? "login-password-error" : undefined}
            className={`w-full text-sm bg-surface border rounded px-3.5 py-2 pr-10 text-foreground placeholder:text-muted transition-colors focus:bg-background focus:outline-none ${
              fieldErrors.password
                ? "border-red-500 focus:border-red-500"
                : "border-border focus:border-primary"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={
              showPassword
                ? t("auth.login.hidePassword")
                : t("auth.login.showPassword")
            }
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-foreground rounded focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {fieldErrors.password && (
          <p id="login-password-error" className="mt-1 text-xs text-red-600">
            {fieldErrors.password}
          </p>
        )}
      </div>

      {/* Google reCAPTCHA v2 Component */}
      <GoogleRecaptcha
        ref={recaptchaRef}
        onVerify={handleCaptchaVerify}
        onExpire={handleCaptchaExpire}
        onError={handleCaptchaError}
        errorMessage={captchaError || undefined}
      />

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-10 px-4 inline-flex items-center justify-center text-sm font-medium text-white bg-primary hover:bg-primary-hover disabled:bg-primary/70 rounded transition-colors shadow-xs"
      >
        {isSubmitting ? t("auth.login.submitting") : t("auth.login.submitButton")}
      </button>

      {/* "or" divider */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative bg-background px-3 text-xs text-muted">
          {t("auth.login.orDivider")}
        </div>
      </div>

      {/* Continue with Google button */}
      <GoogleButton next={next} />

      {/* Sign up link */}
      <div className="text-center pt-2 text-xs text-muted">
        <span>{t("auth.login.noAccount")} </span>
        <Link
          href="/register"
          className="text-primary hover:underline font-medium"
        >
          {t("auth.login.signupLink")}
        </Link>
      </div>
    </form>
  );
}
