"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { useActivities } from "@/features/activities/api/use-activities";
import { ActivityActionsMenu } from "@/features/activities/components/activity-actions-menu";
import { ActivityFormDialog } from "@/features/activities/components/activity-form-dialog";
import { HabitsSection } from "@/features/activities/components/habits-section";
import { KanbanBoard } from "@/features/activities/components/kanban-board";
import { RemindersSection } from "@/features/activities/components/reminders-section";
import type {
  Activity,
  ActivityKind,
  ActivityStatus,
  ActivityView,
} from "@/features/activities/model/activity";
import { useLists } from "@/features/lists/api/use-lists";
import { ListLabel } from "@/features/lists/components/list-label";
import { ListSelect } from "@/features/lists/components/list-select";
import { useTags } from "@/features/tags/api/use-tags";
import { TagChip } from "@/features/tags/components/tag-chip";
import { TagPicker } from "@/features/tags/components/tag-picker";
import { Field } from "@/shared/ui/field";
import { IconButton } from "@/shared/ui/icon-button";
import { DashboardHeader } from "./dashboard-header";
import { useDashboardParams } from "./use-dashboard-params";

gsap.registerPlugin(useGSAP);

export interface DashboardViewProps {
  view: ActivityView;
}

export function DashboardView({ view }: DashboardViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { q, list, tag, activity: selectedParam, setParam } =
    useDashboardParams();

  const { data: activities, isLoading } = useActivities({
    view,
    listId: list ?? undefined,
    tagId: tag ?? undefined,
    q: q || undefined,
  });

  const { data: lists } = useLists();
  const { data: tags } = useTags();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [defaultKind, setDefaultKind] = useState<ActivityKind>("task");
  const [defaultStatus, setDefaultStatus] = useState<ActivityStatus>("todo");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-dashboard-section]", {
          opacity: 0,
          y: 8,
          duration: 0.35,
          stagger: 0.06,
          ease: "power2.out",
          clearProps: "all",
        });
      });
      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [view] },
  );

  const habits =
    activities?.filter((item) => item.kind === "habit") ?? [];
  const reminders =
    activities?.filter((item) => item.kind === "reminder") ?? [];
  const tasks =
    activities?.filter((item) => item.kind === "task") ?? [];

  const selectedId = selectedParam ?? reminders[0]?.id ?? null;

  const handleSelect = (id: string) => {
    setParam("activity", id);
  };

  const handleOpenNew = (
    kind: ActivityKind = "task",
    status: ActivityStatus = "todo",
  ) => {
    setEditingActivity(null);
    setDefaultKind(kind);
    setDefaultStatus(status);
    setDialogOpen(true);
  };

  const handleOpenEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setDefaultKind(activity.kind);
    setDefaultStatus(activity.status);
    setDialogOpen(true);
  };

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

  const renderActions = (activity: Activity) => (
    <ActivityActionsMenu activity={activity} onEdit={handleOpenEdit} />
  );

  return (
    <div ref={containerRef} className="mx-auto max-w-6xl space-y-7 p-4 sm:p-6">
      <div data-dashboard-section>
        <DashboardHeader
          view={view}
          onNewActivity={() => handleOpenNew("task", "todo")}
        />
      </div>

      {view !== "inbox" ? (
        <div data-dashboard-section>
          <HabitsSection
            habits={habits}
            isLoading={isLoading}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>
      ) : null}

      <div data-dashboard-section>
        <RemindersSection
          reminders={reminders}
          isLoading={isLoading}
          selectedId={selectedId}
          onSelect={handleSelect}
          renderMeta={renderMeta}
          renderActions={renderActions}
        />
      </div>

      <div data-dashboard-section>
        <KanbanBoard
          tasks={tasks}
          isLoading={isLoading}
          selectedId={selectedId}
          onSelect={handleSelect}
          columnActions={(status) => (
            <IconButton
              label="Add activity"
              size="sm"
              onClick={() => handleOpenNew("task", status)}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </IconButton>
          )}
          renderMeta={renderMeta}
          renderActions={renderActions}
        />
      </div>

      <ActivityFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        activity={editingActivity}
        defaultKind={defaultKind}
        defaultStatus={defaultStatus}
        extraFields={(values, setValues) => (
          <div className="space-y-4">
            <Field label="List">
              <ListSelect
                value={values.listId}
                onChange={(listId) =>
                  setValues((prev) => ({ ...prev, listId }))
                }
              />
            </Field>
            <Field label="Tags">
              <TagPicker
                selectedIds={values.tagIds}
                onChange={(tagIds) =>
                  setValues((prev) => ({ ...prev, tagIds }))
                }
              />
            </Field>
          </div>
        )}
      />
    </div>
  );
}
