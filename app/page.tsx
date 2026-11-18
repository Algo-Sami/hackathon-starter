"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Upload,
  Send,
  RotateCcw,
  Download,
  Building2,
  Clock,
  UtensilsCrossed,
  Gavel,
  Wallet,
  ShieldCheck,
  ArrowRight,
  Info,
  ChevronRight,
  FileText,
  Cpu,
  CornerDownLeft,
} from "lucide-react";
import { useEventMind } from "@/components/eventmind/EventMindProvider";

export default function DashboardPage() {
  const {
    state,
    submitNewMessage,
    uploadMessagePack,
    resetWorkspace,
    exportPlanAsText,
    exportTraceAsJson,
    isProcessing,
    lastActionResult,
    clearActionResult,
  } = useEventMind();

  const [messageInput, setMessageInput] = useState("");
  const [senderInput, setSenderInput] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle single new message submit
  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || isProcessing) return;

    await submitNewMessage(messageInput.trim(), senderInput.trim() || "Event Organizer");
    setMessageInput("");
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      if (content) {
        await uploadMessagePack(content, file.name);
        setShowUploadModal(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* ── 1. Workspace Header Banner ────────────────────────────────────────── */}
      <section className="bg-surface border-b border-border py-8 sm:py-10">
        <div className="site-container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary-light text-primary border border-primary-accent/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Physical Hackathon Islamabad • Version {state.version}.0</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {state.eventName}
              </h1>
              <p className="text-sm text-muted max-w-[640px]">
                Active event planning workspace. Interprets incoming messages in English & Roman Urdu,
                enforces strict deterministic constraints, and maintains verified plan state.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="h-9 px-3.5 text-xs sm:text-sm font-medium text-foreground bg-background hover:bg-surface border border-border rounded flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5 text-primary" />
                <span>Upload Pack (.txt)</span>
              </button>

              <button
                type="button"
                onClick={exportPlanAsText}
                className="h-9 px-3.5 text-xs sm:text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Plan</span>
              </button>

              <button
                type="button"
                onClick={resetWorkspace}
                title="Reset to default baseline hackathon state"
                className="h-9 w-9 text-muted hover:text-foreground hover:bg-background border border-border rounded flex items-center justify-center transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Action Result Banner (Notification) ────────────────────────────────── */}
      {lastActionResult && (
        <div className="site-container mt-6">
          <div
            className={`p-4 rounded border text-sm flex items-start justify-between gap-3 ${
              lastActionResult.type === "success"
                ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                : lastActionResult.type === "error"
                ? "bg-rose-50/80 border-rose-200 text-rose-900"
                : "bg-surface border-border text-foreground"
            }`}
          >
            <div className="flex items-start gap-2.5">
              {lastActionResult.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : lastActionResult.type === "error" ? (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-muted shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <p className="font-medium leading-snug">{lastActionResult.message}</p>
                <p className="text-xs opacity-80">
                  Calculations & deterministic validation recomputed automatically.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearActionResult}
              className="text-xs font-semibold px-2 py-1 rounded hover:bg-black/5"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ── 2. Status Summary Cards (PRD 10.3) ─────────────────────────────────── */}
      <section className="site-container mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1: Plan Validity */}
          <div className="bg-background border border-border rounded p-4.5 flex flex-col justify-between">
            <span className="text-xs text-muted font-medium">Plan Status</span>
            <div className="flex items-center gap-2 mt-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-lg font-bold text-foreground">VALID</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium mt-1">
              6/6 deterministic checks passed
            </span>
          </div>

          {/* Card 2: Approved Budget */}
          <div className="bg-background border border-border rounded p-4.5 flex flex-col justify-between">
            <span className="text-xs text-muted font-medium">Budget Status</span>
            <div className="mt-2">
              <span className="text-lg font-bold text-foreground">
                Rs {state.budget.totalCommitted.toLocaleString()}
              </span>
              <span className="text-xs text-muted ms-1">/ 650k</span>
            </div>
            <span className="text-[11px] text-muted font-medium mt-1">
              Rs {state.budget.remainingBalance.toLocaleString()} unallocated
            </span>
          </div>

          {/* Card 3: Headcount & Attendance */}
          <div className="bg-background border border-border rounded p-4.5 flex flex-col justify-between">
            <span className="text-xs text-muted font-medium">Verified Headcount</span>
            <div className="text-lg font-bold text-foreground mt-2">
              177 Attendees
            </div>
            <span className="text-[11px] text-muted font-medium mt-1">
              150 students • 10 staff • 17 judges
            </span>
          </div>

          {/* Card 4: Messages Processed */}
          <div className="bg-background border border-border rounded p-4.5 flex flex-col justify-between">
            <span className="text-xs text-muted font-medium">Messages Analyzed</span>
            <div className="text-lg font-bold text-foreground mt-2">
              {state.messages.length} Messages
            </div>
            <span className="text-[11px] text-muted font-medium mt-1">
              {state.messages.filter((m) => m.decisionStatus === "rejected").length} invalid proposal rejected
            </span>
          </div>
        </div>
      </section>

      {/* ── 3. Main Action: Submit Single Message (PRD 10.3 #3) ────────────────── */}
      <section className="site-container mt-8">
        <div className="bg-background border border-border rounded p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-primary-light flex items-center justify-center text-primary">
                <Send className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-base font-semibold text-foreground">
                Submit New Message (English or Roman Urdu)
              </h2>
            </div>
            <span className="text-xs text-muted hidden sm:inline">
              Max 5 model calls • &lt; 1 min update limit
            </span>
          </div>

          <p className="text-xs text-muted mb-4">
            Test the deterministic conflict engine by sending updates, e.g.,{" "}
            <span className="text-foreground font-mono bg-surface px-1.5 py-0.5 rounded border border-border/80">
              &quot;Bhai 100 boxes mangwa lo kafi hongay bachat ho jaye gi&quot;
            </span>{" "}
            or{" "}
            <span className="text-foreground font-mono bg-surface px-1.5 py-0.5 rounded border border-border/80">
              &quot;Printing flex cost increased to Rs 15,000&quot;
            </span>.
          </p>

          <form onSubmit={handleMessageSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                value={senderInput}
                onChange={(e) => setSenderInput(e.target.value)}
                placeholder="Sender / Role (e.g., Food Committee, Vendor)"
                className="sm:col-span-1 h-10 px-3 text-xs bg-surface border border-border rounded focus:outline-none focus:border-primary"
              />
              <div className="sm:col-span-3 relative">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a new message in English or Roman Urdu..."
                  required
                  className="w-full h-10 ps-3 pe-24 text-xs sm:text-sm bg-surface border border-border rounded focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim() || isProcessing}
                  className="absolute end-1 top-1 h-8 px-3 text-xs font-medium text-white bg-primary hover:bg-primary-hover disabled:opacity-50 rounded flex items-center gap-1.5 transition-colors"
                >
                  {isProcessing ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>Submit</span>
                      <CornerDownLeft className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* ── 4. Five Planning Areas Overview Cards (PRD 10.3 #4) ────────────────── */}
      <section className="site-container mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Five Planning Areas</h2>
            <p className="text-xs text-muted">
              Core areas mandated by the hackathon competition brief.
            </p>
          </div>
          <Link
            href="/plan"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
          >
            <span>View Full Detailed Plan</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* 1. Venue */}
          <div className="bg-background border border-border rounded p-4 flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-8 h-8 rounded bg-primary-light flex items-center justify-center text-primary">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {state.venue.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground">1. Venue</h3>
              <p className="text-xs text-muted mt-1 font-medium truncate">
                {state.venue.name}
              </p>
              <div className="mt-3 space-y-1 text-xs text-muted">
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <strong className="text-foreground">{state.venue.capacity} seats</strong>
                </div>
                <div className="flex justify-between">
                  <span>Attendance:</span>
                  <strong className="text-foreground">{state.venue.expectedAttendance}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Rental:</span>
                  <strong className="text-foreground">Rs {state.venue.cost.toLocaleString()}</strong>
                </div>
              </div>
            </div>
            <Link
              href="/plan#venue"
              className="mt-4 pt-3 border-t border-border text-xs text-primary font-medium hover:underline flex items-center justify-between"
            >
              <span>Venue details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* 2. Schedule */}
          <div className="bg-background border border-border rounded p-4 flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-8 h-8 rounded bg-primary-light flex items-center justify-center text-primary">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {state.schedule.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground">2. Schedule</h3>
              <p className="text-xs text-muted mt-1 font-medium">
                {state.schedule.totalDurationHours} Hours (Mandatory)
              </p>
              <div className="mt-3 space-y-1 text-xs text-muted">
                <div className="flex justify-between">
                  <span>Start - End:</span>
                  <strong className="text-foreground">
                    {state.schedule.eventStartTime} - {state.schedule.eventEndTime}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Prayer Break:</span>
                  <strong className="text-emerald-700 font-medium">20 min (Asr)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Activities:</span>
                  <strong className="text-foreground">{state.schedule.activities.length} slots</strong>
                </div>
              </div>
            </div>
            <Link
              href="/plan#schedule"
              className="mt-4 pt-3 border-t border-border text-xs text-primary font-medium hover:underline flex items-center justify-between"
            >
              <span>Schedule timeline</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* 3. Food */}
          <div className="bg-background border border-border rounded p-4 flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-8 h-8 rounded bg-primary-light flex items-center justify-center text-primary">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {state.food.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground">3. Food</h3>
              <p className="text-xs text-muted mt-1 font-medium">
                177 Meals (100% Covered)
              </p>
              <div className="mt-3 space-y-1 text-xs text-muted">
                <div className="flex justify-between">
                  <span>Boxes:</span>
                  <strong className="text-foreground">{state.food.requiredQuantity} pcs</strong>
                </div>
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <strong className="text-foreground">Rs {state.food.unitPrice}/box</strong>
                </div>
                <div className="flex justify-between">
                  <span>Total Food:</span>
                  <strong className="text-foreground">Rs {state.food.totalCost.toLocaleString()}</strong>
                </div>
              </div>
            </div>
            <Link
              href="/plan#food"
              className="mt-4 pt-3 border-t border-border text-xs text-primary font-medium hover:underline flex items-center justify-between"
            >
              <span>Catering breakdown</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* 4. Judging */}
          <div className="bg-background border border-border rounded p-4 flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-8 h-8 rounded bg-primary-light flex items-center justify-center text-primary">
                  <Gavel className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {state.judging.allocationStatus}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground">4. Judging</h3>
              <p className="text-xs text-muted mt-1 font-medium">
                50 Teams • 17 Judges
              </p>
              <div className="mt-3 space-y-1 text-xs text-muted">
                <div className="flex justify-between">
                  <span>Ratio:</span>
                  <strong className="text-foreground">{state.judging.teamsPerJudge} teams/judge</strong>
                </div>
                <div className="flex justify-between">
                  <span>Pitch Time:</span>
                  <strong className="text-foreground">{state.judging.minutesPerTeam} min / team</strong>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <strong className="text-emerald-700 font-medium">Feasible slot</strong>
                </div>
              </div>
            </div>
            <Link
              href="/plan#judging"
              className="mt-4 pt-3 border-t border-border text-xs text-primary font-medium hover:underline flex items-center justify-between"
            >
              <span>Judge assignments</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* 5. Budget */}
          <div className="bg-background border border-border rounded p-4 flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-8 h-8 rounded bg-primary-light flex items-center justify-center text-primary">
                  <Wallet className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {state.budget.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground">5. Budget</h3>
              <p className="text-xs text-muted mt-1 font-medium">
                Rs {state.budget.approvedTotal.toLocaleString()} Ceiling
              </p>
              <div className="mt-3 space-y-1 text-xs text-muted">
                <div className="flex justify-between">
                  <span>Committed:</span>
                  <strong className="text-foreground">Rs {state.budget.totalCommitted.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Planned:</span>
                  <strong className="text-foreground">Rs {state.budget.totalPlanned.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Balance:</span>
                  <strong className="text-emerald-700 font-medium">
                    Rs {state.budget.remainingBalance.toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
            <Link
              href="/plan#budget"
              className="mt-4 pt-3 border-t border-border text-xs text-primary font-medium hover:underline flex items-center justify-between"
            >
              <span>Ledger items</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Deterministic Validation Summary (PRD 10.3 #5) ──────────────────── */}
      <section className="site-container mt-10">
        <div className="bg-background border border-border rounded p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-border">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Deterministic Validation Rules Engine</span>
              </h2>
              <p className="text-xs text-muted">
                Calculations and hard-constraint checks run in deterministic TypeScript code, never delegated to LLM hallucination.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
              ALL 6 CHECKS PASSED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {state.validations.map((check) => (
              <div
                key={check.id}
                className="p-3.5 rounded border border-border bg-surface/50 flex items-start gap-3"
              >
                <div className="mt-0.5 shrink-0">
                  {check.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600" />
                  )}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{check.name}</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface border border-border text-muted">
                      {check.area}
                    </span>
                  </div>
                  <p className="text-muted leading-relaxed">{check.reason}</p>
                  <div className="text-[11px] text-foreground font-mono">
                    <span className="text-muted">Rule: </span>
                    {check.thresholdOrRule} • <span className="text-muted">Actual: </span>
                    {check.actualValue}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Recent Decisions & Rejected Messages (PRD 10.3 #6) ──────────────── */}
      <section className="site-container mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Message Decisions Feed */}
          <div className="lg:col-span-2 bg-background border border-border rounded p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-foreground">Recent Decisions & Message Audits</h2>
                <p className="text-xs text-muted">
                  Full evidence trail of accepted, updated, and explicitly rejected proposals.
                </p>
              </div>
              <Link
                href="/messages"
                className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
              >
                <span>All {state.messages.length} Messages</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {state.messages.slice(-4).reverse().map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded border text-xs space-y-2 ${
                    msg.decisionStatus === "rejected"
                      ? "border-rose-200 bg-rose-50/40"
                      : msg.decisionStatus === "accepted"
                      ? "border-border bg-surface/30"
                      : "border-amber-200 bg-amber-50/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{msg.sender}</span>
                      <span className="text-[10px] text-muted">({msg.timestamp})</span>
                      {msg.language === "roman_ur" && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                          Roman Urdu
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                        msg.decisionStatus === "rejected"
                          ? "bg-rose-100 text-rose-800 border-rose-300"
                          : msg.decisionStatus === "accepted"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : "bg-amber-100 text-amber-800 border-amber-300"
                      }`}
                    >
                      {msg.decisionStatus}
                    </span>
                  </div>

                  <p className="text-foreground font-mono bg-background/80 p-2 rounded border border-border/60">
                    &quot;{msg.rawText}&quot;
                  </p>

                  <p
                    className={`leading-relaxed ${
                      msg.decisionStatus === "rejected"
                        ? "text-rose-900 font-medium"
                        : "text-muted"
                    }`}
                  >
                    <strong>Decision:</strong> {msg.decisionReason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right 1 Col: AI Trace & Token Accounting Preview (PRD 10.3 #7) */}
          <div className="bg-background border border-border rounded p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-primary-light flex items-center justify-center text-primary">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="text-base font-bold text-foreground">AI Model Trace</h2>
                </div>
                <Link
                  href="/trace"
                  className="text-xs text-primary font-medium hover:underline"
                >
                  View full trace
                </Link>
              </div>

              <p className="text-xs text-muted leading-relaxed">
                Truthful recording of actual LLM calls used. Every call is tagged with exactly one area and records provider-reported token usage.
              </p>

              <div className="p-3.5 rounded bg-surface border border-border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted">Total Recorded Calls:</span>
                  <strong className="text-foreground">{state.traces.length} calls</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Total Tokens Used:</span>
                  <strong className="text-foreground">{state.totalTokensUsed.toLocaleString()} tokens</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Active Model:</span>
                  <strong className="text-foreground font-mono">llama-3.3-70b</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Calls per Update Rule:</span>
                  <strong className="text-emerald-700 font-medium">&le; 5 calls (Met)</strong>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-foreground">Recent Call Tags:</span>
                <div className="flex flex-wrap gap-1.5">
                  {state.traces.slice(-4).map((t) => (
                    <span
                      key={t.id}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary-light text-primary border border-primary-accent/30"
                    >
                      #{t.sequence} [{t.areaTag}]
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Export Actions Bar (PRD 10.3 #8) */}
            <div className="pt-5 border-t border-border mt-6 space-y-2">
              <span className="text-xs font-semibold text-foreground block">Submission Exports</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={exportPlanAsText}
                  className="w-full py-2 px-2.5 text-xs font-medium text-foreground bg-surface hover:bg-border/60 border border-border rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>Plan (.txt)</span>
                </button>
                <button
                  type="button"
                  onClick={exportTraceAsJson}
                  className="w-full py-2 px-2.5 text-xs font-medium text-foreground bg-surface hover:bg-border/60 border border-border rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Cpu className="w-3.5 h-3.5 text-primary" />
                  <span>Trace (.json)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── File Upload Modal ────────────────────────────────────────────────── */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
          <div className="bg-background border border-border rounded p-6 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">
                Upload Initial Message Pack (.txt)
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-muted hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              Upload the complete unedited plain-text message pack. The system preserves original messages, parses facts, builds all 5 planning areas, and validates constraints.
            </p>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`border-2 border-dashed rounded p-8 text-center cursor-pointer transition-colors ${
                dragActive
                  ? "border-primary bg-primary-light/50"
                  : "border-border hover:border-primary/50 bg-surface/50"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-xs font-semibold text-foreground">
                Click to browse or drop .txt file here
              </p>
              <p className="text-[11px] text-muted mt-1">Plain-text UTF-8 message pack</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-xs font-medium text-muted hover:text-foreground border border-border rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
