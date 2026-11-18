"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { useTranslation } from "@/components/providers/LanguageProvider";

export interface UserDropdownProps {
  email: string;
  fullName?: string | null;
  avatarUrl?: string | null;
}

function getInitials(name?: string | null, email?: string): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return "?";
}

export function UserDropdown({ email, fullName, avatarUrl }: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const initials = getInitials(fullName, email);
  const displayName = fullName?.trim() || email;

  async function handleLogout() {
    setLoggingOut(true);
    await logoutAction();
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* Avatar trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("auth.dropdown.avatarAria")}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1.5 p-1 rounded hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        {/* Avatar circle */}
        <div className="w-8 h-8 rounded-full bg-primary-light border border-border overflow-hidden flex items-center justify-center shrink-0">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-semibold text-primary select-none">
              {initials}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown panel positioned relative to logical start/end */}
      {open && (
        <div className="absolute end-0 top-full mt-2 w-56 bg-background border border-border rounded shadow-xs py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
          {/* User info */}
          <div className="px-3 py-2.5 border-b border-border text-start">
            <p className="text-[11px] text-muted uppercase tracking-wide mb-0.5">
              {t("auth.dropdown.signedInAs")}
            </p>
            <p className="text-sm font-semibold text-foreground truncate leading-tight">
              {displayName}
            </p>
            {fullName && (
              <p className="text-xs text-muted truncate ltr-isolate">{email}</p>
            )}
          </div>

          {/* Actions */}
          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-surface transition-colors text-start"
            >
              <LayoutDashboard className="w-4 h-4 text-primary shrink-0" />
              <span>Agent Workspace</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-surface hover:text-foreground disabled:opacity-60 transition-colors text-start"
            >
              <LogOut className="w-4 h-4 text-muted rtl-flip shrink-0" />
              <span>
                {loggingOut
                  ? t("auth.dropdown.loggingOut")
                  : t("auth.dropdown.logout")}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
