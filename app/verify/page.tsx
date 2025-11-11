/**
 * Verification Page
 * Simple age confirmation checkbox
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { buttonClass } from "@/lib/style-utils";
import { Shield, Loader2 } from "lucide-react";

export default function VerificationPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/shop";

  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Check if already verified
  useEffect(() => {
    if (session?.user) {
      checkVerificationStatus();
    }
  }, [session]);

  const checkVerificationStatus = async () => {
    try {
      const response = await fetch("/api/verify/status");
      const data = await response.json();

      // If already verified, redirect
      if (data.isVerified) {
        router.push(returnTo);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch status:", error);
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!accepted) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/verify/confirm", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        // Force session update to refresh verification status
        window.location.href = returnTo;
      } else {
        alert(data.error || "Failed to confirm age");
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Failed to confirm age:", error);
      alert("Failed to confirm age. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-accent-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card rounded-md shadow-lg p-8">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-accent-600 flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>

        <h1 className="font-heading text-2xl font-bold text-center text-card-foreground mb-4">
          Age Verification Required
        </h1>

        <div className="space-y-4 text-sm text-muted-foreground mb-6">
          <p>
            This website contains products and content intended for mature
            audiences.
          </p>

          <p>
            <strong>By entering, you confirm that:</strong>
          </p>

          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>You are at least 18 years old</li>
            <li>
              You are legally allowed to view this content in your jurisdiction
            </li>
            <li>You agree to our Terms of Service and Privacy Policy</li>
          </ul>
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="checkbox"
            id="age-confirm"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="h-4 w-4 rounded border-border text-accent-600 focus:ring-accent-600"
          />
          <label
            htmlFor="age-confirm"
            className="text-sm text-card-foreground cursor-pointer"
          >
            I confirm I am 18 years of age or older
          </label>
        </div>

        {/* Button */}
        <button
          onClick={handleConfirm}
          disabled={!accepted || submitting}
          className={`${buttonClass("primary", "lg")} w-full`}
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Confirming...
            </>
          ) : (
            "Enter Site"
          )}
        </button>
      </div>
    </div>
  );
}
