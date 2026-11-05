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
    "bg-accent text-accent-fg hover:bg-accent-strong border border-transparent",
  berry:
    "bg-berry text-white hover:opacity-90 border border-transparent",
  secondary:
    "bg-surface text-fg border border-line hover:bg-surface-muted hover:border-line-strong",
  ghost:
    "bg-transparent text-fg-secondary hover:bg-surface-muted hover:text-fg border border-transparent",
  danger:
    "bg-tag-pink-bg text-tag-pink-fg border border-transparent hover:opacity-90",
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
          "btn relative inline-flex items-center justify-center transition-[translate,scale,opacity,background-color,border-color,color] duration-150 ease-out select-none motion-safe:hover:-translate-y-px motion-safe:active:scale-[0.97] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:shadow-md after:transition-opacity after:duration-150 hover:after:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
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
