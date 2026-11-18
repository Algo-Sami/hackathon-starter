import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Building2,
  Clock,
  UtensilsCrossed,
  Gavel,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full pb-20">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <section className="bg-surface border-b border-border py-10 sm:py-14">
        <div className="site-container max-w-[840px] text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary-light text-primary border border-primary-accent/30 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mind to Machine Hackathon • Islamabad 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            About {siteConfig.name}
          </h1>

          <p className="text-sm sm:text-base text-muted leading-relaxed max-w-[680px] mx-auto">
            An intelligent event planning and decision system designed to transform unstructured, multi-sender
            messages into verified, explainable, and incrementally updateable event plans.
          </p>

          <div className="flex justify-center gap-3 mt-6">
            <Link
              href="/"
              className="h-9 px-5 inline-flex items-center justify-center text-xs sm:text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded transition-colors shadow-xs"
            >
              <span>Open Workspace Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 ms-1.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Core Principles ─────────────────────────────────────────────────── */}
      <section className="site-container max-w-[840px] mt-10 space-y-8">
        <div className="bg-background border border-border rounded p-6 shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>The Foundational Product Principle</span>
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            <strong className="text-foreground">AI interprets natural language.</strong> Deterministic application
            logic performs calculations, applies explicit constraints, tracks state, and validates the plan.
            The system never invents missing facts or fabricates model-call traces.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded bg-surface border border-border space-y-1">
              <span className="font-semibold text-foreground">AI Role</span>
              <p className="text-muted">
                Extracts facts, claims, sentiment, and constraints from English and Roman Urdu messages.
              </p>
            </div>
            <div className="p-3 rounded bg-surface border border-border space-y-1">
              <span className="font-semibold text-foreground">Deterministic Code Role</span>
              <p className="text-muted">
                Calculates totals, enforces budget ceilings, verifies venue capacity, checks schedule durations, and audits allocations.
              </p>
            </div>
          </div>
        </div>

        {/* ── Physical Hackathon Scenario ───────────────────────────────────── */}
        <div className="bg-background border border-border rounded p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-foreground">The Islamabad Hackathon Scenario</h2>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            The competition scenario requires planning a major student hackathon in Islamabad with the following
            non-negotiable parameters:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded bg-surface border border-border">
              <span className="text-muted block">Participants</span>
              <strong className="text-foreground text-sm">150 Students</strong>
              <span className="text-[11px] text-muted block">50 Teams (3/team)</span>
            </div>
            <div className="p-3 rounded bg-surface border border-border">
              <span className="text-muted block">Event Duration</span>
              <strong className="text-foreground text-sm">Strictly 4.0 Hours</strong>
              <span className="text-[11px] text-muted block">With Asr prayer break</span>
            </div>
            <div className="p-3 rounded bg-surface border border-border">
              <span className="text-muted block">Approved Budget</span>
              <strong className="text-foreground text-sm">Rs 650,000</strong>
              <span className="text-[11px] text-muted block">Hard ceiling limit</span>
            </div>
            <div className="p-3 rounded bg-surface border border-border">
              <span className="text-muted block">Evaluator Pool</span>
              <strong className="text-foreground text-sm">17 Judges</strong>
              <span className="text-[11px] text-muted block">&le; 3 teams/judge</span>
            </div>
          </div>
        </div>

        {/* ── Five Mandatory Planning Areas ─────────────────────────────────── */}
        <div className="bg-background border border-border rounded p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-foreground">Five Mandated Planning Areas</h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded bg-surface border border-border flex items-start gap-3">
              <Building2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground block text-sm">1. Venue Plan</strong>
                <p className="text-muted">
                  Ensures capacity for all 177 attendees (students + staff + judges), evaluates rental costs, and enforces operational rules (AC, power backup).
                </p>
              </div>
            </div>

            <div className="p-3 rounded bg-surface border border-border flex items-start gap-3">
              <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground block text-sm">2. Schedule Plan</strong>
                <p className="text-muted">
                  Orders activities without overlaps, enforces the strict 4-hour envelope, and includes a mandatory 20-minute Asr prayer break.
                </p>
              </div>
            </div>

            <div className="p-3 rounded bg-surface border border-border flex items-start gap-3">
              <UtensilsCrossed className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground block text-sm">3. Food Plan</strong>
                <p className="text-muted">
                  Ensures meals for all 177 confirmed individuals. Explicitly rejects flawed suggestions (e.g., reducing to 100 boxes) with clear justifications.
                </p>
              </div>
            </div>

            <div className="p-3 rounded bg-surface border border-border flex items-start gap-3">
              <Gavel className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground block text-sm">4. Judging Plan</strong>
                <p className="text-muted">
                  Distributes 50 teams across 17 evaluators (~2.94 teams/judge) and accommodates real-world situations like traffic delays without disruption.
                </p>
              </div>
            </div>

            <div className="p-3 rounded bg-surface border border-border flex items-start gap-3">
              <Wallet className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground block text-sm">5. Budget Plan</strong>
                <p className="text-muted">
                  Tracks committed, planned, and remaining funds under the Rs 650,000 ceiling. Unapproved suggestions (like a Rs 35,000 DJ) are quarantined.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
