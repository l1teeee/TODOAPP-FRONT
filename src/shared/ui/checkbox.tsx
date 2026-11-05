import { Check } from "lucide-react";
import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  invalid?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, invalid, checked, ...props }, ref) => {
    return (
      <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          aria-invalid={invalid || undefined}
          className={cn(
            "peer h-5 w-5 cursor-pointer appearance-none rounded-md border bg-surface transition-all hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95 checked:border-success checked:bg-success disabled:cursor-not-allowed disabled:opacity-50",
            invalid ? "border-tag-pink-fg" : "border-line-strong",
            className,
          )}
          {...props}
        />
        <Check
          aria-hidden="true"
          strokeWidth={3}
          className="pointer-events-none absolute h-3.5 w-3.5 text-surface opacity-0 transition-opacity peer-checked:opacity-100"
        />
      </span>
    );
  },
);

Checkbox.displayName = "Checkbox";
