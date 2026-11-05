"use client";

import { X } from "lucide-react";
import { Dialog as RadixDialog } from "radix-ui";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { IconButton } from "./icon-button";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-fg/40 backdrop-blur-[1px]" />
        <RadixDialog.Content
          className={cn(
            "anim-pop-in fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-card border border-line bg-surface p-6 text-fg shadow-xl focus:outline-none max-h-[90vh] overflow-y-auto",
            className,
          )}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <RadixDialog.Title className="text-base font-semibold text-fg">
                {title}
              </RadixDialog.Title>
              <RadixDialog.Description
                className={cn(
                  "mt-1 text-xs text-fg-secondary",
                  !description && "sr-only",
                )}
              >
                {description ?? title}
              </RadixDialog.Description>
            </div>
            <RadixDialog.Close asChild>
              <IconButton label="Close dialog" size="sm">
                <X className="h-4 w-4" aria-hidden="true" />
              </IconButton>
            </RadixDialog.Close>
          </div>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
