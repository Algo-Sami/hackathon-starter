import { redirect } from "next/navigation";
import Link from "next/link";
import { Square, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/config/site";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { t } from "@/lib/i18n";

export const metadata = {
  title: "Reset Password",
};

export default async function ForgotPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 sm:py-16 px-4 bg-surface">
      <div className="w-full max-w-[400px]">
        {/* Header: Logo + Title above card */}
        <div className="text-center mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 group mb-3 focus:outline-none"
            aria-label={`${siteConfig.name} Home`}
          >
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold text-sm shadow-xs group-hover:bg-primary-hover transition-colors">
              <Square className="w-4 h-4 fill-white text-white" />
            </div>
            <span className="font-semibold text-xl tracking-tight text-foreground">
              {siteConfig.name}
            </span>
          </Link>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
            {t("auth.forgotPassword.title")}
          </h1>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            {t("auth.forgotPassword.subtitle")}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-background border border-border rounded p-6 sm:p-7 shadow-xs">
          <ForgotPasswordForm />
        </div>

        {/* Back to Home */}
        <div className="text-center mt-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t("auth.forgotPassword.backHome")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
