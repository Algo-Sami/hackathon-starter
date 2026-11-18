"use client";

import { useState } from "react";
import {
  Search,
  Clock,
  Send,
  CornerDownLeft,
} from "lucide-react";
import { useEventMind } from "@/components/eventmind/EventMindProvider";

export default function MessagesDecisionsPage() {
  const { state, submitNewMessage, isProcessing } = useEventMind();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterClassification, setFilterClassification] = useState<string>("all");
  const [filterDecision, setFilterDecision] = useState<string>("all");

  const [newMsgText, setNewMsgText] = useState("");
  const [newMsgSender, setNewMsgSender] = useState("");

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim() || isProcessing) return;
    await submitNewMessage(newMsgText.trim(), newMsgSender.trim() || "Event Organizer");
    setNewMsgText("");
  };

  const filteredMessages = state.messages.filter((msg) => {
    const matchesSearch =
      msg.rawText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.sender && msg.sender.toLowerCase().includes(searchQuery.toLowerCase())) ||
      msg.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClassification =
      filterClassification === "all" || msg.classification === filterClassification;

    const matchesDecision =
      filterDecision === "all" || msg.decisionStatus === filterDecision;

    return matchesSearch && matchesClassification && matchesDecision;
  });

  return (
    <div className="flex flex-col w-full pb-20">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <section className="bg-surface border-b border-border py-8">
        <div className="site-container">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-light text-primary border border-primary-accent/30">
                Auditable Decision Log
              </span>
              <span className="text-xs text-muted">{state.messages.length} Total Messages Logged</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Messages & Decisions Audit
            </h1>
            <p className="text-xs sm:text-sm text-muted max-w-[680px]">
              Complete record of all incoming communications in English and Roman Urdu. Original raw text is
              preserved unchanged, classified, and paired with verifiable decision reasons.
            </p>
          </div>
        </div>
      </section>

      <div className="site-container mt-8 space-y-6">
        {/* ── Quick Add Message Form ──────────────────────────────────────────── */}
        <div className="bg-background border border-border rounded p-5 shadow-2xs">
          <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-primary" />
            <span>Submit Another Message to Event Stream</span>
          </h2>
          <form onSubmit={handleQuickSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              value={newMsgSender}
              onChange={(e) => setNewMsgSender(e.target.value)}
              placeholder="Sender / Stakeholder"
              className="sm:col-span-1 h-9 px-3 text-xs bg-surface border border-border rounded focus:outline-none focus:border-primary"
            />
            <div className="sm:col-span-3 relative">
              <input
                type="text"
                value={newMsgText}
                onChange={(e) => setNewMsgText(e.target.value)}
                placeholder="Enter text in English or Roman Urdu..."
                required
                className="w-full h-9 ps-3 pe-24 text-xs bg-surface border border-border rounded focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={!newMsgText.trim() || isProcessing}
                className="absolute end-1 top-1 h-7 px-3 text-xs font-medium text-white bg-primary hover:bg-primary-hover disabled:opacity-50 rounded flex items-center gap-1 transition-colors"
              >
                <span>{isProcessing ? "Processing..." : "Process"}</span>
                <CornerDownLeft className="w-2.5 h-2.5" />
              </button>
            </div>
          </form>
        </div>

        {/* ── Filter & Search Toolbar ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-3 rounded border border-border">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-muted absolute start-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, sender, or MSG ID..."
              className="w-full h-9 ps-9 pe-3 text-xs bg-background border border-border rounded focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterClassification}
              onChange={(e) => setFilterClassification(e.target.value)}
              className="h-9 px-2 text-xs bg-background border border-border rounded text-muted focus:outline-none focus:border-primary"
            >
              <option value="all">All Classifications</option>
              <option value="confirmed_fact">Confirmed Fact</option>
              <option value="hard_constraint">Hard Constraint</option>
              <option value="update">Update</option>
              <option value="suggestion">Suggestion</option>
              <option value="invalid_proposal">Invalid Proposal</option>
            </select>

            <select
              value={filterDecision}
              onChange={(e) => setFilterDecision(e.target.value)}
              className="h-9 px-2 text-xs bg-background border border-border rounded text-muted focus:outline-none focus:border-primary"
            >
              <option value="all">All Decisions</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="unresolved">Unresolved</option>
            </select>
          </div>
        </div>

        {/* ── Messages Feed ───────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="bg-background border border-border rounded p-12 text-center text-muted text-xs">
              No messages found matching your search or filters.
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`bg-background border rounded p-5 space-y-3 shadow-2xs transition-all ${
                  msg.isLatest ? "ring-2 ring-primary/40 border-primary" : "border-border"
                } ${
                  msg.decisionStatus === "rejected" ? "bg-rose-50/20 border-rose-200" : ""
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground bg-surface px-2 py-0.5 rounded border border-border">
                      {msg.id}
                    </span>
                    <span className="text-xs font-semibold text-foreground">{msg.sender}</span>
                    {msg.role && (
                      <span className="text-[11px] text-muted">({msg.role})</span>
                    )}
                    <span className="text-[11px] text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {msg.timestamp}
                    </span>
                    {msg.isLatest && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary text-white">
                        LATEST
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Classification Badge */}
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface border border-border text-muted">
                      {msg.classification.replace("_", " ")}
                    </span>

                    {/* Language Badge */}
                    {msg.language === "roman_ur" && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                        Roman Urdu
                      </span>
                    )}

                    {/* Decision Badge */}
                    <span
                      className={`text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded border ${
                        msg.decisionStatus === "accepted"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : msg.decisionStatus === "rejected"
                          ? "bg-rose-100 text-rose-800 border-rose-300"
                          : "bg-amber-100 text-amber-800 border-amber-300"
                      }`}
                    >
                      {msg.decisionStatus}
                    </span>
                  </div>
                </div>

                {/* Raw Message Body (Unchanged text) */}
                <div className="bg-surface/70 border border-border/80 rounded p-3 text-xs sm:text-sm font-mono text-foreground leading-relaxed">
                  &quot;{msg.rawText}&quot;
                </div>

                {/* Decision Reason & Affected Areas */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
                  <div className="space-y-0.5">
                    <p
                      className={`${
                        msg.decisionStatus === "rejected"
                          ? "text-rose-900 font-medium"
                          : "text-muted"
                      }`}
                    >
                      <strong className="text-foreground">Decision Rationale: </strong>
                      {msg.decisionReason}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                    <span className="text-[10px] text-muted">Affected:</span>
                    {msg.affectedAreas.map((area) => (
                      <span
                        key={area}
                        className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-primary-light text-primary border border-primary-accent/30"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
