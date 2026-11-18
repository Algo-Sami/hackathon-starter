"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { VOICE_CONFIG } from "@/lib/voice/config";
import { useTranslation } from "@/components/providers/LanguageProvider";

export type STTState =
  | "idle"
  | "asking-permission"
  | "recording"
  | "transcribing"
  | "error";

interface UseSpeechToTextOptions {
  onTranscript?: (text: string) => void;
}

export function useSpeechToText({ onTranscript }: UseSpeechToTextOptions = {}) {
  const { language } = useTranslation();
  const [state, setState] = useState<STTState>("idle");
  const [duration, setDuration] = useState(0);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const durationRef = useRef(0);
  const isCancelledRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up microphone hardware tracks
  const releaseMicrophone = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // Ignore track stop errors
        }
      });
      mediaStreamRef.current = null;
    }
  }, []);

  const clearTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    durationRef.current = 0;
    setDuration(0);
  }, []);

  // Stop recording and trigger transcription
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      isCancelledRef.current = false;
      clearTimer();
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Fallback cleanup
        releaseMicrophone();
        setState("idle");
      }
    }
  }, [clearTimer, releaseMicrophone]);

  // Cancel recording without transcribing
  const cancelRecording = useCallback(() => {
    isCancelledRef.current = true;
    clearTimer();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Ignore
      }
    }

    releaseMicrophone();
    audioChunksRef.current = [];
    setState("idle");
    setErrorKey(null);
  }, [clearTimer, releaseMicrophone]);

  // Clean cancellation when language switches or unmounts
  useEffect(() => {
    return () => {
      cancelRecording();
    };
  }, [language, cancelRecording]);

  // Select best supported MIME type
  const getSupportedMimeType = (): string => {
    if (typeof MediaRecorder === "undefined") return "";

    const candidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg;codecs=opus",
      "audio/wav",
    ];

    for (const type of candidates) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return "";
  };

  // Start recording
  const startRecording = useCallback(async () => {
    setErrorKey(null);

    // 1. Check browser mediaDevices support
    if (
      typeof window === "undefined" ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setErrorKey("voice.errors.browserNotSupported");
      setState("error");
      return;
    }

    // 2. Check secure context (HTTPS or localhost)
    if (
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      setErrorKey("voice.errors.insecureOrigin");
      setState("error");
      return;
    }

    const mimeType = getSupportedMimeType();

    setState("asking-permission");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;
      audioChunksRef.current = [];
      isCancelledRef.current = false;

      const recorderOptions: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const recorder = new MediaRecorder(stream, recorderOptions);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        releaseMicrophone();

        if (isCancelledRef.current) {
          audioChunksRef.current = [];
          setState("idle");
          return;
        }

        const chunks = audioChunksRef.current;
        if (chunks.length === 0) {
          setErrorKey("voice.errors.nothingHeard");
          setState("error");
          return;
        }

        const actualMime = recorder.mimeType || mimeType || "audio/webm";
        const audioBlob = new Blob(chunks, { type: actualMime });

        // Discard silent/empty blobs (< 1000 bytes)
        if (audioBlob.size < 1000) {
          setErrorKey("voice.errors.nothingHeard");
          setState("error");
          return;
        }

        setState("transcribing");

        try {
          abortControllerRef.current = new AbortController();

          const formData = new FormData();
          const extension = actualMime.includes("mp4")
            ? "mp4"
            : actualMime.includes("ogg")
            ? "ogg"
            : actualMime.includes("wav")
            ? "wav"
            : "webm";

          formData.append("file", audioBlob, `speech.${extension}`);
          formData.append("language", language); // Pass current active app language

          const res = await fetch("/api/voice/transcribe", {
            method: "POST",
            body: formData,
            signal: abortControllerRef.current.signal,
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            const code = errData.code || "server_error";
            throw new Error(code);
          }

          const data = await res.json();
          if (data.empty || !data.text || data.text.trim() === "") {
            setErrorKey("voice.errors.nothingHeard");
            setState("error");
          } else {
            onTranscript?.(data.text.trim());
            setState("idle");
          }
        } catch (err: unknown) {
          if (err instanceof Error && err.name === "AbortError") {
            setState("idle");
            return;
          }
          const code = err instanceof Error ? err.message : "server_error";
          if (code === "rate_limited") {
            setErrorKey("voice.errors.rateLimited");
          } else if (code === "timeout") {
            setErrorKey("voice.errors.timeout");
          } else if (code === "nothing_heard") {
            setErrorKey("voice.errors.nothingHeard");
          } else {
            setErrorKey("voice.errors.transcriptionFailed");
          }
          setState("error");
        } finally {
          abortControllerRef.current = null;
        }
      };

      recorder.start(250); // Slice data every 250ms
      setState("recording");

      // Start 60s timer and auto-stop
      durationRef.current = 0;
      setDuration(0);
      timerIntervalRef.current = setInterval(() => {
        durationRef.current += 1;
        setDuration(durationRef.current);

        if (durationRef.current >= VOICE_CONFIG.stt.maxDurationSeconds) {
          stopRecording();
        }
      }, 1000);
    } catch (err: unknown) {
      releaseMicrophone();
      if (
        err instanceof DOMException &&
        (err.name === "NotAllowedError" ||
          err.name === "PermissionDeniedError")
      ) {
        setErrorKey("voice.errors.micPermissionDenied");
      } else if (
        err instanceof DOMException &&
        (err.name === "NotFoundError" ||
          err.name === "DevicesNotFoundError")
      ) {
        setErrorKey("voice.errors.noMicrophone");
      } else {
        setErrorKey("voice.errors.micAccessFailed");
      }
      setState("error");
    }
  }, [language, onTranscript, releaseMicrophone, stopRecording]);

  return {
    state,
    duration,
    errorKey,
    startRecording,
    stopRecording,
    cancelRecording,
    clearError: () => setErrorKey(null),
  };
}
