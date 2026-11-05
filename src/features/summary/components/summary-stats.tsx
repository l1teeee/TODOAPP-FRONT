import { AlertTriangle, CheckCircle2, Clock, Layers } from "lucide-react";
import type { Summary } from "../model/summary";

export interface SummaryStatsProps {
  summary: Summary;
}

export function SummaryStats({ summary }: SummaryStatsProps) {
  const total =
    summary.byStatus.todo +
    summary.byStatus.inProgress +
    summary.byStatus.completed;

  const tiles = [
    {
      label: "Total",
      value: total,
      icon: Layers,
      iconClass: "bg-tag-blue-bg text-tag-blue-fg",
    },
    {
      label: "Completed in 7 days",
      value: summary.completedLast7Days,
      icon: CheckCircle2,
      iconClass: "bg-tag-green-bg text-tag-green-fg",
    },
    {
      label: "In progress",
      value: summary.byStatus.inProgress,
      icon: Clock,
      iconClass: "bg-tag-orange-bg text-tag-orange-fg",
    },
    {
      label: "Overdue reminders",
      value: summary.overdueReminders,
      icon: AlertTriangle,
      iconClass: "bg-tag-pink-bg text-tag-pink-fg",
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {tiles.map((tile) => {
        const Icon = tile.icon;
        return (
          <div
            key={tile.label}
            className="flex items-start justify-between rounded-card border border-line bg-surface p-4"
          >
            <div>
              <p className="text-xs font-semibold text-fg-secondary">
                {tile.label}
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-fg">
                {tile.value}
              </p>
            </div>
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-control ${tile.iconClass}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
