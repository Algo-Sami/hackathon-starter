"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  UtensilsCrossed,
  Gavel,
  Wallet,
  CheckCircle2,
  Cpu,
  MapPin,
  Mail,
} from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export default function LandingHomePage() {

  return (
    <div className="flex flex-col w-full">
      {/* ── 1. Hero Section (#home) ─────────────────────────────────────────── */}
      <section
        id="home"
        className="py-16 sm:py-24 lg:py-28 border-b border-border bg-background scroll-mt-16"
      >
        <div className="site-container text-center max-w-[860px]">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary-light text-primary border border-primary-accent/30 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EventMind AI • Physical Hackathon Islamabad</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.18] mb-6">
            Intelligent Event Planning & Decision System
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-muted max-w-[680px] mx-auto leading-relaxed mb-8">
            Converts multi-sender messages in English & Roman Urdu into a valid, explainable, and incrementally updateable five-area event plan. Enforces strict deterministic calculations and constraint verification.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto h-11 px-7 inline-flex items-center justify-center text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded transition-colors shadow-xs group"
            >
              <span>Launch Agent Workspace</span>
              <ArrowRight className="w-4 h-4 ms-2 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="#features"
              className="w-full sm:w-auto h-11 px-6 inline-flex items-center justify-center text-sm font-medium text-foreground bg-surface hover:bg-surface/80 border border-border rounded transition-colors"
            >
              Explore Features
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto h-11 px-6 inline-flex items-center justify-center text-sm font-medium text-muted hover:text-foreground border border-transparent hover:border-border rounded transition-colors"
            >
              Sign In
            </Link>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-6 border-t border-border/60 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              English & Roman Urdu Support
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Deterministic Rule Validation
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              Truthful AI Model Tracing
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. The Hackathon Scenario Parameters ─────────────────────────────── */}
      <section className="py-12 bg-surface/50 border-b border-border">
        <div className="site-container">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-bold">
              Competition Test Scenario
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
              Physical Hackathon in Islamabad
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Derived strictly from the official student hackathon challenge brief.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
            <div className="p-4 bg-background border border-border rounded text-center">
              <span className="text-xs text-muted block">Participants</span>
              <strong className="text-base sm:text-lg font-bold text-foreground mt-1 block">
                150 Students
              </strong>
              <span className="text-[11px] text-muted">50 Teams (3/team)</span>
            </div>

            <div className="p-4 bg-background border border-border rounded text-center">
              <span className="text-xs text-muted block">Duration</span>
              <strong className="text-base sm:text-lg font-bold text-foreground mt-1 block">
                4.0 Hours
              </strong>
              <span className="text-[11px] text-muted">With prayer break</span>
            </div>

            <div className="p-4 bg-background border border-border rounded text-center">
              <span className="text-xs text-muted block">Budget Ceiling</span>
              <strong className="text-base sm:text-lg font-bold text-foreground mt-1 block">
                Rs 650,000
              </strong>
              <span className="text-[11px] text-muted">Hard budget limit</span>
            </div>

            <div className="p-4 bg-background border border-border rounded text-center">
              <span className="text-xs text-muted block">Total Headcount</span>
              <strong className="text-base sm:text-lg font-bold text-foreground mt-1 block">
                177 Meals
              </strong>
              <span className="text-[11px] text-muted">Students + Staff + Judges</span>
            </div>

            <div className="p-4 bg-background border border-border rounded text-center col-span-2 md:col-span-1">
              <span className="text-xs text-muted block">Evaluator Pool</span>
              <strong className="text-base sm:text-lg font-bold text-foreground mt-1 block">
                17 Judges
              </strong>
              <span className="text-[11px] text-muted">&le; 3 teams per judge</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Five Planning Areas (#features) ─────────────────────────────────── */}
      <section id="features" className="py-16 sm:py-20 bg-background border-b border-border scroll-mt-16">
        <div className="site-container">
          <div className="text-center max-w-[680px] mx-auto mb-12">
            <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-bold">
              Five Required Planning Areas
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1.5 mb-2">
              End-to-End Event Coordination
            </h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              The agent organizes facts, resolves conflicting proposals, and builds synchronized plans across all five mandatory areas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Venue */}
            <div className="p-6 bg-surface/50 border border-border rounded-lg space-y-3 hover:border-primary/40 transition-colors">
              <div className="w-9 h-9 rounded bg-primary-light flex items-center justify-center text-primary">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">1. Venue Planning</h3>
              <p className="text-xs text-muted leading-relaxed">
                Matches total verified attendance (177 people) against hall capacities. Evaluates rental rates, audio/visual setups, AC requirements, and standby power generator availability.
              </p>
              <div className="text-[11px] font-mono text-foreground bg-background p-2 rounded border border-border">
                Hall B: 220 seats • Rs 180,000 rental
              </div>
            </div>

            {/* 2. Schedule */}
            <div className="p-6 bg-surface/50 border border-border rounded-lg space-y-3 hover:border-primary/40 transition-colors">
              <div className="w-9 h-9 rounded bg-primary-light flex items-center justify-center text-primary">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">2. Schedule Construction</h3>
              <p className="text-xs text-muted leading-relaxed">
                Enforces the non-negotiable 4-hour timeline without activity overlaps. Integrates the mandatory 20-minute Asr prayer and refreshment break at 03:00 PM.
              </p>
              <div className="text-[11px] font-mono text-foreground bg-background p-2 rounded border border-border">
                01:00 PM – 05:00 PM (Strict 240 min)
              </div>
            </div>

            {/* 3. Food */}
            <div className="p-6 bg-surface/50 border border-border rounded-lg space-y-3 hover:border-primary/40 transition-colors">
              <div className="w-9 h-9 rounded bg-primary-light flex items-center justify-center text-primary">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">3. Food & Anti-Shortage Guard</h3>
              <p className="text-xs text-muted leading-relaxed">
                Calculates exact required meals: 150 students + 10 staff + 17 judges = 177 meals. Automatically rejects unsafe reductions (such as the 100-box proposal) to protect student meals.
              </p>
              <div className="text-[11px] font-mono text-foreground bg-background p-2 rounded border border-border">
                177 Biryani Meals • Rs 650/head + delivery
              </div>
            </div>

            {/* 4. Judging */}
            <div className="p-6 bg-surface/50 border border-border rounded-lg space-y-3 hover:border-primary/40 transition-colors">
              <div className="w-9 h-9 rounded bg-primary-light flex items-center justify-center text-primary">
                <Gavel className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">4. Judging Capacity Allocation</h3>
              <p className="text-xs text-muted leading-relaxed">
                Distributes 50 teams across 17 evaluators (~2.94 teams per judge). Allows 8 minutes of presentation and 2 minutes of Q&A per team. Handles traffic delays seamlessly.
              </p>
              <div className="text-[11px] font-mono text-foreground bg-background p-2 rounded border border-border">
                75-min Parallel Pitching Slot
              </div>
            </div>

            {/* 5. Budget */}
            <div className="p-6 bg-surface/50 border border-border rounded-lg space-y-3 hover:border-primary/40 transition-colors">
              <div className="w-9 h-9 rounded bg-primary-light flex items-center justify-center text-primary">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">5. Budget Ledger & Ceiling</h3>
              <p className="text-xs text-muted leading-relaxed">
                Maintains committed expenses under the Rs 650,000 ceiling. Unapproved suggestions (like a Rs 35,000 DJ) are quarantined and never counted as committed spend.
              </p>
              <div className="text-[11px] font-mono text-foreground bg-background p-2 rounded border border-border">
                Rs 400,050 committed • Rs 99,950 buffer
              </div>
            </div>

            {/* 6. Model Call Trace */}
            <div className="p-6 bg-surface/50 border border-border rounded-lg space-y-3 hover:border-primary/40 transition-colors">
              <div className="w-9 h-9 rounded bg-primary-light flex items-center justify-center text-primary">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">6. Truthful AI Model Tracing</h3>
              <p className="text-xs text-muted leading-relaxed">
                Records sequential call numbers, actual model identifiers, exact inputs/outputs, and provider-reported token usage. Limits updates to &le; 5 model calls per turn.
              </p>
              <div className="text-[11px] font-mono text-foreground bg-background p-2 rounded border border-border">
                Exportable JSON Audit Trail
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. How It Works Section (#about) ─────────────────────────────────── */}
      <section id="about" className="py-16 sm:py-20 bg-surface/40 border-b border-border scroll-mt-16">
        <div className="site-container">
          <div className="text-center max-w-[680px] mx-auto mb-12">
            <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-bold">
              Workflow & Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1.5 mb-2">
              How EventMind AI Works
            </h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              A hybrid architecture combining large language models for natural language understanding with deterministic logic for calculations and constraints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-background border border-border rounded-lg space-y-3">
              <span className="text-2xl font-bold text-primary font-mono">01</span>
              <h3 className="text-base font-bold text-foreground">Ingest Messages</h3>
              <p className="text-xs text-muted leading-relaxed">
                Upload raw .txt message packs or submit single messages in English or Roman Urdu. Original text is preserved untouched without paraphrasing errors.
              </p>
            </div>

            <div className="p-6 bg-background border border-border rounded-lg space-y-3">
              <span className="text-2xl font-bold text-primary font-mono">02</span>
              <h3 className="text-base font-bold text-foreground">Extract & Classify</h3>
              <p className="text-xs text-muted leading-relaxed">
                AI extracts claims and categorizes each message as confirmed fact, hard constraint, update, suggestion, or invalid proposal violating existing rules.
              </p>
            </div>

            <div className="p-6 bg-background border border-border rounded-lg space-y-3">
              <span className="text-2xl font-bold text-primary font-mono">03</span>
              <h3 className="text-base font-bold text-foreground">Deterministic Validate</h3>
              <p className="text-xs text-muted leading-relaxed">
                TypeScript application code calculates budgets, checks capacity, enforces schedule durations, rejects invalid proposals, and preserves the last valid plan.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 h-10 px-6 text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded transition-colors shadow-xs"
            >
              <span>Test with Live Message Stream</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Contact & Support Section (#contact) ─────────────────────────── */}
      <section id="contact" className="py-16 sm:py-20 bg-background scroll-mt-16">
        <div className="site-container max-w-[840px]">
          <div className="text-center mb-10">
            <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-bold">
              Get in Touch
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1.5 mb-2">
              Contact EventMind Support
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Have a question about the hackathon planning brief or system integration? Reach out below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 md:col-span-1 text-xs">
              <div className="p-4 bg-surface rounded border border-border space-y-1">
                <span className="text-muted block font-medium">Headquarters</span>
                <p className="text-foreground font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> Islamabad, Pakistan
                </p>
              </div>

              <div className="p-4 bg-surface rounded border border-border space-y-1">
                <span className="text-muted block font-medium">Coordinator Email</span>
                <p className="text-foreground font-semibold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" /> eventmind@islamabad.hackathon
                </p>
              </div>

              <div className="p-4 bg-surface rounded border border-border space-y-1">
                <span className="text-muted block font-medium">Event Schedule</span>
                <p className="text-foreground font-semibold">18 November 2026</p>
              </div>
            </div>

            <div className="md:col-span-2 bg-surface p-6 rounded-lg border border-border">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
