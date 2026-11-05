import { cn } from "@/shared/lib/cn";
import type { Tag, TagColor } from "../model/tag";

export const TAG_COLOR_CLASSES: Record<
  TagColor,
  { bg: string; fg: string; icon: string }
> = {
  purple: {
    bg: "bg-tag-purple-bg",
    fg: "text-tag-purple-fg",
    icon: "text-tag-purple-fg",
  },
  blue: {
    bg: "bg-tag-blue-bg",
    fg: "text-tag-blue-fg",
    icon: "text-tag-blue-fg",
  },
  pink: {
    bg: "bg-tag-pink-bg",
    fg: "text-tag-pink-fg",
    icon: "text-tag-pink-fg",
  },
  orange: {
    bg: "bg-tag-orange-bg",
    fg: "text-tag-orange-fg",
    icon: "text-tag-orange-fg",
  },
  green: {
    bg: "bg-tag-green-bg",
    fg: "text-tag-green-fg",
    icon: "text-tag-green-fg",
  },
  gray: {
    bg: "bg-tag-gray-bg",
    fg: "text-tag-gray-fg",
    icon: "text-tag-gray-fg",
  },
};

export interface TagChipProps {
  tag: Tag;
  className?: string;
}

export function TagChip({ tag, className }: TagChipProps) {
  const palette = TAG_COLOR_CLASSES[tag.color] ?? TAG_COLOR_CLASSES.gray;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium leading-4",
        palette.bg,
        palette.fg,
        className,
      )}
    >
      {tag.name}
    </span>
  );
}
