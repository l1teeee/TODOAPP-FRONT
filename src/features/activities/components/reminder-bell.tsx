"use client";

import { Bell } from "lucide-react";
import { EmptyState } from "@/shared/ui/empty-state";
import { IconButton } from "@/shared/ui/icon-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { useActivities } from "../api/use-activities";

export function ReminderBell() {
  const { data: activities } = useActivities({ view: "today" });
  const todayReminders =
    activities?.filter((item) => item.kind === "reminder") ?? [];
  const hasReminders = todayReminders.length > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative inline-flex">
          <IconButton label="Today's reminders">
            <Bell className="h-5 w-5" aria-hidden="true" />
          </IconButton>
          {hasReminders ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-2 top-2 h-2 w-2 rounded-full bg-accent"
            />
          ) : null}
        </div>
      </PopoverTrigger>
      <PopoverContent side="right" align="end">
        <p className="mb-2 text-xs font-semibold text-fg">
          Today&apos;s Reminders
        </p>
        {todayReminders.length === 0 ? (
          <EmptyState
            title="No reminders today"
            className="py-4 px-3"
          />
        ) : (
          <ul className="space-y-1.5">
            {todayReminders.map((reminder) => (
              <li
                key={reminder.id}
                className="flex items-center justify-between gap-2 rounded-md bg-surface-muted px-2.5 py-2 text-xs"
              >
                <span className="truncate font-medium text-fg">
                  {reminder.title}
                </span>
                <span className="shrink-0 font-semibold text-fg-secondary">
                  {reminder.startTime ?? "--:--"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
