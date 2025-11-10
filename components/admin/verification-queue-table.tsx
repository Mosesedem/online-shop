/**
 * Verification Queue Table Component
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/lib/style-utils";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface Verification {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  isVerified: boolean;
  verification: any;
  verificationLogs: any[];
}

interface Props {
  verifications: Verification[];
}

export function VerificationQueueTable({ verifications }: Props) {
  const router = useRouter();
  const [processing, setProcessing] = useState<string | null>(null);

  const handleApprove = async (userId: string) => {
    if (!confirm("Approve this user's age verification?")) return;

    setProcessing(userId);

    try {
      const response = await fetch("/api/admin/verify/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action: "approve" }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to approve verification");
      }
    } catch (error) {
      alert("Error approving verification");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (userId: string) => {
    const reason = prompt("Reason for rejection:");
    if (!reason) return;

    setProcessing(userId);

    try {
      const response = await fetch("/api/admin/verify/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action: "reject", reason }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to reject verification");
      }
    } catch (error) {
      alert("Error rejecting verification");
    } finally {
      setProcessing(null);
    }
  };

  if (verifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No pending verifications</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold text-sm">User</th>
            <th className="text-left py-3 px-4 font-semibold text-sm">
              Status
            </th>
            <th className="text-left py-3 px-4 font-semibold text-sm">
              Provider
            </th>
            <th className="text-left py-3 px-4 font-semibold text-sm">
              Submitted
            </th>
            <th className="text-right py-3 px-4 font-semibold text-sm">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {verifications.map((verification) => (
            <tr
              key={verification.id}
              className="border-b border-border hover:bg-muted/5"
            >
              <td className="py-3 px-4">
                <div>
                  <div className="font-medium text-sm">
                    {verification.name || "Unknown"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {verification.email}
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <Badge
                  variant={
                    verification.verification?.status === "review"
                      ? "info"
                      : "muted"
                  }
                >
                  {verification.verification?.status || "pending"}
                </Badge>
              </td>
              <td className="py-3 px-4 text-sm">
                {verification.verification?.provider || "—"}
              </td>
              <td className="py-3 px-4 text-sm text-muted-foreground">
                {new Date(verification.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleApprove(verification.id)}
                    disabled={processing === verification.id}
                    className={buttonClass("primary", "sm")}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(verification.id)}
                    disabled={processing === verification.id}
                    className={buttonClass("destructive", "sm")}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
