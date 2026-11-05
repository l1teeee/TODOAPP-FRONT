"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
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
import { AssistantCard } from "@/features/assistant/components/assistant-card";
import type { DailyBriefInput } from "@/features/assistant/model/daily-brief";
import { useLists } from "@/features/lists/api/use-lists";
import { ListLabel } from "@/features/lists/components/list-label";
import { ListSelect } from "@/features/lists/components/list-select";
import { useProfile } from "@/features/profile/api/use-profile";
import { useTags } from "@/features/tags/api/use-tags";
import { TagChip } from "@/features/tags/components/tag-chip";
import { TagPicker } from "@/features/tags/components/tag-picker";
import { Field } from "@/shared/ui/field";
import { IconButton } from "@/shared/ui/icon-button";
import { DashboardHeader } from "./dashboard-header";
import { OnboardingCard } from "./onboarding-card";
import { useDetailPanelState } from "./use-detail-panel-state";
import { useOnboardingDismissed } from "./sample-data";
import { useDashboardParams } from "./use-dashboard-params";

function formatClock(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function useLocalTime(): string {
  const [time, setTime] = useState(() => formatClock(new Date()));
  useEffect(() => {
    const timer = setInterval(() => setTime(formatClock(new Date())), 60_000);
    return () => clearInterval(timer);
  }, []);
  return time;
}

export interface DashboardViewProps {
  view: ActivityView;
}

export function DashboardView({ view }: DashboardViewProps) {
  const { q, list, tag, activity: selectedParam, setParam } =
    useDashboardParams();

  const { data: activities, isLoading } = useActivities({
    view,
    listId: list ?? undefined,
    tagId: tag ?? undefined,
    q: q || undefined,
  });

  const { data: lists, isLoading: isListsLoading } = useLists();
  const { data: tags, isLoading: isTagsLoading } = useTags();
  const { data: profile } = useProfile();
  const { data: allActivities, isLoading: isAllLoading } = useActivities({
    view: "all",
  });
  const onboardingDismissed = useOnboardingDismissed();
  const localTime = useLocalTime();
  const [locale] = useState(() =>
    typeof navigator === "undefined" ? "en" : navigator.language,
  );

  const isWorkspaceEmpty =
    !isAllLoading &&
    !isListsLoading &&
    !isTagsLoading &&
    (allActivities?.length ?? 0) === 0 &&
    (lists?.length ?? 0) === 0 &&
    (tags?.length ?? 0) === 0;
  const showOnboarding =
    view === "today" && isWorkspaceEmpty && !onboardingDismissed;
  const firstName = profile?.displayName?.trim().split(/\s+/)[0] || null;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [defaultKind, setDefaultKind] = useState<ActivityKind>("task");
  const [defaultStatus, setDefaultStatus] = useState<ActivityStatus>("todo");

  const habits =
    activities?.filter((item) => item.kind === "habit") ?? [];
  const reminders =
    activities?.filter((item) => item.kind === "reminder") ?? [];
  const tasks =
    activities?.filter((item) => item.kind === "task") ?? [];

  const selectedId = selectedParam ?? reminders[0]?.id ?? null;

  const briefInput: DailyBriefInput = {
    firstName,
    localTime,
    locale,
    items: (activities ?? []).map((item) => ({
      id: item.id,
      kind: item.kind,
      title: item.title,
      startTime: item.startTime,
      endTime: item.endTime,
      location: item.location,
      status: item.status,
    })),
  };

  const { open: openDetailPanel } = useDetailPanelState();

  const handleSelect = (id: string) => {
    openDetailPanel();
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
    <div className="mx-auto max-w-6xl space-y-7 p-4 sm:p-6">
      {showOnboarding ? (
        <OnboardingCard
          firstName={firstName}
          onStartFromScratch={() => handleOpenNew("task", "todo")}
        />
      ) : null}

      <div>
        <DashboardHeader
          view={view}
          onNewActivity={() => handleOpenNew("task", "todo")}
        />
      </div>

      {view === "today" ? (
        <div>
          <AssistantCard
            input={briefInput}
            isLoading={isLoading}
            onSelect={handleSelect}
          />
        </div>
      ) : null}

      {view !== "inbox" ? (
        <div>
          <HabitsSection
            habits={habits}
            isLoading={isLoading}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>
      ) : null}

      <div>
        <RemindersSection
          reminders={reminders}
          isLoading={isLoading}
          selectedId={selectedId}
          onSelect={handleSelect}
          renderMeta={renderMeta}
          renderActions={renderActions}
        />
      </div>

      <div>
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
