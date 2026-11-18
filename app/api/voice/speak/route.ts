import { NextRequest, NextResponse } from "next/server";
import { getGroqClient } from "@/lib/voice/groqClient";
import { VOICE_CONFIG } from "@/lib/voice/config";
import { containsArabicScript } from "@/lib/voice/textUtils";
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

  // 2. Per-IP rate limiting (~30 requests per minute)
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(
    `tts:${clientIp}`,
    VOICE_CONFIG.tts.rateLimitPerMinute,
    60000
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many voice requests. Please wait a moment.",
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

  // 3. Payload parsing & validation
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body", code: "invalid_json" },
      { status: 400 }
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("text" in body) ||
    typeof (body as { text: unknown }).text !== "string"
  ) {
    return NextResponse.json(
      { error: "Missing 'text' field", code: "missing_text" },
      { status: 400 }
    );
  }

  const text = (body as { text: string }).text.trim();

  // Validate non-empty and at most 200 characters per request
  if (!text || text.length === 0) {
    return NextResponse.json(
      { error: "Text must not be empty", code: "empty_text" },
      { status: 400 }
    );
  }

  if (text.length > VOICE_CONFIG.tts.apiHardLimitChars) {
    return NextResponse.json(
      {
        error: `Text exceeds maximum allowed length of ${VOICE_CONFIG.tts.apiHardLimitChars} characters`,
        code: "text_too_long",
      },
      { status: 400 }
    );
  }

  // Language check: Groq TTS model canopylabs/orpheus-v1-english ONLY supports English.
  // Never send Urdu/Arabic script text to Groq TTS.
  if (containsArabicScript(text)) {
    return NextResponse.json(
      {
        error: "Arabic/Urdu script is not supported by Groq TTS",
        code: "unsupported_language",
      },
      { status: 400 }
    );
  }

  // 4. Call Groq TTS API with timeout
  try {
    const groq = getGroqClient();

    // 15 second request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const speechResponse = await groq.audio.speech.create(
      {
        model: VOICE_CONFIG.tts.model,
        voice: VOICE_CONFIG.tts.voice,
        response_format: VOICE_CONFIG.tts.responseFormat,
        input: text,
      },
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    const audioBuffer = await speechResponse.arrayBuffer();

    // Return binary audio/wav
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": String(audioBuffer.byteLength),
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (error: unknown) {
    // Check for Abort / Timeout
    if (
      (error instanceof Error && error.name === "AbortError") ||
      (typeof error === "object" &&
        error !== null &&
        "name" in error &&
        (error as { name: string }).name === "AbortError")
    ) {
      return NextResponse.json(
        { error: "Speech generation timed out", code: "timeout" },
        { status: 504 }
      );
    }

    // Inspect Groq API Error
    interface ApiErrorLike {
      status?: number;
      code?: string;
      message?: string;
      error?: { code?: string; message?: string };
    }

    const err = error as ApiErrorLike;
    const statusCode = err.status || 500;
    const errCode = err.code || err.error?.code || "";

    if (errCode === "model_terms_required" || (err.message && err.message.includes("model_terms_required"))) {
      return NextResponse.json(
        {
          error:
            "Model terms acceptance required in Groq Console for canopylabs/orpheus-v1-english",
          code: "model_terms_required",
        },
        { status: 400 }
      );
    }

    if (statusCode === 401) {
      return NextResponse.json(
        { error: "Authentication failed with speech provider", code: "auth_error" },
        { status: 401 }
      );
    }

    if (statusCode === 429) {
      return NextResponse.json(
        { error: "Provider rate limit reached. Please wait a moment.", code: "rate_limited" },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate speech", code: "server_error" },
      { status: 500 }
    );
  }
}
