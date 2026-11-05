"use client";

import { Sparkles } from "lucide-react";
import { EmptyState } from "@/shared/ui/empty-state";
import { Skeleton } from "@/shared/ui/skeleton";
import type { Activity } from "../model/activity";
import { HabitCard } from "./habit-card";

export interface HabitsSectionProps {
  habits: Activity[];
  isLoading?: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function HabitsSection({
  habits,
  isLoading,
  selectedId,
  onSelect,
}: HabitsSectionProps) {
  return (
    <section aria-labelledby="habits-heading" aria-busy={isLoading}>
      <h2
        id="habits-heading"
        className="mb-3 text-base font-semibold text-fg"
      >
        Your Habits
      </h2>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-36 w-full rounded-card" />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
          title="No habits yet"
        />
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory xl:grid xl:grid-cols-5 xl:overflow-visible xl:pb-0">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="w-44 shrink-0 snap-start xl:w-auto xl:shrink"
            >
              <HabitCard
                activity={habit}
                selected={selectedId === habit.id}
                onSelect={onSelect}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
