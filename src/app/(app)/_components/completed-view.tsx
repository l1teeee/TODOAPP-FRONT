"use client";

import { CheckCircle2, RotateCcw, Trash2 } from "lucide-react";
import {
  useCompletedActivities,
  useTrashActivity,
  useUpdateActivity,
} from "@/features/activities/api/use-activities";
import { ActivityRow } from "@/features/activities/components/activity-row";
import type { Activity } from "@/features/activities/model/activity";
import { useRef } from "react";
import { useLists } from "@/features/lists/api/use-lists";
import { ListLabel } from "@/features/lists/components/list-label";
import { useTags } from "@/features/tags/api/use-tags";
import { TagChip } from "@/features/tags/components/tag-chip";
import { useEnabledModules } from "@/shared/api/use-enabled-modules";
import { useEntrance } from "@/shared/motion/use-entrance";
import { addDaysFormatted, formatLocalDate } from "@/shared/lib/dates";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { Skeleton } from "@/shared/ui/skeleton";

function formatDayGroupLabel(isoString: string | null, now: Date): string {
  if (!isoString) return "Completed";
  const dateObj = new Date(isoString);
  const dateKey = formatLocalDate(dateObj);
  const todayKey = formatLocalDate(now);
  const yesterdayKey = addDaysFormatted(now, -1);

  if (dateKey === todayKey) return "Today";
  if (dateKey === yesterdayKey) return "Yesterday";
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCompletionTime(isoString: string | null): string {
  if (!isoString) return "";
  const dateObj = new Date(isoString);
  return dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CompletedView() {
  const { data: modules } = useEnabledModules();
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useCompletedActivities();
  const activities = data?.pages.flatMap((page) => page.items);
  const { data: lists } = useLists();
  const { data: tags } = useTags();
  const updateMutation = useUpdateActivity();
  const trashMutation = useTrashActivity();
  const groupsRef = useRef<HTMLDivElement>(null);
  useEntrance(groupsRef, !isLoading);

  const renderMeta = (activity: Activity) => {
    const matchedTags =
      tags?.filter((t) => (activity.tagIds ?? []).includes(t.id)) ?? [];
    const matchedList = activity.listId
      ? lists?.find((l) => l.id === activity.listId)
      : undefined;

    return (
      <>
        {modules?.includes("tags")
          ? matchedTags.map((t) => <TagChip key={t.id} tag={t} />)
          : null}
        {modules?.includes("lists") && matchedList ? (
          <ListLabel list={matchedList} />
        ) : null}
      </>
    );
  };

  const groups: Array<{ label: string; items: Activity[] }> = [];
  if (activities) {
    const now = new Date();
    for (const item of activities) {
      const label = formatDayGroupLabel(item.completedAt, now);
      const last = groups[groups.length - 1];
      if (last && last.label === label) {
        last.items.push(item);
      } else {
        groups.push({ label, items: [item] });
      }
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-fg">Completed</h1>
        <p className="mt-1 text-xs text-fg-secondary">
          Review finished habits, reminders and tasks.
        </p>
      </header>

      {isLoading ? (
        <div className="space-y-3" aria-busy="true">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-card" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
          title="Nothing completed yet"
          text="Activities you mark as done will show up here."
        />
      ) : (
        <div ref={groupsRef} className="space-y-6">
          {groups.map((group) => (
            <section key={group.label} className="space-y-2.5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
                {group.label}
              </h2>
              <div className="space-y-2">
                {group.items.map((activity) => (
                  <ActivityRow
                    key={activity.id}
                    activity={activity}
                    meta={renderMeta(activity)}
                    dateText={formatCompletionTime(activity.completedAt)}
                    actions={
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={updateMutation.isPending}
                          onClick={() =>
                            updateMutation.mutate({
                              id: activity.id,
                              patch: { status: "todo" },
                            })
                          }
                        >
                          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Mark as not done</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={trashMutation.isPending}
                          onClick={() => trashMutation.mutate(activity.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Move to trash</span>
                        </Button>
                      </>
                    }
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
      {hasNextPage ? (
        <Button
          variant="secondary"
          disabled={isFetchingNextPage}
          onClick={() => void fetchNextPage()}
        >
          Load more
        </Button>
      ) : null}
    </div>
  );
}
