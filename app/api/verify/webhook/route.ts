/**
 * POST /api/verify/webhook
 * Handles verification status updates from third-party providers
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyWebhookSignature,
  type VerificationProvider,
} from "@/lib/verification";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature =
      request.headers.get("x-signature") ||
      request.headers.get("x-hmac-signature") ||
      request.headers.get("x-webhook-signature") ||
      "";

    const provider = (request.headers.get("x-provider") ||
      process.env.VERIFICATION_PROVIDER ||
      "veriff") as VerificationProvider;

    // Verify webhook signature
    const isValid = await verifyWebhookSignature(provider, payload, signature);

    if (!isValid) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const data = JSON.parse(payload);

    // Parse provider-specific payload
    const webhookData = parseProviderWebhook(provider, data);

    if (!webhookData) {
      console.error("Failed to parse webhook data");
      return NextResponse.json(
        { error: "Invalid webhook data" },
        { status: 400 }
      );
    }

    // Find user by provider session ID
    const user = await prisma.user.findFirst({
      where: {
        verification: {
          path: ["providerId"],
          equals: webhookData.sessionId,
        },
      },
    });

    if (!user) {
      console.error("User not found for session:", webhookData.sessionId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user verification status
    const isApproved = webhookData.status === "approved";
    const needsReview = webhookData.status === "review";

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: isApproved,
        verification: {
          provider: provider,
          providerId: webhookData.sessionId,
          status: webhookData.status,
          verifiedAt: isApproved ? new Date().toISOString() : null,
          riskScore: webhookData.riskScore,
          reason: webhookData.reason,
        },
      },
    });

    // Log verification event
    await prisma.verificationLog.create({
      data: {
        userId: user.id,
        provider: provider,
        event: webhookData.status,
        status: webhookData.status.toUpperCase() as any,
        payload: {
          sessionId: webhookData.sessionId,
          riskScore: webhookData.riskScore,
          reason: webhookData.reason,
        },
      },
    });

    // TODO: Send notification email to user
    // TODO: If needs review, notify admin

    return NextResponse.json({
      success: true,
      userId: user.id,
      status: webhookData.status,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

function parseProviderWebhook(provider: VerificationProvider, data: any) {
  switch (provider) {
    case "veriff":
      return {
        sessionId: data.verification?.id || data.id,
        status: mapVeriffStatus(data.verification?.status || data.status),
        riskScore: data.verification?.riskLabels?.length || 0,
        reason: data.verification?.reason,
      };

    case "persona":
      return {
        sessionId: data.data?.id,
        status: mapPersonaStatus(data.data?.attributes?.status),
        riskScore: data.data?.attributes?.risk_score,
        reason: data.data?.attributes?.failure_reasons?.[0],
      };

    case "yoti":
      return {
        sessionId: data.session_id,
        status: mapYotiStatus(data.state),
        riskScore: 0,
        reason: data.client_session_token,
      };

    default:
      return null;
  }
}

function mapVeriffStatus(status: string): "approved" | "rejected" | "review" {
  switch (status?.toLowerCase()) {
    case "approved":
    case "success":
      return "approved";
    case "declined":
    case "failed":
      return "rejected";
    case "resubmission_requested":
    case "review":
      return "review";
    default:
      return "review";
  }
}

function mapPersonaStatus(status: string): "approved" | "rejected" | "review" {
  switch (status?.toLowerCase()) {
    case "completed":
    case "approved":
      return "approved";
    case "declined":
    case "failed":
      return "rejected";
    case "needs_review":
    case "pending":
      return "review";
    default:
      return "review";
  }
}

function mapYotiStatus(state: string): "approved" | "rejected" | "review" {
  switch (state?.toLowerCase()) {
    case "completed":
      return "approved";
    case "failed":
      return "rejected";
    default:
      return "review";
  }
}
