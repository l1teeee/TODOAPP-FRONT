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
const LARGE_SCREEN = "(min-width: 1024px)";

type MediaMode = "none" | "static" | "play";

function subscribeMediaMode(onChange: () => void): () => void {
  const lists = [LARGE_SCREEN, NO_REDUCED_MOTION].map((query) =>
    window.matchMedia(query),
  );
  for (const list of lists) list.addEventListener("change", onChange);
  return () => {
    for (const list of lists) list.removeEventListener("change", onChange);
  };
}

function getMediaMode(): MediaMode {
  if (!window.matchMedia(LARGE_SCREEN).matches) return "none";
  return window.matchMedia(NO_REDUCED_MOTION).matches ? "play" : "static";
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
        // Set by this run's cleanup; Strict Mode runs the effect twice.
        let disposed = false;

        const fail = () => {
          if (failed || disposed) return;
          failed = true;
          onFail();
        };

        const play = (video: HTMLVideoElement): Promise<void> =>
          video.play().catch((error: unknown) => {
            // pause() or a new load interrupts play() with an AbortError.
            if (disposed) return;
            if (error instanceof DOMException && error.name === "AbortError") {
              return;
            }
            fail();
          });

        const loadInto = (video: HTMLVideoElement, playlistIndex: number) => {
          video.src = PLAYLIST[playlistIndex];
          video.preload = "metadata";
          video.load();
        };

        const swap = () => {
          if (swapping || failed || disposed) return;
          swapping = true;
          const current = layers[active];
          const next = layers[1 - active];
          next.preload = "auto";
          next.currentTime = 0;
          void play(next).then(() => {
            if (failed || disposed) return;
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
                if (disposed) return;
                current.pause();
                active = 1 - active;
                index = (index + 1) % PLAYLIST.length;
                loadInto(current, (index + 1) % PLAYLIST.length);
                swapping = false;
              },
            });
          });
        };

        const handleError = (event: Event) => {
          const video = event.currentTarget;
          if (video instanceof HTMLVideoElement && video.error) {
            fail();
          }
        };

        const handleTimeUpdate = () => {
          if (disposed) return;
          const video = layers[active];
          if (
            Number.isFinite(video.duration) &&
            video.duration - video.currentTime <= CROSSFADE_SECONDS
          ) {
            swap();
          }
        };

        const handleVisibility = () => {
          if (disposed) return;
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
          video.addEventListener("error", handleError);
        }
        document.addEventListener("visibilitychange", handleVisibility);
        void play(first);

        return () => {
          disposed = true;
          document.removeEventListener("visibilitychange", handleVisibility);
          first.removeEventListener("playing", handleFirstPlaying);
          for (const video of layers) {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("ended", swap);
            video.removeEventListener("error", handleError);
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

export function AuthMediaCard({ className }: AuthMediaCardProps) {
  const mode = useSyncExternalStore(
    subscribeMediaMode,
    getMediaMode,
    (): MediaMode => "none",
  );
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-[40px] bg-navy",
        className,
      )}
    >
      {mode === "play" && !videoFailed ? (
        <VideoLoop onFail={() => setVideoFailed(true)} />
      ) : null}
      {mode === "static" || (mode === "play" && videoFailed) ? (
        <video
          aria-hidden="true"
          muted
          playsInline
          preload="metadata"
          src={`${PLAYLIST[0]}#t=0.001`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}

      <div
        aria-hidden="true"
        className="film-grain pointer-events-none absolute -inset-1/2 opacity-[0.12] mix-blend-overlay"
      />

      <div className="absolute bottom-0 left-0 right-0 p-10 xl:p-12">
        <h2 className="text-shadow-soft max-w-[18ch] text-[44px] font-bold leading-[1.08] tracking-tight text-navy-fg">
          Plan your habits, reminders and tasks in one place.
        </h2>
        <p className="text-shadow-soft mt-4 text-base text-navy-fg/70">
          Your day, organized and calm.
        </p>
      </div>
    </div>
  );
}
