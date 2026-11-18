"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, MailCheck, ShieldCheck } from "lucide-react";
import { registerAction } from "@/app/actions/auth";
import { GoogleButton } from "@/components/auth/GoogleButton";
import {
  GoogleRecaptcha,
  type GoogleRecaptchaRef,
} from "@/components/auth/GoogleRecaptcha";
import { useTranslation } from "@/components/providers/LanguageProvider";
import { EventMindRole } from "@/lib/eventmind/types";

const ROLE_OPTIONS: EventMindRole[] = [
  "Dean",
  "Venue Manager",
  "Catering Person",
  "Finance Person",
  "Judging Coordinator",
  "Event Organizer",
];

export function RegisterForm() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<EventMindRole>("Event Organizer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

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
    const errs: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!fullName.trim()) {
      errs.fullName = t("auth.errors.nameRequired");
    }

    if (!email.trim()) {
      errs.email = t("auth.errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = t("auth.errors.emailInvalid");
    }

    if (!password) {
      errs.password = t("auth.errors.passwordRequired");
    } else if (password.length < 8) {
      errs.password = t("auth.errors.passwordMinLength");
    }

    if (!confirmPassword) {
      errs.confirmPassword = t("auth.errors.confirmPasswordRequired");
    } else if (password !== confirmPassword) {
      errs.confirmPassword = t("auth.errors.passwordsDoNotMatch");
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
    try {
      localStorage.setItem("eventmind_user_role", role);
    } catch {
      // Ignore quota error
    }
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("role", role);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("recaptchaToken", recaptchaToken);

    try {
      const res = await registerAction(formData);
      if (res && !res.success) {
        setErrorKey(res.errorKey || "auth.errors.genericError");
        setIsSubmitting(false);
        recaptchaRef.current?.reset();
        setRecaptchaToken("");
      } else if (res && res.needsEmailConfirmation) {
        setNeedsEmailConfirmation(true);
        setIsSubmitting(false);
      }
    } catch {
      // In case Next.js redirect threw
      setIsSubmitting(false);
    }
  };

  if (needsEmailConfirmation) {
    return (
      <div className="text-center py-4 space-y-4">
        <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto">
          <MailCheck className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          {t("auth.register.checkEmailTitle")}
        </h3>
        <p className="text-xs text-muted leading-relaxed">
          {t("auth.register.checkEmailMessage")}
        </p>
        <div className="pt-2">
          <Link
            href="/login"
            className="text-xs text-primary font-medium hover:underline"
          >
            {t("auth.register.loginLink")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Global Error Alert */}
      {errorKey && (
        <div
          role="alert"
          className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{t(errorKey)}</span>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label
          htmlFor="register-fullname"
          className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5"
        >
          {t("auth.register.fullNameLabel")}
        </label>
        <input
          id="register-fullname"
          name="fullName"
          type="text"
          autoComplete="name"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (fieldErrors.fullName)
              setFieldErrors({ ...fieldErrors, fullName: undefined });
          }}
          placeholder={t("auth.register.fullNamePlaceholder")}
          aria-invalid={!!fieldErrors.fullName}
          aria-describedby={
            fieldErrors.fullName ? "register-fullname-error" : undefined
          }
          className={`w-full text-sm bg-surface border rounded px-3.5 py-2 text-foreground placeholder:text-muted transition-colors focus:bg-background focus:outline-none ${
            fieldErrors.fullName
              ? "border-red-500 focus:border-red-500"
              : "border-border focus:border-primary"
          }`}
        />
        {fieldErrors.fullName && (
          <p id="register-fullname-error" className="mt-1 text-xs text-red-600">
            {fieldErrors.fullName}
          </p>
        )}
      </div>

      {/* Role Selection */}
      <div>
        <label
          htmlFor="register-role"
          className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5 flex items-center justify-between"
        >
          <span>Select Your Role</span>
          <span className="text-[10px] text-primary font-normal flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> EventMind Access
          </span>
        </label>
        <select
          id="register-role"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value as EventMindRole)}
          className="w-full text-sm bg-surface border border-border rounded px-3.5 py-2 text-foreground transition-colors focus:bg-background focus:outline-none focus:border-primary cursor-pointer"
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className="bg-background text-foreground">
              {opt}
            </option>
          ))}
        </select>
        <p className="mt-1 text-[11px] text-muted">
          Your role configures your personalized workspace permissions & alerts.
        </p>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="register-email"
          className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5"
        >
          {t("auth.register.emailLabel")}
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email)
              setFieldErrors({ ...fieldErrors, email: undefined });
          }}
          placeholder={t("auth.register.emailPlaceholder")}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={
            fieldErrors.email ? "register-email-error" : undefined
          }
          className={`w-full text-sm bg-surface border rounded px-3.5 py-2 text-foreground placeholder:text-muted transition-colors focus:bg-background focus:outline-none ${
            fieldErrors.email
              ? "border-red-500 focus:border-red-500"
              : "border-border focus:border-primary"
          }`}
        />
        {fieldErrors.email && (
          <p id="register-email-error" className="mt-1 text-xs text-red-600">
            {fieldErrors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="register-password"
          className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5"
        >
          {t("auth.register.passwordLabel")}
        </label>
        <div className="relative">
          <input
            id="register-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password)
                setFieldErrors({ ...fieldErrors, password: undefined });
            }}
            placeholder={t("auth.register.passwordPlaceholder")}
            aria-invalid={!!fieldErrors.password}
            aria-describedby={
              fieldErrors.password ? "register-password-error" : undefined
            }
            className={`w-full text-sm bg-surface border rounded ps-3.5 pe-10 py-2 text-foreground placeholder:text-muted transition-colors focus:bg-background focus:outline-none ${
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
                ? t("auth.register.hidePassword")
                : t("auth.register.showPassword")
            }
            className="absolute end-2.5 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-foreground rounded focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {fieldErrors.password && (
          <p id="register-password-error" className="mt-1 text-xs text-red-600">
            {fieldErrors.password}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="register-confirm-password"
          className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5"
        >
          {t("auth.register.confirmPasswordLabel")}
        </label>
        <input
          id="register-confirm-password"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (fieldErrors.confirmPassword)
              setFieldErrors({ ...fieldErrors, confirmPassword: undefined });
          }}
          placeholder={t("auth.register.confirmPasswordPlaceholder")}
          aria-invalid={!!fieldErrors.confirmPassword}
          aria-describedby={
            fieldErrors.confirmPassword
              ? "register-confirm-password-error"
              : undefined
          }
          className={`w-full text-sm bg-surface border rounded px-3.5 py-2 text-foreground placeholder:text-muted transition-colors focus:bg-background focus:outline-none ${
            fieldErrors.confirmPassword
              ? "border-red-500 focus:border-red-500"
              : "border-border focus:border-primary"
          }`}
        />
        {fieldErrors.confirmPassword && (
          <p
            id="register-confirm-password-error"
            className="mt-1 text-xs text-red-600"
          >
            {fieldErrors.confirmPassword}
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-10 px-4 inline-flex items-center justify-center text-sm font-medium text-white bg-primary hover:bg-primary-hover disabled:bg-primary/70 rounded transition-colors shadow-xs"
      >
        {isSubmitting
          ? t("auth.register.submitting")
          : t("auth.register.submitButton")}
      </button>

      {/* "or" Divider */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative bg-background px-3 text-xs text-muted">
          {t("auth.register.orDivider")}
        </div>
      </div>

      {/* Continue with Google */}
      <GoogleButton />

      {/* Back to Login */}
      <div className="text-center pt-2 text-xs text-muted">
        <span>{t("auth.register.hasAccount")} </span>
        <Link
          href="/login"
          className="text-primary hover:underline font-medium"
        >
          {t("auth.register.loginLink")}
        </Link>
      </div>
    </form>
  );
}
