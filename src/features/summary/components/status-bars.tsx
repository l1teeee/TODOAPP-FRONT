import type { Summary } from "../model/summary";

export interface StatusBarsProps {
  byStatus: Summary["byStatus"];
}

export function StatusBars({ byStatus }: StatusBarsProps) {
  const total = byStatus.todo + byStatus.inProgress + byStatus.completed;

  const rows = [
    {
      label: "To Do",
      count: byStatus.todo,
      barClass: "bg-accent",
    },
    {
      label: "In Progress",
      count: byStatus.inProgress,
      barClass: "bg-berry",
    },
    {
      label: "Completed",
      count: byStatus.completed,
      barClass: "bg-navy",
    },
  ] as const;

  return (
    <div className="rounded-card border border-line bg-surface p-5">
      <h2 className="text-sm font-semibold text-fg">By status</h2>
      <div className="mt-4 space-y-4">
        {rows.map((row) => {
          const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
          return (
            <div key={row.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-fg">{row.label}</span>
                <span className="text-fg-secondary">
                  {row.count} ({pct}%)
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-muted">
                <div
                  className={`h-full rounded-full transition-all ${row.barClass}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
