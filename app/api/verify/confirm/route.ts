/**
 * API Route: /api/verify/confirm
 * Simple age confirmation (checkbox acceptance)
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update user verification status
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        isVerified: true,
        verification: {
          status: "approved",
          verifiedAt: new Date().toISOString(),
          method: "checkbox-confirmation",
        },
      },
    });

    return NextResponse.json({
      success: true,
      isVerified: user.isVerified,
    });
  } catch (error) {
    console.error("Verification confirm error:", error);
    return NextResponse.json(
      { error: "Failed to confirm age verification" },
      { status: 500 }
    );
  }
}
