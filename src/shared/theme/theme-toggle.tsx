"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useTheme } from "./use-theme";

const SEGMENT_CLASSES =
  "theme-seg relative z-10 inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95";

export function ThemeToggle() {
  const { resolved, setPreference } = useTheme();

  return (
    <div
      role="group"
      aria-label="Theme"
      className="relative inline-flex items-center gap-1 rounded-full bg-surface-muted p-1 border border-line"
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-1 top-1 h-7 w-7 rounded-full bg-surface shadow-xs motion-safe:transition-[translate] motion-safe:duration-[350ms] motion-safe:ease-[cubic-bezier(0.215,0.61,0.355,1)]",
          resolved === "dark" ? "translate-x-8" : "translate-x-0",
        )}
      />
      <button
        type="button"
        aria-label="Light theme"
        aria-pressed={resolved === "light"}
        onClick={() => setPreference("light")}
        className={cn(
          SEGMENT_CLASSES,
          resolved === "light" ? "text-fg" : "text-fg-muted hover:text-fg",
        )}
      >
        <Sun className="sun-icon h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Dark theme"
        aria-pressed={resolved === "dark"}
        onClick={() => setPreference("dark")}
        className={cn(
          SEGMENT_CLASSES,
          resolved === "dark" ? "text-fg" : "text-fg-muted hover:text-fg",
        )}
      >
        <Moon className="moon-icon h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

// Single-button variant for narrow rails: swaps Sun and Moon.
export function ThemeToggleButton() {
  const { resolved, setPreference } = useTheme();
  const next = resolved === "dark" ? "light" : "dark";
  const Icon = resolved === "dark" ? Moon : Sun;

  return (
    <button
      type="button"
      aria-label={next === "dark" ? "Dark theme" : "Light theme"}
      title={next === "dark" ? "Dark theme" : "Light theme"}
      onClick={() => setPreference(next)}
      className="icon-anim inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line bg-surface-muted text-fg transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
