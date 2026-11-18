import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { AuthCardHeader } from "@/components/auth/AuthCardHeader";
import { BackToHomeLink } from "@/components/auth/BackToHomeLink";
import { getServerTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export async function generateMetadata() {
  const { t } = await getServerTranslation();
  return {
    title: t("auth.forgotPassword.title"),
  };
}

export default async function ForgotPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 sm:py-16 px-4 bg-surface relative">
      {/* Top right language switcher on auth page */}
      <div className="absolute top-4 end-4">
        <LanguageSwitcher size="sm" />
      </div>

      <div className="w-full max-w-[400px]">
        {/* Header: Logo + Title above card */}
        <AuthCardHeader
          titleKey="auth.forgotPassword.title"
          subtitleKey="auth.forgotPassword.subtitle"
        />

        {/* Form Card */}
        <div className="bg-background border border-border rounded p-6 sm:p-7 shadow-xs">
          <ForgotPasswordForm />
        </div>

        {/* Back to Home */}
        <BackToHomeLink textKey="auth.forgotPassword.backHome" />
      </div>
    </div>
  );
}
