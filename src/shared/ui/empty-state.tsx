import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  text?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  text,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-card border border-dashed border-line bg-surface/60 px-6 py-8 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-fg-muted">
          {icon}
        </div>
      ) : null}
      <p className="text-sm font-semibold text-fg">{title}</p>
      {text ? <p className="mt-1 text-xs text-fg-secondary">{text}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
