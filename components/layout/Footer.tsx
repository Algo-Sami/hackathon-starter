"use client";

import Link from "next/link";
import { Square, Mail, Phone, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { footerSections } from "@/config/content";
import { useTranslation } from "@/components/providers/LanguageProvider";

const COPYRIGHT_YEAR = 2026;

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-background border-t border-border mt-auto">
      <div className="site-container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none"
              aria-label={`${siteConfig.name} Home`}
            >
              <div className="w-7 h-7 rounded bg-primary flex items-center justify-center text-white font-bold text-xs shadow-xs group-hover:bg-primary-hover transition-colors">
                <Square className="w-3.5 h-3.5 fill-white text-white" />
              </div>
              <span className="font-semibold text-lg tracking-tight text-foreground">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Dynamic Link Columns: Product & Company */}
          {footerSections.map((section) => (
            <div key={section.titleKey} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground tracking-tight">
                {t(section.titleKey)}
              </h3>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted hover:text-foreground transition-colors"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 4: Contact Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              {t("footer.contactTitle")}
            </h3>
            <ul className="space-y-2.5 text-sm text-muted">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  dir="ltr"
                  className="hover:text-foreground transition-colors break-all ltr-isolate"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-muted shrink-0" />
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, "")}`}
                  dir="ltr"
                  className="hover:text-foreground transition-colors ltr-isolate"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                <span>{siteConfig.contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
          <p>
            {t("footer.copyright", {
              year: COPYRIGHT_YEAR,
              name: siteConfig.name,
            })}
          </p>
          <div className="flex items-center gap-6">
            <span>Powered by Next.js & Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
