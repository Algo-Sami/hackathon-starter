"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { chatSuggestionChips } from "@/config/content";
import { useTranslation } from "@/components/providers/LanguageProvider";

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
  const { t, language, dir, isRTL } = useTranslation();

  // Stores sent messages. Welcome message is rendered automatically if this is empty.
  const [userThread, setUserThread] = useState<Message[]>([]);

  const messages: Message[] = useMemo(() => {
    return userThread.length > 0
      ? userThread
      : [
          {
            id: "welcome-1",
            sender: "bot",
            text: t("chat.welcomeMessage"),
            timestamp: "Just now",
          },
        ];
  }, [userThread, t]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    // AI request payload shape annotated with active language
    const _aiPayload = { message: query, language };
    void _aiPayload;

    const baseList =
      userThread.length > 0
        ? userThread
        : [
            {
              id: "welcome-1",
              sender: "bot" as const,
              text: t("chat.welcomeMessage"),
              timestamp: "Just now",
            },
          ];

    setUserThread([
      ...baseList,
      {
        id: `user-${baseList.length + 1}`,
        sender: "user",
        text: query,
        timestamp: "Just now",
      },
    ]);
    setInput("");
    setIsTyping(true);

    // Simulate dummy AI response after short delay
    setTimeout(() => {
      setUserThread((prev) => [
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
      {/* Floating Trigger Button (Stays at bottom-right in both languages) */}
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

      {/* Chat Panel Anchored at Bottom-Right */}
      {isOpen && (
        <div
          role="dialog"
          dir={dir}
          aria-label={t("chat.title")}
          className="fixed z-50 bottom-24 right-6 w-[360px] h-[500px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-7rem)] bg-background border border-border rounded-lg shadow-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-surface border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary-light flex items-center justify-center text-primary">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {t("chat.title")}
                </h3>
                <p className="text-[10px] text-muted">
                  {t("chat.subtitle")}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-muted hover:text-foreground hover:bg-background transition-colors focus:outline-none"
              aria-label={t("chat.closeButton")}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-background text-sm">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${
                    isUser
                      ? isRTL
                        ? "flex-row"
                        : "flex-row-reverse"
                      : isRTL
                        ? "flex-row-reverse"
                        : "flex-row"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold select-none ${
                      isUser
                        ? "bg-foreground text-background"
                        : "bg-primary-light text-primary border border-primary-accent/30"
                    }`}
                  >
                    {isUser ? (
                      <User className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div
                    className={`max-w-[78%] px-3 py-2 rounded text-xs leading-relaxed ${
                      isUser
                        ? "bg-primary text-white"
                        : "bg-surface border border-border text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span
                      className={`block text-[9px] mt-1 ${
                        isUser ? "text-white/70" : "text-muted"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary-light text-primary flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="px-3 py-2 rounded bg-surface border border-border text-xs text-muted flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="px-3 py-2 bg-surface/50 border-t border-border flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {chatSuggestionChips.map((chipKey) => (
              <button
                key={chipKey}
                type="button"
                onClick={() => handleChipClick(chipKey)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] bg-background border border-border text-muted hover:text-foreground hover:border-primary transition-colors focus:outline-none"
              >
                {t(chipKey)}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-surface border-t border-border flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chat.inputPlaceholder")}
              aria-label={t("chat.inputPlaceholder")}
              className="flex-1 bg-background border border-border rounded px-3 py-1.5 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-8 h-8 rounded bg-primary hover:bg-primary-hover disabled:bg-primary/40 text-white flex items-center justify-center transition-colors focus:outline-none shrink-0"
              aria-label={t("chat.sendButton")}
            >
              <Send className="w-3.5 h-3.5 rtl-flip" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
