import type { CSSProperties } from "react";
import { cn } from "@/shared/lib/cn";

export interface AssistantMarkProps {
  size?: number;
  /** Bounces the dots one after another while the assistant is typing. */
  typing?: boolean;
  className?: string;
}

const DOT_DELAYS_SECONDS = [0, 0.15, 0.3] as const;

export function AssistantMark({
  size = 20,
  typing = false,
  className,
}: AssistantMarkProps) {
  const dotSize = size / 7;
  const gap = size / 10;

  // --mark-bounce is read by the bounce keyframe in globals.css.
  const style = {
    width: size,
    height: size,
    gap,
    "--mark-bounce": `${-size / 14}px`,
  } as CSSProperties;

  return (
    <span
      aria-hidden="true"
      style={style}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-fg",
        className,
      )}
    >
      {DOT_DELAYS_SECONDS.map((delay) => (
        <span
          key={delay}
          style={{
            width: dotSize,
            height: dotSize,
            animationDelay: `${delay}s`,
          }}
          className={cn(
            "rounded-full bg-canvas",
            typing && "assistant-mark-dot",
          )}
        />
      ))}
    </span>
  );
}
