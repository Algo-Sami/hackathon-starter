"use client";

import { useState, useRef, useEffect } from "react";
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
  ChevronDown,
  Layers,
  History,
  FileText,
  Info,
  LogOut,
  ShieldCheck,
  Bot,
  Filter,
  Menu,
  X,
} from "lucide-react";
import { useEventMind } from "@/components/eventmind/EventMindProvider";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { logoutAction } from "@/app/actions/auth";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
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
    submitNewMessage,
    uploadMessagePack,
    resetWorkspace,
    exportPlanAsText,
    exportPlanAsJson,
    isProcessing,
  } = useEventMind();

  // Selected view: Displays ONLY ONE section at a time in the main content area
  const [activeSection, setActiveSection] = useState<"assistant" | "plan" | "updates">("assistant");

  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"All" | "Accepted" | "Rejected">("All");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
    if (activeSection === "assistant") {
      scrollToBottom();
    }
  }, [state.messages, activeSection]);

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

  const currentRoleObj =
    ALL_ROLES.find((r) => r.role === currentUserRole) || ALL_ROLES[0];

  const filteredUpdates = state.updateHistory.filter((item) => {
    if (statusFilter === "All") return true;
    return item.status === statusFilter;
  });

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FDFBF7] text-neutral-900 flex flex-col font-sans">
      {/* ══════════════════════════════════════════════════════════════════════
          1. COMPACT AUTHENTICATED DASHBOARD HEADER (Single Header)
      ══════════════════════════════════════════════════════════════════════ */}
      <header className="h-14 bg-white border-b border-neutral-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
        {/* Left: Brand & Mobile Menu Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100"
            aria-label="Toggle Navigation Sidebar"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              E
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-neutral-900">
                  EventMind AI
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Workspace
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 leading-none">
                {state.eventName}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Informational User Role Badge (Non-interactive) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium">
            <span className="text-sm">{currentRoleObj.icon}</span>
            <span className="hidden sm:inline text-neutral-500 text-[11px]">Role:</span>
            <span className="font-semibold text-emerald-800">{currentUserRole}</span>
          </div>
        </div>

        {/* Right: Language, Export, Reset & Sign Out */}
        <div className="flex items-center gap-2">
          {/* Functional Language Switcher */}
          <div className="scale-90 origin-right">
            <LanguageSwitcher />
          </div>

          {/* Export Menu */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-300 text-xs font-medium text-neutral-700 bg-white shadow-2xs transition-colors"
              title="Export Plan"
            >
              <Download className="w-3.5 h-3.5 text-neutral-500" />
              <span className="hidden md:inline">Export</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-neutral-200 py-1 z-50 text-xs">
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
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          2. WORKSPACE BODY (Persistent Vertical Sidebar + Main Content)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ── VERTICAL SIDEBAR NAVIGATION (Neuron OS inspired) ── */}
        <aside
          className={`
            fixed md:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-neutral-200 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0
            ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          {/* Sidebar Top: Section Links */}
          <div className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Navigation
            </div>

            {/* Item 1: AI Assistant */}
            <button
              onClick={() => {
                setActiveSection("assistant");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeSection === "assistant"
                  ? "bg-emerald-50 text-emerald-900 font-semibold border-l-4 border-emerald-700 shadow-2xs"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border-l-4 border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles
                  className={`w-4 h-4 ${
                    activeSection === "assistant" ? "text-emerald-700" : "text-neutral-400"
                  }`}
                />
                <span>AI Assistant</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded ${
                  activeSection === "assistant"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-neutral-100 text-neutral-500"
                }`}
              >
                Chat
              </span>
            </button>

            {/* Item 2: Shared Event Plan */}
            <button
              onClick={() => {
                setActiveSection("plan");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeSection === "plan"
                  ? "bg-emerald-50 text-emerald-900 font-semibold border-l-4 border-emerald-700 shadow-2xs"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border-l-4 border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers
                  className={`w-4 h-4 ${
                    activeSection === "plan" ? "text-emerald-700" : "text-neutral-400"
                  }`}
                />
                <span>Shared Event Plan</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded ${
                  activeSection === "plan"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-neutral-100 text-neutral-500"
                }`}
              >
                5 Areas
              </span>
            </button>

            {/* Item 3: Latest Updates */}
            <button
              onClick={() => {
                setActiveSection("updates");
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeSection === "updates"
                  ? "bg-emerald-50 text-emerald-900 font-semibold border-l-4 border-emerald-700 shadow-2xs"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border-l-4 border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <History
                  className={`w-4 h-4 ${
                    activeSection === "updates" ? "text-emerald-700" : "text-neutral-400"
                  }`}
                />
                <span>Latest Updates</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeSection === "updates"
                    ? "bg-emerald-700 text-white"
                    : "bg-neutral-200 text-neutral-700"
                }`}
              >
                {state.updateHistory.length}
              </span>
            </button>
          </div>

          {/* Sidebar Bottom: User Role Information Box */}
          <div className="p-3 border-t border-neutral-100 bg-neutral-50/70">
            <div className="p-3 rounded-xl bg-white border border-neutral-200/80 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Assigned Profile
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                <span>{currentRoleObj.icon}</span>
                <span>{currentUserRole}</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-snug">
                {currentRoleObj.desc}
              </p>
              <div className="pt-1 text-[10px] text-neutral-400 flex items-center justify-between border-t border-neutral-100">
                <span>Plan Version</span>
                <span className="font-semibold text-neutral-700">v{state.version}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Backdrop for Mobile Sidebar */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 z-10 md:hidden"
          />
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            3. MAIN CONTENT AREA — DISPLAYS ONLY ONE SELECTED SECTION AT A TIME
        ══════════════════════════════════════════════════════════════════════ */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#FDFBF7]">
          {/* ──────────────────────────────────────────────────────────────────
              SECTION 1: AI ASSISTANT (Chatbot Interface)
          ────────────────────────────────────────────────────────────────── */}
          {activeSection === "assistant" && (
            <div className="flex-1 flex flex-col h-full overflow-hidden p-3 sm:p-5 max-w-5xl w-full mx-auto">
              <div className="flex-1 flex flex-col bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="px-5 py-3.5 bg-neutral-50/80 border-b border-neutral-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                      <Bot className="w-4 h-4 text-emerald-800" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                        <span>EventMind AI Assistant</span>
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </h2>
                      <p className="text-[11px] text-neutral-500">
                        Authenticated as <span className="font-semibold text-neutral-800">{currentUserRole}</span> • Updates sync to shared plan
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] text-neutral-500 bg-white border border-neutral-200 px-2.5 py-1 rounded-full shadow-2xs">
                    Plan v{state.version} • {state.lastUpdated}
                  </div>
                </div>

                {/* Role-Specific Quick Suggested Chips */}
                <div className="px-4 py-2 bg-neutral-50 border-b border-neutral-100 flex items-center gap-2 overflow-x-auto text-[11px]">
                  <span className="text-neutral-400 font-medium whitespace-nowrap">Suggested for you:</span>
                  {ROLE_PROMPT_SUGGESTIONS[currentUserRole]?.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputMessage(prompt)}
                      className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-emerald-50 border border-neutral-200 hover:border-emerald-300 text-neutral-700 hover:text-emerald-900 rounded-md transition-colors text-left"
                    >
                      &ldquo;{prompt.length > 60 ? prompt.slice(0, 60) + "…" : prompt}&rdquo;
                    </button>
                  ))}
                </div>

                {/* Conversation Stream */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                  {state.messages.length === 0 ? (
                    <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center p-6 text-neutral-500">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mb-3 shadow-2xs">
                        <Bot className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-neutral-900 text-sm mb-1">
                        EventMind AI Assistant
                      </h3>
                      <p className="text-xs text-neutral-500 max-w-sm mb-4 leading-relaxed">
                        No messages yet. Ask questions, report updates, or submit event proposals. The AI will validate constraints and update the shared event plan.
                      </p>
                      <div className="text-[11px] text-neutral-400">
                        Select a suggestion above or type a message below to begin.
                      </div>
                    </div>
                  ) : (
                    state.messages.map((msg) => {
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
                            className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
                              isAi
                                ? "bg-neutral-100/90 text-neutral-900 rounded-tl-sm border border-neutral-200/60"
                                : "bg-emerald-700 text-white rounded-tr-sm"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.rawText}</p>
                          </div>

                          {/* AI Decision Rationale Card */}
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
                                    ? "AI Validator: Proposal Rejected"
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
                    })
                  )}

                  {/* AI Processing State Indicator */}
                  {isProcessing && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 w-fit">
                      <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                      <span>EventMind AI is analyzing constraints and updating plan dependencies...</span>
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

                    {/* Microphone Voice-to-Text Button (Groq Whisper STT) */}
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
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────────
              SECTION 2: SHARED EVENT PLAN (Single Source of Truth)
          ────────────────────────────────────────────────────────────────── */}
          {activeSection === "plan" && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-6xl w-full mx-auto space-y-6">
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-neutral-200 gap-2">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-700" />
                    <span>Shared Event Plan</span>
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Single source of truth synchronized live across all 6 organizing roles
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Plan Version v{state.version}
                  </span>
                  <span className="text-xs text-neutral-500">
                    Updated: {state.lastUpdated}
                  </span>
                </div>
              </div>

              {/* Event Overview Hero Banner */}
              <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 pb-3 gap-2">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">{state.eventName}</h3>
                    <p className="text-xs text-neutral-500">📍 {state.location} • Physical On-Site Hackathon</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-neutral-400 block uppercase">Total Headcount</span>
                    <span className="text-xl font-extrabold text-emerald-700">177 Attendees</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                    <span className="text-neutral-500 block text-[11px]">Students</span>
                    <strong className="text-sm font-bold text-neutral-900">150 Participants</strong>
                    <span className="text-[10px] text-neutral-400 block">50 Teams (3/team)</span>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                    <span className="text-neutral-500 block text-[11px]">Event Staff</span>
                    <strong className="text-sm font-bold text-neutral-900">10 Organizers</strong>
                    <span className="text-[10px] text-neutral-400 block">Logistics & Tech</span>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                    <span className="text-neutral-500 block text-[11px]">Judges & Mentors</span>
                    <strong className="text-sm font-bold text-neutral-900">17 Evaluators</strong>
                    <span className="text-[10px] text-neutral-400 block">Industry experts</span>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                    <span className="text-neutral-500 block text-[11px]">Duration</span>
                    <strong className="text-sm font-bold text-neutral-900">4.0 Hours</strong>
                    <span className="text-[10px] text-emerald-700 font-medium block">Prayer break locked</span>
                  </div>
                </div>
              </div>

              {/* Grid of the 5 Core Planning Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Venue & Capacity */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-700" />
                      <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                        1. Venue & Capacity
                      </h4>
                    </div>
                    <span className="font-bold text-sm text-emerald-800">
                      Rs {state.venue.cost.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-semibold text-sm text-neutral-900">{state.venue.name}</h5>
                    <p className="text-xs text-neutral-600">{state.venue.location}</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl text-xs space-y-1 text-neutral-600">
                    <div className="flex justify-between">
                      <span>Venue Capacity:</span>
                      <strong className="text-neutral-900">{state.venue.capacity} seats</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Required Headcount:</span>
                      <strong className="text-neutral-900">177 people</strong>
                    </div>
                    <div className="flex justify-between text-emerald-800 font-semibold">
                      <span>Available Cushion:</span>
                      <span>+{state.venue.capacity - state.venue.expectedAttendance} seats</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-500 italic">
                    Reason: {state.venue.selectionReason}
                  </p>
                </div>

                {/* 2. Catering & Food */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="w-4 h-4 text-emerald-700" />
                      <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                        2. Catering & Food
                      </h4>
                    </div>
                    <span className="font-bold text-sm text-emerald-800">
                      Rs {state.food.totalCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-semibold text-sm text-neutral-900">
                      {state.food.headcount} Total Meals Required
                    </h5>
                    <p className="text-xs text-neutral-600">{state.food.itemDescription}</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl text-xs space-y-1 text-neutral-600">
                    <div className="flex justify-between">
                      <span>Unit Price:</span>
                      <strong className="text-neutral-900">Rs {state.food.unitPrice} / person</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charges:</span>
                      <strong className="text-neutral-900">Rs {state.food.deliveryCharges.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between text-emerald-800 font-semibold">
                      <span>Total Catering Cost:</span>
                      <span>Rs {state.food.totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Rule verification: Any proposal reducing headcount below 177 is strictly rejected.
                  </p>
                </div>

                {/* 3. Budget & Expenses */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-emerald-700" />
                      <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                        3. Budget & Expenses
                      </h4>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                      Ceiling: Rs {state.budget.approvedTotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                      <span className="text-[11px] text-neutral-500 block">Total Committed</span>
                      <strong className="text-base font-extrabold text-neutral-900">
                        Rs {state.budget.totalCommitted.toLocaleString()}
                      </strong>
                    </div>
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                      <span className="text-[11px] text-emerald-700 block font-medium">Remaining Balance</span>
                      <strong className="text-base font-extrabold text-emerald-800">
                        Rs {state.budget.remainingBalance.toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  {/* Budget Allocation Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-neutral-500">
                      <span>Utilization</span>
                      <span>
                        {Math.round((state.budget.totalCommitted / state.budget.approvedTotal) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              (state.budget.totalCommitted / state.budget.approvedTotal) * 100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Event Schedule */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-700" />
                      <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                        4. Event Schedule (4 Hours)
                      </h4>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700">
                      {state.schedule.eventStartTime} - {state.schedule.eventEndTime}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {state.schedule.activities.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                          item.type === "prayer"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-950 font-medium"
                            : "bg-neutral-50 border-neutral-100 text-neutral-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-400 font-mono text-[11px]">
                            {item.startTime} - {item.endTime}
                          </span>
                          <span className="font-semibold text-xs">{item.title}</span>
                        </div>
                        <span className="text-[10px] text-neutral-500 shrink-0">
                          {item.durationMinutes} min
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Judges Allocation */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-3 md:col-span-2">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Gavel className="w-4 h-4 text-emerald-700" />
                      <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                        5. Judging Allocation & Scoring Slots
                      </h4>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                      {state.judging.judgesList.length} Confirmed Evaluators
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-neutral-50 rounded-xl">
                      <span className="text-neutral-500 block text-[11px]">Teams to Judge</span>
                      <strong className="text-sm font-bold text-neutral-900">50 Teams Total</strong>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl">
                      <span className="text-neutral-500 block text-[11px]">Workload Cap</span>
                      <strong className="text-sm font-bold text-neutral-900">&le; 3 Teams per Judge</strong>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl">
                      <span className="text-neutral-500 block text-[11px]">Evaluation Model</span>
                      <strong className="text-sm font-bold text-emerald-800">Parallel Evaluation</strong>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Dr. Tariq 10-minute motorway delay absorbed in group 3 without extending event end time past 05:00 PM.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────────
              SECTION 3: LATEST UPDATES (Audit Trail & Activity History)
          ────────────────────────────────────────────────────────────────── */}
          {activeSection === "updates" && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl w-full mx-auto space-y-5">
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-neutral-200 gap-3">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-emerald-700" />
                    <span>Latest Updates</span>
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Transparent activity history and AI constraint validation decisions
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl text-xs">
                  <Filter className="w-3.5 h-3.5 text-neutral-400 ms-1" />
                  {(["All", "Accepted", "Rejected"] as const).map((filterOpt) => (
                    <button
                      key={filterOpt}
                      onClick={() => setStatusFilter(filterOpt)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        statusFilter === filterOpt
                          ? "bg-white text-emerald-900 shadow-2xs"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      {filterOpt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Updates List */}
              <div className="space-y-3.5">
                {filteredUpdates.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-300 transition-colors shadow-2xs space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 text-sm">
                          {item.submittedBy}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-full">
                          {item.role}
                        </span>
                        <span className="text-neutral-400 text-[11px]">• {item.timestamp}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
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

                    {/* Raw Incoming Message */}
                    <div className="text-xs italic text-neutral-700 bg-neutral-50 p-3 rounded-xl border border-neutral-150">
                      &ldquo;{item.rawMessage}&rdquo;
                    </div>

                    {/* Before / After Diff */}
                    {item.previousValue && item.newValue && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                          <span className="text-neutral-400 block text-[10px] font-semibold uppercase tracking-wider">
                            Previous Value
                          </span>
                          <span className="text-neutral-600 line-through truncate block">
                            {item.previousValue}
                          </span>
                        </div>
                        <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
                          <span className="text-emerald-700 block text-[10px] font-semibold uppercase tracking-wider">
                            New Value
                          </span>
                          <span className="font-bold text-emerald-900 truncate block">
                            {item.newValue}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* AI Reasoning Action */}
                    <div className="text-[11px] text-neutral-600 pt-2 border-t border-neutral-100 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-neutral-800 font-semibold">AI Action: </strong>
                        {item.aiAction}
                      </span>
                    </div>
                  </div>
                ))}

                {filteredUpdates.length === 0 && (
                  <div className="text-center py-16 text-neutral-400 text-xs flex flex-col items-center justify-center">
                    <Clock className="w-8 h-8 text-neutral-300 mb-2" />
                    <span className="font-semibold text-neutral-600">
                      {statusFilter === "All"
                        ? "No activity updates recorded yet"
                        : `No activity updates found matching "${statusFilter}"`}
                    </span>
                    <span className="text-[11px] text-neutral-400 mt-1">
                      When you or team members submit proposals, AI validations and plan modifications will appear here.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
