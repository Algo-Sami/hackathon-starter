"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { resetPasswordAction } from "@/app/actions/auth";
import { useTranslation } from "@/components/providers/LanguageProvider";

export function ResetPasswordForm() {
  const { t } = useTranslation();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const errorId = "reset-error";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    setError(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await resetPasswordAction(formData);

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
          {t("auth.resetPassword.successTitle")}
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          {t("auth.resetPassword.successMessage")}
        </p>
        <div className="pt-2">
          <Link
            href="/login"
            className="w-full h-10 inline-flex items-center justify-center text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded transition-colors"
          >
            {t("auth.resetPassword.loginButton")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* New password */}
      <div className="space-y-1.5">
        <label
          htmlFor="reset-password"
          className="block text-sm font-medium text-foreground"
        >
          {t("auth.resetPassword.newPasswordLabel")}
        </label>
        <div className="relative">
          <input
            id="reset-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder={t("auth.resetPassword.newPasswordPlaceholder")}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={!!error}
            className="w-full ps-3.5 pe-10 h-10 text-sm border border-border rounded bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={
              showPassword
                ? t("auth.resetPassword.hidePassword")
                : t("auth.resetPassword.showPassword")
            }
            className="absolute end-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Confirm new password */}
      <div className="space-y-1.5">
        <label
          htmlFor="reset-confirm-password"
          className="block text-sm font-medium text-foreground"
        >
          {t("auth.resetPassword.confirmPasswordLabel")}
        </label>
        <div className="relative">
          <input
            id="reset-confirm-password"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder={t("auth.resetPassword.confirmPasswordPlaceholder")}
            className="w-full ps-3.5 pe-10 h-10 text-sm border border-border rounded bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={
              showConfirm
                ? t("auth.resetPassword.hidePassword")
                : t("auth.resetPassword.showPassword")
            }
            className="absolute end-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
          >
            {showConfirm ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
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
          ? t("auth.resetPassword.submitting")
          : t("auth.resetPassword.submitButton")}
      </button>
    </form>
  );
}
