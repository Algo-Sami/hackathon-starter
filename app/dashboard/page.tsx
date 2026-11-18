"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  Upload,
  RotateCcw,
  Download,
  Building2,
  Clock,
  UtensilsCrossed,
  Gavel,
  Wallet,
  ShieldCheck,
  Cpu,
  CornerDownLeft,
  MessageSquare,
  Calendar,
  Mic,
  Home,
} from "lucide-react";
import { useEventMind } from "@/components/eventmind/EventMindProvider";
import { useSpeechToText } from "@/hooks/useSpeechToText";

export default function AgentDashboardPage() {
  const {
    state,
    submitNewMessage,
    uploadMessagePack,
    resetWorkspace,
    exportPlanAsText,
    exportTraceAsJson,
    isProcessing,
  } = useEventMind();

  const [activeView, setActiveView] = useState<"chat" | "plan" | "trace">("chat");
  const [inputMessage, setInputMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Integrated Voice STT (Groq Whisper)
  const {
    state: sttState,
    startRecording,
    stopRecording,
  } = useSpeechToText({
    onTranscript: (transcript) => {
      setInputMessage((prev) => (prev.trim() ? `${prev.trim()} ${transcript}` : transcript));
    },
  });

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeView === "chat") {
      scrollToBottom();
    }
  }, [state.messages.length, activeView]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isProcessing) return;

    const textToSend = inputMessage.trim();
    const sender = senderName.trim() || "Event Organizer";
    setInputMessage("");
    await submitNewMessage(textToSend, sender);
  };

  const handleQuickPrompt = (prompt: string, sender = "Event Contributor") => {
    setInputMessage(prompt);
    setSenderName(sender);
  };

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
    <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-4rem)] bg-background">
      {/* ── LEFT SIDEBAR (Event Context & Navigation) ─────────────────────────── */}
      <aside className="w-full lg:w-72 xl:w-80 border-b lg:border-b-0 lg:border-e border-border bg-surface/40 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          {/* Workspace Title & Badge */}
          <div className="p-3 bg-background border border-border rounded shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-light px-2 py-0.5 rounded border border-primary-accent/30">
                ACTIVE WORKSPACE
              </span>
              <span className="text-[10px] text-muted font-mono">v{state.version}.0</span>
            </div>
            <h2 className="text-sm font-bold text-foreground leading-snug">
              {state.eventName}
            </h2>
            <p className="text-[11px] text-muted">
              Islamabad • 150 Students (50 Teams) • 4.0 Hours
            </p>
          </div>

          {/* Key Metrics Quick Box */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-background border border-border rounded">
              <span className="text-[10px] text-muted block">Plan Validity</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1 text-xs mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> VALID
              </span>
            </div>
            <div className="p-2.5 bg-background border border-border rounded">
              <span className="text-[10px] text-muted block">Committed Budget</span>
              <span className="font-bold text-foreground font-mono text-xs mt-0.5">
                Rs {state.budget.totalCommitted.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 bg-background border border-border rounded">
              <span className="text-[10px] text-muted block">Total Headcount</span>
              <span className="font-bold text-foreground text-xs mt-0.5">
                177 Meals
              </span>
            </div>
            <div className="p-2.5 bg-background border border-border rounded">
              <span className="text-[10px] text-muted block">Remaining Buffer</span>
              <span className="font-bold text-emerald-700 font-mono text-xs mt-0.5">
                Rs {state.budget.remainingBalance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Five Areas Mini-Directory */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider px-1">
              Five Required Planning Areas
            </span>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveView("plan")}
                className="w-full p-2 text-xs rounded hover:bg-background border border-transparent hover:border-border flex items-center justify-between text-start transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  <span className="font-medium text-foreground">1. Venue</span>
                </div>
                <span className="text-[11px] text-muted font-mono">{state.venue.capacity} seats</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView("plan")}
                className="w-full p-2 text-xs rounded hover:bg-background border border-transparent hover:border-border flex items-center justify-between text-start transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span className="font-medium text-foreground">2. Schedule</span>
                </div>
                <span className="text-[11px] text-muted font-mono">{state.schedule.totalDurationHours} hrs</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView("plan")}
                className="w-full p-2 text-xs rounded hover:bg-background border border-transparent hover:border-border flex items-center justify-between text-start transition-colors"
              >
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-primary" />
                  <span className="font-medium text-foreground">3. Food</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium">177 / 177</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView("plan")}
                className="w-full p-2 text-xs rounded hover:bg-background border border-transparent hover:border-border flex items-center justify-between text-start transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Gavel className="w-3.5 h-3.5 text-primary" />
                  <span className="font-medium text-foreground">4. Judging</span>
                </div>
                <span className="text-[11px] text-muted font-mono">17 judges</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView("plan")}
                className="w-full p-2 text-xs rounded hover:bg-background border border-transparent hover:border-border flex items-center justify-between text-start transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Wallet className="w-3.5 h-3.5 text-primary" />
                  <span className="font-medium text-foreground">5. Budget</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-mono">Rs 650k max</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Controls & Footer */}
        <div className="space-y-2 pt-4 border-t border-border mt-4">
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="w-full py-2 px-3 text-xs font-medium text-foreground bg-background hover:bg-surface border border-border rounded flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-primary" />
            <span>Upload Message Pack (.txt)</span>
          </button>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={exportPlanAsText}
              className="py-1.5 px-2 text-[11px] font-medium text-foreground bg-background hover:bg-surface border border-border rounded flex items-center justify-center gap-1 transition-colors"
            >
              <Download className="w-3 h-3 text-primary" />
              <span>Plan (.txt)</span>
            </button>
            <button
              type="button"
              onClick={exportTraceAsJson}
              className="py-1.5 px-2 text-[11px] font-medium text-foreground bg-background hover:bg-surface border border-border rounded flex items-center justify-center gap-1 transition-colors"
            >
              <Cpu className="w-3 h-3 text-primary" />
              <span>Trace (.json)</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 text-[11px] text-muted">
            <button
              type="button"
              onClick={resetWorkspace}
              className="text-muted hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset State</span>
            </button>

            <Link href="/" className="hover:text-primary flex items-center gap-1 transition-colors">
              <Home className="w-3 h-3" />
              <span>Public Site</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* ── CENTER STAGE (ChatGPT-style Interface) ────────────────────────────── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header Mode Toggle Bar */}
        <div className="h-14 border-b border-border bg-background/80 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-none">
                EventMind AI Agent
              </h1>
              <span className="text-[10px] text-muted">
                Multi-sender reasoning & conflict detection engine
              </span>
            </div>
          </div>

          {/* Mode Switcher Pills */}
          <div className="flex items-center p-0.5 bg-surface border border-border rounded">
            <button
              type="button"
              onClick={() => setActiveView("chat")}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
                activeView === "chat"
                  ? "bg-primary text-white shadow-2xs font-semibold"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Agent Chat</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView("plan")}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
                activeView === "plan"
                  ? "bg-primary text-white shadow-2xs font-semibold"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>5-Area Plan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView("trace")}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
                activeView === "trace"
                  ? "bg-primary text-white shadow-2xs font-semibold"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>AI Trace</span>
            </button>
          </div>
        </div>

        {/* ── VIEW 1: CHATGPT-STYLE CONVERSATION STREAM ─────────────────────── */}
        {activeView === "chat" && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            {/* Scrollable Conversation Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl w-full mx-auto">
              {/* Agent Intro Greeting Card */}
              <div className="p-4 rounded-lg bg-surface/60 border border-border text-xs space-y-2">
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Welcome to EventMind AI Workspace</span>
                </div>
                <p className="text-muted leading-relaxed">
                  I have analyzed the current message pack for the{" "}
                  <strong className="text-foreground">Physical Hackathon in Islamabad</strong>. All 5 areas are
                  planned and verified under the approved budget ceiling of Rs 650,000. You can submit updates,
                  proposals, or questions in English or Roman Urdu below.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] bg-background px-2 py-0.5 rounded border border-border text-muted">
                    Venue: Hall B (220 seats)
                  </span>
                  <span className="text-[10px] bg-background px-2 py-0.5 rounded border border-border text-muted">
                    Schedule: 4.0 Hours (Prayer break included)
                  </span>
                  <span className="text-[10px] bg-background px-2 py-0.5 rounded border border-border text-muted">
                    Food: 177 meals
                  </span>
                  <span className="text-[10px] bg-background px-2 py-0.5 rounded border border-border text-muted">
                    Budget Committed: Rs 400,050
                  </span>
                </div>
              </div>

              {/* Chronological Messages / Interaction Feed */}
              {state.messages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  {/* Stakeholder Incoming Message (User Bubble Style) */}
                  <div className="flex justify-end">
                    <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-xs bg-surface border border-border p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between gap-2 text-[10px] text-muted">
                        <span className="font-semibold text-foreground">{msg.sender}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="font-mono text-foreground text-xs leading-relaxed">
                        &quot;{msg.rawText}&quot;
                      </p>
                      {msg.language === "roman_ur" && (
                        <span className="inline-block text-[9px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                          Roman Urdu Message
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Agent Response Bubble (ChatGPT Style) */}
                  <div className="flex justify-start">
                    <div
                      className={`max-w-[90%] sm:max-w-[80%] rounded-2xl rounded-tl-xs p-3.5 text-xs space-y-2 border ${
                        msg.decisionStatus === "rejected"
                          ? "bg-rose-50/50 border-rose-200"
                          : msg.decisionStatus === "accepted"
                          ? "bg-background border-border shadow-2xs"
                          : "bg-amber-50/50 border-amber-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-bold text-foreground">
                          <Sparkles className="w-3.5 h-3.5 text-primary" />
                          <span>EventMind Decision Engine</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {msg.affectedAreas.map((area) => (
                            <span
                              key={area}
                              className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-surface border border-border text-muted"
                            >
                              {area}
                            </span>
                          ))}
                          <span
                            className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
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

                      <p
                        className={`leading-relaxed ${
                          msg.decisionStatus === "rejected"
                            ? "text-rose-900 font-medium"
                            : "text-foreground"
                        }`}
                      >
                        {msg.decisionReason}
                      </p>

                      {msg.decisionStatus === "rejected" && (
                        <div className="p-2 rounded bg-rose-100/60 border border-rose-200 text-[11px] text-rose-800 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                          <span>Safety Guard: The last valid plan was strictly preserved.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div className="flex items-center gap-2 text-xs text-muted p-2">
                  <Sparkles className="w-4 h-4 text-primary animate-spin" />
                  <span>EventMind AI is analyzing constraints and recalculating dependencies...</span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Bottom ChatGPT Sticky Input Container */}
            <div className="border-t border-border bg-background p-3 sm:p-4 shrink-0">
              <div className="max-w-4xl mx-auto space-y-2.5">
                {/* Prompt Suggestion Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
                  <span className="text-[10px] text-muted shrink-0">Try test prompt:</span>
                  {[
                    {
                      label: "Bhai 100 boxes mangwa lo (Food Rejection)",
                      text: "Bhai 100 boxes mangwa lo kafi hongay bachat ho jaye gi",
                      sender: "Team Assistant",
                    },
                    {
                      label: "Printing cost increased to Rs 15,000",
                      text: "Printing vendor saying flex and badges cost Rs 15,000 instead of 10,000",
                      sender: "Printing Vendor",
                    },
                    {
                      label: "Dr. Tariq 10 mins late",
                      text: "Judge Dr. Tariq will be 10 minutes late due to traffic",
                      sender: "Judge Coordinator",
                    },
                    {
                      label: "Can we hire a DJ for Rs 35,000?",
                      text: "Can we hire a DJ for music during coding? Quotation is Rs 35,000",
                      sender: "Student Council",
                    },
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickPrompt(chip.text, chip.sender)}
                      className="px-2.5 py-1 rounded-full text-[11px] bg-surface hover:bg-surface/80 border border-border text-foreground whitespace-nowrap transition-colors"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* ChatGPT-style Prompt Input Bar */}
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-2 bg-surface border border-border rounded-xl p-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 shadow-xs"
                >
                  {/* File Upload Button */}
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(true)}
                    title="Upload .txt message pack"
                    className="p-2 text-muted hover:text-foreground rounded-lg hover:bg-background transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                  </button>

                  {/* Text Input */}
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Message EventMind AI in English or Roman Urdu..."
                    className="flex-1 bg-transparent px-2 text-xs sm:text-sm text-foreground focus:outline-none"
                  />

                  {/* Voice Mic Button (Groq Whisper STT) */}
                  <button
                    type="button"
                    onClick={() => {
                      if (sttState === "recording") {
                        stopRecording();
                      } else {
                        startRecording();
                      }
                    }}
                    title={sttState === "recording" ? "Stop recording" : "Record voice (Groq STT)"}
                    className={`p-2 rounded-lg transition-colors ${
                      sttState === "recording"
                        ? "bg-rose-100 text-rose-700 animate-pulse"
                        : "text-muted hover:text-foreground hover:bg-background"
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isProcessing}
                    className="h-8 px-3 text-xs font-semibold text-white bg-primary hover:bg-primary-hover disabled:opacity-40 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <span>Send</span>
                    <CornerDownLeft className="w-3 h-3" />
                  </button>
                </form>

                <p className="text-[10px] text-center text-muted">
                  EventMind AI uses AI to interpret natural language while deterministic code performs calculations and constraint checks.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── VIEW 2: FIVE-AREA PLAN VIEW ───────────────────────────────────── */}
        {activeView === "plan" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-5xl w-full mx-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h2 className="text-base font-bold text-foreground">Five-Area Verified Event Plan</h2>
                <p className="text-xs text-muted">
                  Islamabad Physical Hackathon • 150 Students (50 Teams) • Budget: Rs 650,000
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={exportPlanAsText}
                  className="px-3 py-1.5 text-xs font-medium text-foreground bg-surface border border-border rounded flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-primary" />
                  <span>Download (.txt)</span>
                </button>
              </div>
            </div>

            {/* 1. Venue */}
            <div className="p-4 rounded-lg bg-surface/30 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span>1. Venue Plan</span>
                </h3>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {state.venue.status}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 bg-background rounded border border-border">
                  <span className="text-muted block text-[11px]">Selected Hall</span>
                  <strong className="text-foreground">{state.venue.name}</strong>
                </div>
                <div className="p-2.5 bg-background rounded border border-border">
                  <span className="text-muted block text-[11px]">Capacity / Attendance</span>
                  <strong className="text-foreground">{state.venue.capacity} seats ({state.venue.expectedAttendance} attendees)</strong>
                </div>
                <div className="p-2.5 bg-background rounded border border-border">
                  <span className="text-muted block text-[11px]">Rental Cost</span>
                  <strong className="text-foreground">Rs {state.venue.cost.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* 2. Schedule */}
            <div className="p-4 rounded-lg bg-surface/30 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>2. Schedule (4.0 Hours Strict)</span>
                </h3>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {state.schedule.eventStartTime} – {state.schedule.eventEndTime}
                </span>
              </div>
              <div className="divide-y divide-border text-xs">
                {state.schedule.activities.map((act) => (
                  <div key={act.id} className="py-2 flex items-center justify-between gap-3">
                    <span className="font-mono text-primary font-bold w-24 shrink-0">{act.startTime} - {act.endTime}</span>
                    <span className="flex-1 font-medium text-foreground">{act.title}</span>
                    <span className="text-muted text-[11px] font-mono">{act.durationMinutes} min</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Food */}
            <div className="p-4 rounded-lg bg-surface/30 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-primary" />
                  <span>3. Food & Catering Plan</span>
                </h3>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {state.food.headcount} Meals Verified
                </span>
              </div>
              <p className="text-xs text-muted">
                Menu: {state.food.itemDescription} @ Rs {state.food.unitPrice}/box + Rs {state.food.deliveryCharges} delivery ={" "}
                <strong className="text-foreground">Rs {state.food.totalCost.toLocaleString()}</strong>
              </p>
            </div>

            {/* 4. Judging */}
            <div className="p-4 rounded-lg bg-surface/30 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-primary" />
                  <span>4. Judging Allocation</span>
                </h3>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Feasible Ratio
                </span>
              </div>
              <p className="text-xs text-muted">
                50 Teams evaluated by 17 Judges (~{state.judging.teamsPerJudge} teams/judge, {state.judging.minutesPerTeam} mins/team).
              </p>
            </div>

            {/* 5. Budget */}
            <div className="p-4 rounded-lg bg-surface/30 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span>5. Budget Plan (PKR)</span>
                </h3>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Rs 650,000 Ceiling
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 bg-background rounded border border-border">
                  <span className="text-[10px] text-muted block">Approved</span>
                  <strong>Rs {state.budget.approvedTotal.toLocaleString()}</strong>
                </div>
                <div className="p-2 bg-background rounded border border-border">
                  <span className="text-[10px] text-muted block">Committed</span>
                  <strong>Rs {state.budget.totalCommitted.toLocaleString()}</strong>
                </div>
                <div className="p-2 bg-background rounded border border-border">
                  <span className="text-[10px] text-muted block">Planned</span>
                  <strong>Rs {state.budget.totalPlanned.toLocaleString()}</strong>
                </div>
                <div className="p-2 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
                  <span className="text-[10px] block font-medium">Remaining</span>
                  <strong>Rs {state.budget.remainingBalance.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── VIEW 3: AI MODEL TRACE VIEW ───────────────────────────────────── */}
        {activeView === "trace" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl w-full mx-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h2 className="text-base font-bold text-foreground">Truthful AI Model-Call Trace</h2>
                <p className="text-xs text-muted">
                  Total Calls: {state.traces.length} • Total Tokens: {state.totalTokensUsed.toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={exportTraceAsJson}
                className="px-3 py-1.5 text-xs font-medium text-white bg-primary rounded flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Trace (.json)</span>
              </button>
            </div>

            <div className="space-y-3">
              {state.traces.map((tr) => (
                <div key={tr.id} className="p-3.5 rounded border border-border bg-surface/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-primary">
                      Call #{tr.sequence} [{tr.areaTag}]
                    </span>
                    <span className="font-mono text-muted text-[11px]">{tr.model}</span>
                  </div>
                  <div className="text-[11px] text-muted flex gap-3 font-mono">
                    <span>Prompt: {tr.promptTokens}</span>
                    <span>Completion: {tr.completionTokens}</span>
                    <span className="text-primary font-bold">Total: {tr.totalTokens}</span>
                    <span>{tr.latencyMs} ms</span>
                  </div>
                  <pre className="p-2 rounded bg-background border border-border text-[11px] font-mono whitespace-pre-wrap max-h-24 overflow-hidden">
                    {tr.outputResponse}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── File Upload Modal ────────────────────────────────────────────────── */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
          <div className="bg-background border border-border rounded p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">
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
              className={`border-2 border-dashed rounded p-6 text-center cursor-pointer transition-colors ${
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
              <Upload className="w-6 h-6 text-primary mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-foreground">
                Click to browse or drop .txt pack
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-3 py-1.5 text-xs text-muted hover:text-foreground border border-border rounded"
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
