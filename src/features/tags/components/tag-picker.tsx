"use client";

import { cn } from "@/shared/lib/cn";
import { useTags } from "../api/use-tags";
import { TAG_COLOR_CLASSES } from "./tag-chip";

export interface TagPickerProps {
  selectedIds: string[];
  onChange: (tagIds: string[]) => void;
}

export function TagPicker({ selectedIds, onChange }: TagPickerProps) {
  const { data: tags } = useTags();

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Tags">
      {tags?.map((tag) => {
        const active = selectedIds.includes(tag.id);
        const palette = TAG_COLOR_CLASSES[tag.color] ?? TAG_COLOR_CLASSES.gray;
        return (
          <button
            key={tag.id}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(tag.id)}
            className={cn(
              "inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer",
              palette.bg,
              palette.fg,
              active
                ? "ring-2 ring-accent"
                : "opacity-75 hover:opacity-100",
            )}
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
}
