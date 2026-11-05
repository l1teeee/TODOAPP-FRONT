import { Suspense, type ReactNode } from "react";
import { Skeleton } from "@/shared/ui/skeleton";
import { AppRail } from "./_components/app-rail";
import { AppSidebar } from "./_components/app-sidebar";
import { DetailPanel } from "./_components/detail-panel";
import { MobileNav } from "./_components/mobile-nav";

function SidebarFallback() {
  return (
    <div className="hidden lg:flex lg:h-full lg:w-[220px] lg:shrink-0 lg:flex-col lg:gap-4 lg:border-r lg:border-line lg:bg-surface lg:p-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

function DetailFallback() {
  return (
    <div className="hidden xl:flex xl:h-full xl:w-[320px] xl:shrink-0 xl:flex-col xl:gap-4 xl:border-l xl:border-line xl:bg-surface xl:p-5">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-44 w-full rounded-card" />
      <Skeleton className="h-32 w-full rounded-card" />
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-canvas lg:grid lg:grid-cols-[72px_220px_minmax(0,1fr)] xl:grid-cols-[72px_220px_minmax(0,1fr)_320px]">
      <Suspense fallback={<div className="h-14 border-b border-line bg-surface lg:hidden" />}>
        <MobileNav />
      </Suspense>

      <div className="hidden lg:block lg:h-full">
        <AppRail />
      </div>

      <div className="hidden lg:block lg:h-full">
        <Suspense fallback={<SidebarFallback />}>
          <AppSidebar />
        </Suspense>
      </div>

      <main className="min-w-0 flex-1 overflow-y-auto bg-canvas">
        {children}
      </main>

      <Suspense fallback={<DetailFallback />}>
        <DetailPanel />
      </Suspense>
    </div>
  );
}
