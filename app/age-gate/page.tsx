import { Suspense } from "react";
import AgeGateClient from "./AgeGateClient";

interface PageProps {
  searchParams: Promise<{ returnTo?: string }>;
}

export default async function AgeGatePage({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Suspense
        fallback={<div className="text-center">Confirming access...</div>}
      >
        <AgeGateClient searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
