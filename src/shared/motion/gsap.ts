import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(useGSAP, Flip);

export const NO_REDUCED_MOTION = "(prefers-reduced-motion: no-preference)";

// Sets will-change only while a tween runs; callers clear it through clearProps.
export function markWillChange(this: gsap.core.Tween): void {
  gsap.set(this.targets(), { willChange: "transform, opacity" });
}

export { gsap, useGSAP, Flip };
