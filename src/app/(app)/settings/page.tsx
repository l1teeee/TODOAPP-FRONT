import { Suspense } from "react";
import { Skeleton } from "@/shared/ui/skeleton";
import { SettingsView } from "../_components/settings-view";

function SettingsFallback() {
  return (
    <div className="space-y-6 p-6" aria-busy="true">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-56 w-full rounded-card" />
      <Skeleton className="h-28 w-full rounded-card" />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsFallback />}>
      <SettingsView />
    </Suspense>
  );
}
