"use client";

import { usePathname } from "next/navigation";
import {
  Suspense,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
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
import { DetailPanelToggle } from "./_components/detail-panel-toggle";
import { MobileNav } from "./_components/mobile-nav";
import { SidebarToggle } from "./_components/sidebar-toggle";
import { useDetailPanelState } from "./_components/use-detail-panel-state";
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

interface CollapsiblePanelOptions {
  collapsed: boolean;
  hydrated: boolean;
  wrapRef: RefObject<HTMLDivElement | null>;
  panelRef?: RefObject<HTMLDivElement | null>;
  width: number;
  /** Wrapper width when collapsed (0 hides the column). */
  collapsedWidth?: number;
  /** Horizontal offset (px) the inner panel travels while collapsing. */
  offset: number;
  /** Descendants that stagger in when the panel expands. */
  itemSelector?: string;
}

// Tweens the wrapper width (the only layout tween) and the inner panel's
// transform and opacity. The stored state is applied without animation on
// the first run after hydration.
function useCollapsiblePanel({
  collapsed,
  hydrated,
  wrapRef,
  panelRef,
  width,
  collapsedWidth = 0,
  offset,
  itemSelector,
}: CollapsiblePanelOptions): void {
  const previousCollapsed = useRef<boolean | null>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const panel = panelRef?.current ?? null;
      if (!hydrated || !wrap) return;

      const changed =
        previousCollapsed.current !== null &&
        previousCollapsed.current !== collapsed;
      previousCollapsed.current = collapsed;

      const applyFinalState = () => {
        if (collapsed) {
          gsap.set(wrap, { width: collapsedWidth });
          if (panel) gsap.set(panel, { autoAlpha: 0, x: offset });
        } else {
          gsap.set(wrap, { clearProps: "width" });
          if (panel) gsap.set(panel, { clearProps: "all" });
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
            width: collapsedWidth,
            duration: 0.45,
            ease: EASE.inOut,
            overwrite: "auto",
          });
          if (panel) {
            gsap.to(panel, {
              autoAlpha: 0,
              x: offset,
              duration: 0.2,
              ease: EASE.out,
              overwrite: "auto",
            });
          }
          return;
        }
        gsap.fromTo(
          wrap,
          { width: collapsedWidth },
          {
            width,
            duration: 0.45,
            ease: EASE.inOut,
            overwrite: "auto",
            clearProps: "width",
          },
        );
        if (panel) {
          gsap.fromTo(
            panel,
            { autoAlpha: 0, x: offset },
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
        }
        if (panel && itemSelector) {
          gsap.from(panel.querySelectorAll(itemSelector), {
            autoAlpha: 0,
            y: 6,
            duration: DURATION.base,
            stagger: 0.03,
            delay: 0.25,
            ease: EASE.out,
            overwrite: "auto",
            clearProps: "all",
          });
        }
      });
      mm.add("(prefers-reduced-motion: reduce)", applyFinalState);
    },
    { dependencies: [collapsed, hydrated] },
  );
}

function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const sidebar = useSidebarState();
  const detailPanel = useDetailPanelState();
  const sidebarWrapRef = useRef<HTMLDivElement>(null);
  const sidebarPanelRef = useRef<HTMLDivElement>(null);
  const detailWrapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);

  // Animates only the wrapper this layout renders; the page content inside
  // Suspense hydrates later and must not be touched from here.
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
      });
      return () => mm.revert();
    },
    { scope: viewRef, dependencies: [pathname] },
  );

  useCollapsiblePanel({
    collapsed: sidebar.state === "collapsed",
    hydrated: sidebar.hydrated,
    wrapRef: sidebarWrapRef,
    panelRef: sidebarPanelRef,
    width: 220,
    offset: -24,
    itemSelector: "li",
  });

  useCollapsiblePanel({
    collapsed: detailPanel.state === "closed",
    hydrated: detailPanel.hydrated,
    wrapRef: detailWrapRef,
    width: 320,
    collapsedWidth: 72,
    offset: 0,
  });

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-canvas lg:grid lg:grid-cols-[72px_auto_minmax(0,1fr)] xl:grid-cols-[72px_auto_minmax(0,1fr)_auto]">
      <ProfileTimezoneSync />
      <Suspense fallback={<div className="h-14 border-b border-line bg-surface lg:hidden" />}>
        <MobileNav />
      </Suspense>

      <div className="hidden lg:block lg:h-full">
        <AppRail />
      </div>

      <div
        ref={sidebarWrapRef}
        className="relative hidden lg:block lg:h-full lg:w-[220px] lg:shrink-0"
      >
        <div className="h-full overflow-hidden">
          <div ref={sidebarPanelRef} className="h-full w-[220px]">
            <Suspense fallback={<SidebarFallback />}>
              <AppSidebar />
            </Suspense>
          </div>
        </div>
        <SidebarToggle />
      </div>

      <main className="scroll-soft min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-canvas">
        <div
          key={pathname}
          ref={viewRef}
          data-motion="pending"
          className="min-w-0 [contain:layout_paint]"
        >
          {children}
        </div>
      </main>

      <div
        ref={detailWrapRef}
        className="relative xl:h-full xl:w-[320px] xl:shrink-0"
      >
        <div className="h-full overflow-hidden">
          <div className="xl:h-full xl:w-[320px]">
            <Suspense fallback={<DetailFallback />}>
              <DetailPanel />
            </Suspense>
          </div>
        </div>
        <DetailPanelToggle />
      </div>
    </div>
  );
}

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
