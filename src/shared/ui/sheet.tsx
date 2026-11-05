"use client";

import { X } from "lucide-react";
import { Dialog as RadixDialog } from "radix-ui";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { IconButton } from "./icon-button";

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: "left" | "right";
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Sheet({
  open,
  onOpenChange,
  side = "right",
  title,
  description,
  children,
  className,
}: SheetProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-fg/40 backdrop-blur-[1px]" />
        <RadixDialog.Content
          className={cn(
            "fixed inset-y-0 z-50 flex w-full flex-col bg-surface text-fg shadow-xl focus:outline-none sm:max-w-sm border-line",
            side === "left"
              ? "left-0 sm:border-r"
              : "right-0 sm:border-l",
            className,
          )}
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div>
              <RadixDialog.Title className="text-sm font-semibold text-fg">
                {title}
              </RadixDialog.Title>
              <RadixDialog.Description
                className={cn(
                  "text-xs text-fg-secondary",
                  !description && "sr-only",
                )}
              >
                {description ?? title}
              </RadixDialog.Description>
            </div>
            <RadixDialog.Close asChild>
              <IconButton label="Close panel" size="sm">
                <X className="h-4 w-4" aria-hidden="true" />
              </IconButton>
            </RadixDialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
