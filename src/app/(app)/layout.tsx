"use client";

import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, type ReactNode } from "react";
import { useProfile, useUpdateProfile } from "@/features/profile/api/use-profile";
import {
  gsap,
  markWillChange,
  NO_REDUCED_MOTION,
  useGSAP,
} from "@/shared/motion/gsap";
import { DURATION, EASE } from "@/shared/motion/motion-tokens";
import { Skeleton } from "@/shared/ui/skeleton";
import { RequireSession } from "@/shared/auth/auth-guard";
import { AppRail } from "./_components/app-rail";
import { AppSidebar } from "./_components/app-sidebar";
import { DetailPanel } from "./_components/detail-panel";
import { MobileNav } from "./_components/mobile-nav";
import { useSidebarState } from "./_components/use-sidebar-state";

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

const SIDEBAR_WIDTH = 220;

function ProfileTimezoneSync() {
  const { data: profile } = useProfile();
  const { mutate: updateProfile, error } = useUpdateProfile();
  const syncedProfileId = useRef<string | null>(null);

  useEffect(() => {
    if (!profile || syncedProfileId.current === profile.id) return;
    syncedProfileId.current = profile.id;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone !== profile.timezone) {
      updateProfile({ timezone });
    }
  }, [profile, updateProfile]);

  if (error) throw error;
  return null;
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <RequireSession
      fallback={
        <div className="flex h-dvh w-full bg-canvas" aria-busy="true">
          <SidebarFallback />
          <div className="flex-1 space-y-4 p-6">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-44 w-full rounded-card" />
            <Skeleton className="h-32 w-full rounded-card" />
          </div>
          <DetailFallback />
        </div>
      }
    >
      <AppShell>{children}</AppShell>
    </RequireSession>
  );
}

function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { state, hydrated } = useSidebarState();
  const sidebarWrapRef = useRef<HTMLDivElement>(null);
  const sidebarPanelRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const previousSidebarState = useRef<string | null>(null);

  useGSAP(
    () => {
      const view = viewRef.current;
      if (!view) return;

      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        gsap.fromTo(
          view,
          { autoAlpha: 0, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            duration: DURATION.slow,
            ease: EASE.out,
            overwrite: "auto",
            onStart: markWillChange,
            clearProps: "all",
          },
        );
        view.dataset.motion = "done";
        gsap.from(view.firstElementChild?.children ?? [], {
          autoAlpha: 0,
          y: 10,
          duration: DURATION.base,
          ease: EASE.out,
          stagger: 0.03,
          overwrite: "auto",
          clearProps: "all",
        });
      });
      return () => mm.revert();
    },
    { scope: viewRef, dependencies: [pathname] },
  );

  useGSAP(
    () => {
      const wrap = sidebarWrapRef.current;
      const panel = sidebarPanelRef.current;
      if (!hydrated || !wrap || !panel) return;

      const collapsed = state === "collapsed";
      const changed =
        previousSidebarState.current !== null &&
        previousSidebarState.current !== state;
      previousSidebarState.current = state;

      const applyFinalState = () => {
        if (collapsed) {
          gsap.set(wrap, { width: 0 });
          gsap.set(panel, { autoAlpha: 0, x: -24 });
        } else {
          gsap.set(wrap, { clearProps: "width" });
          gsap.set(panel, { clearProps: "all" });
        }
      };

      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        if (!changed) {
          applyFinalState();
          return;
        }
        if (collapsed) {
          gsap.to(wrap, {
            width: 0,
            duration: 0.45,
            ease: EASE.inOut,
            overwrite: "auto",
          });
          gsap.to(panel, {
            autoAlpha: 0,
            x: -24,
            duration: 0.2,
            ease: EASE.out,
            overwrite: "auto",
          });
          return;
        }
        gsap.fromTo(
          wrap,
          { width: 0 },
          {
            width: SIDEBAR_WIDTH,
            duration: 0.45,
            ease: EASE.inOut,
            overwrite: "auto",
            clearProps: "width",
          },
        );
        gsap.fromTo(
          panel,
          { autoAlpha: 0, x: -24 },
          {
            autoAlpha: 1,
            x: 0,
            duration: DURATION.base,
            delay: 0.15,
            ease: EASE.out,
            overwrite: "auto",
            clearProps: "all",
          },
        );
        gsap.from(panel.querySelectorAll("li"), {
          autoAlpha: 0,
          y: 6,
          duration: DURATION.base,
          stagger: 0.03,
          delay: 0.25,
          ease: EASE.out,
          overwrite: "auto",
          clearProps: "all",
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", applyFinalState);
    },
    { dependencies: [state, hydrated] },
  );

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-canvas lg:grid lg:grid-cols-[72px_auto_minmax(0,1fr)] xl:grid-cols-[72px_auto_minmax(0,1fr)_320px]">
      <ProfileTimezoneSync />
      <Suspense fallback={<div className="h-14 border-b border-line bg-surface lg:hidden" />}>
        <MobileNav />
      </Suspense>

      <div className="hidden lg:block lg:h-full">
        <AppRail />
      </div>

      <div
        ref={sidebarWrapRef}
        className="hidden lg:block lg:h-full lg:w-[220px] lg:overflow-hidden"
      >
        <div ref={sidebarPanelRef} className="h-full w-[220px]">
          <Suspense fallback={<SidebarFallback />}>
            <AppSidebar />
          </Suspense>
        </div>
      </div>

      <main className="min-w-0 flex-1 overflow-y-auto bg-canvas">
        <div
          key={pathname}
          ref={viewRef}
          data-motion="pending"
          className="[contain:layout_paint]"
        >
          {children}
        </div>
      </main>

      <Suspense fallback={<DetailFallback />}>
        <DetailPanel />
      </Suspense>
    </div>
  );
}
