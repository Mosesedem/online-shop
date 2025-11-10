/**
 * Verification Page
 * Age verification wizard with provider integration
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { buttonClass } from "@/lib/style-utils";
import { Badge } from "@/components/ui/badge";
import { VerificationStatusBanner } from "@/components/verification-status-banner";
import { Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

type VerificationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "review"
  | "expired"
  | null;

interface VerificationData {
  isVerified: boolean;
  verification: any;
  logs: any[];
}

export default function VerificationPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/shop";

  const [status, setStatus] = useState<VerificationStatus>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [verificationData, setVerificationData] =
    useState<VerificationData | null>(null);

  // Fetch current verification status
  useEffect(() => {
    if (session?.user) {
      fetchStatus();
    }
  }, [session]);

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/verify/status");
      const data = await response.json();

      setVerificationData(data);
      setStatus(data.verification?.status || null);

      // If already verified, redirect
      if (data.isVerified) {
        router.push(returnTo);
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch status:", error);
      setLoading(false);
    }
  };

  const startVerification = async () => {
    setStarting(true);

    try {
      const response = await fetch("/api/verify/start", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success && data.sessionUrl) {
        // Redirect to provider's verification flow
        window.location.href = data.sessionUrl;
      } else {
        alert(data.error || "Failed to start verification");
        setStarting(false);
      }
    } catch (error) {
      console.error("Failed to start verification:", error);
      alert("Failed to start verification. Please try again.");
      setStarting(false);
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
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent-600 mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            Age Verification
          </h1>
          <p className="text-muted-foreground">
            Verify your age to access our full product catalog and complete
            purchases
          </p>
        </div>

        {/* Status Banner */}
        {status && (
          <VerificationStatusBanner
            status={status}
            verifiedAt={verificationData?.verification?.verifiedAt}
            className="mb-6"
          />
        )}

        {/* Main Card */}
        <div className="bg-card rounded-md shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-xl font-semibold text-card-foreground mb-4">
                How It Works
              </h2>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-accent-600 text-white text-xs font-semibold">
                    1
                  </span>
                  <span>
                    Click "Start Verification" to begin the secure process
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-accent-600 text-white text-xs font-semibold">
                    2
                  </span>
                  <span>
                    You'll be redirected to our trusted verification partner
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-accent-600 text-white text-xs font-semibold">
                    3
                  </span>
                  <span>
                    Upload a photo of your government-issued ID and take a
                    selfie
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-accent-600 text-white text-xs font-semibold">
                    4
                  </span>
                  <span>Verification typically completes in 1-2 minutes</span>
                </li>
              </ol>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-semibold text-card-foreground mb-3">
                Privacy & Security
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-600 flex-shrink-0 mt-0.5" />
                  <span>Your data is encrypted end-to-end</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-600 flex-shrink-0 mt-0.5" />
                  <span>ID images are not stored on our servers</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-600 flex-shrink-0 mt-0.5" />
                  <span>Only age verification result is retained</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-600 flex-shrink-0 mt-0.5" />
                  <span>Compliant with GDPR and CCPA regulations</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                onClick={startVerification}
                disabled={starting || status === "pending"}
                className={`${buttonClass("primary", "lg")} w-full`}
              >
                {starting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : status === "pending" ? (
                  "Verification In Progress"
                ) : (
                  "Start Verification"
                )}
              </button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                By continuing, you agree to share your verification data with
                our trusted partner.
              </p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Having trouble?{" "}
            <a href="/support" className="text-accent-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
