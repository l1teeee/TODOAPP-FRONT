import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> {
  label: string;
  variant?: "ghost" | "secondary" | "active";
  size?: "sm" | "md";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      label,
      variant = "ghost",
      size = "md",
      className,
      type = "button",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        className={cn(
          "icon-anim inline-flex items-center justify-center rounded-control transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variant === "ghost" &&
            "text-fg-secondary hover:bg-surface-muted hover:text-fg",
          variant === "secondary" &&
            "bg-surface text-fg border border-line hover:bg-surface-muted hover:border-line-strong",
          variant === "active" && "bg-accent-soft text-accent",
          size === "sm" ? "h-7 w-7" : "h-9 w-9",
          className,
        )}
        {...props}
      />
    );
  },
);

IconButton.displayName = "IconButton";
