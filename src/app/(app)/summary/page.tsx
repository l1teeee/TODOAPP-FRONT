import { Suspense } from "react";
import { Skeleton } from "@/shared/ui/skeleton";
import { SummaryView } from "../_components/summary-view";

function SummaryFallback() {
  return (
    <div className="space-y-6 p-6" aria-busy="true">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-24 w-full rounded-card" />
      <Skeleton className="h-48 w-full rounded-card" />
    </div>
  );
}

export default function SummaryPage() {
  return (
    <Suspense fallback={<SummaryFallback />}>
      <SummaryView />
    </Suspense>
  );
}
