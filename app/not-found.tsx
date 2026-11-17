import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { t } from "@/lib/i18n";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-24 px-4 bg-surface">
      <div className="w-full max-w-[440px] bg-background border border-border rounded p-8 sm:p-10 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-6 h-6" />
        </div>

        <span className="text-4xl font-bold font-mono text-primary mb-2 block">
          {t("notFound.code")}
        </span>

        <h1 className="text-xl font-semibold text-foreground tracking-tight mb-2">
          {t("notFound.title")}
        </h1>

        <p className="text-sm text-muted mb-6 leading-relaxed">
          {t("notFound.description")}
        </p>

        <Link
          href="/"
          className="w-full h-10 inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("notFound.backHome")}</span>
        </Link>
      </div>
    </div>
  );
}
