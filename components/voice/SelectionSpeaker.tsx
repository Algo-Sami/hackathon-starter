"use client";

import React from "react";
import { Volume2, Square, Loader2, AlertCircle } from "lucide-react";
import { useSelectionSpeech } from "@/hooks/useSelectionSpeech";
import { useTranslation } from "@/components/providers/LanguageProvider";

export function SelectionSpeaker() {
  const { t } = useTranslation();
  const {
    dominantScript,
    coords,
    isVisible,
    isPlaying,
    isLoading,
    errorKey,
    isTruncated,
    hasUrduVoice,
    speak,
    stop,
  } = useSelectionSpeech();

  if (!isVisible || !coords) {
    return null;
  }

  const isUrduDisabled = dominantScript === "ur" && !hasUrduVoice;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUrduDisabled) return;
    if (isPlaying) {
      stop();
    } else {
      speak();
    }
  };

  // Prevent selection from clearing when clicking the button
  const handlePreventClear = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };

  const getAriaLabel = () => {
    if (isLoading) return t("voice.speaker.loading");
    if (isPlaying) return t("voice.speaker.stop");
    if (isUrduDisabled) return t("voice.speaker.urduUnavailable");
    return t("voice.speaker.play");
  };

  return (
    <div
      style={{
        position: "fixed",
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        zIndex: 9999,
      }}
      className="pointer-events-auto transition-transform duration-150 animate-in fade-in zoom-in-90"
    >
      <div className="relative flex flex-col items-center">
        {/* Speaker Button */}
        <button
          type="button"
          onMouseDown={handlePreventClear}
          onPointerDown={handlePreventClear}
          onClick={handleClick}
          disabled={isUrduDisabled}
          aria-label={getAriaLabel()}
          title={getAriaLabel()}
          className={`w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 select-none ${
            isUrduDisabled
              ? "bg-surface border border-border text-muted cursor-not-allowed opacity-70"
              : isPlaying
              ? "bg-primary text-white border border-primary-hover shadow-primary/20 scale-105"
              : "bg-background border border-border hover:border-primary text-foreground hover:text-primary hover:bg-surface active:scale-95"
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : isPlaying ? (
            <Square className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>

        {/* Truncation notice */}
        {isTruncated && isPlaying && (
          <div className="absolute top-full mt-1.5 whitespace-nowrap bg-background border border-border rounded px-2 py-0.5 text-[10px] text-muted shadow-xs">
            {t("voice.speaker.truncatedNote")}
          </div>
        )}

        {/* Urdu voice unavailable tooltip / indicator */}
        {isUrduDisabled && (
          <div className="absolute top-full mt-1.5 whitespace-nowrap bg-background border border-border rounded px-2.5 py-1 text-[11px] text-muted shadow-md flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
            <span>{t("voice.errors.urduVoiceUnavailable")}</span>
          </div>
        )}

        {/* Error notice banner */}
        {errorKey && (
          <div className="absolute top-full mt-1.5 whitespace-nowrap bg-red-50 border border-red-200 rounded px-2.5 py-1 text-[11px] text-red-600 shadow-md flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{t(errorKey)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
