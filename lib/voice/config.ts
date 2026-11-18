/**
 * Voice feature configuration constants for Groq STT and TTS.
 *
 * Exact Model IDs:
 * - STT: whisper-large-v3 (Whisper Large v3 for highest accuracy across English and Urdu)
 * - TTS: canopylabs/orpheus-v1-english (English TTS model by Canopy Labs on Groq)
 */

export const VOICE_CONFIG = {
  stt: {
    model: "whisper-large-v3",
    modelTurbo: "whisper-large-v3-turbo",
    endpoint: "/openai/v1/audio/transcriptions",
    maxFileSizeBytes: 10 * 1024 * 1024, // 10 MB maximum audio payload
    maxDurationSeconds: 60, // 60 seconds auto-cutoff
    rateLimitPerMinute: 10, // Per-IP rate limit
    allowedMimeTypes: [
      "audio/webm",
      "audio/webm;codecs=opus",
      "audio/ogg",
      "audio/ogg;codecs=opus",
      "audio/mp4",
      "audio/m4a",
      "audio/x-m4a",
      "audio/wav",
      "audio/x-wav",
      "audio/mpeg",
      "audio/mp3",
    ],
  },
  tts: {
    model: "canopylabs/orpheus-v1-english",
    voice: "autumn",
    responseFormat: "wav" as const,
    endpoint: "/openai/v1/audio/speech",
    apiHardLimitChars: 200, // Groq TTS hard limit per request
    maxChunkChars: 180, // Safe sentence chunk limit (must be <= 200)
    maxSelectionChars: 1500, // Maximum selection length to read
    rateLimitPerMinute: 30, // Per-IP rate limit
  },
} as const;

export type SupportedVoiceLanguage = "en" | "ur";
