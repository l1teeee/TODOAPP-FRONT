"use client";

import { FileText } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  useActivities,
  useActivity,
  useUpdateActivity,
} from "@/features/activities/api/use-activities";
import { ActivityDetailCard } from "@/features/activities/components/activity-detail-card";
import type { Activity, ActivityView } from "@/features/activities/model/activity";
import { useLists } from "@/features/lists/api/use-lists";
import { ListLabel } from "@/features/lists/components/list-label";
import { UserMenu } from "@/features/profile/components/user-menu";
import { SubtaskChecklist } from "@/features/subtasks/components/subtask-checklist";
import { useTags } from "@/features/tags/api/use-tags";
import { TagChip } from "@/features/tags/components/tag-chip";
import { ThemeToggle } from "@/shared/theme/theme-toggle";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { Sheet } from "@/shared/ui/sheet";
import { Skeleton } from "@/shared/ui/skeleton";
import { useDashboardParams } from "./use-dashboard-params";

function resolveViewFromPathname(pathname: string): ActivityView {
  if (pathname.startsWith("/tomorrow")) return "tomorrow";
  if (pathname.startsWith("/next-7-days")) return "next-7-days";
  if (pathname.startsWith("/all")) return "all";
  if (pathname.startsWith("/inbox")) return "inbox";
  return "today";
}

function DetailBody({ activity }: { activity: Activity | null }) {
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
    <div className="flex flex-1 flex-col justify-between gap-6">
      <div className="space-y-6">
        <ActivityDetailCard
          activity={activity}
          listSection={
            matchedList ? <ListLabel list={matchedList} /> : undefined
          }
          tagsSection={
            matchedTags.length > 0
              ? matchedTags.map((tag) => <TagChip key={tag.id} tag={tag} />)
              : undefined
          }
        />

        <SubtaskChecklist activityId={activity.id} />
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
  const view = resolveViewFromPathname(pathname);
  const { q, list, tag, activity: activityParam, setParam } =
    useDashboardParams();

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
        aria-label="Activity details"
        aria-busy={isLoading}
        className="hidden xl:flex xl:h-full xl:w-[320px] xl:shrink-0 xl:flex-col xl:border-l xl:border-line xl:bg-surface xl:p-5 xl:overflow-y-auto"
      >
        <div className="mb-6 flex items-center justify-between gap-2">
          <ThemeToggle />
          <UserMenu />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-44 w-full rounded-card" />
            <Skeleton className="h-10 w-full rounded-control" />
            <Skeleton className="h-10 w-full rounded-control" />
          </div>
        ) : (
          <DetailBody activity={resolvedActivity} />
        )}
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
              <div className="space-y-4">
                <Skeleton className="h-44 w-full rounded-card" />
                <Skeleton className="h-10 w-full rounded-control" />
              </div>
            ) : (
              <DetailBody activity={resolvedActivity} />
            )}
          </div>
        </Sheet>
      </div>
    </>
  );
}
