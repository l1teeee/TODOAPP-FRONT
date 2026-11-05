"use client";

import { useRef, type RefObject } from "react";
import { DURATION, EASE } from "./motion-tokens";
import { Flip, gsap, markWillChange, NO_REDUCED_MOTION, useGSAP } from "./gsap";

/**
 * Fades and lifts the children of the referenced element in, once per mount,
 * the first time `ready` is true (data arrived).
 */
export function useEntrance(
  ref: RefObject<HTMLElement | null>,
  ready: boolean,
): void {
  const playedRef = useRef(false);

  useGSAP(
    () => {
      const container = ref.current;
      if (!ready || playedRef.current || !container) return;

      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        gsap.from(container.children, {
          autoAlpha: 0,
          y: 8,
          duration: DURATION.base,
          ease: EASE.out,
          stagger: 0.04,
          overwrite: "auto",
          onStart: markWillChange,
          onComplete: () => {
            playedRef.current = true;
          },
          clearProps: "all",
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [ready] },
  );
}

export interface ShellEntranceOptions {
  x?: number;
  y?: number;
  delay?: number;
  /** Selector of descendants that also stagger in (y 6 -> 0). */
  itemSelector?: string;
}

/**
 * First-load entrance for an app shell element carrying data-motion="pending".
 * Inline styles set by GSAP take over from the CSS hiding rule, then clear.
 */
export function useShellEntrance(
  ref: RefObject<HTMLElement | null>,
  { x = 0, y = 0, delay = 0, itemSelector }: ShellEntranceOptions = {},
): void {
  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;

      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, x, y },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: DURATION.base,
            ease: EASE.out,
            delay,
            overwrite: "auto",
            onStart: markWillChange,
            clearProps: "all",
          },
        );
        element.dataset.motion = "done";

        if (itemSelector) {
          gsap.from(element.querySelectorAll(itemSelector), {
            autoAlpha: 0,
            y: 6,
            duration: DURATION.base,
            ease: EASE.out,
            stagger: 0.03,
            delay: delay + 0.05,
            overwrite: "auto",
            onStart: markWillChange,
            clearProps: "all",
          });
        }
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
}

/**
 * Keeps one indicator element and re-parents it into the active link of the
 * nav, animating the move with Flip.
 */
export function useActiveIndicator(
  navRef: RefObject<HTMLElement | null>,
  activeKey: string,
  indicatorClassName: string,
): void {
  const indicatorRef = useRef<HTMLSpanElement | null>(null);

  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav) return;
      const activeLink = nav.querySelector<HTMLElement>('[aria-current="page"]');

      let indicator = indicatorRef.current;
      if (!activeLink) {
        indicator?.remove();
        indicatorRef.current = null;
        return;
      }
      if (!indicator) {
        indicator = document.createElement("span");
        indicator.setAttribute("aria-hidden", "true");
        indicator.className = indicatorClassName;
        indicatorRef.current = indicator;
        activeLink.appendChild(indicator);
        return;
      }
      if (indicator.parentElement === activeLink) return;

      const state = Flip.getState(indicator);
      activeLink.appendChild(indicator);

      const mm = gsap.matchMedia();
      mm.add(NO_REDUCED_MOTION, () => {
        Flip.from(state, { duration: 0.35, ease: EASE.flip, overwrite: "auto" });
      });
    },
    { scope: navRef, dependencies: [activeKey] },
  );
}
