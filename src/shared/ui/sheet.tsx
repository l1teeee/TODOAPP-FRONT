"use client";

import { X } from "lucide-react";
import { Dialog as RadixDialog } from "radix-ui";
import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { gsap, markWillChange, NO_REDUCED_MOTION, useGSAP } from "@/shared/motion/gsap";
import { DURATION, EASE } from "@/shared/motion/motion-tokens";
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
  const [present, setPresent] = useState(open);
  const [overlayEl, setOverlayEl] = useState<HTMLDivElement | null>(null);
  const [panelEl, setPanelEl] = useState<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  if (open && !present) {
    setPresent(true);
  }

  useGSAP(
    () => {
      if (!overlayEl || !panelEl) return;
      const direction = side === "left" ? -1 : 1;

      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        if (!open) {
          timelineRef.current?.timeScale(1.6).reverse();
          return;
        }
        if (timelineRef.current) {
          timelineRef.current.timeScale(1).play();
          return;
        }

        const items = bodyRef.current ? Array.from(bodyRef.current.children) : [];
        const timeline = gsap.timeline({
          paused: true,
          onReverseComplete: () => {
            timelineRef.current = null;
            setPresent(false);
          },
        });
        timeline
          .fromTo(
            overlayEl,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: DURATION.slow, ease: EASE.out },
            0,
          )
          .fromTo(
            panelEl,
            { xPercent: 100 * direction },
            {
              xPercent: 0,
              duration: DURATION.slow,
              ease: EASE.out,
              onStart: markWillChange,
            },
            0,
          )
          .fromTo(
            items,
            { autoAlpha: 0, x: (side === "left" ? -24 : 16) },
            {
              autoAlpha: 1,
              x: 0,
              duration: DURATION.base,
              ease: EASE.out,
              stagger: 0.04,
            },
            0.12,
          );
        timelineRef.current = timeline;
        timeline.play();
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (!open) setPresent(false);
      });
    },
    { dependencies: [open, overlayEl, panelEl, side] },
  );

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal forceMount>
        {present ? (
          <>
            <RadixDialog.Overlay
              ref={setOverlayEl}
              forceMount
              className="fixed inset-0 z-40 bg-fg/40 backdrop-blur-[1px]"
            />
            <RadixDialog.Content
              ref={setPanelEl}
              forceMount
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
              <div ref={bodyRef} className="flex-1 overflow-y-auto">
                {children}
              </div>
            </RadixDialog.Content>
          </>
        ) : null}
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
