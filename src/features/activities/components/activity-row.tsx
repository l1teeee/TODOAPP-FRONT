import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import type { Activity, ActivityKind } from "../model/activity";
import { ActivityIcon } from "./activity-icon";

export interface ActivityRowProps {
  activity: Activity;
  meta?: ReactNode;
  dateText?: string;
  actions?: ReactNode;
  className?: string;
}

function resolveKindIcon(activity: Activity): string | null {
  if (activity.icon) {
    return activity.icon;
  }
  const fallbackByKind: Record<ActivityKind, string | null> = {
    habit: "sparkles",
    reminder: "sun",
    task: null,
  };
  return fallbackByKind[activity.kind];
}

export function ActivityRow({
  activity,
  meta,
  dateText,
  actions,
  className,
}: ActivityRowProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-surface px-4 py-3 transition-colors hover:border-line-strong",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control bg-surface-muted text-fg-secondary">
          <ActivityIcon icon={resolveKindIcon(activity)} className="h-4 w-4" />
        </div>
        <span className="truncate text-sm font-semibold text-fg">
          {activity.title}
        </span>
        {meta ? (
          <div className="hidden flex-wrap items-center gap-1.5 sm:flex">
            {meta}
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {dateText ? (
          <span className="text-right text-xs text-fg-muted">{dateText}</span>
        ) : null}
        {actions ? (
          <div className="flex items-center gap-1.5">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}
