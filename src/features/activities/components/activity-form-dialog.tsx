"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { formatLocalDate } from "@/shared/lib/dates";
import { Button } from "@/shared/ui/button";
import { Dialog } from "@/shared/ui/dialog";
import { Field } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { SegmentedControl } from "@/shared/ui/segmented-control";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { useCreateActivity, useUpdateActivity } from "../api/use-activities";
import type {
  Activity,
  ActivityInput,
  ActivityKind,
  ActivityStatus,
} from "../model/activity";
import { ACTIVITY_ICON_KEYS } from "./activity-icon";

export interface ActivityFormValues {
  kind: ActivityKind;
  title: string;
  description: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  location: string;
  status: ActivityStatus;
  icon: string;
  listId: string | null;
  tagIds: string[];
}

export interface ActivityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity?: Activity | null;
  defaultKind?: ActivityKind;
  defaultStatus?: ActivityStatus;
  extraFields?: (
    values: ActivityFormValues,
    setValues: (updater: (prev: ActivityFormValues) => ActivityFormValues) => void,
  ) => ReactNode;
}

const KIND_OPTIONS: readonly { value: ActivityKind; label: string }[] = [
  { value: "task", label: "Task" },
  { value: "reminder", label: "Reminder" },
  { value: "habit", label: "Habit" },
];

function createInitialValues(
  activity?: Activity | null,
  defaultKind: ActivityKind = "task",
  defaultStatus: ActivityStatus = "todo",
): ActivityFormValues {
  if (activity) {
    return {
      kind: activity.kind,
      title: activity.title,
      description: activity.description ?? "",
      scheduledDate: activity.scheduledDate ?? "",
      startTime: activity.startTime ?? "",
      endTime: activity.endTime ?? "",
      location: activity.location ?? "",
      status: activity.status,
      icon: activity.icon ?? "sparkles",
      listId: activity.listId ?? null,
      tagIds: activity.tagIds ? [...activity.tagIds] : [],
    };
  }
  return {
    kind: defaultKind,
    title: "",
    description: "",
    scheduledDate: formatLocalDate(new Date()),
    startTime: "09:00",
    endTime: "10:00",
    location: "",
    status: defaultStatus,
    icon: "sparkles",
    listId: null,
    tagIds: [],
  };
}

export function ActivityFormDialog({
  open,
  onOpenChange,
  activity,
  defaultKind = "task",
  defaultStatus = "todo",
  extraFields,
}: ActivityFormDialogProps) {
  const formKey = `${open}-${activity?.id ?? "new"}-${defaultKind}-${defaultStatus}`;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={activity ? "Edit activity" : "New activity"}
      description={
        activity
          ? "Update your activity details."
          : "Create a task, reminder, or habit."
      }
    >
      <ActivityFormBody
        key={formKey}
        activity={activity}
        defaultKind={defaultKind}
        defaultStatus={defaultStatus}
        onClose={() => onOpenChange(false)}
        extraFields={extraFields}
      />
    </Dialog>
  );
}

interface ActivityFormBodyProps {
  activity?: Activity | null;
  defaultKind: ActivityKind;
  defaultStatus: ActivityStatus;
  onClose: () => void;
  extraFields?: ActivityFormDialogProps["extraFields"];
}

function ActivityFormBody({
  activity,
  defaultKind,
  defaultStatus,
  onClose,
  extraFields,
}: ActivityFormBodyProps) {
  const [values, setValues] = useState<ActivityFormValues>(() =>
    createInitialValues(activity, defaultKind, defaultStatus),
  );
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    endTime?: string;
  }>({});

  const createMutation = useCreateActivity();
  const updateMutation = useUpdateActivity();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: {
      title?: string;
      description?: string;
      endTime?: string;
    } = {};

    const trimmedTitle = values.title.trim();
    if (trimmedTitle.length < 1 || trimmedTitle.length > 120) {
      nextErrors.title = "Title must be between 1 and 120 characters.";
    }
    if (values.description.length > 500) {
      nextErrors.description = "Description cannot exceed 500 characters.";
    }
    if (
      values.kind === "habit" &&
      values.startTime &&
      values.endTime &&
      values.endTime <= values.startTime
    ) {
      nextErrors.endTime = "End time must be after start time.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    const payload: ActivityInput = {
      kind: values.kind,
      title: trimmedTitle,
      description: values.description.trim() || null,
      status: values.kind === "task" ? values.status : (activity?.status ?? "todo"),
      scheduledDate:
        values.kind === "habit" ? null : values.scheduledDate || null,
      startTime: values.startTime || null,
      endTime: values.kind === "habit" ? values.endTime || null : null,
      location:
        values.kind === "reminder" ? values.location.trim() || null : null,
      icon: values.kind === "habit" ? values.icon : null,
      listId: values.listId,
      tagIds: values.tagIds,
    };

    if (activity) {
      updateMutation.mutate(
        { id: activity.id, patch: payload },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-fg-secondary">Type</span>
        <SegmentedControl
          label="Activity type"
          options={KIND_OPTIONS}
          value={values.kind}
          onChange={(kind) => setValues((prev) => ({ ...prev, kind }))}
        />
      </div>

      <Field label="Title" error={errors.title}>
        <Input
          required
          maxLength={120}
          value={values.title}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, title: event.target.value }))
          }
          placeholder="e.g. Gym Session Week 3"
        />
      </Field>

      <Field label="Description" error={errors.description}>
        <Textarea
          maxLength={500}
          value={values.description}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, description: event.target.value }))
          }
          placeholder="Optional notes or details"
        />
      </Field>

      {values.kind !== "habit" ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Date">
            <Input
              type="date"
              value={values.scheduledDate}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  scheduledDate: event.target.value,
                }))
              }
            />
          </Field>
          <Field label="Start time">
            <Input
              type="time"
              value={values.startTime}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  startTime: event.target.value,
                }))
              }
            />
          </Field>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Start time">
            <Input
              type="time"
              value={values.startTime}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  startTime: event.target.value,
                }))
              }
            />
          </Field>
          <Field label="End time" error={errors.endTime}>
            <Input
              type="time"
              value={values.endTime}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  endTime: event.target.value,
                }))
              }
            />
          </Field>
        </div>
      )}

      {values.kind === "reminder" ? (
        <Field label="Location">
          <Input
            value={values.location}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, location: event.target.value }))
            }
            placeholder="e.g. Dona Gym"
          />
        </Field>
      ) : null}

      {values.kind === "task" ? (
        <Field label="Status">
          <Select
            value={values.status}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                status: event.target.value as ActivityStatus,
              }))
            }
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </Select>
        </Field>
      ) : null}

      {values.kind === "habit" ? (
        <Field label="Icon">
          <Select
            value={values.icon}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, icon: event.target.value }))
            }
          >
            {ACTIVITY_ICON_KEYS.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </Select>
        </Field>
      ) : null}

      {extraFields ? extraFields(values, setValues) : null}

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {activity ? "Save changes" : "Create activity"}
        </Button>
      </div>
    </form>
  );
}
