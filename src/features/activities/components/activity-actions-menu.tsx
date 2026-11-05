"use client";

import {
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { IconButton } from "@/shared/ui/icon-button";
import { useTrashActivity, useUpdateActivity } from "../api/use-activities";
import type { Activity, ActivityStatus } from "../model/activity";

export interface ActivityActionsMenuProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
}

const STATUS_OPTIONS: readonly { value: ActivityStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export function ActivityActionsMenu({
  activity,
  onEdit,
}: ActivityActionsMenuProps) {
  const updateMutation = useUpdateActivity();
  const trashMutation = useTrashActivity();

  const isCompleted = activity.status === "completed";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton label="More actions" size="sm">
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => onEdit(activity)}>
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Edit</span>
        </DropdownMenuItem>

        {activity.kind === "task" ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Move to</DropdownMenuLabel>
            {STATUS_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                disabled={activity.status === option.value}
                onSelect={() =>
                  updateMutation.mutate({
                    id: activity.id,
                    patch: { status: option.value },
                  })
                }
              >
                <Circle className="h-3 w-3" aria-hidden="true" />
                <span>{option.label}</span>
              </DropdownMenuItem>
            ))}
          </>
        ) : (
          <DropdownMenuItem
            onSelect={() =>
              updateMutation.mutate({
                id: activity.id,
                patch: { status: isCompleted ? "todo" : "completed" },
              })
            }
          >
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{isCompleted ? "Mark as not done" : "Mark as done"}</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          danger
          onSelect={() => trashMutation.mutate(activity.id)}
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Move to trash</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
