/**
 * POST /api/verify/start
 * Initiates age verification session with third-party provider
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createVerificationSession } from "@/lib/verification";

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(
  identifier: string,
  maxAttempts = 5,
  windowMs = 3600000
): boolean {
  const now = Date.now();
  const attempts = rateLimitMap.get(identifier) || [];

  // Remove attempts outside the time window
  const recentAttempts = attempts.filter((time) => now - time < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    return false;
  }

  recentAttempts.push(now);
  rateLimitMap.set(identifier, recentAttempts);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting by IP
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    if (!checkRateLimit(ip, 5, 3600000)) {
      return NextResponse.json(
        { error: "Too many verification attempts. Please try again later." },
        { status: 429 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already verified
    if (user.isVerified) {
      return NextResponse.json(
        {
          error: "User already verified",
          isVerified: true,
        },
        { status: 400 }
      );
    }

    // Create verification session with provider
    const verificationSession = await createVerificationSession(
      user.id,
      user.email
    );

    // Log verification start
    await prisma.verificationLog.create({
      data: {
        userId: user.id,
        provider: verificationSession.provider,
        event: "started",
        status: "PENDING",
        payload: {
          sessionId: verificationSession.sessionId,
        },
        ipAddress: ip,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    // Update user verification status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verification: {
          provider: verificationSession.provider,
          providerId: verificationSession.sessionId,
          status: "pending",
          startedAt: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      sessionUrl: verificationSession.sessionUrl,
      sessionId: verificationSession.sessionId,
      provider: verificationSession.provider,
    });
  } catch (error) {
    console.error("Verification start error:", error);
    return NextResponse.json(
      { error: "Failed to start verification process" },
      { status: 500 }
    );
  }
}
