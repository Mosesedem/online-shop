/**
 * VerificationStatusBanner Component
 * Shows current user verification status and next steps
 */

"use client";

import Link from "next/link";
import { Badge } from "./ui/badge";
import { buttonClass } from "@/lib/style-utils";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";

type VerificationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "review"
  | "expired"
  | null;

interface VerificationStatusBannerProps {
  status: VerificationStatus;
  verifiedAt?: string;
  className?: string;
}

export function VerificationStatusBanner({
  status,
  verifiedAt,
  className = "",
}: VerificationStatusBannerProps) {
  if (!status || status === "approved") return null;

  const statusConfig = {
    pending: {
      icon: Clock,
      badge: "info" as const,
      title: "Verification In Progress",
      message:
        "Your age verification is being processed. This usually takes a few minutes.",
      action: null,
    },
    review: {
      icon: AlertCircle,
      badge: "info" as const,
      title: "Manual Review Required",
      message:
        "Our team is reviewing your verification. You'll be notified within 24 hours.",
      action: null,
    },
    rejected: {
      icon: XCircle,
      badge: "danger" as const,
      title: "Verification Not Approved",
      message:
        "Unfortunately, we couldn't verify your age. Please try again or contact support.",
      action: { label: "Try Again", href: "/verify" },
    },
    expired: {
      icon: AlertCircle,
      badge: "danger" as const,
      title: "Verification Expired",
      message:
        "Your verification session has expired. Please restart the process.",
      action: { label: "Restart Verification", href: "/verify" },
    },
  };

  const config = statusConfig[status];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div
      className={`border-l-4 border-${
        config.badge === "danger" ? "destructive" : "accent-600"
      } bg-card p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={`h-5 w-5 mt-0.5 ${
            config.badge === "danger" ? "text-destructive" : "text-accent-600"
          }`}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-heading font-semibold text-card-foreground">
              {config.title}
            </h3>
            <Badge variant={config.badge}>{status.toUpperCase()}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{config.message}</p>
          {config.action && (
            <Link
              href={config.action.href}
              className={buttonClass("primary", "sm")}
            >
              {config.action.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
