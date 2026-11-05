import { cn } from "@/shared/lib/cn";

export type BrandMarkVariant = "color" | "reverse";

export interface BrandMarkProps {
  size?: number;
  variant?: BrandMarkVariant;
  /** Accessible name; the mark is decorative (aria-hidden) without it. */
  title?: string;
  className?: string;
}

export function BrandMark({
  size = 40,
  variant = "color",
  title,
  className,
}: BrandMarkProps) {
  const reverse = variant === "reverse";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      className={cn("shrink-0", className)}
    >
      {title ? <title>{title}</title> : null}
      <rect
        width="64"
        height="64"
        rx="16"
        className={reverse ? "fill-white" : "fill-navy"}
      />
      <path
        d="M15 33l11 11 23-24"
        fill="none"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={reverse ? "stroke-navy" : "stroke-white"}
      />
      <circle cx="51" cy="13" r="4" className="fill-berry" />
    </svg>
  );
}
