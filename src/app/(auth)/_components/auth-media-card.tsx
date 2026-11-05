"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/shared/lib/cn";
import { gsap, NO_REDUCED_MOTION, useGSAP } from "@/shared/motion/gsap";

const PLAYLIST = [
  "/videos/auth-1.mp4",
  "/videos/auth-2.mp4",
  "/videos/auth-3.mp4",
] as const;

const CROSSFADE_SECONDS = 0.8;
const VIDEO_QUERIES = [
  "(min-width: 1024px)",
  NO_REDUCED_MOTION,
] as const;

function subscribeVideoQueries(onChange: () => void): () => void {
  const lists = VIDEO_QUERIES.map((query) => window.matchMedia(query));
  for (const list of lists) list.addEventListener("change", onChange);
  return () => {
    for (const list of lists) list.removeEventListener("change", onChange);
  };
}

function videosAllowed(): boolean {
  return VIDEO_QUERIES.every((query) => window.matchMedia(query).matches);
}

export interface AuthMediaCardProps {
  className?: string;
}

interface VideoLoopProps {
  onFail: () => void;
}

// Two stacked videos play the playlist in order; shortly before the active one
// ends the next starts from 0 and the layers cross-fade, then swap roles.
function VideoLoop({ onFail }: VideoLoopProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLVideoElement>(null);
  const secondRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const first = firstRef.current;
      const second = secondRef.current;
      if (!first || !second) return;

      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        const layers = [first, second];
        let active = 0;
        let index = 0;
        let swapping = false;
        let failed = false;

        const fail = () => {
          if (failed) return;
          failed = true;
          onFail();
        };

        const play = (video: HTMLVideoElement): Promise<void> =>
          video.play().catch(fail);

        const loadInto = (video: HTMLVideoElement, playlistIndex: number) => {
          video.src = PLAYLIST[playlistIndex];
          video.preload = "metadata";
          video.load();
        };

        const swap = () => {
          if (swapping || failed) return;
          swapping = true;
          const current = layers[active];
          const next = layers[1 - active];
          next.preload = "auto";
          next.currentTime = 0;
          void play(next).then(() => {
            if (failed) return;
            gsap.to(next, {
              autoAlpha: 1,
              duration: CROSSFADE_SECONDS,
              ease: "power2.inOut",
            });
            gsap.to(current, {
              autoAlpha: 0,
              duration: CROSSFADE_SECONDS,
              ease: "power2.inOut",
              onComplete: () => {
                current.pause();
                active = 1 - active;
                index = (index + 1) % PLAYLIST.length;
                loadInto(current, (index + 1) % PLAYLIST.length);
                swapping = false;
              },
            });
          });
        };

        const handleTimeUpdate = () => {
          const video = layers[active];
          if (
            Number.isFinite(video.duration) &&
            video.duration - video.currentTime <= CROSSFADE_SECONDS
          ) {
            swap();
          }
        };

        const handleVisibility = () => {
          const video = layers[active];
          if (document.hidden) {
            video.pause();
          } else if (!swapping) {
            void play(video);
          }
        };

        gsap.set(layers, { autoAlpha: 0 });
        first.src = PLAYLIST[0];
        first.preload = "auto";
        loadInto(second, 1);

        const handleFirstPlaying = () => {
          gsap.to(first, {
            autoAlpha: 1,
            duration: CROSSFADE_SECONDS,
            ease: "power2.inOut",
          });
        };

        first.addEventListener("playing", handleFirstPlaying, { once: true });
        for (const video of layers) {
          video.addEventListener("timeupdate", handleTimeUpdate);
          video.addEventListener("ended", swap);
          video.addEventListener("error", fail);
        }
        document.addEventListener("visibilitychange", handleVisibility);
        void play(first);

        return () => {
          document.removeEventListener("visibilitychange", handleVisibility);
          first.removeEventListener("playing", handleFirstPlaying);
          for (const video of layers) {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("ended", swap);
            video.removeEventListener("error", fail);
            video.pause();
          }
        };
      });
      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} aria-hidden="true" className="absolute inset-0">
      <video
        ref={firstRef}
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      <video
        ref={secondRef}
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

const BLOB_BASE = "absolute rounded-full blur-3xl";

export function AuthMediaCard({ className }: AuthMediaCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videosEnabled = useSyncExternalStore(
    subscribeVideoQueries,
    videosAllowed,
    () => false,
  );
  const [videoFailed, setVideoFailed] = useState(false);

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
      </div>

      {videosEnabled && !videoFailed ? (
        <VideoLoop onFail={() => setVideoFailed(true)} />
      ) : null}

      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
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
