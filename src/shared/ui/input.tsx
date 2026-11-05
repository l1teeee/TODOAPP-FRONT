import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  leadingIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, leadingIcon, ...props }, ref) => {
    const input = (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "h-10 w-full rounded-control border bg-surface px-3 text-sm text-fg placeholder:text-fg-muted transition-colors hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50",
          invalid ? "border-tag-pink-fg" : "border-line",
          leadingIcon && "pl-10",
          className,
        )}
        {...props}
      />
    );

    if (!leadingIcon) return input;

    return (
      <div className="relative w-full">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 text-fg-muted"
        >
          {leadingIcon}
        </span>
        {input}
      </div>
    );
  },
);

Input.displayName = "Input";
