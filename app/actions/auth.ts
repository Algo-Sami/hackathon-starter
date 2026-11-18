"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { verifyRecaptchaToken } from "@/lib/recaptcha";

export interface AuthActionResult {
  success: boolean;
  errorKey?: string;
  needsEmailConfirmation?: boolean;
}

export async function loginAction(
  formData: FormData
): Promise<AuthActionResult> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "/dashboard";
  const recaptchaToken = (
    formData.get("recaptchaToken") || formData.get("g-recaptcha-response")
  ) as string;

  // Sanitize next redirect
  const safeNext =
    next.startsWith("/") && !next.startsWith("//") ? next : "/";

  // Strict backend reCAPTCHA token verification
  if (!recaptchaToken || !recaptchaToken.trim()) {
    return { success: false, errorKey: "auth.errors.captchaRequired" };
  }

  const captchaVerification = await verifyRecaptchaToken(recaptchaToken);
  if (!captchaVerification.success) {
    return { success: false, errorKey: "auth.errors.captchaFailed" };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, errorKey: "auth.errors.emailInvalid" };
  }

  if (!password) {
    return { success: false, errorKey: "auth.errors.passwordRequired" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("invalid login credentials") || msg.includes("invalid_grant")) {
      return { success: false, errorKey: "auth.errors.invalidCredentials" };
    }
    if (msg.includes("fetch failed") || msg.includes("network")) {
      return { success: false, errorKey: "auth.errors.networkError" };
    }
    return { success: false, errorKey: "auth.errors.invalidCredentials" };
  }

  redirect(safeNext);
}

export async function registerAction(
  formData: FormData
): Promise<AuthActionResult> {
  const fullName = (formData.get("fullName") as string)?.trim();
  const role = (formData.get("role") as string)?.trim() || "Event Organizer";
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const recaptchaToken = (
    formData.get("recaptchaToken") || formData.get("g-recaptcha-response")
  ) as string;

  // Strict backend reCAPTCHA token verification
  if (!recaptchaToken || !recaptchaToken.trim()) {
    return { success: false, errorKey: "auth.errors.captchaRequired" };
  }

  const captchaVerification = await verifyRecaptchaToken(recaptchaToken);
  if (!captchaVerification.success) {
    return { success: false, errorKey: "auth.errors.captchaFailed" };
  }

  // Validation
  if (!fullName) {
    return { success: false, errorKey: "auth.errors.nameRequired" };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, errorKey: "auth.errors.emailInvalid" };
  }

  if (!password || password.length < 8) {
    return { success: false, errorKey: "auth.errors.passwordMinLength" };
  }

  if (password !== confirmPassword) {
    return { success: false, errorKey: "auth.errors.passwordsDoNotMatch" };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (
      msg.includes("already registered") ||
      msg.includes("user already exists")
    ) {
      return {
        success: false,
        errorKey: "auth.errors.emailAlreadyRegistered",
      };
    }
    if (msg.includes("fetch failed") || msg.includes("network")) {
      return { success: false, errorKey: "auth.errors.networkError" };
    }
    return { success: false, errorKey: "auth.errors.genericError" };
  }

  // Check whether email confirmation is required or user was auto-confirmed
  // If session is created, user is immediately logged in
  if (data.session) {
    redirect("/dashboard");
  }

  // If user exists but identities is empty, email is already registered
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return {
      success: false,
      errorKey: "auth.errors.emailAlreadyRegistered",
    };
  }

  return {
    success: true,
    needsEmailConfirmation: true,
  };
}

export async function forgotPasswordAction(
  formData: FormData,
  origin: string
): Promise<AuthActionResult> {
  const email = (formData.get("email") as string)?.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, errorKey: "auth.errors.emailInvalid" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("fetch failed") || msg.includes("network")) {
      return { success: false, errorKey: "auth.errors.networkError" };
    }
  }

  // Return success even if email not found to prevent user enumeration
  return { success: true };
}

export async function resetPasswordAction(
  formData: FormData
): Promise<AuthActionResult> {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || password.length < 8) {
    return { success: false, errorKey: "auth.errors.passwordMinLength" };
  }

  if (password !== confirmPassword) {
    return { success: false, errorKey: "auth.errors.passwordsDoNotMatch" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { success: false, errorKey: "auth.errors.genericError" };
  }

  return { success: true };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
