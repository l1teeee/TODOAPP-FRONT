"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  gsap,
  markWillChange,
  NO_REDUCED_MOTION,
  useGSAP,
} from "@/shared/motion/gsap";
import { DURATION, EASE } from "@/shared/motion/motion-tokens";
import { MeshGradientSurface } from "@/shared/ui/mesh-gradient-surface";
import { Skeleton } from "@/shared/ui/skeleton";
import { useDailyBrief } from "../api/use-daily-brief";
import { AssistantMark } from "./assistant-mark";
import { composeLocalBrief } from "../lib/compose-local-brief";
import type { DailyBriefInput } from "../model/daily-brief";

const TYPING_CHARACTERS_PER_SECOND = 28;
const HERO_CLASSES =
  "relative min-h-[220px] overflow-hidden rounded-[24px] border border-line bg-surface";

export interface AssistantHeroProps {
  input: DailyBriefInput;
  isLoading?: boolean;
  onSelect: (activityId: string) => void;
  /** Rendered at the top right (below the text on small screens). */
  action?: ReactNode;
}

function HeroSkeleton({ action }: { action?: ReactNode }) {
  return (
    <div className={HERO_CLASSES} aria-busy="true">
      <div className="relative z-10 flex flex-col gap-4 p-8 md:flex-row md:justify-between">
        <div className="w-full max-w-md space-y-3">
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-5 w-full" />
          <div className="flex flex-wrap gap-2 pt-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-7 w-32 rounded-full" />
            ))}
          </div>
        </div>
        {action}
      </div>
    </div>
  );
}

export function AssistantHero({
  input,
  isLoading,
  onSelect,
  action,
}: AssistantHeroProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const chipsRef = useRef<HTMLUListElement>(null);
  const [typing, setTyping] = useState(false);
  const { brief } = useDailyBrief(input);
  const local = composeLocalBrief(input);
  const message = brief.message;

  useGSAP(
    () => {
      const text = textRef.current;
      if (isLoading || !text) return;
      const chips = chipsRef.current;

      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        setTyping(true);
        if (chips) gsap.set(chips, { autoAlpha: 0 });
        // Writes textContent only; the message can contain user-provided text.
        const progress = { characters: 0 };
        text.textContent = "";
        gsap.to(progress, {
          characters: message.length,
          duration: message.length / TYPING_CHARACTERS_PER_SECOND,
          ease: "none",
          onUpdate: () => {
            text.textContent = message.slice(0, Math.round(progress.characters));
          },
          onComplete: () => {
            setTyping(false);
            if (chips) {
              gsap.fromTo(
                chips,
                { autoAlpha: 0, y: 6 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: DURATION.base,
                  ease: EASE.out,
                  onStart: markWillChange,
                  clearProps: "all",
                },
              );
            }
          },
        });
        return () => setTyping(false);
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        text.textContent = message;
      });
      return () => mm.revert();
    },
    { dependencies: [message, isLoading] },
  );

  if (isLoading) {
    return <HeroSkeleton action={action} />;
  }

  const chips = [
    ...(local.nextTask ? [local.nextTask] : []),
    ...local.rest,
  ];

  return (
    <section aria-label="Assistant" className={HERO_CLASSES}>
      <MeshGradientSurface />
      <div className="relative z-10 flex flex-col gap-5 p-8 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface/70 px-3 py-1 text-xs font-semibold text-fg-secondary">
            <AssistantMark size={16} typing={typing} />
            {brief.source === "ai" ? "AI assistant" : "Smart summary"}
          </span>
          <div className="mt-4 flex items-center gap-3">
            <AssistantMark size={40} typing={typing} />
            <h1 className="text-[36px] font-bold leading-tight tracking-tight text-fg md:text-[40px]">
              {local.firstName ? `Hi, ${local.firstName}` : "Hi there"}
            </h1>
          </div>
          <p className="mt-2 text-lg text-fg-secondary">
            <span className="sr-only">{message}</span>
            <span ref={textRef} aria-hidden="true" />
            <span
              aria-hidden="true"
              className={typing ? "assistant-caret" : "assistant-caret assistant-caret-done"}
            />
          </p>
          {chips.length > 0 ? (
            <ul
              ref={chipsRef}
              className="mt-5 flex flex-wrap gap-2"
              aria-label="Next up"
            >
              {chips.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(item.id)}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-surface/80 px-3 py-1 text-xs font-semibold text-fg transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
                  >
                    <span className="font-semibold text-accent">
                      {item.startTime}
                    </span>
                    <span className="truncate">{item.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {action}
      </div>
    </section>
  );
}
