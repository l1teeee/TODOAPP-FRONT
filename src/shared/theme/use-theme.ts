"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "todo-theme";
const THEME_EVENT = "todo-theme-change";
const FADE_CLASS_DURATION_MS = 200;

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

function applyPreference(next: ThemePreference): void {
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

  document.startViewTransition(() => {
    commitPreference(next);
  });
}

export function useTheme(): {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (p: ThemePreference) => void;
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
    (next: ThemePreference) => {
      if (typeof window === "undefined") {
        return;
      }
      applyPreference(next);
    },
    [],
  );

  return { preference, resolved, setPreference };
}
