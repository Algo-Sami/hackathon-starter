"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Download,
  Building2,
  Clock,
  UtensilsCrossed,
  Gavel,
  Wallet,
  Send,
  Mic,
  MicOff,
  Paperclip,
  Home,
  ChevronDown,
  Layers,
  History,
  FileText,
  Info,
  LogOut,
} from "lucide-react";
import { useEventMind } from "@/components/eventmind/EventMindProvider";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { logoutAction } from "@/app/actions/auth";
import { EventMindRole } from "@/lib/eventmind/types";

const ALL_ROLES: { role: EventMindRole; desc: string; icon: string }[] = [
  { role: "Event Organizer", desc: "Overall event execution & tracking", icon: "📋" },
  { role: "Catering Person", desc: "Food headcount, menu & catering rates", icon: "🍱" },
  { role: "Finance Person", desc: "Budget caps, bills & expense approvals", icon: "💰" },
  { role: "Venue Manager", desc: "Hall bookings, seats & AV logistics", icon: "🏛️" },
  { role: "Judging Coordinator", desc: "Evaluation slots, judges & scoring", icon: "⚖️" },
  { role: "Dean", desc: "Institutional directives & budget ceilings", icon: "🎓" },
];

const ROLE_PROMPT_SUGGESTIONS: Record<EventMindRole, string[]> = {
  "Catering Person": [
    "Salam, standard lunch price has increased from Rs 1000 to Rs 1200 per person.",
    "Bhai 100 boxes mangwa lo kafi hongay bachat ho jaye gi",
  ],
  "Finance Person": [
    "Vendor confirmed flex printing & backdrop banners invoice is Rs 15,000 instead of Rs 10,000.",
  ],
  "Venue Manager": [
    "Pak-China Friendship Centre Hall B is locked in with 220 seats at Rs 180,000 rent.",
    "Room D is available for Rs 50,000 with 80 seats capacity.",
  ],
  "Judging Coordinator": [
    "Dr. Tariq will arrive 10 minutes late due to motorway traffic. Can we adjust his slot?",
  ],
  Dean: [
    "Approved total budget ceiling Rs 650,000. Ensure strict 15-minute Asr prayer break in schedule.",
  ],
  "Event Organizer": [
    "Can we add a DJ sound setup for Rs 30,000 during opening ceremony?",
    "Review latest budget status and check if all 177 meals are secured.",
  ],
};

export default function AgentDashboardPage() {
  const {
    state,
    currentUserRole,
    setCurrentUserRole,
    submitNewMessage,
    uploadMessagePack,
    resetWorkspace,
    exportPlanAsText,
    exportPlanAsJson,
    isProcessing,
  } = useEventMind();

  const [activeTab, setActiveTab] = useState<"assistant" | "plan" | "updates">("assistant");
  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

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
    scrollToBottom();
  }, [state.messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() && !selectedFile) return;

    if (selectedFile) {
      try {
        const text = await selectedFile.text();
        await uploadMessagePack(text, selectedFile.name);
        setSelectedFile(null);
      } catch {
        // Fallback
      }
    }

    if (inputMessage.trim()) {
      const text = inputMessage.trim();
      setInputMessage("");
      await submitNewMessage(text, undefined, currentUserRole);
    }
  };

  const handleRoleSelect = (role: EventMindRole) => {
    setCurrentUserRole(role);
    setShowRoleMenu(false);
  };

  const currentRoleObj =
    ALL_ROLES.find((r) => r.role === currentUserRole) || ALL_ROLES[0];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-neutral-900 flex flex-col font-sans">
      {/* ── TOP NAVIGATION BAR ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Brand & Home */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-medium text-neutral-600 hover:text-emerald-700 transition-colors p-1.5 rounded-lg hover:bg-neutral-100"
              title="Return to Public Landing Page"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Landing Page</span>
            </Link>

            <div className="h-4 w-px bg-neutral-200" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                E
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm tracking-tight text-neutral-900">
                    EventMind AI
                  </span>
                  <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded">
                    Centralized
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 leading-none">
                  {state.eventName}
                </p>
              </div>
            </div>
          </div>

          {/* Center: ROLE SWITCHER DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-semibold shadow-xs transition-colors"
            >
              <span className="text-base">{currentRoleObj.icon}</span>
              <span className="hidden md:inline text-neutral-500 font-normal">Active Role:</span>
              <span className="font-semibold text-emerald-800">{currentUserRole}</span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
            </button>

            {showRoleMenu && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-0 w-72 bg-white rounded-xl shadow-xl border border-neutral-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-neutral-100 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Switch Active Role (Demo Mode)
                </div>
                {ALL_ROLES.map((item) => (
                  <button
                    key={item.role}
                    onClick={() => handleRoleSelect(item.role)}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2.5 transition-colors ${
                      item.role === currentUserRole
                        ? "bg-emerald-50 text-emerald-900 font-semibold"
                        : "hover:bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs">{item.role}</div>
                      <div className="text-[10px] text-neutral-400 font-normal">{item.desc}</div>
                    </div>
                    {item.role === currentUserRole && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Export Menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-300 text-xs font-medium text-neutral-700 bg-white shadow-xs transition-colors"
                title="Export centralized plan"
              >
                <Download className="w-3.5 h-3.5 text-neutral-500" />
                <span className="hidden md:inline">Export</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50 text-xs">
                  <button
                    onClick={() => {
                      exportPlanAsText();
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-neutral-700 flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-neutral-500" /> Plan Summary (.txt)
                  </button>
                  <button
                    onClick={() => {
                      exportPlanAsJson();
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-neutral-700 flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-neutral-500" /> Full State (.json)
                  </button>
                </div>
              )}
            </div>

            {/* Reset Workspace */}
            <button
              onClick={() => {
                if (confirm("Reset workspace to initial hackathon baseline?")) {
                  resetWorkspace();
                }
              }}
              className="p-1.5 rounded-lg border border-neutral-200 hover:border-neutral-300 text-neutral-600 hover:text-neutral-900 bg-white transition-colors"
              title="Reset workspace state"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Sign Out */}
            <button
              onClick={async () => {
                await logoutAction();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 hover:border-red-200 hover:bg-red-50 text-neutral-600 hover:text-red-700 bg-white text-xs font-medium transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS (Mobile / Quick Switcher) */}
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-neutral-100 flex items-center gap-2">
          <button
            onClick={() => setActiveTab("assistant")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "assistant"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Section 1: AI Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab("plan")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "plan"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Section 2: Shared Event Plan</span>
          </button>

          <button
            onClick={() => setActiveTab("updates")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "updates"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Section 3: Latest Updates</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-200 text-neutral-700">
              {state.updateHistory.length}
            </span>
          </button>
        </div>
      </header>

      {/* ── MAIN WORKSPACE CONTENT ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 1: AI ASSISTANT (Chatbot Interface)
        ══════════════════════════════════════════════════════════════════════ */}
        <div
          className={`lg:col-span-7 flex flex-col bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden h-[calc(100vh-150px)] min-h-[580px] ${
            activeTab !== "assistant" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Chat Header */}
          <div className="px-5 py-3.5 bg-neutral-50/80 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                🤖
              </div>
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                  <span>EventMind AI Assistant</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h2>
                <p className="text-[11px] text-neutral-500">
                  Role: <span className="font-medium text-neutral-800">{currentUserRole}</span> • Updates sync directly to the shared plan
                </p>
              </div>
            </div>

            <div className="text-[11px] text-neutral-500 bg-white border border-neutral-200 px-2.5 py-1 rounded-full shadow-2xs">
              Plan v{state.version} • {state.lastUpdated}
            </div>
          </div>

          {/* Quick Suggested Chips for Active Role */}
          <div className="px-4 py-2 bg-neutral-50 border-b border-neutral-100 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-neutral-400 font-medium whitespace-nowrap">Suggested:</span>
            {ROLE_PROMPT_SUGGESTIONS[currentUserRole]?.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setInputMessage(prompt)}
                className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-emerald-50 border border-neutral-200 hover:border-emerald-300 text-neutral-700 hover:text-emerald-900 rounded-md transition-colors text-left"
              >
                &ldquo;{prompt.length > 55 ? prompt.slice(0, 55) + "…" : prompt}&rdquo;
              </button>
            ))}
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {state.messages.map((msg) => {
              const isAi = !msg.sender || msg.sender === "System" || msg.sender === "EventMind AI";
              const isAccepted = msg.decisionStatus === "accepted";
              const isRejected = msg.decisionStatus === "rejected";

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAi ? "items-start" : "items-end"}`}
                >
                  {/* Sender Name & Role */}
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mb-1 px-1">
                    <span className="font-medium text-neutral-800">
                      {isAi ? "EventMind AI" : msg.sender}
                    </span>
                    {msg.role && (
                      <span className="bg-neutral-100 text-neutral-600 px-1.5 py-0.2 rounded text-[10px]">
                        {msg.role}
                      </span>
                    )}
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                      isAi
                        ? "bg-neutral-100/80 text-neutral-900 rounded-tl-sm border border-neutral-200/60"
                        : "bg-emerald-700 text-white rounded-tr-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.rawText}</p>
                  </div>

                  {/* AI Decision Card (If Applicable) */}
                  {msg.decisionReason && (
                    <div
                      className={`mt-1.5 max-w-[88%] sm:max-w-[80%] rounded-xl p-3 text-[11px] border leading-relaxed flex items-start gap-2 shadow-2xs ${
                        isRejected
                          ? "bg-red-50 border-red-200 text-red-900"
                          : isAccepted
                          ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                          : "bg-amber-50 border-amber-200 text-amber-950"
                      }`}
                    >
                      {isRejected ? (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      ) : isAccepted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-semibold mb-0.5">
                          {isRejected
                            ? "AI Validator: Update Rejected"
                            : isAccepted
                            ? "AI Assistant: Update Accepted & Synced"
                            : "AI Assistant: Review Required"}
                        </div>
                        <p>{msg.decisionReason}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* AI Processing Indicator */}
            {isProcessing && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 w-fit">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                <span>EventMind AI is analyzing constraints and recalculating dependencies...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Selected File Badge */}
          {selectedFile && (
            <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-medium truncate max-w-xs">{selectedFile.name}</span>
                <span className="text-[10px] text-emerald-600">
                  ({Math.round(selectedFile.size / 1024)} KB)
                </span>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-neutral-400 hover:text-neutral-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-neutral-200">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              {/* File Attachment Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.json,.csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
                title="Attach text file or message pack"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Voice Microphone (Groq Whisper STT) */}
              <button
                type="button"
                onClick={() => {
                  if (sttState === "recording") {
                    stopRecording();
                  } else {
                    startRecording();
                  }
                }}
                disabled={sttState === "transcribing"}
                className={`p-2 rounded-lg transition-all ${
                  sttState === "recording"
                    ? "bg-red-600 text-white animate-pulse"
                    : sttState === "transcribing"
                    ? "bg-amber-100 text-amber-800 animate-spin"
                    : "text-neutral-500 hover:text-emerald-700 hover:bg-emerald-50"
                }`}
                title={
                  sttState === "recording"
                    ? "Click to stop recording"
                    : "Speak using Groq Whisper (English or Urdu)"
                }
              >
                {sttState === "recording" ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Type a message as ${currentUserRole} (e.g. "Lunch price increased to 1200")...`}
                className="flex-1 bg-neutral-100/70 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={(!inputMessage.trim() && !selectedFile) || isProcessing}
                className="p-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors"
                title="Send message to AI assistant"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            RIGHT SIDE: SECTION 2 (Shared Event Plan) & SECTION 3 (Latest Updates)
        ══════════════════════════════════════════════════════════════════════ */}
        <div
          className={`lg:col-span-5 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-150px)] pr-1 ${
            activeTab === "assistant" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* ════════════════════════════════════════════════════════════════════
              SECTION 2 — SHARED EVENT PLAN (Single Source of Truth)
          ════════════════════════════════════════════════════════════════════ */}
          <div
            className={`bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-4 ${
              activeTab === "updates" ? "hidden lg:block" : "block"
            }`}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                <h3 className="font-semibold text-sm text-neutral-900">
                  Section 2 — Shared Event Plan
                </h3>
              </div>
              <span className="text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                Single Source of Truth
              </span>
            </div>

            {/* Event Overview Box */}
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 text-xs space-y-2">
              <div className="font-semibold text-neutral-900 flex items-center justify-between">
                <span>{state.eventName}</span>
                <span className="text-emerald-700 font-bold">177 Total Attendees</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600">
                <div>📍 Location: {state.location}</div>
                <div>👥 150 Students (50 Teams)</div>
                <div>👔 10 Staff Members</div>
                <div>⚖️ 17 Judges & Mentors</div>
              </div>
            </div>

            {/* Area 1: Venue & Capacity */}
            <div className="border border-neutral-200 rounded-xl p-3.5 space-y-1.5 hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-800">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Venue & Capacity</span>
                </div>
                <span className="text-emerald-800 font-bold">
                  Rs {state.venue.cost.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-neutral-900 font-medium">{state.venue.name}</div>
              <p className="text-[11px] text-neutral-500 leading-snug">
                Capacity: <strong>{state.venue.capacity} seats</strong> (Need: 177). Room D rejected (capacity 80).
              </p>
            </div>

            {/* Area 2: Catering & Food */}
            <div className="border border-neutral-200 rounded-xl p-3.5 space-y-1.5 hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-800">
                <div className="flex items-center gap-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Catering & Food</span>
                </div>
                <span className="text-emerald-800 font-bold">
                  Rs {state.food.totalCost.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-neutral-900 font-medium">
                {state.food.headcount} Meals Required @ Rs {state.food.unitPrice} / person
              </div>
              <p className="text-[11px] text-neutral-500 leading-snug">
                {state.food.itemDescription}
              </p>
            </div>

            {/* Area 3: Budget & Expenses */}
            <div className="border border-neutral-200 rounded-xl p-3.5 space-y-2 bg-emerald-50/30">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
                <div className="flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Budget & Expenses</span>
                </div>
                <span className="text-[10px] text-neutral-500">
                  Ceiling: Rs {state.budget.approvedTotal.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded-lg border border-neutral-200">
                  <span className="text-[10px] text-neutral-500 block">Committed</span>
                  <span className="font-bold text-neutral-900">
                    Rs {state.budget.totalCommitted.toLocaleString()}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-neutral-200">
                  <span className="text-[10px] text-neutral-500 block">Remaining</span>
                  <span className="font-bold text-emerald-700">
                    Rs {state.budget.remainingBalance.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Area 4: Schedule */}
            <div className="border border-neutral-200 rounded-xl p-3.5 space-y-1.5 hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-800">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Event Schedule (4 Hours)</span>
                </div>
                <span className="text-emerald-700 font-medium text-[11px]">
                  {state.schedule.eventStartTime} - {state.schedule.eventEndTime}
                </span>
              </div>
              <div className="text-[11px] text-neutral-600 space-y-1">
                <div>• 01:00 PM - 01:25 PM: Opening Ceremony</div>
                <div>• 01:25 PM - 03:00 PM: Hacking Sprint 1</div>
                <div className="text-emerald-800 font-semibold">
                  • 03:00 PM - 03:20 PM: Asr Prayer & Refreshment Break (Mandatory)
                </div>
                <div>• 03:20 PM - 04:35 PM: Parallel Judging Rounds</div>
                <div>• 04:35 PM - 05:00 PM: Closing & Awards</div>
              </div>
            </div>

            {/* Area 5: Judges */}
            <div className="border border-neutral-200 rounded-xl p-3.5 space-y-1.5 hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-800">
                <div className="flex items-center gap-1.5">
                  <Gavel className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Judging Allocation</span>
                </div>
                <span className="text-neutral-700 text-[11px]">
                  {state.judging.judgesList.length} Confirmed
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                50 teams evaluated across 17 judges (~3 teams/judge). Parallel evaluation prevents delays.
              </p>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════════
              SECTION 3 — LATEST UPDATES (Audit Trail & Activity History)
          ════════════════════════════════════════════════════════════════════ */}
          <div
            className={`bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-3 ${
              activeTab === "plan" ? "hidden lg:block" : "block"
            }`}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-700" />
                <h3 className="font-semibold text-sm text-neutral-900">
                  Section 3 — Latest Updates
                </h3>
              </div>
              <span className="text-[10px] text-neutral-500">
                {state.updateHistory.length} Activity Records
              </span>
            </div>

            {/* List of update cards */}
            <div className="space-y-3">
              {state.updateHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-white hover:border-neutral-300 transition-colors text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-neutral-900">{item.submittedBy}</span>
                      <span className="text-[10px] font-medium px-1.5 py-0.2 bg-neutral-200 text-neutral-700 rounded">
                        {item.role}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === "Accepted"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="text-[11px] italic text-neutral-600 bg-white p-2 rounded border border-neutral-150">
                    &ldquo;{item.rawMessage}&rdquo;
                  </div>

                  {item.previousValue && item.newValue && (
                    <div className="text-[11px] grid grid-cols-2 gap-1 text-neutral-600 pt-0.5">
                      <div>
                        <span className="text-neutral-400 block text-[9px] uppercase">Before</span>
                        <span className="text-neutral-500 line-through truncate block">
                          {item.previousValue}
                        </span>
                      </div>
                      <div>
                        <span className="text-emerald-700 block text-[9px] uppercase font-semibold">
                          After
                        </span>
                        <span className="font-medium text-emerald-900 truncate block">
                          {item.newValue}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="text-[10px] text-neutral-500 pt-1 border-t border-neutral-100 flex items-start gap-1">
                    <Info className="w-3 h-3 text-neutral-400 shrink-0 mt-0.5" />
                    <span>{item.aiAction}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
