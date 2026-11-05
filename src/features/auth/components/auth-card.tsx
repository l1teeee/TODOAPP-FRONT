"use client";

import { Check } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { useShellEntrance } from "@/shared/motion/use-entrance";

export interface AuthCardProps {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  /** Links shown in a muted rounded info box below the form. */
  footer?: ReactNode;
  className?: string;
}

// Auth inputs and the submit button are 48 px tall with 12 px radius; the OTP
// boxes (maxlength 1) and checkboxes keep their own sizes.
const FORM_SIZING = [
  "[&_input[type=email]]:h-12 [&_input[type=email]]:rounded-xl",
  "[&_input[type=password]]:h-12 [&_input[type=password]]:rounded-xl",
  "[&_input[type=text]:not([maxlength='1'])]:h-12 [&_input[type=text]:not([maxlength='1'])]:rounded-xl",
  "[&_button[type=submit]]:h-12 [&_button[type=submit]]:rounded-xl",
].join(" ");

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
  className,
}: AuthCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  useShellEntrance(cardRef, { y: 12, delay: 0.08 });

  return (
    <div
      ref={cardRef}
      data-motion="pending"
      className={cn("w-full max-w-[450px]", className)}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-navy-fg">
          <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
        </span>
        <span className="text-[15px] font-semibold text-fg">TODO App</span>
      </div>

      <div className="mb-8 mt-10">
        <h1 className="text-[40px] font-bold leading-[1.1] tracking-tight text-fg">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 text-[15px] text-fg-secondary">{subtitle}</p>
        ) : null}
      </div>

      <div className={FORM_SIZING}>{children}</div>

      {footer ? (
        <div className="mt-6 space-y-1.5 rounded-2xl border border-line bg-surface px-5 py-4 text-sm text-fg-secondary [&_a]:font-semibold [&_a]:text-accent [&_a]:hover:underline">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
