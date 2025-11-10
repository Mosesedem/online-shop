/**
 * GET /api/assets/signed
 * Returns signed S3 URLs for protected product images
 * Only accessible to verified users
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// AWS SDK v3 for S3 signed URLs
async function getSignedUrl(key: string): Promise<string> {
  const region = process.env.AWS_REGION || "us-east-1";
  const bucket = process.env.S3_BUCKET;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!bucket || !accessKeyId || !secretAccessKey) {
    throw new Error("S3 credentials not configured");
  }

  // Using presigned URL generation
  // In production, use @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner
  const { S3Client, GetObjectCommand } = await import("@aws-sdk/client-s3");
  const { getSignedUrl: getPresignedUrl } = await import(
    "@aws-sdk/s3-request-presigner"
  );

  const client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  // URL expires in 1 hour
  const signedUrl = await getPresignedUrl(client, command, { expiresIn: 3600 });
  return signedUrl;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user and check verification
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isVerified: true },
    });

    if (!user?.isVerified) {
      return NextResponse.json(
        { error: "Age verification required" },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Missing image key" }, { status: 400 });
    }

    // Generate signed URL
    const signedUrl = await getSignedUrl(key);

    return NextResponse.json({
      url: signedUrl,
      expiresIn: 3600,
    });
  } catch (error) {
    console.error("Signed URL generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate signed URL" },
      { status: 500 }
    );
  }
}
