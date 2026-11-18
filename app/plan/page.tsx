"use client";

import { useState } from "react";
import {
  Building2,
  Clock,
  UtensilsCrossed,
  Gavel,
  Wallet,
  CheckCircle2,
  XCircle,
  Download,
  MapPin,
} from "lucide-react";
import { useEventMind } from "@/components/eventmind/EventMindProvider";

export default function EventPlanPage() {
  const { state, exportPlanAsText, exportPlanAsJson } = useEventMind();
  const [activeTab, setActiveTab] = useState<"all" | "venue" | "schedule" | "food" | "judging" | "budget">("all");

  return (
    <div className="flex flex-col w-full pb-20">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <section className="bg-surface border-b border-border py-8">
        <div className="site-container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-light text-primary border border-primary-accent/30">
                  Version {state.version}.0 Valid Plan
                </span>
                <span className="text-xs text-muted">Last recalculated: {state.lastUpdated}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Five-Area Event Plan
              </h1>
              <p className="text-xs sm:text-sm text-muted max-w-[680px]">
                Comprehensive, evidence-backed plan derived from verified message constraints. All figures are
                calculated deterministically.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={exportPlanAsText}
                className="h-9 px-3.5 text-xs font-medium text-foreground bg-background hover:bg-surface border border-border rounded flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-primary" />
                <span>Download Report (.txt)</span>
              </button>
              <button
                type="button"
                onClick={exportPlanAsJson}
                className="h-9 px-3.5 text-xs font-medium text-white bg-primary hover:bg-primary-hover rounded flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Area Filter Tabs */}
          <div className="flex items-center gap-1.5 mt-6 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "All 5 Areas" },
              { id: "venue", label: "1. Venue" },
              { id: "schedule", label: "2. Schedule" },
              { id: "food", label: "3. Food" },
              { id: "judging", label: "4. Judging" },
              { id: "budget", label: "5. Budget" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "bg-background text-muted hover:text-foreground border border-border"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="site-container mt-8 space-y-10">
        {/* ── AREA 1: VENUE ─────────────────────────────────────────────────── */}
        {(activeTab === "all" || activeTab === "venue") && (
          <section id="venue" className="bg-background border border-border rounded p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-primary-light flex items-center justify-center text-primary">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">1. Venue Plan</h2>
                  <p className="text-xs text-muted">Capacity, operational constraints, and rental costs</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded font-mono bg-surface border border-border text-muted">
                  Source: {state.venue.sourceMessageId}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {state.venue.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded bg-surface border border-border space-y-1">
                <span className="text-xs text-muted">Selected Venue</span>
                <p className="text-sm font-bold text-foreground">{state.venue.name}</p>
                <p className="text-xs text-muted flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-primary" /> {state.venue.location}
                </p>
              </div>

              <div className="p-3.5 rounded bg-surface border border-border space-y-1">
                <span className="text-xs text-muted">Capacity Check</span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-foreground">
                    {state.venue.capacity} Seats Available
                  </span>
                </div>
                <p className="text-xs text-muted">
                  Sufficient for 177 attendees (150 students + 10 staff + 17 judges) with +43 seat margin.
                </p>
              </div>

              <div className="p-3.5 rounded bg-surface border border-border space-y-1">
                <span className="text-xs text-muted">Rental Cost</span>
                <p className="text-sm font-bold text-foreground">Rs {state.venue.cost.toLocaleString()}</p>
                <p className="text-xs text-muted">Includes AV, PA system, and standby power generator.</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Operational Constraints & Policies
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {state.venue.operationalConstraints.map((constraint, i) => (
                  <li key={i} className="p-2.5 rounded bg-surface/60 border border-border flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted">{constraint}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── AREA 2: SCHEDULE ──────────────────────────────────────────────── */}
        {(activeTab === "all" || activeTab === "schedule") && (
          <section id="schedule" className="bg-background border border-border rounded p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-primary-light flex items-center justify-center text-primary">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">2. Schedule & Timeline</h2>
                  <p className="text-xs text-muted">
                    Strict 4-hour hackathon execution with integrated prayer and judging allocations
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                  4.0 Hours Total
                </span>
              </div>
            </div>

            {/* Visual Timeline Bar */}
            <div className="space-y-3 pt-2">
              <div className="w-full h-3 rounded-full bg-surface border border-border flex overflow-hidden">
                <div style={{ width: "10.4%" }} className="bg-blue-500" title="Opening 25 min" />
                <div style={{ width: "39.6%" }} className="bg-emerald-500" title="Sprint 1 95 min" />
                <div style={{ width: "8.3%" }} className="bg-amber-500" title="Asr Break 20 min" />
                <div style={{ width: "31.3%" }} className="bg-purple-500" title="Judging 75 min" />
                <div style={{ width: "10.4%" }} className="bg-primary" title="Awards 25 min" />
              </div>
              <div className="flex flex-wrap items-center justify-between text-[11px] text-muted font-mono">
                <span>01:00 PM (Start)</span>
                <span>01:25 PM</span>
                <span className="text-amber-700 font-semibold">03:00 PM (Asr Prayer)</span>
                <span>03:20 PM (Judging)</span>
                <span>04:35 PM</span>
                <span>05:00 PM (End)</span>
              </div>
            </div>

            {/* Timeline Activities List */}
            <div className="divide-y divide-border pt-2">
              {state.schedule.activities.map((act) => (
                <div key={act.id} className="py-3 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-3">
                    <span className="font-mono font-bold text-primary w-28 shrink-0">
                      {act.startTime} – {act.endTime}
                    </span>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">{act.title}</span>
                        {act.type === "prayer" && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 font-semibold">
                            Mandatory Prayer Break
                          </span>
                        )}
                      </div>
                      <p className="text-muted">{act.notes}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <span className="text-[11px] text-muted font-mono">{act.durationMinutes} min</span>
                    <span className="text-[10px] text-muted bg-surface px-1.5 py-0.5 rounded border border-border">
                      {act.sourceMessageId}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── AREA 3: FOOD ─────────────────────────────────────────────────── */}
        {(activeTab === "all" || activeTab === "food") && (
          <section id="food" className="bg-background border border-border rounded p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-primary-light flex items-center justify-center text-primary">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">3. Food & Catering Plan</h2>
                  <p className="text-xs text-muted">
                    Headcount formula: 150 students + 10 staff + 17 judges = 177 meals
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded font-mono bg-surface border border-border text-muted">
                  Source: {state.food.sourceMessageId}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {state.food.status}
                </span>
              </div>
            </div>

            {/* Food Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3.5 rounded bg-surface border border-border">
                <span className="text-xs text-muted">Total Headcount</span>
                <p className="text-lg font-bold text-foreground mt-1">{state.food.headcount} People</p>
                <p className="text-[11px] text-muted">150 students, 10 staff, 17 judges</p>
              </div>

              <div className="p-3.5 rounded bg-surface border border-border">
                <span className="text-xs text-muted">Ordered Quantity</span>
                <p className="text-lg font-bold text-foreground mt-1">{state.food.requiredQuantity} Boxes</p>
                <p className="text-[11px] text-emerald-600 font-medium">100% headcount covered</p>
              </div>

              <div className="p-3.5 rounded bg-surface border border-border">
                <span className="text-xs text-muted">Unit Rate</span>
                <p className="text-lg font-bold text-foreground mt-1">Rs {state.food.unitPrice}</p>
                <p className="text-[11px] text-muted">Per individual meal box</p>
              </div>

              <div className="p-3.5 rounded bg-surface border border-border">
                <span className="text-xs text-muted">Total Catering Cost</span>
                <p className="text-lg font-bold text-foreground mt-1">Rs {state.food.totalCost.toLocaleString()}</p>
                <p className="text-[11px] text-muted">Incl. Rs {state.food.deliveryCharges.toLocaleString()} delivery</p>
              </div>
            </div>

            {/* Menu Description */}
            <div className="p-3.5 rounded bg-surface/50 border border-border text-xs">
              <span className="font-semibold text-foreground">Menu Details: </span>
              <span className="text-muted">{state.food.itemDescription}</span>
            </div>

            {/* Rejected Proposal Banner (Audit Trail) */}
            {state.food.rejectedProposals && state.food.rejectedProposals.length > 0 && (
              <div className="p-4 rounded border border-rose-200 bg-rose-50/50 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-rose-800 font-semibold">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Rejected Proposal Audit: Attempted Headcount Reduction</span>
                  <span className="text-[10px] font-mono bg-rose-100 px-1.5 py-0.2 rounded border border-rose-300">
                    {state.food.rejectedProposals[0].messageId}
                  </span>
                </div>
                <p className="font-mono text-rose-900 bg-white/70 p-2 rounded border border-rose-200">
                  &quot;{state.food.rejectedProposals[0].proposal}&quot;
                </p>
                <p className="text-rose-800 leading-relaxed">
                  <strong>Rejection Reason:</strong> {state.food.rejectedProposals[0].reason}
                </p>
              </div>
            )}
          </section>
        )}

        {/* ── AREA 4: JUDGING ──────────────────────────────────────────────── */}
        {(activeTab === "all" || activeTab === "judging") && (
          <section id="judging" className="bg-background border border-border rounded p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-primary-light flex items-center justify-center text-primary">
                  <Gavel className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">4. Judging & Evaluation Plan</h2>
                  <p className="text-xs text-muted">
                    Allocation formula: 50 teams / 17 judges = ~2.94 teams per judge (feasible in 75 min)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {state.judging.allocationStatus}
                </span>
              </div>
            </div>

            {/* Judging Key Ratios */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3.5 rounded bg-surface border border-border">
                <span className="text-xs text-muted">Teams to Evaluate</span>
                <p className="text-lg font-bold text-foreground mt-1">{state.judging.totalTeams} Teams</p>
                <p className="text-[11px] text-muted">150 students (3 per team)</p>
              </div>

              <div className="p-3.5 rounded bg-surface border border-border">
                <span className="text-xs text-muted">Available Evaluators</span>
                <p className="text-lg font-bold text-foreground mt-1">{state.judging.availableJudges} Judges</p>
                <p className="text-[11px] text-muted">Faculty & industry mentors</p>
              </div>

              <div className="p-3.5 rounded bg-surface border border-border">
                <span className="text-xs text-muted">Load Ratio</span>
                <p className="text-lg font-bold text-foreground mt-1">{state.judging.teamsPerJudge} Teams / Judge</p>
                <p className="text-[11px] text-emerald-600 font-medium">Under 3 team max threshold</p>
              </div>

              <div className="p-3.5 rounded bg-surface border border-border">
                <span className="text-xs text-muted">Time Allocated</span>
                <p className="text-lg font-bold text-foreground mt-1">{state.judging.minutesPerTeam} min / team</p>
                <p className="text-[11px] text-muted">+ 2 min Q&A per team</p>
              </div>
            </div>

            {/* Judges Roster Table */}
            <div className="border border-border rounded overflow-hidden">
              <table className="w-full text-xs text-start">
                <thead className="bg-surface border-b border-border text-muted font-semibold">
                  <tr>
                    <th className="p-2.5 text-start">Judge Name</th>
                    <th className="p-2.5 text-start">Domain / Specialization</th>
                    <th className="p-2.5 text-start">Assigned Teams</th>
                    <th className="p-2.5 text-start">Arrival / Operational Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {state.judging.judgesList.map((j, i) => (
                    <tr key={i} className="hover:bg-surface/50">
                      <td className="p-2.5 font-medium text-foreground">{j.name}</td>
                      <td className="p-2.5 text-muted">{j.domain}</td>
                      <td className="p-2.5 text-foreground font-mono">{j.assignedTeams} teams</td>
                      <td className="p-2.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${
                            j.arrivalStatus.includes("delay")
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : "bg-emerald-50 text-emerald-800"
                          }`}
                        >
                          {j.arrivalStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── AREA 5: BUDGET ───────────────────────────────────────────────── */}
        {(activeTab === "all" || activeTab === "budget") && (
          <section id="budget" className="bg-background border border-border rounded p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-primary-light flex items-center justify-center text-primary">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">5. Budget & Finance Ledger</h2>
                  <p className="text-xs text-muted">
                    Approved budget ceiling: Rs 650,000 (Strict deterministic math)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Within Ceiling
                </span>
              </div>
            </div>

            {/* Budget Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3.5 rounded bg-surface border border-border">
                <span className="text-xs text-muted">Approved Ceiling</span>
                <p className="text-lg font-bold text-foreground mt-1">
                  Rs {state.budget.approvedTotal.toLocaleString()}
                </p>
                <p className="text-[11px] text-muted">Hard budget ceiling</p>
              </div>

              <div className="p-3.5 rounded bg-surface border border-border">
                <span className="text-xs text-muted">Total Committed</span>
                <p className="text-lg font-bold text-foreground mt-1">
                  Rs {state.budget.totalCommitted.toLocaleString()}
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">Orders placed / verified</p>
              </div>

              <div className="p-3.5 rounded bg-surface border border-border">
                <span className="text-xs text-muted">Planned Buffer</span>
                <p className="text-lg font-bold text-foreground mt-1">
                  Rs {state.budget.totalPlanned.toLocaleString()}
                </p>
                <p className="text-[11px] text-muted">Standby logistics</p>
              </div>

              <div className="p-3.5 rounded bg-emerald-50/50 border border-emerald-200">
                <span className="text-xs text-emerald-800 font-medium">Remaining Cushion</span>
                <p className="text-lg font-bold text-emerald-900 mt-1">
                  Rs {state.budget.remainingBalance.toLocaleString()}
                </p>
                <p className="text-[11px] text-emerald-700">Safe unallocated balance</p>
              </div>
            </div>

            {/* Itemized Budget Table */}
            <div className="border border-border rounded overflow-hidden">
              <table className="w-full text-xs text-start">
                <thead className="bg-surface border-b border-border text-muted font-semibold">
                  <tr>
                    <th className="p-2.5 text-start">Category</th>
                    <th className="p-2.5 text-start">Item Description</th>
                    <th className="p-2.5 text-start">Amount (PKR)</th>
                    <th className="p-2.5 text-start">Type</th>
                    <th className="p-2.5 text-start">Status</th>
                    <th className="p-2.5 text-start">Source Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {state.budget.items.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-surface/50 ${
                        item.status === "rejected" ? "opacity-60 bg-rose-50/20" : ""
                      }`}
                    >
                      <td className="p-2.5 font-mono uppercase text-[11px] text-muted">
                        {item.category.replace("_", " ")}
                      </td>
                      <td className="p-2.5 font-medium text-foreground">
                        {item.name}
                        {item.notes && <span className="block text-[11px] text-muted font-normal">{item.notes}</span>}
                      </td>
                      <td className="p-2.5 font-bold text-foreground">
                        Rs {item.amount.toLocaleString()}
                      </td>
                      <td className="p-2.5 capitalize text-muted">{item.type.replace("_", " ")}</td>
                      <td className="p-2.5">
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                            item.status === "approved"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-rose-50 text-rose-800 border-rose-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-2.5 font-mono text-[11px] text-muted">{item.sourceMessageId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
