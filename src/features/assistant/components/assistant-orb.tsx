import { cn } from "@/shared/lib/cn";

export interface AssistantOrbProps {
  size?: number;
  /** Speeds the rotation up, for example while the hero is typing. */
  active?: boolean;
  className?: string;
}

export function AssistantOrb({
  size = 20,
  active = false,
  className,
}: AssistantOrbProps) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={cn("assistant-orb relative inline-block shrink-0", className)}
    >
      <span
        className={cn(
          "assistant-orb-spin absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--accent),var(--berry),var(--tag-purple-fg),var(--tag-orange-fg),var(--accent))]",
          active && "assistant-orb-spin-fast",
        )}
      />
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgb(255_255_255/0.5),transparent_55%)]" />
      <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/40" />
    </span>
  );
}
