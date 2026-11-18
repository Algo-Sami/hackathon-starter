"use client";

import Link from "next/link";
import { Sparkles, CheckCircle2, ShieldCheck, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";

const COPYRIGHT_YEAR = 2026;

export function Footer() {

  return (
    <footer className="w-full bg-background border-t border-border mt-auto">
      <div className="site-container py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand & Overview */}
          <div className="space-y-3 md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none"
              aria-label={`${siteConfig.name} Home`}
            >
              <div className="w-7 h-7 rounded bg-primary flex items-center justify-center text-white font-bold text-xs shadow-xs group-hover:bg-primary-hover transition-colors">
                <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
              </div>
              <span className="font-semibold text-lg tracking-tight text-foreground">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-[460px]">
              {siteConfig.description}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary border border-primary-accent/30">
                <CheckCircle2 className="w-3 h-3" />
                Islamabad Hackathon 2026
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface text-muted border border-border">
                <ShieldCheck className="w-3 h-3" />
                Deterministic Verification
              </span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              Event Planning
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted hover:text-foreground transition-colors">
                  Workspace Dashboard
                </Link>
              </li>
              <li>
                <Link href="/plan" className="text-muted hover:text-foreground transition-colors">
                  Five-Area Event Plan
                </Link>
              </li>
              <li>
                <Link href="/messages" className="text-muted hover:text-foreground transition-colors">
                  Messages & Decisions
                </Link>
              </li>
              <li>
                <Link href="/trace" className="text-muted hover:text-foreground transition-colors">
                  AI Model-Call Trace
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Scenario Specifications */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              Scenario Brief
            </h3>
            <ul className="space-y-1.5 text-xs text-muted">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Islamabad, Pakistan</span>
              </li>
              <li>
                <strong className="text-foreground font-medium">Headcount:</strong> 150 Students (50 Teams)
              </li>
              <li>
                <strong className="text-foreground font-medium">Duration:</strong> Strictly 4.0 Hours
              </li>
              <li>
                <strong className="text-foreground font-medium">Budget:</strong> Rs 650,000 Approved
              </li>
              <li>
                <strong className="text-foreground font-medium">Judges:</strong> 17 Available Evaluators
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Principles */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
          <p>
            © {COPYRIGHT_YEAR} {siteConfig.name}. Mind to Machine Hackathon.
          </p>
          <p className="text-xs text-muted">
            AI interprets natural language • Deterministic code performs calculations and validation
          </p>
        </div>
      </div>
    </footer>
  );
}
