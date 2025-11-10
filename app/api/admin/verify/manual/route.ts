/**
 * POST /api/admin/verify/manual
 * Manual approval/rejection of age verification
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check admin authorization
    // TODO: Add proper admin role check
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, action, reason } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const isApproved = action === "approve";

    // Update user verification
    await prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: isApproved,
        verification: {
          status: isApproved ? "approved" : "rejected",
          verifiedAt: isApproved ? new Date().toISOString() : null,
          manualReview: true,
          reviewedBy: session.user.email,
          reviewReason: reason || null,
        },
      },
    });

    // Log manual verification action
    await prisma.verificationLog.create({
      data: {
        userId: userId,
        provider: "manual",
        event: action,
        status: isApproved ? "APPROVED" : "REJECTED",
        payload: {
          reviewedBy: session.user.email,
          reason: reason || null,
          timestamp: new Date().toISOString(),
        },
      },
    });

    // TODO: Send notification email to user

    return NextResponse.json({
      success: true,
      action,
    });
  } catch (error) {
    console.error("Manual verification error:", error);
    return NextResponse.json(
      { error: "Failed to process manual verification" },
      { status: 500 }
    );
  }
}
