/**
 * Age Gate Page
 * Legal requirement: Users must confirm they are 18+ before accessing the site
 */

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { buttonClass } from "@/lib/style-utils";
import { Shield } from "lucide-react";

export default function AgeGatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/";
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    // Set cookie to remember acceptance
    document.cookie =
      "age-gate-accepted=true; path=/; max-age=31536000; SameSite=Strict";

    // Redirect to intended destination
    router.push(returnTo);
  };

  const handleDecline = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <div className="min-h-screen bg-bg-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-surface rounded-md p-8 shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-accent-600 flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>

        <h1 className="font-heading text-2xl font-bold text-center text-bg-900 mb-4">
          Age Verification Required
        </h1>

        <div className="space-y-4 text-sm text-text-muted mb-6">
          <p>
            This website contains adult wellness products and content intended
            for mature audiences.
          </p>

          <p>
            <strong>By entering, you confirm that:</strong>
          </p>

          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>You are at least 18 years old</li>
            <li>
              You are legally allowed to view adult content in your jurisdiction
            </li>
            <li>You will not share this content with minors</li>
            <li>You agree to our Terms of Service and Privacy Policy</li>
          </ul>

          <p className="text-xs text-center pt-2">
            We verify age using a trusted third-party provider. We do not retain
            ID images beyond 30 days.{" "}
            <a href="/privacy" className="text-accent-600 hover:underline">
              See our Privacy Policy
            </a>
          </p>
        </div>

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
            className="text-sm text-bg-900 cursor-pointer"
          >
            I confirm I am 18 years of age or older
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDecline}
            className={`${buttonClass("secondary", "md")} flex-1`}
          >
            I am under 18
          </button>
          <button
            onClick={handleAccept}
            disabled={!accepted}
            className={`${buttonClass("primary", "md")} flex-1`}
          >
            Enter Site
          </button>
        </div>
      </div>
    </div>
  );
}
