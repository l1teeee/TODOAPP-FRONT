import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export type AlertVariant = "error" | "success" | "info";

export interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<AlertVariant, string> = {
  error: "bg-berry-soft text-berry border-line",
  success: "bg-tag-green-bg text-success border-line",
  info: "bg-tag-blue-bg text-tag-blue-fg border-line",
};

function AlertIcon({ variant }: { variant: AlertVariant }) {
  const iconClass = "mt-0.5 h-4 w-4 shrink-0";
  switch (variant) {
    case "error":
      return <AlertCircle className={iconClass} aria-hidden="true" />;
    case "success":
      return <CheckCircle2 className={iconClass} aria-hidden="true" />;
    case "info":
      return <Info className={iconClass} aria-hidden="true" />;
  }
}

export function Alert({ variant = "info", children, className }: AlertProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-control border px-3.5 py-2.5 text-xs font-medium leading-relaxed",
        variantStyles[variant],
        className,
      )}
    >
      <AlertIcon variant={variant} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
