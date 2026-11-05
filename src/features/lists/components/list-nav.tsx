"use client";

import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import { Skeleton } from "@/shared/ui/skeleton";
import { useLists } from "../api/use-lists";
import { ListIcon } from "./list-icon";

export interface ListNavProps {
  activeListId?: string | null;
  onNavigate?: () => void;
}

export function ListNav({ activeListId, onNavigate }: ListNavProps) {
  const { data: lists, isLoading } = useLists();

  return (
    <div className="space-y-1.5" aria-busy={isLoading}>
      <p className="px-3 text-xs font-semibold text-fg">Lists</p>
      {isLoading ? (
        <div className="space-y-1 px-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </div>
      ) : (
        <ul className="space-y-0.5">
          {lists?.map((list) => {
            const isActive = activeListId === list.id;
            return (
              <li key={list.id}>
                <Link
                  href={`/all?list=${encodeURIComponent(list.id)}`}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-3 rounded-control px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    isActive
                      ? "font-semibold text-fg bg-surface-muted/70"
                      : "font-medium text-fg-secondary hover:bg-surface-muted hover:text-fg",
                  )}
                >
                  <ListIcon icon={list.icon} className="h-4 w-4" />
                  <span className="truncate">{list.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
