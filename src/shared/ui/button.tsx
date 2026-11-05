import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

export type ButtonVariant = "primary" | "berry" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-fg hover:bg-accent-strong active:scale-[0.99] border border-transparent",
  berry:
    "bg-berry text-white hover:opacity-90 active:scale-[0.99] border border-transparent",
  secondary:
    "bg-surface text-fg border border-line hover:bg-surface-muted hover:border-line-strong active:scale-[0.99]",
  ghost:
    "bg-transparent text-fg-secondary hover:bg-surface-muted hover:text-fg active:scale-[0.99] border border-transparent",
  danger:
    "bg-tag-pink-bg text-tag-pink-fg border border-transparent hover:opacity-90 active:scale-[0.99]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs font-medium rounded-control gap-1.5",
  md: "h-10 px-4 text-sm font-medium rounded-control gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", type = "button", ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
