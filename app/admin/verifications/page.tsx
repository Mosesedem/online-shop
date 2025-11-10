/**
 * Admin Verification Queue Page
 * Manual review interface for flagged verifications
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VerificationQueueTable } from "@/components/admin/verification-queue-table";

export default async function AdminVerificationsPage() {
  const session = await getServerSession(authOptions);

  // Check admin authorization
  // TODO: Add admin role check
  if (!session?.user) {
    redirect("/auth/login");
  }

  // Fetch users requiring manual review
  const pendingVerifications = await prisma.user.findMany({
    where: {
      OR: [
        {
          verification: {
            path: ["status"],
            equals: "review",
          },
        },
        {
          isVerified: false,
          verification: {
            path: ["status"],
            equals: "pending",
          },
        },
      ],
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      isVerified: true,
      verification: true,
      verificationLogs: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
          Verification Queue
        </h1>
        <p className="text-muted-foreground">
          Review and manually approve or reject user age verifications
        </p>
      </div>

      <div className="bg-card rounded-md shadow p-6">
        <VerificationQueueTable verifications={pendingVerifications} />
      </div>
    </div>
  );
}
