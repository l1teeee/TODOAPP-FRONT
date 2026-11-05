"use client";

import { Bell, CheckSquare, Sparkles } from "lucide-react";
import { useSummary } from "@/features/summary/api/use-summary";
import { StatusBars } from "@/features/summary/components/status-bars";
import { SummaryStats } from "@/features/summary/components/summary-stats";
import { Skeleton } from "@/shared/ui/skeleton";

export function SummaryView() {
  const { data: summary, isLoading } = useSummary();

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-fg">Summary</h1>
        <p className="mt-1 text-xs text-fg-secondary">
          Overview of your habits, reminders and tasks.
        </p>
      </header>

      {isLoading || !summary ? (
        <div className="space-y-6" aria-busy="true">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Skeleton className="h-24 w-full rounded-card" />
            <Skeleton className="h-24 w-full rounded-card" />
            <Skeleton className="h-24 w-full rounded-card" />
            <Skeleton className="h-24 w-full rounded-card" />
          </div>
          <Skeleton className="h-48 w-full rounded-card" />
          <Skeleton className="h-32 w-full rounded-card" />
        </div>
      ) : (
        <>
          <SummaryStats summary={summary} />

          <StatusBars byStatus={summary.byStatus} />

          <section className="rounded-card border border-line bg-surface p-5">
            <h2 className="text-sm font-semibold text-fg">By kind</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center justify-between rounded-control border border-line bg-surface-muted/50 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Sparkles
                    className="h-4 w-4 text-tag-purple-fg"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-semibold text-fg">Habits</span>
                </div>
                <span className="text-base font-bold text-fg">
                  {summary.byKind.habit}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-control border border-line bg-surface-muted/50 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Bell
                    className="h-4 w-4 text-tag-orange-fg"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-semibold text-fg">
                    Reminders
                  </span>
                </div>
                <span className="text-base font-bold text-fg">
                  {summary.byKind.reminder}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-control border border-line bg-surface-muted/50 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <CheckSquare
                    className="h-4 w-4 text-tag-blue-fg"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-semibold text-fg">Tasks</span>
                </div>
                <span className="text-base font-bold text-fg">
                  {summary.byKind.task}
                </span>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
