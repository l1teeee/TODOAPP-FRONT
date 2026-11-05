import { Suspense } from "react";
import { Skeleton } from "@/shared/ui/skeleton";
import { DashboardView } from "../_components/dashboard-view";

function DashboardFallback() {
  return (
    <div className="space-y-6 p-6" aria-busy="true">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-16 w-64" />
      <Skeleton className="h-44 w-full rounded-card" />
    </div>
  );
}

export default function InboxPage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardView view="inbox" />
    </Suspense>
  );
}
