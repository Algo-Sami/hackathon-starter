"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Square } from "lucide-react";
import { siteConfig } from "@/config/site";
import { t } from "@/lib/i18n";
import { UserDropdown, type UserDropdownProps } from "@/components/auth/UserDropdown";

interface NavItem {
  href: string;
  sectionId: string;
  labelKey: string;
}

const navLinks: NavItem[] = [
  { href: "/#home", sectionId: "home", labelKey: "nav.home" },
  { href: "/#features", sectionId: "features", labelKey: "nav.features" },
  { href: "/#about", sectionId: "about", labelKey: "nav.about" },
  { href: "/#contact", sectionId: "contact", labelKey: "nav.contact" },
];

interface HeaderProps {
  user?: UserDropdownProps | null;
}

export function Header({ user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();

  // Scroll spy to highlight the active section when on the home page
  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navLinks.forEach((link) => {
      const element = document.getElementById(link.sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [pathname]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    setMobileMenuOpen(false);

    if (pathname === "/") {
      e.preventDefault();
      const targetElement = document.getElementById(sectionId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `#${sectionId}`);
        setActiveSection(sectionId);
      }
    }
  };

  const isLinkActive = (sectionId: string) => {
    if (pathname === "/") {
      return activeSection === sectionId;
    }
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b border-border transition-colors">
      <div className="site-container h-16 flex items-center justify-between">
        {/* Left: Dummy Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/#home"
            onClick={(e) => handleNavClick(e, "home")}
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label={`${siteConfig.name} Home`}
          >
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold text-sm shadow-xs group-hover:bg-primary-hover transition-colors">
              <Square className="w-4 h-4 fill-white text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-foreground">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Nav Links (Center / Right) */}
          <nav
            className="hidden md:flex items-center gap-1 ml-4"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const active = isLinkActive(link.sectionId);
              return (
                <Link
                  key={link.sectionId}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.sectionId)}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-1.5 text-sm transition-colors rounded ${
                    active
                      ? "text-foreground font-semibold bg-surface border border-border/60"
                      : "text-muted hover:text-foreground hover:bg-surface/50 font-normal"
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Language switcher & Auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Switcher placeholder */}
          <div
            className="flex items-center text-xs text-muted border border-border rounded px-2 py-1 gap-1 select-none"
            title="Language switcher (placeholder)"
            aria-label="Language selection"
          >
            <span className="font-semibold text-foreground">
              {t("nav.langEn")}
            </span>
            <span className="text-border">|</span>
            <span className="text-muted hover:text-foreground cursor-default">
              {t("nav.langUr")}
            </span>
          </div>

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
                {t("nav.login")}
              </Link>

              <Link
                href="/register"
                className="h-9 px-4 inline-flex items-center justify-center text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded transition-colors"
              >
                {t("nav.signup")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Language Switcher */}
          <div
            className="flex items-center text-xs text-muted border border-border rounded px-1.5 py-0.5 gap-1 select-none"
            aria-label="Language selection"
          >
            <span className="font-semibold text-foreground">
              {t("nav.langEn")}
            </span>
            <span className="text-border">|</span>
            <span className="text-muted">{t("nav.langUr")}</span>
          </div>

          {/* Mobile: show avatar or hamburger */}
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
              mobileMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")
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
        <div className="md:hidden border-t border-border bg-background px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const active = isLinkActive(link.sectionId);
              return (
                <Link
                  key={link.sectionId}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.sectionId)}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-2 text-base rounded transition-colors ${
                    active
                      ? "text-foreground font-semibold bg-surface border border-border"
                      : "text-muted hover:text-foreground hover:bg-surface"
                  }`}
                >
                  {t(link.labelKey)}
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
                {t("nav.login")}
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded transition-colors"
              >
                {t("nav.signup")}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
