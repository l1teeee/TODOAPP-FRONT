"use client";

import { FileText } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import {
  useActivities,
  useActivity,
  useUpdateActivity,
} from "@/features/activities/api/use-activities";
import { ActivityDetailCard } from "@/features/activities/components/activity-detail-card";
import type { Activity, ActivityView } from "@/features/activities/model/activity";
import { useSignOut } from "@/features/auth/api/use-auth";
import { useLists } from "@/features/lists/api/use-lists";
import { ListLabel } from "@/features/lists/components/list-label";
import { UserMenu } from "@/features/profile/components/user-menu";
import { SubtaskChecklist } from "@/features/subtasks/components/subtask-checklist";
import { useTags } from "@/features/tags/api/use-tags";
import { TagChip } from "@/features/tags/components/tag-chip";
import { useEnabledModules } from "@/shared/api/use-enabled-modules";
import { gsap, markWillChange, NO_REDUCED_MOTION, useGSAP } from "@/shared/motion/gsap";
import { DURATION, EASE } from "@/shared/motion/motion-tokens";
import { useShellEntrance } from "@/shared/motion/use-entrance";
import { ThemeToggle, ThemeToggleButton } from "@/shared/theme/theme-toggle";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { Sheet } from "@/shared/ui/sheet";
import { Skeleton } from "@/shared/ui/skeleton";
import { useDashboardParams } from "./use-dashboard-params";
import { useDetailPanelState } from "./use-detail-panel-state";

function resolveViewFromPathname(pathname: string): ActivityView {
  if (pathname.startsWith("/tomorrow")) return "tomorrow";
  if (pathname.startsWith("/next-7-days")) return "next-7-days";
  if (pathname.startsWith("/all")) return "all";
  if (pathname.startsWith("/inbox")) return "inbox";
  return "today";
}

function DetailSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="space-y-3 rounded-card bg-surface-muted p-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-11 w-full" />
        ))}
      </div>
    </div>
  );
}

function DetailBody({ activity }: { activity: Activity | null }) {
  const { data: modules } = useEnabledModules();
  const bodyRef = useRef<HTMLDivElement>(null);
  const activityId = activity?.id ?? null;

  useGSAP(
    () => {
      const body = bodyRef.current;
      if (!body) return;

      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        gsap.fromTo(
          body,
          { autoAlpha: 0, y: 6 },
          {
            autoAlpha: 1,
            y: 0,
            duration: DURATION.base,
            ease: EASE.out,
            overwrite: "auto",
            onStart: markWillChange,
            clearProps: "all",
          },
        );
      });
      return () => mm.revert();
    },
    { scope: bodyRef, dependencies: [activityId] },
  );

  const { data: lists } = useLists();
  const { data: tags } = useTags();
  const updateMutation = useUpdateActivity();

  if (!activity) {
    return (
      <EmptyState
        icon={<FileText className="h-4 w-4" aria-hidden="true" />}
        title="Select an activity"
        text="Choose a habit, reminder, or task to inspect details and checklist items."
      />
    );
  }

  const matchedList = activity.listId
    ? lists?.find((item) => item.id === activity.listId)
    : undefined;
  const matchedTags =
    tags?.filter((tag) => (activity.tagIds ?? []).includes(tag.id)) ?? [];

  const isCompleted = activity.status === "completed";

  return (
    <div ref={bodyRef} className="flex flex-1 flex-col justify-between gap-6">
      <div className="space-y-6">
        <ActivityDetailCard
          activity={activity}
          listSection={
            modules?.includes("lists") && matchedList
              ? <ListLabel list={matchedList} />
              : undefined
          }
          tagsSection={
            modules?.includes("tags") && matchedTags.length > 0
              ? matchedTags.map((tag) => <TagChip key={tag.id} tag={tag} />)
              : undefined
          }
        />

        {modules?.includes("subtasks") ? (
          <SubtaskChecklist activityId={activity.id} />
        ) : null}
      </div>

      <Button
        variant="primary"
        className="w-full"
        disabled={updateMutation.isPending}
        onClick={() =>
          updateMutation.mutate({
            id: activity.id,
            patch: { status: isCompleted ? "todo" : "completed" },
          })
        }
      >
        {isCompleted ? "Mark as not done" : "Mark as Done"}
      </Button>
    </div>
  );
}

export function DetailPanel() {
  const pathname = usePathname();
  const router = useRouter();
  const signOutMutation = useSignOut();
  const view = resolveViewFromPathname(pathname);
  const asideRef = useRef<HTMLElement>(null);
  const expandedRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const { state: panelState, hydrated } = useDetailPanelState();
  const collapsed = panelState === "closed";
  const previousCollapsed = useRef<boolean | null>(null);
  useShellEntrance(asideRef, { x: 16, delay: 0.1 });

  // Cross-fades the full panel and the 72 px rail; the stored state is
  // applied without animation on the first run after hydration.
  useGSAP(
    () => {
      const expanded = expandedRef.current;
      const rail = railRef.current;
      if (!hydrated || !expanded || !rail) return;

      const changed =
        previousCollapsed.current !== null &&
        previousCollapsed.current !== collapsed;
      previousCollapsed.current = collapsed;

      const showing = collapsed ? rail : expanded;
      const hiding = collapsed ? expanded : rail;
      const applyFinalState = () => {
        gsap.set(showing, { autoAlpha: 1 });
        gsap.set(hiding, { autoAlpha: 0 });
      };

      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        if (!changed) {
          applyFinalState();
          return;
        }
        gsap.to(hiding, {
          autoAlpha: 0,
          duration: 0.15,
          ease: EASE.out,
          overwrite: "auto",
        });
        gsap.to(showing, {
          autoAlpha: 1,
          duration: DURATION.base,
          delay: 0.2,
          ease: EASE.out,
          overwrite: "auto",
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", applyFinalState);
    },
    { dependencies: [collapsed, hydrated] },
  );
  const { q, list, tag, activity: activityParam, setParam } =
    useDashboardParams();

  const handleSignOut = () => {
    signOutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  };

  const { data: viewActivities, isLoading: isViewLoading } = useActivities({
    view,
    listId: list ?? undefined,
    tagId: tag ?? undefined,
    q: q || undefined,
  });

  const firstReminder =
    viewActivities?.find((item) => item.kind === "reminder") ?? null;
  const effectiveId = activityParam ?? firstReminder?.id ?? null;

  const { data: fetchedActivity, isLoading: isDetailLoading } =
    useActivity(effectiveId);

  const resolvedActivity =
    fetchedActivity ??
    viewActivities?.find((item) => item.id === effectiveId) ??
    null;

  const isLoading = isViewLoading || (effectiveId !== null && isDetailLoading);

  return (
    <>
      <aside
        ref={asideRef}
        data-motion="pending"
        aria-label="Activity details"
        aria-busy={isLoading}
        className="relative hidden xl:block xl:h-full xl:w-[320px] xl:shrink-0 xl:border-l xl:border-line xl:bg-surface"
      >
        <div
          ref={expandedRef}
          inert={collapsed}
          className="scroll-soft absolute inset-y-0 left-0 flex w-[320px] flex-col overflow-y-auto overscroll-contain p-5"
        >
          <div className="mb-6 flex items-center justify-between gap-2">
            <ThemeToggle />
            <UserMenu onSignOut={handleSignOut} />
          </div>

          {isLoading ? (
            <DetailSkeleton />
          ) : (
            <DetailBody activity={resolvedActivity} />
          )}
        </div>

        <div
          ref={railRef}
          inert={!collapsed}
          className="invisible absolute inset-y-0 left-0 flex w-[72px] flex-col items-center gap-4 py-5"
        >
          <UserMenu onSignOut={handleSignOut} compact />
          <ThemeToggleButton />
        </div>
      </aside>

      <div className="xl:hidden">
        <Sheet
          open={activityParam !== null}
          onOpenChange={(open) => {
            if (!open) {
              setParam("activity", null);
            }
          }}
          side="right"
          title={resolvedActivity?.title ?? "Activity details"}
          description="Activity details and checklist"
          className="p-4"
        >
          <div className="flex h-full flex-col pt-2">
            {isDetailLoading ? (
              <DetailSkeleton />
            ) : (
              <DetailBody activity={resolvedActivity} />
            )}
          </div>
        </Sheet>
      </div>
    </>
  );
}
