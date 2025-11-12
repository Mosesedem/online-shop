"use client";

import { use } from "react"; // React 19+ hook for unwrapping Promises
import { useState } from "react";
import { useRouter } from "next/navigation";
import { buttonClass } from "@/lib/style-utils";

interface ClientProps {
  searchParams: Promise<{ returnTo?: string }>;
}

export default function AgeGateClient({ searchParams }: ClientProps) {
  // Unwrap the Promise client-side (only after hydration)
  const resolvedParams = use(searchParams);
  const router = useRouter();
  const returnTo = resolvedParams.returnTo || "/";
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (!accepted) return;

    // Set cookie to remember acceptance (client-only)
    document.cookie =
      "age-gate-accepted=true; path=/; max-age=31536000; SameSite=Strict";
    window.location.href = returnTo;
    // Redirect to intended destination
    // router.push("/");
  };

  return (
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
  );
}
