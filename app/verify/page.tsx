/**
 * Verification Page
 * Simple age confirmation checkbox for authenticated users
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { buttonClass } from "@/lib/style-utils";
import { Loader2 } from "lucide-react";

export default function VerificationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/shop";

  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check authentication and verification status
  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        console.log("Fetching verification status...");
        const response = await fetch("/api/verify/status");

        if (!response.ok) {
          console.error("Failed to fetch status:", response.status);
          setError(`Failed to check verification status: ${response.status}`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log("Verification status:", data);

        // If already verified, redirect
        if (data.isVerified) {
          console.log("Already verified, redirecting to:", returnTo);
          router.push(returnTo);
        } else {
          console.log("Not verified, showing form");
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch status:", error);
        setError("Failed to check verification status. Please try again.");
        setLoading(false);
      }
    };

    console.log("Session status:", status);
    console.log("Session data:", session);

    if (status === "loading") {
      console.log("Session still loading...");
      return;
    }

    if (status === "unauthenticated") {
      console.log("User not authenticated, redirecting to login");
      // Redirect to login if not authenticated
      router.push(
        `/auth/login?returnTo=${encodeURIComponent(
          `/verify?returnTo=${returnTo}`
        )}`
      );
      return;
    }

    if (status === "authenticated" && session?.user) {
      console.log("User authenticated, checking verification status");
      checkVerificationStatus();
    } else {
      console.log("Unexpected state:", { status, session });
      setError("Unexpected authentication state");
      setLoading(false);
    }
  }, [session, status, router, returnTo]);

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
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-accent-600 animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-card rounded-md shadow-lg p-8">
          <h1 className="font-heading text-xl font-bold text-center text-red-600 mb-4">
            Error
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className={`${buttonClass("primary", "md")} w-full`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card rounded-md shadow-lg p-8">
        <h1 className="font-heading text-2xl font-bold text-center text-card-foreground mb-6">
          Age Confirmation
        </h1>

        <p className="text-sm text-muted-foreground text-center mb-8">
          To access shopping features, please confirm your age.
        </p>

        <div className="flex items-start gap-3 mb-8 p-4 bg-accent-50 dark:bg-accent-950 rounded-md">
          <input
            type="checkbox"
            id="age-confirm"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border text-accent-600 focus:ring-accent-600 cursor-pointer"
          />
          <label
            htmlFor="age-confirm"
            className="text-sm text-card-foreground cursor-pointer flex-1"
          >
            I confirm that I am above 18 years of age
          </label>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!accepted || submitting}
          className={`${buttonClass("primary", "md")} w-full`}
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Confirming...
            </>
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </div>
  );
}
