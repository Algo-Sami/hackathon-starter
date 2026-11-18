import { NextRequest, NextResponse } from "next/server";
import { getGroqClient } from "@/lib/voice/groqClient";
import { VOICE_CONFIG } from "@/lib/voice/config";
import {
  checkRateLimit,
  getClientIp,
  validateRequestOrigin,
} from "@/lib/voice/rateLimit";



export async function POST(request: NextRequest) {
  // 1. Origin verification
  if (!validateRequestOrigin(request)) {
    return NextResponse.json(
      { error: "Forbidden: Origin validation failed", code: "forbidden_origin" },
      { status: 403 }
    );
  }

  // 2. Per-IP rate limiting (~10 requests per minute)
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(
    `stt:${clientIp}`,
    VOICE_CONFIG.stt.rateLimitPerMinute,
    60000
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many transcription requests. Please wait a moment.",
        code: "rate_limited",
        retryAfter: rateLimit.retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  // 3. Parse multipart form data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data submission", code: "invalid_form_data" },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Audio file is required", code: "missing_file" },
      { status: 400 }
    );
  }

  // Validate file size (10 MB maximum)
  if (file.size > VOICE_CONFIG.stt.maxFileSizeBytes) {
    return NextResponse.json(
      {
        error: "Audio file exceeds 10 MB limit",
        code: "file_too_large",
      },
      { status: 400 }
    );
  }

  if (file.size === 0) {
    return NextResponse.json(
      {
        error: "Audio file is empty",
        code: "empty_audio",
      },
      { status: 400 }
    );
  }

  // Validate MIME type
  const rawType = (file.type || "").toLowerCase().split(";")[0].trim();
  const isAllowedType = VOICE_CONFIG.stt.allowedMimeTypes.some((allowed) =>
    allowed.toLowerCase().startsWith(rawType)
  );

  if (rawType && !isAllowedType) {
    return NextResponse.json(
      {
        error: `Unsupported audio type: ${rawType}`,
        code: "unsupported_audio_type",
      },
      { status: 400 }
    );
  }

  // Optional language parameter ("en" or "ur")
  const rawLang = formData.get("language");
  let languageParam: "en" | "ur" | undefined = undefined;
  if (typeof rawLang === "string") {
    const cleanLang = rawLang.trim().toLowerCase();
    if (cleanLang === "ur" || cleanLang === "en") {
      languageParam = cleanLang;
    }
  }

  // 4. Send to Groq Whisper API with 25 second timeout
  try {
    const groq = getGroqClient();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const transcription = await groq.audio.transcriptions.create(
      {
        file,
        model: VOICE_CONFIG.stt.model, // whisper-large-v3
        language: languageParam, // "en" or "ur" so Urdu outputs in Urdu script
        temperature: 0,
        response_format: "json",
      },
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    const transcribedText = (transcription.text || "").trim();

    // Check if nothing was heard / silence
    if (!transcribedText) {
      return NextResponse.json(
        {
          text: "",
          empty: true,
          code: "nothing_heard",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      text: transcribedText,
      empty: false,
    });
  } catch (error: unknown) {
    if (
      (error instanceof Error && error.name === "AbortError") ||
      (typeof error === "object" &&
        error !== null &&
        "name" in error &&
        (error as { name: string }).name === "AbortError")
    ) {
      return NextResponse.json(
        { error: "Transcription request timed out", code: "timeout" },
        { status: 504 }
      );
    }

    interface ApiErrorLike {
      status?: number;
      code?: string;
      message?: string;
    }

    const err = error as ApiErrorLike;
    const statusCode = err.status || 500;

    if (statusCode === 401) {
      return NextResponse.json(
        { error: "Authentication failed with transcription provider", code: "auth_error" },
        { status: 401 }
      );
    }

    if (statusCode === 429) {
      return NextResponse.json(
        {
          error: "Provider transcription rate limit reached. Please wait a moment.",
          code: "rate_limited",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to transcribe audio", code: "server_error" },
      { status: 500 }
    );
  }
}
