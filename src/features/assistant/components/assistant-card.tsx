"use client";

import { RefreshCw, Sparkles } from "lucide-react";
import { Fragment, useRef } from "react";
import {
  gsap,
  markWillChange,
  NO_REDUCED_MOTION,
  useGSAP,
} from "@/shared/motion/gsap";
import { DURATION, EASE } from "@/shared/motion/motion-tokens";
import { useEntrance } from "@/shared/motion/use-entrance";
import { IconButton } from "@/shared/ui/icon-button";
import { Skeleton } from "@/shared/ui/skeleton";
import { useDailyBrief } from "../api/use-daily-brief";
import { composeGreeting, pickNextUp } from "../lib/compose-local-brief";
import type { DailyBriefInput } from "../model/daily-brief";

export interface AssistantCardProps {
  input: DailyBriefInput;
  isLoading?: boolean;
  onSelect: (activityId: string) => void;
}

const CONTAINER_CLASSES =
  "rounded-card bg-navy bg-[radial-gradient(circle_at_90%_0%,color-mix(in_srgb,var(--berry)_45%,transparent),transparent_55%),radial-gradient(circle_at_0%_100%,color-mix(in_srgb,var(--accent)_40%,transparent),transparent_55%)] p-5 text-navy-fg";

function AssistantSkeleton() {
  return (
    <div className={CONTAINER_CLASSES} aria-busy="true">
      <div className="flex items-start gap-4">
        <Skeleton className="h-11 w-11 shrink-0 rounded-full bg-white/10!" />
        <div className="flex-1 space-y-2.5">
          <Skeleton className="h-4 w-1/3 bg-white/10!" />
          <Skeleton className="h-3.5 w-3/4 bg-white/10!" />
          <div className="flex flex-wrap gap-2 pt-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-7 w-32 rounded-full bg-white/10!"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AssistantCard({ input, isLoading, onSelect }: AssistantCardProps) {
  const messageRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  useEntrance(cardRef, !isLoading);
  const { brief, isAiEnabled, isRefreshing, refresh } = useDailyBrief(input);

  useGSAP(
    () => {
      const message = messageRef.current;
      if (!message) return;

      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        gsap.from(message.querySelectorAll("[data-word]"), {
          autoAlpha: 0,
          y: 4,
          duration: DURATION.base,
          ease: EASE.out,
          stagger: 0.02,
          overwrite: "auto",
          onStart: markWillChange,
          clearProps: "all",
        });
      });
      return () => mm.revert();
    },
    { scope: messageRef, dependencies: [brief.message, isLoading] },
  );

  if (isLoading) {
    return <AssistantSkeleton />;
  }

  const nextUp = pickNextUp(input);
  const words = brief.message.split(" ");

  return (
    <section
      ref={cardRef}
      aria-label="Assistant"
      className={CONTAINER_CLASSES}
    >
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-white/20 motion-safe:animate-pulse"
          />
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold">{composeGreeting(input)}</h2>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-navy-muted">
                {brief.source === "ai" ? "AI" : "Smart summary"}
              </span>
            </div>
            {isAiEnabled ? (
              <IconButton
                label="Refresh summary"
                size="sm"
                disabled={isRefreshing}
                onClick={refresh}
                className="text-navy-fg hover:bg-white/10 hover:text-navy-fg"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
              </IconButton>
            ) : null}
          </div>

          <p ref={messageRef} className="mt-1.5 text-sm font-normal text-navy-fg/85">
            {words.map((word, index) => (
              <Fragment key={`${word}-${index}`}>
                {index > 0 ? " " : null}
                <span data-word className="inline-block">
                  {word}
                </span>
              </Fragment>
            ))}
          </p>

          {nextUp.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Next up">
              {nextUp.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(item.id)}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-navy-fg transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
                  >
                    <span className="text-navy-muted">{item.startTime}</span>
                    <span className="truncate">{item.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
