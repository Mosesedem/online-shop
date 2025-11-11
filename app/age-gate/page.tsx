/**
 * Age Gate Page
 * Simple age confirmation: Users must confirm they are 18+ before accessing the site
 */

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { buttonClass } from "@/lib/style-utils";

export default function AgeGatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/";
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (!accepted) return;

    // Set cookie to remember acceptance
    document.cookie =
      "age-gate-accepted=true; path=/; max-age=31536000; SameSite=Strict";

    // Redirect to intended destination
    router.push(returnTo);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card rounded-md shadow-lg p-8">
        <h1 className="font-heading text-2xl font-bold text-center text-card-foreground mb-6">
          Age Confirmation
        </h1>

        <p className="text-sm text-muted-foreground text-center mb-8">
          This website contains products intended for adults.
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
          onClick={handleAccept}
          disabled={!accepted}
          className={`${buttonClass("primary", "md")} w-full`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
