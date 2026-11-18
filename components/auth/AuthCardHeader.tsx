"use client";

import Link from "next/link";
import { Square } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useTranslation } from "@/components/providers/LanguageProvider";

interface AuthCardHeaderProps {
  titleKey: string;
  subtitleKey: string;
}

export function AuthCardHeader({ titleKey, subtitleKey }: AuthCardHeaderProps) {
  const { t } = useTranslation();

  return (
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
        {t(titleKey)}
      </h1>
      <p className="text-xs text-muted mt-1 leading-relaxed">
        {t(subtitleKey)}
      </p>
    </div>
  );
}
