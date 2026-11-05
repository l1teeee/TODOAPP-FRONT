"use client";

import { Bell } from "lucide-react";
import type { ReactNode } from "react";
import { EmptyState } from "@/shared/ui/empty-state";
import { Skeleton } from "@/shared/ui/skeleton";
import type { Activity } from "../model/activity";
import { ReminderCard } from "./reminder-card";

export interface RemindersSectionProps {
  reminders: Activity[];
  isLoading?: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  renderMeta?: (activity: Activity) => ReactNode;
  renderActions?: (activity: Activity) => ReactNode;
}

export function RemindersSection({
  reminders,
  isLoading,
  selectedId,
  onSelect,
  renderMeta,
  renderActions,
}: RemindersSectionProps) {
  return (
    <section aria-labelledby="reminders-heading" aria-busy={isLoading}>
      <h2
        id="reminders-heading"
        className="mb-3 text-base font-semibold text-fg"
      >
        Reminders
      </h2>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-card" />
          ))}
        </div>
      ) : reminders.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-4 w-4" aria-hidden="true" />}
          title="No reminders for this day"
        />
      ) : (
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3">
          {reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              activity={reminder}
              selected={selectedId === reminder.id}
              onSelect={onSelect}
              meta={renderMeta?.(reminder)}
              actions={renderActions?.(reminder)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
