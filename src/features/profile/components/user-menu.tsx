"use client";

import { ChevronDown, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/shared/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Skeleton } from "@/shared/ui/skeleton";
import { useProfile } from "../api/use-profile";

export interface UserMenuProps {
  onSignOut: () => void;
  /** Shows only the avatar as the trigger. */
  compact?: boolean;
}

export function UserMenu({ onSignOut, compact = false }: UserMenuProps) {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2" aria-busy="true">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
    );
  }

  const displayName = profile?.displayName ?? profile?.email ?? "User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className={compact ? "inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer" : "inline-flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 text-xs font-semibold text-fg transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"}
        >
          <Avatar name={displayName} className={compact ? "h-9! w-9!" : undefined} />
          {compact ? null : (
            <>
              <span className="hidden max-w-[7rem] truncate text-sm font-semibold text-fg sm:inline">
                {displayName}
              </span>
              <ChevronDown
                className="h-4 w-4 text-fg-secondary"
                aria-hidden="true"
              />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onSignOut}>
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
