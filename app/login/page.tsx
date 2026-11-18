import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthCardHeader } from "@/components/auth/AuthCardHeader";
import { BackToHomeLink } from "@/components/auth/BackToHomeLink";
import { getServerTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export async function generateMetadata() {
  const { t } = await getServerTranslation();
  return {
    title: t("auth.login.title"),
  };
}

interface LoginPageProps {
  searchParams: Promise<{ next?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const resolvedParams = await searchParams;
  const next = resolvedParams.next || "/dashboard";

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 sm:py-16 px-4 bg-surface relative">
      {/* Top right language switcher on auth page */}
      <div className="absolute top-4 end-4">
        <LanguageSwitcher size="sm" />
      </div>

      <div className="w-full max-w-[400px]">
        {/* Header with Logo and Title above the card */}
        <AuthCardHeader
          titleKey="auth.login.title"
          subtitleKey="auth.login.subtitle"
        />

        {/* Form Card */}
        <div className="bg-background border border-border rounded p-6 sm:p-7 shadow-xs">
          <LoginForm next={next} />
        </div>

        {/* Back to Home Link */}
        <BackToHomeLink textKey="auth.login.backHome" />
      </div>
    </div>
  );
}
