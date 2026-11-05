import { ChevronDown } from "lucide-react";
import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          aria-invalid={invalid || undefined}
          className={cn(
            "h-10 w-full appearance-none rounded-control border bg-surface pl-3 pr-9 text-sm text-fg transition-colors hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50",
            invalid ? "border-tag-pink-fg" : "border-line",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted"
        />
      </div>
    );
  },
);

Select.displayName = "Select";
