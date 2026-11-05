"use client";

import { MapPin } from "lucide-react";
import type { KeyboardEvent, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import type { Activity } from "../model/activity";

export interface ReminderCardProps {
  activity: Activity;
  selected?: boolean;
  onSelect: (id: string) => void;
  meta?: ReactNode;
  actions?: ReactNode;
}

export function ReminderCard({
  activity,
  selected,
  onSelect,
  meta,
  actions,
}: ReminderCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(activity.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={() => onSelect(activity.id)}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex flex-col justify-between rounded-card bg-surface p-4 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        selected
          ? "border-[1.5px] border-accent shadow-xs"
          : "border border-line hover:border-line-strong",
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 min-h-[1.25rem]">
            {meta}
          </div>
          {actions ? (
            <div
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            >
              {actions}
            </div>
          ) : null}
        </div>
        <h3
          className={cn(
            "mt-2.5 text-[15px] font-semibold text-fg",
            activity.status === "completed" && "line-through text-fg-muted",
          )}
        >
          {activity.title}
        </h3>
        {activity.description ? (
          <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-fg-secondary">
            {activity.description}
          </p>
        ) : null}
      </div>

      <div>
        <div className="my-3 h-px bg-line" />
        <div className="flex items-center justify-between gap-2 text-xs text-fg-secondary">
          <span className="inline-flex items-center gap-1.5 truncate font-medium">
            <MapPin
              className="h-3.5 w-3.5 shrink-0 text-fg-muted"
              aria-hidden="true"
            />
            <span className="truncate">{activity.location ?? "No location"}</span>
          </span>
          <span className="shrink-0 font-semibold text-fg">
            {activity.startTime ?? "--:--"}
          </span>
        </div>
      </div>
    </div>
  );
}
