"use client";

import { Tag as TagIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import { Skeleton } from "@/shared/ui/skeleton";
import { useTags } from "../api/use-tags";
import { TAG_COLOR_CLASSES } from "./tag-chip";

export interface TagNavProps {
  activeTagId?: string | null;
  onNavigate?: () => void;
}

export function TagNav({ activeTagId, onNavigate }: TagNavProps) {
  const { data: tags, isLoading } = useTags();

  return (
    <div className="space-y-1.5" aria-busy={isLoading}>
      <p className="px-3 text-xs font-semibold text-fg">Tags</p>
      {isLoading ? (
        <div className="space-y-1 px-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </div>
      ) : (
        <ul className="space-y-0.5">
          {tags?.map((tag) => {
            const isActive = activeTagId === tag.id;
            const palette =
              TAG_COLOR_CLASSES[tag.color] ?? TAG_COLOR_CLASSES.gray;
            return (
              <li key={tag.id}>
                <Link
                  href={`/all?tag=${encodeURIComponent(tag.id)}`}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-3 rounded-control px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    isActive
                      ? "font-semibold text-fg bg-surface-muted/70"
                      : "font-medium text-fg-secondary hover:bg-surface-muted hover:text-fg",
                  )}
                >
                  <TagIcon
                    aria-hidden="true"
                    className={cn("h-4 w-4 shrink-0", palette.icon)}
                  />
                  <span className="truncate">{tag.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
