"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles, LayoutDashboard, CalendarDays, MessageSquareText, Cpu, Info } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useTranslation } from "@/components/providers/LanguageProvider";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { UserDropdown, type UserDropdownProps } from "@/components/auth/UserDropdown";

interface NavItem {
  href: string;
  labelKey: string;
  defaultLabel: string;
  icon: typeof LayoutDashboard;
}

const navLinks: NavItem[] = [
  { href: "/", labelKey: "nav.dashboard", defaultLabel: "Dashboard", icon: LayoutDashboard },
  { href: "/plan", labelKey: "nav.plan", defaultLabel: "Event Plan", icon: CalendarDays },
  { href: "/messages", labelKey: "nav.messages", defaultLabel: "Messages", icon: MessageSquareText },
  { href: "/trace", labelKey: "nav.trace", defaultLabel: "AI Trace", icon: Cpu },
  { href: "/about", labelKey: "nav.about", defaultLabel: "About", icon: Info },
];

interface HeaderProps {
  user?: UserDropdownProps | null;
}

export function Header({ user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t, isRTL } = useTranslation();

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-xs border-b border-border transition-colors">
      <div className="site-container h-16 flex items-center justify-between">
        {/* Brand Logo & Nav */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label={`${siteConfig.name} ${t("nav.dashboard", "Dashboard")}`}
          >
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold text-sm shadow-xs group-hover:bg-primary-hover transition-colors">
              <Sparkles className="w-4 h-4 fill-white text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-base sm:text-lg tracking-tight text-foreground leading-none">
                {siteConfig.name}
              </span>
              <span className="text-[10px] text-muted font-medium tracking-wide uppercase mt-0.5">
                Islamabad 2026
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav
            className="hidden md:flex items-center gap-1 ms-3"
            aria-label={t("nav.dashboard", "Dashboard")}
          >
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-1.5 text-sm transition-colors rounded flex items-center gap-1.5 ${
                    active
                      ? "text-primary font-semibold bg-primary-light border border-primary-accent/30"
                      : "text-muted hover:text-foreground hover:bg-surface/80 font-normal"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? "text-primary" : "text-muted"}`} />
                  <span>{t(link.labelKey, link.defaultLabel)}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Language switcher & Auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Functional Language Switcher */}
          <LanguageSwitcher />

          {/* Logged-in: avatar dropdown | Logged-out: login + sign up */}
          {user ? (
            <UserDropdown
              email={user.email}
              fullName={user.fullName}
              avatarUrl={user.avatarUrl}
            />
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-foreground hover:text-primary px-3 py-2 transition-colors rounded"
              >
                {t("nav.login", "Log in")}
              </Link>

              <Link
                href="/register"
                className="h-9 px-4 inline-flex items-center justify-center text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded transition-colors shadow-xs"
              >
                {t("nav.signup", "Sign up")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Header Controls */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Language Switcher */}
          <LanguageSwitcher size="sm" />

          {/* Mobile User Avatar if logged in */}
          {user && (
            <UserDropdown
              email={user.email}
              fullName={user.fullName}
              avatarUrl={user.avatarUrl}
            />
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground hover:bg-surface rounded border border-border transition-colors"
            aria-label={
              mobileMenuOpen ? t("nav.closeMenu", "Close main menu") : t("nav.openMenu", "Open main menu")
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Panel */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-t border-border bg-background px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 ${
            isRTL ? "text-end" : "text-start"
          }`}
        >
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-2 text-base rounded transition-colors flex items-center gap-2.5 ${
                    active
                      ? "text-primary font-semibold bg-primary-light border border-primary-accent/30"
                      : "text-muted hover:text-foreground hover:bg-surface"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t(link.labelKey, link.defaultLabel)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile auth — only shown when logged out */}
          {!user && (
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium text-foreground hover:bg-surface border border-border rounded transition-colors"
              >
                {t("nav.login", "Log in")}
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded transition-colors"
              >
                {t("nav.signup", "Sign up")}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
