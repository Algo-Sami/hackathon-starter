import Groq from "groq-sdk";

/**
 * Server-only Groq SDK client instance.
 *
 * SECURITY:
 * This module must only be imported in Server Components, Route Handlers,
 * or Server Actions. GROQ_API_KEY is never exposed to the client.
 */

let cachedGroqClient: Groq | null = null;

export function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    throw new Error(
      "GROQ_API_KEY is not defined in the server environment. Please configure it in .env.local."
    );
  }

  if (!cachedGroqClient) {
    cachedGroqClient = new Groq({
      apiKey: apiKey.trim(),
    });
  }

  return cachedGroqClient;
}
