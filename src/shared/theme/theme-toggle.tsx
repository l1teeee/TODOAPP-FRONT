"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useTheme } from "./use-theme";

export function ThemeToggle() {
  const { resolved, setPreference } = useTheme();

  return (
    <div
      role="group"
      aria-label="Theme"
      className="inline-flex items-center gap-1 rounded-full bg-surface-muted p-1 border border-line"
    >
      <button
        type="button"
        aria-label="Light theme"
        aria-pressed={resolved === "light"}
        onClick={() => setPreference("light")}
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95",
          resolved === "light"
            ? "bg-surface text-fg shadow-xs"
            : "text-fg-muted hover:text-fg",
        )}
      >
        <Sun className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Dark theme"
        aria-pressed={resolved === "dark"}
        onClick={() => setPreference("dark")}
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95",
          resolved === "dark"
            ? "bg-surface text-fg shadow-xs"
            : "text-fg-muted hover:text-fg",
        )}
      >
        <Moon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
