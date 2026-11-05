"use client";

import { CheckSquare, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import { Checkbox } from "@/shared/ui/checkbox";
import { EmptyState } from "@/shared/ui/empty-state";
import { IconButton } from "@/shared/ui/icon-button";
import { Input } from "@/shared/ui/input";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  useCreateSubtask,
  useDeleteSubtask,
  useSubtasks,
  useToggleSubtask,
} from "../api/use-subtasks";

export interface SubtaskChecklistProps {
  activityId: string | null;
}

export function SubtaskChecklist({ activityId }: SubtaskChecklistProps) {
  const { data: subtasks, isLoading } = useSubtasks(activityId);
  const createMutation = useCreateSubtask();
  const toggleMutation = useToggleSubtask();
  const deleteMutation = useDeleteSubtask();

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleCreate = () => {
    const trimmed = newTitle.trim();
    if (!trimmed || !activityId) return;
    createMutation.mutate(
      { activityId, title: trimmed },
      {
        onSuccess: () => {
          setNewTitle("");
          setIsAdding(false);
        },
      },
    );
  };

  return (
    <div className="space-y-3" aria-busy={isLoading}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-fg">To Do</h3>
        <IconButton
          label="Add subtask"
          size="sm"
          disabled={!activityId}
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </IconButton>
      </div>

      {isAdding && activityId ? (
        <div>
          <Input
            autoFocus
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder="Subtask title (Enter to save, Esc to cancel)"
            aria-label="New subtask title"
            disabled={createMutation.isPending}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleCreate();
              } else if (event.key === "Escape") {
                event.preventDefault();
                setIsAdding(false);
                setNewTitle("");
              }
            }}
          />
        </div>
      ) : null}

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-11 w-full" />
          ))}
        </div>
      ) : !subtasks || subtasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="h-4 w-4" aria-hidden="true" />}
          title="No subtasks yet"
          className="py-6"
        />
      ) : (
        <ul className="space-y-2">
          {subtasks.map((subtask) => (
            <li
              key={subtask.id}
              className="group flex items-center justify-between gap-2.5 rounded-control border border-line bg-surface px-3 py-2.5 transition-colors hover:border-line-strong"
            >
              <label className="flex flex-1 cursor-pointer items-center gap-3 text-xs font-medium text-fg">
                <Checkbox
                  checked={subtask.isDone}
                  onChange={(event) => {
                    if (!activityId) return;
                    toggleMutation.mutate({
                      id: subtask.id,
                      activityId,
                      isDone: event.target.checked,
                    });
                  }}
                />
                <span
                  className={cn(
                    "select-none",
                    subtask.isDone && "line-through text-fg-muted",
                  )}
                >
                  {subtask.title}
                </span>
              </label>
              <IconButton
                label={`Delete ${subtask.title}`}
                size="sm"
                onClick={() => {
                  if (!activityId) return;
                  deleteMutation.mutate({
                    id: subtask.id,
                    activityId,
                  });
                }}
                className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
