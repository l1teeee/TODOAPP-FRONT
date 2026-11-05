"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { useEntrance } from "@/shared/motion/use-entrance";
import { EmptyState } from "@/shared/ui/empty-state";
import { Skeleton } from "@/shared/ui/skeleton";
import type { Activity, ActivityStatus } from "../model/activity";
import { TaskCard } from "./task-card";

const COLUMNS: readonly {
  status: ActivityStatus;
  title: string;
  borderClass: string;
}[] = [
  {
    status: "todo",
    title: "To Do",
    borderClass: "border-l-[3px] border-l-status-todo",
  },
  {
    status: "in_progress",
    title: "In Progress",
    borderClass: "border-l-[3px] border-l-status-progress",
  },
  {
    status: "completed",
    title: "Completed",
    borderClass: "border-l-[3px] border-l-status-done",
  },
];

export interface KanbanBoardProps {
  tasks: Activity[];
  isLoading?: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  columnActions?: (status: ActivityStatus) => ReactNode;
  renderMeta?: (activity: Activity) => ReactNode;
  renderActions?: (activity: Activity) => ReactNode;
}

export function KanbanBoard({
  tasks,
  isLoading,
  selectedId,
  onSelect,
  columnActions,
  renderMeta,
  renderActions,
}: KanbanBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  useEntrance(boardRef, !isLoading);

  return (
    <section aria-labelledby="kanban-heading" aria-busy={isLoading}>
      <h2
        id="kanban-heading"
        className="mb-3 text-base font-semibold text-fg"
      >
        To Do List
      </h2>
      <div
        ref={boardRef}
        className="flex gap-3.5 overflow-x-auto pb-2 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0"
      >
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter(
            (task) => task.status === column.status,
          );
          return (
            <div
              key={column.status}
              className="w-[85%] shrink-0 snap-start space-y-3 lg:w-auto lg:shrink"
            >
              <div className="flex items-center justify-between rounded-card border border-line bg-surface px-4 py-3">
                <div
                  className={cn(
                    "flex items-center gap-2 pl-2.5",
                    column.borderClass,
                  )}
                >
                  <span className="text-xs font-semibold text-fg">
                    {column.title}
                  </span>
                  <span className="text-xs font-medium text-fg-muted">
                    {columnTasks.length}
                  </span>
                </div>
                {columnActions ? <div>{columnActions(column.status)}</div> : null}
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-28 w-full rounded-card" />
                  <Skeleton className="h-28 w-full rounded-card" />
                </div>
              ) : columnTasks.length === 0 ? (
                <EmptyState
                  title={`No ${column.title.toLowerCase()} tasks`}
                  className="py-6"
                />
              ) : (
                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      activity={task}
                      selected={selectedId === task.id}
                      onSelect={onSelect}
                      meta={renderMeta?.(task)}
                      actions={renderActions?.(task)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
