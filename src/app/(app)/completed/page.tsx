import { Suspense } from "react";
import { Skeleton } from "@/shared/ui/skeleton";
import { CompletedView } from "../_components/completed-view";

function CompletedFallback() {
  return (
    <div className="space-y-4 p-6" aria-busy="true">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-14 w-full rounded-card" />
      <Skeleton className="h-14 w-full rounded-card" />
    </div>
  );
}

// The content depends on the browser auth session, so instant-navigation validation does not apply.
export const instant = false;

export default function CompletedPage() {
  return (
    <Suspense fallback={<CompletedFallback />}>
      <CompletedView />
    </Suspense>
  );
}
