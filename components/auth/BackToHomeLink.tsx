"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/components/providers/LanguageProvider";

interface BackToHomeLinkProps {
  textKey?: string;
  className?: string;
}

export function BackToHomeLink({
  textKey = "auth.login.backHome",
  className = "",
}: BackToHomeLinkProps) {
  const { t } = useTranslation();

  return (
    <div className={`text-center mt-5 ${className}`}>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 rtl-flip" />
        <span>{t(textKey)}</span>
      </Link>
    </div>
  );
}
