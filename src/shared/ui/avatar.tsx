import { cn } from "@/shared/lib/cn";

export interface AvatarProps {
  name: string;
  src?: string | null;
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function Avatar({ name, src, className }: AvatarProps) {
  return (
    <span
      role="img"
      aria-label={name}
      style={src ? { backgroundImage: `url(${src})` } : undefined}
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent bg-cover bg-center text-xs font-semibold text-accent-fg border border-line",
        className,
      )}
    >
      {!src ? <span aria-hidden="true">{getInitials(name)}</span> : null}
    </span>
  );
}
