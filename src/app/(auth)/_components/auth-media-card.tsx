"use client";

import { useRef } from "react";
import { gsap, NO_REDUCED_MOTION, useGSAP } from "@/shared/motion/gsap";
import { cn } from "@/shared/lib/cn";

export interface AuthMediaCardProps {
  /** Reserved for a looping background video; not used yet. */
  videoSrc?: string;
  className?: string;
}

const BLOB_BASE = "absolute rounded-full blur-3xl";

export function AuthMediaCard({ videoSrc, className }: AuthMediaCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        const drift = (
          selector: string,
          vars: { x: number; y: number; scale: number; duration: number },
        ) => {
          gsap.to(selector, {
            x: vars.x,
            y: vars.y,
            scale: vars.scale,
            duration: vars.duration,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        };
        drift("[data-blob='accent']", { x: 90, y: 60, scale: 1.2, duration: 16 });
        drift("[data-blob='berry']", { x: -80, y: -70, scale: 1.15, duration: 20 });
        drift("[data-blob='lavender']", { x: 60, y: -90, scale: 1.25, duration: 12 });
      });
      return () => mm.revert();
    },
    { scope: cardRef },
  );

  return (
    <div
      ref={cardRef}
      data-video-src={videoSrc}
      className={cn(
        "relative h-full w-full overflow-hidden rounded-[40px] bg-navy",
        className,
      )}
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div
          data-blob="accent"
          className={cn(
            BLOB_BASE,
            "-left-24 top-10 h-[28rem] w-[28rem] bg-accent/60",
          )}
        />
        <div
          data-blob="berry"
          className={cn(
            BLOB_BASE,
            "-right-20 top-1/3 h-[26rem] w-[26rem] bg-berry/50",
          )}
        />
        <div
          data-blob="lavender"
          className={cn(
            BLOB_BASE,
            "bottom-0 left-1/4 h-[24rem] w-[24rem] bg-tag-purple-fg/50",
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(var(--color-navy-fg)_1px,transparent_1px)] [background-size:3px_3px]" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-10 xl:p-12">
        <h2 className="max-w-[18ch] text-[44px] font-bold leading-[1.08] tracking-tight text-navy-fg">
          Plan your habits, reminders and tasks in one place.
        </h2>
        <p className="mt-4 text-base text-navy-fg/70">
          Your day, organized and calm.
        </p>
      </div>
    </div>
  );
}
