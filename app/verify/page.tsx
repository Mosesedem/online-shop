import { Suspense } from "react";
import VerificationClient from "./VerificationClient";
import { Loader2 } from "lucide-react"; // Import for fallback (optional)

interface PageProps {
  searchParams: Promise<{ returnTo?: string }>;
}

export default async function VerificationPage({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Suspense
        fallback={
          <div className="text-center">
            <Loader2 className="h-8 w-8 text-accent-600 animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        }
      >
        <VerificationClient searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
