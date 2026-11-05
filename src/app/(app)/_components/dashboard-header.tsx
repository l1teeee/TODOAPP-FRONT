"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { ActivityView } from "@/features/activities/model/activity";
import { useSignOut } from "@/features/auth/api/use-auth";
import { useLists } from "@/features/lists/api/use-lists";
import { UserMenu } from "@/features/profile/components/user-menu";
import { useTags } from "@/features/tags/api/use-tags";
import { useEnabledModules } from "@/shared/api/use-enabled-modules";
import { ThemeToggle } from "@/shared/theme/theme-toggle";
import { Button } from "@/shared/ui/button";
import { SearchField } from "@/shared/ui/search-field";
import { useDashboardParams } from "./use-dashboard-params";

const VIEW_TITLES: Record<ActivityView, string> = {
  today: "Today Activities",
  tomorrow: "Tomorrow Activities",
  "next-7-days": "Next 7 Days",
  all: "All Activities",
  inbox: "Inbox",
};

export interface DashboardHeaderProps {
  view: ActivityView;
  onNewActivity: () => void;
  /** Today hero; receives the New Activity button to place inside it. */
  hero?: (action: ReactNode) => ReactNode;
}

export function DashboardHeader({
  view,
  onNewActivity,
  hero,
}: DashboardHeaderProps) {
  const { data: modules } = useEnabledModules();
  const router = useRouter();
  const signOutMutation = useSignOut();
  const { q, list: listId, tag: tagId, setParam } = useDashboardParams();
  const { data: lists } = useLists();
  const { data: tags } = useTags();

  const handleSignOut = () => {
    signOutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  };

  const [draft, setDraft] = useState<{ baseQ: string; value: string }>({
    baseQ: q,
    value: q,
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const localQ = draft.baseQ === q ? draft.value : q;

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleSearchChange = (nextValue: string) => {
    setDraft({ baseQ: q, value: nextValue });
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setParam("q", nextValue || null);
    }, 250);
  };

  const activeList = modules?.includes("lists") && listId
    ? lists?.find((item) => item.id === listId)
    : undefined;
  const activeTag = modules?.includes("tags") && tagId
    ? tags?.find((item) => item.id === tagId)
    : undefined;

  const heading = activeList
    ? activeList.name
    : activeTag
      ? `#${activeTag.name}`
      : VIEW_TITLES[view];

  const newActivityButton = (
    <Button
      variant="berry"
      className="plus-spin shrink-0 self-start"
      onClick={onNewActivity}
    >
      <Plus className="h-4 w-4" aria-hidden="true" />
      <span>New Activity</span>
    </Button>
  );

  return (
    <header className="space-y-5">
      {view === "today" && !activeList && !activeTag && hero ? (
        hero(newActivityButton)
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-fg">
            {heading}
          </h1>
          {newActivityButton}
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <SearchField
          value={localQ}
          onChange={handleSearchChange}
          placeholder="Search"
          className="flex-1"
        />
        <div className="hidden items-center gap-3 lg:flex xl:hidden">
          <ThemeToggle />
          <UserMenu onSignOut={handleSignOut} />
        </div>
      </div>
    </header>
  );
}
