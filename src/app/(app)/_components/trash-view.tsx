"use client";

import { RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  useDeleteActivityForever,
  useRestoreActivity,
  useTrashedActivities,
} from "@/features/activities/api/use-activities";
import { ActivityRow } from "@/features/activities/components/activity-row";
import type { Activity } from "@/features/activities/model/activity";
import { useLists } from "@/features/lists/api/use-lists";
import { ListLabel } from "@/features/lists/components/list-label";
import { useTags } from "@/features/tags/api/use-tags";
import { TagChip } from "@/features/tags/components/tag-chip";
import { Button } from "@/shared/ui/button";
import { Dialog } from "@/shared/ui/dialog";
import { EmptyState } from "@/shared/ui/empty-state";
import { Skeleton } from "@/shared/ui/skeleton";

function formatDeletedDate(isoString: string | null): string {
  if (!isoString) return "";
  const dateObj = new Date(isoString);
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function TrashView() {
  const { data: activities, isLoading } = useTrashedActivities();
  const { data: lists } = useLists();
  const { data: tags } = useTags();
  const restoreMutation = useRestoreActivity();
  const deleteForeverMutation = useDeleteActivityForever();

  const [confirmingActivity, setConfirmingActivity] = useState<Activity | null>(
    null,
  );

  const renderMeta = (activity: Activity) => {
    const matchedTags =
      tags?.filter((t) => (activity.tagIds ?? []).includes(t.id)) ?? [];
    const matchedList = activity.listId
      ? lists?.find((l) => l.id === activity.listId)
      : undefined;

    return (
      <>
        {matchedTags.map((t) => (
          <TagChip key={t.id} tag={t} />
        ))}
        {matchedList ? <ListLabel list={matchedList} /> : null}
      </>
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-fg">Trash</h1>
        <p className="mt-1 text-xs text-fg-secondary">
          Items in the trash can be restored or deleted forever.
        </p>
      </header>

      {isLoading ? (
        <div className="space-y-3" aria-busy="true">
          <Skeleton className="h-14 w-full rounded-card" />
          <Skeleton className="h-14 w-full rounded-card" />
        </div>
      ) : !activities || activities.length === 0 ? (
        <EmptyState
          icon={<Trash2 className="h-4 w-4" aria-hidden="true" />}
          title="Trash is empty"
          text="Moved items will appear here before being permanently deleted."
        />
      ) : (
        <div className="space-y-2">
          {activities.map((activity) => (
            <ActivityRow
              key={activity.id}
              activity={activity}
              meta={renderMeta(activity)}
              dateText={formatDeletedDate(activity.deletedAt)}
              actions={
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={restoreMutation.isPending}
                    onClick={() => restoreMutation.mutate(activity.id)}
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Restore</span>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setConfirmingActivity(activity)}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Delete forever</span>
                  </Button>
                </>
              }
            />
          ))}
        </div>
      )}

      <Dialog
        open={confirmingActivity !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmingActivity(null);
        }}
        title="Delete forever?"
        description={
          confirmingActivity
            ? `"${confirmingActivity.title}" will be permanently removed and cannot be undone.`
            : "This action cannot be undone."
        }
      >
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => setConfirmingActivity(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={deleteForeverMutation.isPending}
            onClick={() => {
              if (!confirmingActivity) return;
              deleteForeverMutation.mutate(confirmingActivity.id, {
                onSuccess: () => {
                  setConfirmingActivity(null);
                },
              });
            }}
          >
            Delete forever
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
