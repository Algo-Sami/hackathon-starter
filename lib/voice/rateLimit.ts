/**
 * In-memory sliding-window rate limiter for voice API routes.
 *
 * NOTE FOR PRODUCTION:
 * This in-memory implementation tracks requests per instance memory.
 * For multi-region serverless or auto-scaled production deployments,
 * replace or back this with a shared distributed store such as
 * Upstash Redis (@upstash/ratelimit) or Vercel KV.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 60000);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

export function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs = 60000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  let record = rateLimitStore.get(identifier);

  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(identifier, record);
  }

  // Filter timestamps within the active sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= maxRequests) {
    const oldest = record.timestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: maxRequests - record.timestamps.length,
    retryAfterSeconds: 0,
  };
}

/**
 * Extracts client IP address safely from standard proxy headers.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Validates that the request origin matches the host / site.
 * Permitted: Same-origin requests, localhost / 127.0.0.1 in development,
 * and requests matching the host header.
 */
export function validateRequestOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  // If no origin header is sent (e.g. some internal same-origin fetches),
  // check Sec-Fetch-Site if available
  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite === "same-origin" || secFetchSite === "same-site") {
    return true;
  }

  if (!origin) {
    // If neither origin nor sec-fetch-site is present, verify referer matches host
    const referer = request.headers.get("referer");
    if (referer && host) {
      try {
        const refUrl = new URL(referer);
        return refUrl.host === host;
      } catch {
        return false;
      }
    }
    return true;
  }

  try {
    const originUrl = new URL(origin);

    // Allow localhost/127.0.0.1 on any port in development
    if (
      originUrl.hostname === "localhost" ||
      originUrl.hostname === "127.0.0.1"
    ) {
      return true;
    }

    if (host && originUrl.host === host) {
      return true;
    }

    // Allow vercel preview / production domains for this app
    if (originUrl.hostname.endsWith(".vercel.app")) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}
