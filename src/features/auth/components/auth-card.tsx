"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { useShellEntrance } from "@/shared/motion/use-entrance";
import { useTheme } from "@/shared/theme/use-theme";
import { BrandMark } from "@/shared/ui/brand-mark";

export interface AuthCardProps {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  /** Links shown in a muted rounded info box below the form. */
  footer?: ReactNode;
  className?: string;
}

// Auth inputs and the submit button are 44 px tall with 10 px radius; the OTP
// boxes (maxlength 1) and checkboxes keep their own sizes.
const FORM_SIZING = [
  "[&_input[type=email]]:h-11 [&_input[type=email]]:rounded-[10px]",
  "[&_input[type=password]]:h-11 [&_input[type=password]]:rounded-[10px]",
  "[&_input[type=text]:not([maxlength='1'])]:h-11 [&_input[type=text]:not([maxlength='1'])]:rounded-[10px]",
  "[&_button[type=submit]]:h-11 [&_button[type=submit]]:rounded-[10px]",
  "[&_label]:text-[13px] [&_label]:font-medium",
].join(" ");

export const authSecondaryLinkClass =
  "inline-flex h-11 w-full items-center justify-center rounded-[10px] border border-line bg-surface text-sm font-medium text-fg transition-colors hover:border-line-strong hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function AuthDivider() {
  return (
    <div className="flex items-center gap-3 text-xs text-fg-muted" role="separator">
      <span className="h-px flex-1 bg-line" />
      <span>or</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
  className,
}: AuthCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  useShellEntrance(cardRef, { y: 12, delay: 0.08 });
  const { resolved } = useTheme();

  return (
    <div
      ref={cardRef}
      data-motion="pending"
      className={cn("w-full max-w-[380px]", className)}
    >
      <div className="flex items-center gap-2.5">
        <BrandMark size={28} variant={resolved === "dark" ? "reverse" : "color"} />
        <span className="text-[14px] font-semibold text-fg">TODO App</span>
      </div>

      <div className="mb-8 mt-12">
        <h1 className="text-[30px] font-bold leading-[1.15] tracking-tight text-fg">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-[14px] text-fg-secondary">{subtitle}</p>
        ) : null}
      </div>

      <div className={FORM_SIZING}>{children}</div>

      {footer ? (
        <div className="mt-8 text-center text-sm text-fg-secondary [&_a]:font-semibold [&_a]:text-accent [&_a]:hover:underline">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
