"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { t } from "@/lib/i18n";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("contact.validation.nameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("contact.validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = t("contact.validation.emailInvalid");
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t("contact.validation.subjectRequired");
    }

    if (!formData.message.trim()) {
      newErrors.message = t("contact.validation.messageRequired");
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t("contact.validation.messageMinLength");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Temporary client-side success simulation
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setErrors({});
    }, 500);
  };

  const handleReset = () => {
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="bg-background border border-border rounded p-8 sm:p-10 text-center flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold text-foreground tracking-tight mb-2">
          {t("contact.success.title")}
        </h3>
        <p className="text-sm text-muted max-w-[420px] mb-6 leading-relaxed">
          {t("contact.success.message")}
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="h-10 px-5 inline-flex items-center justify-center text-sm font-medium text-foreground bg-background hover:bg-surface border border-border rounded transition-colors"
        >
          {t("contact.success.reset")}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-background border border-border rounded p-6 sm:p-8 space-y-5"
    >
      {/* Name Field */}
      <div>
        <label
          htmlFor="contact-name"
          className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2"
        >
          {t("contact.form.nameLabel")} <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: undefined });
          }}
          placeholder={t("contact.form.namePlaceholder")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={`w-full text-sm bg-surface border rounded px-3.5 py-2.5 text-foreground placeholder:text-muted transition-colors focus:bg-background focus:outline-none ${
            errors.name
              ? "border-red-500 focus:border-red-500"
              : "border-border focus:border-primary"
          }`}
        />
        {errors.name && (
          <p
            id="name-error"
            className="mt-1.5 text-xs text-red-600 flex items-center gap-1"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.name}</span>
          </p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="contact-email"
          className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2"
        >
          {t("contact.form.emailLabel")}{" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            if (errors.email) setErrors({ ...errors, email: undefined });
          }}
          placeholder={t("contact.form.emailPlaceholder")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`w-full text-sm bg-surface border rounded px-3.5 py-2.5 text-foreground placeholder:text-muted transition-colors focus:bg-background focus:outline-none ${
            errors.email
              ? "border-red-500 focus:border-red-500"
              : "border-border focus:border-primary"
          }`}
        />
        {errors.email && (
          <p
            id="email-error"
            className="mt-1.5 text-xs text-red-600 flex items-center gap-1"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.email}</span>
          </p>
        )}
      </div>

      {/* Subject Field */}
      <div>
        <label
          htmlFor="contact-subject"
          className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2"
        >
          {t("contact.form.subjectLabel")}{" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={(e) => {
            setFormData({ ...formData, subject: e.target.value });
            if (errors.subject) setErrors({ ...errors, subject: undefined });
          }}
          placeholder={t("contact.form.subjectPlaceholder")}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className={`w-full text-sm bg-surface border rounded px-3.5 py-2.5 text-foreground placeholder:text-muted transition-colors focus:bg-background focus:outline-none ${
            errors.subject
              ? "border-red-500 focus:border-red-500"
              : "border-border focus:border-primary"
          }`}
        />
        {errors.subject && (
          <p
            id="subject-error"
            className="mt-1.5 text-xs text-red-600 flex items-center gap-1"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.subject}</span>
          </p>
        )}
      </div>

      {/* Message Field */}
      <div>
        <label
          htmlFor="contact-message"
          className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2"
        >
          {t("contact.form.messageLabel")}{" "}
          <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={(e) => {
            setFormData({ ...formData, message: e.target.value });
            if (errors.message) setErrors({ ...errors, message: undefined });
          }}
          placeholder={t("contact.form.messagePlaceholder")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`w-full text-sm bg-surface border rounded px-3.5 py-2.5 text-foreground placeholder:text-muted transition-colors focus:bg-background focus:outline-none resize-y ${
            errors.message
              ? "border-red-500 focus:border-red-500"
              : "border-border focus:border-primary"
          }`}
        />
        {errors.message && (
          <p
            id="message-error"
            className="mt-1.5 text-xs text-red-600 flex items-center gap-1"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.message}</span>
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-10 px-5 inline-flex items-center justify-center text-sm font-medium text-white bg-primary hover:bg-primary-hover disabled:bg-primary/70 rounded transition-colors"
      >
        {isSubmitting
          ? t("contact.form.submitting")
          : t("contact.form.submitButton")}
      </button>
    </form>
  );
}
