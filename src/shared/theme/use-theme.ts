"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "todo-theme";
const THEME_EVENT = "todo-theme-change";
const REVEAL_DURATION_MS = 750;
const REVEAL_EASING = "cubic-bezier(0.65, 0, 0.35, 1)";
const FADE_CLASS_DURATION_MS = 320;

export interface ThemeOrigin {
  x: number;
  y: number;
}

function subscribePreference(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      onStoreChange();
    }
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(THEME_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(THEME_EVENT, onStoreChange);
  };
}

function getPreferenceSnapshot(): ThemePreference {
  if (typeof window === "undefined") {
    return "light";
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "light";
}

function getServerPreferenceSnapshot(): ThemePreference {
  return "light";
}

function subscribeSystemDark(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onStoreChange);
  return () => {
    media.removeEventListener("change", onStoreChange);
  };
}

function getSystemDarkSnapshot(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getServerSystemDarkSnapshot(): boolean {
  return false;
}

function commitPreference(next: ThemePreference): void {
  window.localStorage.setItem(STORAGE_KEY, next);
  document.documentElement.dataset.theme = next;
  flushSync(() => {
    window.dispatchEvent(new Event(THEME_EVENT));
  });
}

function revealFrom(origin: ThemeOrigin): { clipPath: string[] } {
  const radius = Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y),
  );
  return {
    clipPath: [
      `circle(0px at ${origin.x}px ${origin.y}px)`,
      `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
    ],
  };
}

function applyPreference(next: ThemePreference, origin?: ThemeOrigin): void {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reducedMotion) {
    commitPreference(next);
    return;
  }

  if (typeof document.startViewTransition !== "function") {
    const root = document.documentElement;
    root.classList.add("theme-fading");
    commitPreference(next);
    window.setTimeout(() => {
      root.classList.remove("theme-fading");
    }, FADE_CLASS_DURATION_MS);
    return;
  }

  const transition = document.startViewTransition(() => {
    commitPreference(next);
  });
  if (!origin) return;

  void transition.ready.then(() => {
    const options = {
      duration: REVEAL_DURATION_MS,
      easing: REVEAL_EASING,
      fill: "forwards" as const,
    };
    document.documentElement.animate(revealFrom(origin), {
      ...options,
      pseudoElement: "::view-transition-new(root)",
    });
    document.documentElement.animate(
      { opacity: [1, 0.85] },
      { ...options, pseudoElement: "::view-transition-old(root)" },
    );
  });
}

export function useTheme(): {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (p: ThemePreference, origin?: ThemeOrigin) => void;
} {
  const preference = useSyncExternalStore(
    subscribePreference,
    getPreferenceSnapshot,
    getServerPreferenceSnapshot,
  );

  const systemIsDark = useSyncExternalStore(
    subscribeSystemDark,
    getSystemDarkSnapshot,
    getServerSystemDarkSnapshot,
  );

  const resolved: ResolvedTheme =
    preference === "system" ? (systemIsDark ? "dark" : "light") : preference;

  useEffect(() => {
    document.documentElement.dataset.theme = preference;
    document.getElementById("theme-boot")?.remove();
  }, [preference]);

  const setPreference = useCallback(
    (next: ThemePreference, origin?: ThemeOrigin) => {
      if (typeof window === "undefined") {
        return;
      }
      applyPreference(next, origin);
    },
    [],
  );

  return { preference, resolved, setPreference };
}
