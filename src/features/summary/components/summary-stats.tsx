"use client";

import { AlertTriangle, CheckCircle2, Clock, Layers } from "lucide-react";
import { useRef } from "react";
import { useEntrance } from "@/shared/motion/use-entrance";
import type { Summary } from "../model/summary";

export interface SummaryStatsProps {
  summary: Summary;
}

export function SummaryStats({ summary }: SummaryStatsProps) {
  const total =
    summary.byStatus.todo +
    summary.byStatus.inProgress +
    summary.byStatus.completed;

  const gridRef = useRef<HTMLDivElement>(null);
  useEntrance(gridRef, true);

  const tiles = [
    {
      label: "Total",
      value: total,
      icon: Layers,
      iconClass: "bg-white/10 text-navy-fg",
    },
    {
      label: "Completed in 7 days",
      value: summary.completedLast7Days,
      icon: CheckCircle2,
      iconClass: "bg-white/10 text-navy-fg",
    },
    {
      label: "In progress",
      value: summary.byStatus.inProgress,
      icon: Clock,
      iconClass: "bg-white/10 text-navy-fg",
    },
    {
      label: "Overdue reminders",
      value: summary.overdueReminders,
      icon: AlertTriangle,
      iconClass: "bg-white/10 text-navy-fg",
    },
  ] as const;

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4"
    >
      {tiles.map((tile) => {
        const Icon = tile.icon;
        return (
          <div
            key={tile.label}
            className="flex items-start justify-between rounded-card border border-line bg-navy p-4"
          >
            <div>
              <p className="text-xs font-semibold text-navy-muted">
                {tile.label}
              </p>
              <p className="mt-2 text-[28px] font-extrabold md:text-2xl tracking-tight text-navy-fg">
                {tile.value}
              </p>
            </div>
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tile.iconClass}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
