"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { VOICE_CONFIG } from "@/lib/voice/config";
import {
  detectDominantScript,
  chunkTextForTTS,
  cleanTextForSpeech,
} from "@/lib/voice/textUtils";
import { useTranslation } from "@/components/providers/LanguageProvider";

export interface SelectionCoords {
  x: number;
  y: number;
  placement: "top" | "bottom";
}

// In-session cache for TTS audio blob URLs to avoid duplicate API requests
const audioBlobCache = new Map<string, string>();

function checkSystemUrduVoice(): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }
  const voices = window.speechSynthesis.getVoices();
  return voices.some(
    (v) =>
      v.lang.toLowerCase().startsWith("ur") ||
      v.name.toLowerCase().includes("urdu")
  );
}

export function useSelectionSpeech() {
  const { language } = useTranslation();
  const pathname = usePathname();

  // ── 1. State ────────────────────────────────────────────────────────────────
  const [selectedText, setSelectedText] = useState("");
  const [dominantScript, setDominantScript] = useState<"en" | "ur">("en");
  const [coords, setCoords] = useState<SelectionCoords | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [hasUrduVoice, setHasUrduVoice] = useState(checkSystemUrduVoice);

  // ── 2. Refs ──────────────────────────────────────────────────────────────────
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const initialScrollYRef = useRef<number>(0);
  const chunksQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);
  // selectedText ref so debounce closure sees the latest value without stale captures
  const selectedTextRef = useRef("");
  // Will be assigned inside useEffect once stop & fetchAudioChunk are defined
  const playNextChunkRef = useRef<(index: number) => Promise<void>>(
    async () => {}
  );

  // ── 3. fetchAudioChunk (useCallback, deps: []) ───────────────────────────────
  const fetchAudioChunk = useCallback(
    async (chunkText: string, signal: AbortSignal): Promise<string> => {
      const cachedUrl = audioBlobCache.get(chunkText);
      if (cachedUrl) return cachedUrl;

      const response = await fetch("/api/voice/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: chunkText }),
        signal,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const code = (errData as { code?: string }).code ?? "server_error";
        throw new Error(code);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      audioBlobCache.set(chunkText, objectUrl);
      return objectUrl;
    },
    []
  );

  // ── 4. stop (useCallback, deps: []) ─────────────────────────────────────────
  const stop = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setIsLoading(false);

    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.src = "";
      activeAudioRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore synthesis cancel errors
      }
    }

    chunksQueueRef.current = [];
  }, []);

  // ── 5. dismiss (useCallback, deps: [stop]) ───────────────────────────────────
  const dismiss = useCallback(() => {
    stop();
    setIsVisible(false);
    setCoords(null);
    setSelectedText("");
    setErrorKey(null);
    setIsTruncated(false);
  }, [stop]);

  // ── 6. voiceschanged listener ────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const onVoicesChanged = () => setHasUrduVoice(checkSystemUrduVoice());
    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
    };
  }, []);

  // ── 7. Route/language change cleanup ────────────────────────────────────────
  const prevRouteKeyRef = useRef(`${pathname}-${language}`);
  useEffect(() => {
    const currentKey = `${pathname}-${language}`;
    if (prevRouteKeyRef.current !== currentKey) {
      prevRouteKeyRef.current = currentKey;
      if (isPlayingRef.current) stop();
      setIsVisible(false);
      setCoords(null);
      setSelectedText("");
      setErrorKey(null);
    }
  }, [pathname, language, stop]);

  // ── 8. Assign playNextChunkRef.current (after stop & fetchAudioChunk) ────────
  useEffect(() => {
    playNextChunkRef.current = async (index: number) => {
      if (!isPlayingRef.current) return;

      const queue = chunksQueueRef.current;
      if (index >= queue.length) {
        stop();
        return;
      }

      const currentChunk = queue[index];

      try {
        if (!abortControllerRef.current) {
          abortControllerRef.current = new AbortController();
        }
        const signal = abortControllerRef.current.signal;

        let audioUrl = audioBlobCache.get(currentChunk);
        if (!audioUrl) {
          audioUrl = await fetchAudioChunk(currentChunk, signal);
        }

        if (!isPlayingRef.current) return;

        const audio = new Audio(audioUrl);
        activeAudioRef.current = audio;

        // Prefetch next chunk in background
        const nextIndex = index + 1;
        if (nextIndex < queue.length && !audioBlobCache.has(queue[nextIndex])) {
          fetchAudioChunk(queue[nextIndex], signal).catch(() => {
            // Ignore prefetch failures; next step will retry
          });
        }

        audio.onplay = () => setIsLoading(false);

        audio.onended = () => {
          void playNextChunkRef.current(index + 1);
        };

        audio.onerror = () => {
          setErrorKey("voice.errors.playbackFailed");
          stop();
        };

        await audio.play();
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;

        const code =
          err instanceof Error ? err.message : "server_error";
        if (code === "model_terms_required") {
          setErrorKey("voice.errors.modelTermsRequired");
        } else if (code === "rate_limited") {
          setErrorKey("voice.errors.rateLimited");
        } else if (code === "unsupported_language") {
          setErrorKey("voice.errors.unsupportedLanguage");
        } else if (code === "timeout") {
          setErrorKey("voice.errors.timeout");
        } else {
          setErrorKey("voice.errors.ttsFailed");
        }
        stop();
      }
    };
  }, [stop, fetchAudioChunk]);

  // ── 9. Selection detection and positioning ───────────────────────────────────
  const updateSelection = useCallback(
    (latestSelectedText: string) => {
      if (typeof window === "undefined") return;

      const activeEl = document.activeElement;

      if (
        activeEl instanceof HTMLInputElement &&
        activeEl.type.toLowerCase() === "password"
      ) {
        dismiss();
        return;
      }

      if (activeEl?.closest("[data-no-speak]")) {
        dismiss();
        return;
      }

      let text = "";
      let rect: DOMRect | null = null;

      if (
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement
      ) {
        const start = activeEl.selectionStart ?? 0;
        const end = activeEl.selectionEnd ?? 0;
        if (end - start >= 2) {
          text = activeEl.value.substring(start, end);
          rect = activeEl.getBoundingClientRect();
        }
      } else {
        const sel = window.getSelection();
        if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
          const anchorNode = sel.anchorNode;
          const parentElem =
            anchorNode instanceof Element
              ? anchorNode
              : anchorNode?.parentElement;
          if (parentElem?.closest("[data-no-speak]")) {
            dismiss();
            return;
          }
          const range = sel.getRangeAt(0);
          text = sel.toString();
          rect = range.getBoundingClientRect();
        }
      }

      const trimmed = text.trim();

      if (trimmed.length < 2 || !rect || (rect.width === 0 && rect.height === 0)) {
        if (!isPlayingRef.current) {
          setIsVisible(false);
          setCoords(null);
        }
        return;
      }

      if (isPlayingRef.current && trimmed !== latestSelectedText) {
        stop();
      }

      setSelectedText(trimmed);
      setDominantScript(detectDominantScript(trimmed));
      setErrorKey(null);

      initialScrollYRef.current = window.scrollY;

      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const buttonSize = isTouch ? 42 : 36;
      const margin = 8;
      const isDocRTL = document.documentElement.dir === "rtl";

      let x = isDocRTL ? rect.left + margin : rect.right - buttonSize;
      const viewportWidth = window.innerWidth;
      x = Math.max(margin, Math.min(x, viewportWidth - buttonSize - margin));

      let y = rect.top - buttonSize - margin;
      let placement: "top" | "bottom" = "top";

      if (isTouch || y < margin + 10) {
        y = rect.bottom + margin;
        placement = "bottom";
      }

      setCoords({ x, y, placement });
      setIsVisible(true);
    },
    [dismiss, stop]
  );

  // ── 10. Debounced selection events ───────────────────────────────────────────
  // Sync selectedText to ref so the debounce closure sees the latest value
  useEffect(() => {
    selectedTextRef.current = selectedText;
  }, [selectedText]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const handleEvent = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(
        () => updateSelection(selectedTextRef.current),
        150
      );
    };

    document.addEventListener("selectionchange", handleEvent);
    document.addEventListener("mouseup", handleEvent);
    document.addEventListener("touchend", handleEvent);
    document.addEventListener("keyup", handleEvent);

    return () => {
      if (timer) clearTimeout(timer);
      document.removeEventListener("selectionchange", handleEvent);
      document.removeEventListener("mouseup", handleEvent);
      document.removeEventListener("touchend", handleEvent);
      document.removeEventListener("keyup", handleEvent);
    };
  }, [updateSelection]);

  // ── 11. Escape / scroll / resize ─────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };

    const handleScroll = () => {
      if (!isVisible) return;
      const scrollDiff = Math.abs(window.scrollY - initialScrollYRef.current);
      if (scrollDiff > 250) dismiss();
    };

    const handleResize = () => {
      // Re-read current selected text via DOM to reposition
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed) updateSelection(selectedText);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [dismiss, isVisible, updateSelection, selectedText]);

  // ── 12. speak ────────────────────────────────────────────────────────────────
  const speak = useCallback(() => {
    if (isPlaying) {
      stop();
      return;
    }

    if (!selectedText) return;

    setErrorKey(null);
    setIsLoading(true);
    setIsPlaying(true);
    isPlayingRef.current = true;

    // Urdu path: browser speechSynthesis
    if (dominantScript === "ur") {
      const urduAvailable = checkSystemUrduVoice();
      if (!urduAvailable) {
        setErrorKey("voice.errors.urduVoiceUnavailable");
        stop();
        return;
      }

      try {
        const voices = window.speechSynthesis.getVoices();
        const urduVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith("ur") ||
            v.name.toLowerCase().includes("urdu")
        );

        if (!urduVoice) {
          setErrorKey("voice.errors.urduVoiceUnavailable");
          stop();
          return;
        }

        const cleaned = cleanTextForSpeech(selectedText);
        const utterance = new SpeechSynthesisUtterance(cleaned);
        utterance.voice = urduVoice;
        utterance.lang = "ur-PK";
        utterance.onstart = () => setIsLoading(false);
        utterance.onend = () => stop();
        utterance.onerror = () => {
          setErrorKey("voice.errors.playbackFailed");
          stop();
        };

        window.speechSynthesis.speak(utterance);
      } catch {
        setErrorKey("voice.errors.playbackFailed");
        stop();
      }
      return;
    }

    // English path: Groq TTS chunked playback
    let textToSpeak = selectedText;
    if (textToSpeak.length > VOICE_CONFIG.tts.maxSelectionChars) {
      textToSpeak = textToSpeak.substring(0, VOICE_CONFIG.tts.maxSelectionChars);
      setIsTruncated(true);
    } else {
      setIsTruncated(false);
    }

    const chunks = chunkTextForTTS(textToSpeak, VOICE_CONFIG.tts.maxChunkChars);

    if (chunks.length === 0) {
      stop();
      return;
    }

    chunksQueueRef.current = chunks;
    abortControllerRef.current = new AbortController();

    void playNextChunkRef.current(0);
  }, [isPlaying, selectedText, dominantScript, stop]);

  return {
    selectedText,
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
    dismiss,
  };
}
