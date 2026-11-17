"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Mic, Bot, User } from "lucide-react";
import { t } from "@/lib/i18n";
import { chatSuggestionChips } from "@/config/content";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: t("chat.welcomeMessage"),
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // focus input when opened on non-touch screens
      if (window.innerWidth > 640) {
        inputRef.current?.focus();
      }
    }
  }, [isOpen, messages, isTyping]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    if (!query || isTyping) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${prev.length + 1}`,
        sender: "user",
        text: query,
        timestamp: "Just now",
      },
    ]);
    setInput("");
    setIsTyping(true);

    // Simulate dummy AI response after short delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${prev.length + 1}`,
          sender: "bot",
          text: t("chat.dummyReply"),
          timestamp: "Just now",
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleChipClick = (chipKey: string) => {
    const text = t(chipKey);
    handleSendMessage(text);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none"
        aria-label={isOpen ? t("chat.closeButton") : t("chat.openButton")}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={t("chat.title")}
          className="fixed z-50 bottom-24 right-6 w-[360px] h-[500px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-7rem)] bg-background border border-border rounded-lg shadow-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-surface border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center text-primary">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground leading-tight">
                  {t("chat.title")}
                </h3>
                <p className="text-xs text-muted leading-tight">
                  {t("chat.subtitle")}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-muted hover:text-foreground hover:bg-background rounded transition-colors"
              aria-label={t("chat.closeButton")}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-sm bg-background">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded px-3 py-2 leading-relaxed text-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-surface border border-border text-foreground"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                {msg.sender === "user" && (
                  <div className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-muted" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-muted pl-8">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>{t("chat.typingIndicator")}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="px-3 py-2 bg-surface/50 border-t border-border flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
            {chatSuggestionChips.map((chipKey) => (
              <button
                key={chipKey}
                type="button"
                onClick={() => handleChipClick(chipKey)}
                disabled={isTyping}
                className="shrink-0 px-2.5 py-1 bg-background hover:bg-surface border border-border rounded text-muted hover:text-foreground transition-colors disabled:opacity-50"
              >
                {t(chipKey)}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-background border-t border-border flex items-center gap-2"
          >
            {/* Voice input placeholder */}
            <button
              type="button"
              className="p-2 text-muted hover:text-foreground hover:bg-surface rounded transition-colors"
              title={t("chat.voicePlaceholder")}
              aria-label={t("chat.voicePlaceholder")}
              onClick={() => alert(t("chat.voicePlaceholder"))}
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chat.inputPlaceholder")}
              disabled={isTyping}
              className="flex-1 text-sm bg-surface border border-border rounded px-3 py-2 text-foreground placeholder:text-muted focus:outline-none focus:border-primary disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2 bg-primary hover:bg-primary-hover disabled:bg-muted/30 text-white rounded transition-colors disabled:cursor-not-allowed"
              aria-label={t("chat.sendButton")}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
