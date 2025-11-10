/**
 * Age Verification Helpers
 * Integration with third-party verification providers (Veriff/Persona/Yoti)
 */

export type VerificationProvider = "veriff" | "persona" | "yoti";

export interface VerificationSession {
  sessionId: string;
  sessionUrl: string;
  provider: VerificationProvider;
}

export interface VerificationWebhookPayload {
  provider: VerificationProvider;
  sessionId: string;
  status: "approved" | "rejected" | "review";
  userId?: string;
  customerReference?: string;
  riskScore?: number;
  reason?: string;
}

/**
 * Create a verification session with the configured provider
 */
export async function createVerificationSession(
  userId: string,
  email: string
): Promise<VerificationSession> {
  const provider = (process.env.VERIFICATION_PROVIDER ||
    "veriff") as VerificationProvider;

  switch (provider) {
    case "veriff":
      return createVeriffSession(userId, email);
    case "persona":
      return createPersonaSession(userId, email);
    case "yoti":
      return createYotiSession(userId, email);
    default:
      throw new Error(`Unsupported verification provider: ${provider}`);
  }
}

/**
 * Veriff integration
 */
async function createVeriffSession(
  userId: string,
  email: string
): Promise<VerificationSession> {
  const apiKey = process.env.VERIFF_API_KEY;
  const apiSecret = process.env.VERIFF_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("Veriff API credentials not configured");
  }

  const response = await fetch("https://stationapi.veriff.com/v1/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-CLIENT": apiKey,
    },
    body: JSON.stringify({
      verification: {
        callback: `${process.env.NEXTAUTH_URL}/api/verify/webhook`,
        person: {
          firstName: userId, // Use userId as reference
          lastName: "User",
        },
        vendorData: userId,
        timestamp: new Date().toISOString(),
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Veriff API error: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    sessionId: data.verification.id,
    sessionUrl: data.verification.url,
    provider: "veriff",
  };
}

/**
 * Persona integration
 */
async function createPersonaSession(
  userId: string,
  email: string
): Promise<VerificationSession> {
  const apiKey = process.env.PERSONA_API_KEY;
  const templateId = process.env.PERSONA_TEMPLATE_ID;

  if (!apiKey || !templateId) {
    throw new Error("Persona API credentials not configured");
  }

  const response = await fetch("https://withpersona.com/api/v1/inquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "Persona-Version": "2023-01-05",
    },
    body: JSON.stringify({
      data: {
        type: "inquiry",
        attributes: {
          inquiry_template_id: templateId,
          reference_id: userId,
          redirect_uri: `${process.env.NEXTAUTH_URL}/verify/callback`,
        },
        relationships: {
          account: {
            data: {
              type: "account",
              id: userId,
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Persona API error: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    sessionId: data.data.id,
    sessionUrl: data.data.attributes.inquiry_url,
    provider: "persona",
  };
}

/**
 * Yoti integration
 */
async function createYotiSession(
  userId: string,
  email: string
): Promise<VerificationSession> {
  const apiKey = process.env.YOTI_CLIENT_SDK_ID;
  const scenarioId = process.env.YOTI_SCENARIO_ID;

  if (!apiKey || !scenarioId) {
    throw new Error("Yoti API credentials not configured");
  }

  // Yoti Digital Identity implementation
  // Note: Requires Yoti SDK for proper signature generation
  const response = await fetch(`https://api.yoti.com/idverify/v1/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Yoti-Auth-Key": apiKey,
    },
    body: JSON.stringify({
      client_session_token_ttl: 3600,
      resources_ttl: 86400,
      user_tracking_id: userId,
      notifications: {
        endpoint: `${process.env.NEXTAUTH_URL}/api/verify/webhook`,
        topics: ["SESSION_COMPLETION"],
      },
      requested_checks: [
        {
          type: "ID_DOCUMENT_AUTHENTICITY",
        },
        {
          type: "ID_DOCUMENT_FACE_MATCH",
        },
      ],
      requested_tasks: [
        {
          type: "ID_DOCUMENT_TEXT_DATA_EXTRACTION",
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Yoti API error: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    sessionId: data.session_id,
    sessionUrl: data.client_session_token_url,
    provider: "yoti",
  };
}

/**
 * Verify webhook signature from provider
 */
export async function verifyWebhookSignature(
  provider: VerificationProvider,
  payload: string,
  signature: string
): Promise<boolean> {
  switch (provider) {
    case "veriff":
      return verifyVeriffSignature(payload, signature);
    case "persona":
      return verifyPersonaSignature(payload, signature);
    case "yoti":
      return verifyYotiSignature(payload, signature);
    default:
      return false;
  }
}

async function verifyVeriffSignature(
  payload: string,
  signature: string
): Promise<boolean> {
  const secret = process.env.VERIFF_API_SECRET;
  if (!secret) return false;

  const crypto = await import("crypto");
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest("hex");

  return signature.toLowerCase() === expectedSignature.toLowerCase();
}

async function verifyPersonaSignature(
  payload: string,
  signature: string
): Promise<boolean> {
  const secret = process.env.PERSONA_WEBHOOK_SECRET;
  if (!secret) return false;

  const crypto = await import("crypto");
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest("hex");

  return signature === expectedSignature;
}

async function verifyYotiSignature(
  payload: string,
  signature: string
): Promise<boolean> {
  // Yoti uses RSA signature verification
  // This is a simplified example - use Yoti SDK in production
  const publicKey = process.env.YOTI_PUBLIC_KEY;
  if (!publicKey) return false;

  // Implement RSA signature verification
  // Return true for now (implement with Yoti SDK)
  return true;
}
