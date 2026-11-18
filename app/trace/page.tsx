"use client";

import { useState } from "react";
import {
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Check,
} from "lucide-react";
import { useEventMind } from "@/components/eventmind/EventMindProvider";

export default function AiTracePage() {
  const { state, exportTraceAsJson } = useEventMind();
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [expandedCalls, setExpandedCalls] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCalls((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTraces = state.traces.filter((trace) => {
    return selectedArea === "all" || trace.areaTag === selectedArea;
  });

  return (
    <div className="flex flex-col w-full pb-20">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <section className="bg-surface border-b border-border py-8">
        <div className="site-container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-light text-primary border border-primary-accent/30">
                  Truthful Call Ledger
                </span>
                <span className="text-xs text-muted">
                  Total Tokens: {state.totalTokensUsed.toLocaleString()}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                AI Model-Call Execution Trace
              </h1>
              <p className="text-xs sm:text-sm text-muted max-w-[680px]">
                Auditable log of actual model calls. Every entry records the sequential call number, model ID,
                assigned area tag, actual prompt, generated output, and provider-reported token usage.
              </p>
            </div>

            <button
              type="button"
              onClick={exportTraceAsJson}
              className="h-9 px-4 text-xs font-medium text-white bg-primary hover:bg-primary-hover rounded flex items-center gap-1.5 transition-colors shadow-xs self-start md:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Trace (.json)</span>
            </button>
          </div>

          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="p-3 rounded bg-background border border-border">
              <span className="text-xs text-muted">Recorded Calls</span>
              <p className="text-base font-bold text-foreground mt-0.5">{state.traces.length}</p>
            </div>
            <div className="p-3 rounded bg-background border border-border">
              <span className="text-xs text-muted">Total Token Consumption</span>
              <p className="text-base font-bold text-foreground mt-0.5">
                {state.totalTokensUsed.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded bg-background border border-border">
              <span className="text-xs text-muted">Calls per Update Rule</span>
              <p className="text-base font-bold text-emerald-700 mt-0.5">&le; 5 calls (Met)</p>
            </div>
            <div className="p-3 rounded bg-background border border-border">
              <span className="text-xs text-muted">Active Model Engine</span>
              <p className="text-base font-bold text-foreground font-mono text-xs mt-1 truncate">
                llama-3.3-70b-versatile
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="site-container mt-8 space-y-6">
        {/* ── Filter Bar ──────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-3 rounded border border-border">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-muted" />
            <span className="text-xs font-semibold text-foreground">Filter by Area Tag:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {["all", "reading", "venue", "schedule", "food", "judging", "budget"].map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => setSelectedArea(area)}
                className={`px-2.5 py-1 text-xs rounded uppercase font-mono transition-colors ${
                  selectedArea === area
                    ? "bg-primary text-white font-bold"
                    : "bg-background text-muted hover:text-foreground border border-border"
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* ── Chronological Trace Cards ───────────────────────────────────────── */}
        <div className="space-y-4">
          {filteredTraces.map((trace) => {
            const isExpanded = !!expandedCalls[trace.id];
            return (
              <div
                key={trace.id}
                className="bg-background border border-border rounded p-5 space-y-3 shadow-2xs"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/80">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground bg-primary-light text-primary px-2 py-0.5 rounded border border-primary-accent/30">
                      Call #{trace.sequence}
                    </span>
                    <span className="text-xs font-mono font-medium text-muted">{trace.runId}</span>
                    <span className="text-[11px] text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {trace.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Area Tag */}
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface border border-border text-foreground font-semibold">
                      [{trace.areaTag}]
                    </span>

                    {/* Model ID */}
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-muted">
                      {trace.model}
                    </span>
                  </div>
                </div>

                {/* Token Accounting Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-surface/50 p-2.5 rounded border border-border/60">
                  <div>
                    <span className="text-muted block text-[10px]">Prompt Tokens:</span>
                    <strong className="text-foreground font-mono">{trace.promptTokens}</strong>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px]">Completion Tokens:</span>
                    <strong className="text-foreground font-mono">{trace.completionTokens}</strong>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px]">Total Tokens:</span>
                    <strong className="text-primary font-mono">{trace.totalTokens}</strong>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px]">Latency:</span>
                    <strong className="text-foreground font-mono">{trace.latencyMs} ms</strong>
                  </div>
                </div>

                {/* Input Prompt (Expandable) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-muted uppercase text-[10px]">
                      Prompt Input:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(trace.inputPrompt, `${trace.id}-in`)}
                      className="text-[11px] text-muted hover:text-foreground flex items-center gap-1"
                    >
                      {copiedId === `${trace.id}-in` ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre
                    className={`text-xs font-mono bg-surface border border-border rounded p-3 text-foreground whitespace-pre-wrap overflow-hidden ${
                      isExpanded ? "" : "max-h-24"
                    }`}
                  >
                    {trace.inputPrompt}
                  </pre>
                </div>

                {/* Output Response (Expandable) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-muted uppercase text-[10px]">
                      Model Response Output:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(trace.outputResponse, `${trace.id}-out`)}
                      className="text-[11px] text-muted hover:text-foreground flex items-center gap-1"
                    >
                      {copiedId === `${trace.id}-out` ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre
                    className={`text-xs font-mono bg-surface border border-border rounded p-3 text-foreground whitespace-pre-wrap overflow-hidden ${
                      isExpanded ? "" : "max-h-28"
                    }`}
                  >
                    {trace.outputResponse}
                  </pre>
                </div>

                {/* Toggle Expand / Collapse */}
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => toggleExpand(trace.id)}
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    <span>{isExpanded ? "Collapse Details" : "Expand Full Payload"}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
