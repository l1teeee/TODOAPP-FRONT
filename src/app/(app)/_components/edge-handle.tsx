"use client";

import { cn } from "@/shared/lib/cn";
import type { ReactNode } from "react";

export interface EdgeHandleProps {
  label: string;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

// 24 px round handle that straddles a panel border; position it from the
// parent with className (for example `right-0 translate-x-1/2`).
export function EdgeHandle({
  label,
  onClick,
  children,
  className,
}: EdgeHandleProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "absolute top-7 z-30 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-fg-secondary shadow-sm transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className,
      )}
    >
      {children}
    </button>
  );
}
