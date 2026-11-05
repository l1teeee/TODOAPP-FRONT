"use client";

import {
  CalendarDays,
  ChartPie,
  Home,
  LayoutGrid,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { ReminderBell } from "@/features/activities/components/reminder-bell";
import { useSignOut } from "@/features/auth/api/use-auth";
import { cn } from "@/shared/lib/cn";
import {
  useActiveIndicator,
  useShellEntrance,
} from "@/shared/motion/use-entrance";

const TOP_ITEMS = [
  { href: "/today", label: "Today", icon: Home },
  { href: "/all", label: "All activities", icon: LayoutGrid },
  { href: "/next-7-days", label: "Next 7 days", icon: CalendarDays },
  { href: "/summary", label: "Summary", icon: ChartPie },
] as const;

export interface AppRailProps {
  onNavigate?: () => void;
  className?: string;
}

export function AppRail({ onNavigate, className }: AppRailProps) {
  const pathname = usePathname();
  const router = useRouter();
  const signOutMutation = useSignOut();
  const navRef = useRef<HTMLElement>(null);

  useShellEntrance(navRef, { x: -16 });
  useActiveIndicator(
    navRef,
    pathname,
    "absolute inset-0 -z-10 rounded-full bg-accent-soft",
  );

  const handleSignOut = () => {
    onNavigate?.();
    signOutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  };

  return (
    <nav
      ref={navRef}
      data-motion="pending"
      aria-label="App rail"
      className={cn(
        "flex h-full w-[72px] shrink-0 flex-col items-center justify-between border-r border-line bg-surface py-5",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-3">
        {TOP_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-label={item.label}
              title={item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "icon-anim relative isolate inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                active
                  ? "text-accent"
                  : "text-fg-secondary hover:bg-surface-muted hover:text-fg",
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-3">
        <ReminderBell />
        <Link
          href="/settings"
          onClick={onNavigate}
          aria-label="Settings"
          title="Settings"
          aria-current={pathname === "/settings" ? "page" : undefined}
          className={cn(
            "icon-anim relative isolate inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            pathname === "/settings"
              ? "text-accent"
              : "text-fg-secondary hover:bg-surface-muted hover:text-fg",
          )}
        >
          <Settings className="h-5 w-5" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signOutMutation.isPending}
          aria-label="Log out"
          title="Log out"
          className="icon-anim relative inline-flex h-10 w-10 items-center justify-center rounded-full text-fg-secondary transition-colors hover:bg-surface-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 cursor-pointer"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
