"use client";

import { cn } from "@/shared/lib/cn";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentOrigin {
  x: number;
  y: number;
}

export interface SegmentedControlProps<T extends string> {
  label: string;
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T, origin: SegmentOrigin) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  const selectedIndex = options.findIndex((option) => option.value === value);

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "relative grid grid-cols-3 gap-1 rounded-control bg-surface-muted p-1 border border-line",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute left-1 top-1 h-8 rounded-md bg-surface shadow-xs motion-safe:transition-[translate] motion-safe:duration-[350ms] motion-safe:ease-[cubic-bezier(0.215,0.61,0.355,1)]"
        style={{
          width: "calc((100% - 1rem) / 3)",
          translate: `calc(${Math.max(selectedIndex, 0)} * (100% + 0.25rem)) 0`,
        }}
      />
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              onChange(option.value, {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
              });
            }}
            className={cn(
              "relative z-10 h-8 rounded-md px-3 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98] cursor-pointer",
              selected ? "text-fg" : "text-fg-secondary hover:text-fg",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
