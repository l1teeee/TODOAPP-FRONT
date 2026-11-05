import { Suspense } from "react";
import { Skeleton } from "@/shared/ui/skeleton";
import { DashboardView } from "../_components/dashboard-view";

function DashboardFallback() {
  return (
    <div className="space-y-6 p-6" aria-busy="true">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-16 w-64" />
      <Skeleton className="h-40 w-full rounded-card" />
      <Skeleton className="h-44 w-full rounded-card" />
    </div>
  );
}

// The content depends on the browser auth session, so instant-navigation validation does not apply.
export const instant = false;

export default function TomorrowPage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardView view="tomorrow" />
    </Suspense>
  );
}
