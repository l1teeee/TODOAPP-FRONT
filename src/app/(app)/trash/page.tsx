import { Suspense } from "react";
import { Skeleton } from "@/shared/ui/skeleton";
import { TrashView } from "../_components/trash-view";

function TrashFallback() {
  return (
    <div className="space-y-4 p-6" aria-busy="true">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-14 w-full rounded-card" />
      <Skeleton className="h-14 w-full rounded-card" />
    </div>
  );
}

export default function TrashPage() {
  return (
    <Suspense fallback={<TrashFallback />}>
      <TrashView />
    </Suspense>
  );
}
