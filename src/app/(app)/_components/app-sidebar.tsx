"use client";

import {
  Calendar,
  CalendarClock,
  CalendarRange,
  CheckCircle2,
  Clock,
  Inbox,
  PieChart,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListNav } from "@/features/lists/components/list-nav";
import { TagNav } from "@/features/tags/components/tag-nav";
import { cn } from "@/shared/lib/cn";
import { useDashboardParams } from "./use-dashboard-params";

const VIEW_LINKS = [
  { href: "/all", label: "All day", icon: Calendar },
  { href: "/today", label: "Today", icon: Clock },
  { href: "/tomorrow", label: "Tomorrow", icon: CalendarClock },
  { href: "/next-7-days", label: "Next 7 days", icon: CalendarRange },
  { href: "/inbox", label: "Inbox", icon: Inbox },
] as const;

const FOOTER_LINKS = [
  { href: "/completed", label: "Completed", icon: CheckCircle2 },
  { href: "/trash", label: "Trash", icon: Trash2 },
  { href: "/summary", label: "Summary", icon: PieChart },
] as const;

export interface AppSidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function AppSidebar({ onNavigate, className }: AppSidebarProps) {
  const pathname = usePathname();
  const { list, tag } = useDashboardParams();

  return (
    <nav
      aria-label="Sidebar navigation"
      className={cn(
        "flex h-full w-[220px] shrink-0 flex-col justify-between overflow-y-auto border-r border-line bg-surface py-5 pl-3 pr-0",
        className,
      )}
    >
      <div className="space-y-6">
        <ul className="space-y-0.5">
          {VIEW_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href && !list && !tag;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-3 rounded-l-control px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    isActive
                      ? "font-semibold text-fg"
                      : "font-medium text-fg-secondary hover:bg-surface-muted hover:text-fg",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute right-0 top-1.5 bottom-1.5 w-[3px] rounded-l-full bg-accent"
                    />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <ListNav activeListId={list} onNavigate={onNavigate} />

        <TagNav activeTagId={tag} onNavigate={onNavigate} />
      </div>

      <ul className="mt-6 space-y-0.5 pt-4 border-t border-line mr-3">
        {FOOTER_LINKS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-control px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  isActive
                    ? "font-semibold text-fg bg-surface-muted"
                    : "font-medium text-fg-secondary hover:bg-surface-muted hover:text-fg",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
