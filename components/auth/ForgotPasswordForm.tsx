"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { forgotPasswordAction } from "@/app/actions/auth";
import { useTranslation } from "@/components/providers/LanguageProvider";

export function ForgotPasswordForm() {
  const { t } = useTranslation();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const errorId = "forgot-error";
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    setError(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await forgotPasswordAction(formData, window.location.origin);

    if (!result.success && result.errorKey) {
      setError(t(result.errorKey));
      setPending(false);
      return;
    }

    setSuccess(true);
    setPending(false);
  }

  if (success) {
    return (
      <div className="text-center py-4 space-y-3">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h2 className="text-base font-semibold text-foreground">
          {t("auth.forgotPassword.successTitle")}
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          {t("auth.forgotPassword.successMessage")}
        </p>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-hover font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("auth.forgotPassword.backToLogin")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Email field */}
      <div className="space-y-1.5">
        <label
          htmlFor="forgot-email"
          className="block text-sm font-medium text-foreground"
        >
          {t("auth.forgotPassword.emailLabel")}
        </label>
        <div className="relative">
          <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            id="forgot-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={t("auth.forgotPassword.emailPlaceholder")}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={!!error}
            className="w-full ps-9 pe-3 h-10 text-sm border border-border rounded bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2"
        >
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="w-full h-10 inline-flex items-center justify-center text-sm font-medium text-white bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed rounded transition-colors"
      >
        {pending
          ? t("auth.forgotPassword.submitting")
          : t("auth.forgotPassword.submitButton")}
      </button>

      {/* Back to login */}
      <div className="text-center pt-1">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl-flip" />
          {t("auth.forgotPassword.backToLogin")}
        </Link>
      </div>
    </form>
  );
}
