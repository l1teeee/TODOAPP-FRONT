import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export interface AuthCardProps {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full rounded-card border border-line bg-surface p-6 sm:p-7",
        className,
      )}
    >
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold leading-tight tracking-tight text-fg">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1.5 text-[14px] text-fg-secondary">{subtitle}</p>
        ) : null}
      </div>

      <div>{children}</div>

      {footer ? (
        <div className="mt-6 border-t border-line pt-4 text-center text-xs text-fg-secondary">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
