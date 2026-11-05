"use client";

import type { KeyboardEvent } from "react";
import { cn } from "@/shared/lib/cn";
import type { Activity } from "../model/activity";
import { ActivityIcon } from "./activity-icon";

export interface HabitCardProps {
  activity: Activity;
  selected?: boolean;
  onSelect: (id: string) => void;
}

export function HabitCard({ activity, selected, onSelect }: HabitCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(activity.id);
    }
  };

  const timeRange =
    activity.startTime && activity.endTime
      ? `${activity.startTime} - ${activity.endTime}`
      : activity.startTime ?? "All day";

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={() => onSelect(activity.id)}
      onKeyDown={handleKeyDown}
      className={cn(
        "group flex flex-col rounded-card bg-surface p-2.5 transition-all select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        selected
          ? "border-[1.5px] border-accent shadow-xs"
          : "border border-line hover:border-line-strong",
      )}
    >
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded-[10px] bg-habit-art text-accent-fg transition-transform group-hover:scale-[1.01]">
        <ActivityIcon icon={activity.icon} className="h-9 w-9" />
      </div>
      <div className="mt-2.5 px-0.5">
        <p className="truncate text-[14px] font-semibold leading-tight text-fg">
          {activity.title}
        </p>
        <p className="mt-1 text-[12px] text-fg-muted">{timeRange}</p>
      </div>
    </div>
  );
}
