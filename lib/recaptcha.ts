export interface RecaptchaVerificationResult {
  success: boolean;
  challengeTs?: string;
  hostname?: string;
  errorCodes?: string[];
}

/**
 * Strict server-side verification of Google reCAPTCHA v2 token.
 * Calls https://www.google.com/recaptcha/api/siteverify
 */
export async function verifyRecaptchaToken(
  token: string,
  remoteIp?: string
): Promise<RecaptchaVerificationResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY is not defined in environment variables");
    return { success: false, errorCodes: ["missing-secret-key"] };
  }

  if (!token || typeof token !== "string" || !token.trim()) {
    return { success: false, errorCodes: ["missing-input-response"] };
  }

  try {
    const params = new URLSearchParams();
    params.append("secret", secretKey);
    params.append("response", token.trim());
    if (remoteIp) {
      params.append("remoteip", remoteIp);
    }

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "reCAPTCHA verification request failed with HTTP status:",
        response.status
      );
      return { success: false, errorCodes: ["http-error"] };
    }

    const data = await response.json();
    return {
      success: Boolean(data.success),
      challengeTs: data.challenge_ts,
      hostname: data.hostname,
      errorCodes: data["error-codes"],
    };
  } catch (error) {
    console.error("Error during reCAPTCHA token verification:", error);
    return { success: false, errorCodes: ["network-error"] };
  }
}
