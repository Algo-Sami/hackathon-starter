"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Sparkles,
  CalendarDays,
  MessageSquareText,
  Cpu,
  ArrowRight,
  Home,
  MessageSquare,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { useTranslation } from "@/components/providers/LanguageProvider";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { UserDropdown, type UserDropdownProps } from "@/components/auth/UserDropdown";

interface HeaderProps {
  user?: UserDropdownProps | null;
}

export function Header({ user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t, isRTL } = useTranslation();

  const isWorkspace =
    pathname.startsWith("/dashboard") ||
    pathname === "/plan" ||
    pathname === "/messages" ||
    pathname === "/trace";

  // Public Landing links
  const publicLinks = [
    { href: "/#home", label: t("nav.home", "Home") },
    { href: "/#features", label: t("nav.features", "Features") },
    { href: "/#about", label: t("nav.about", "How It Works") },
    { href: "/#contact", label: t("nav.contact", "Contact") },
  ];

  // Workspace links
  const workspaceLinks = [
    { href: "/dashboard", label: "Agent Chat", icon: MessageSquare },
    { href: "/plan", label: "Five-Area Plan", icon: CalendarDays },
    { href: "/messages", label: "Messages Audit", icon: MessageSquareText },
    { href: "/trace", label: "AI Trace", icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-xs border-b border-border transition-colors">
      <div className="site-container h-16 flex items-center justify-between">
        {/* Brand Logo & Nav */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label={`${siteConfig.name} Home`}
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
          <nav className="hidden md:flex items-center gap-1 ms-3">
            {!isWorkspace ? (
              // Public Landing Page Navigation
              <>
                {publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-1.5 text-sm text-muted hover:text-foreground hover:bg-surface/80 rounded transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            ) : (
              // Workspace App Navigation
              <>
                {workspaceLinks.map((link) => {
                  const active = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3 py-1.5 text-sm rounded transition-colors flex items-center gap-1.5 ${
                        active
                          ? "text-primary font-semibold bg-primary-light border border-primary-accent/30"
                          : "text-muted hover:text-foreground hover:bg-surface/80 font-normal"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
                <Link
                  href="/"
                  className="px-2.5 py-1.5 text-xs text-muted hover:text-foreground rounded flex items-center gap-1 ms-1 transition-colors"
                >
                  <Home className="w-3 h-3" />
                  <span>Public Site</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right: CTA & Auth & Language */}
        <div className="hidden md:flex items-center gap-3">
          {/* Functional Language Switcher */}
          <LanguageSwitcher />

          {/* CTA: If on landing page, show Launch Workspace button */}
          {!isWorkspace && (
            <Link
              href="/dashboard"
              className="h-9 px-4 inline-flex items-center justify-center text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded transition-colors shadow-xs gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Agent Workspace</span>
            </Link>
          )}

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
                className="h-9 px-3.5 inline-flex items-center justify-center text-sm font-medium text-foreground bg-surface hover:bg-border/60 border border-border rounded transition-colors"
              >
                {t("nav.signup", "Sign up")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Header Controls */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher size="sm" />

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
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
          <nav className="flex flex-col space-y-1">
            {!isWorkspace ? (
              <>
                {publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-base text-foreground hover:bg-surface rounded transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-semibold text-primary bg-primary-light rounded flex items-center justify-between"
                >
                  <span>Launch Agent Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <>
                {workspaceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-base text-foreground hover:bg-surface rounded transition-colors flex items-center gap-2"
                  >
                    <link.icon className="w-4 h-4 text-primary" />
                    <span>{link.label}</span>
                  </Link>
                ))}
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-muted hover:bg-surface rounded"
                >
                  Back to Public Landing
                </Link>
              </>
            )}
          </nav>

          {!user && (
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium text-foreground hover:bg-surface border border-border rounded"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
