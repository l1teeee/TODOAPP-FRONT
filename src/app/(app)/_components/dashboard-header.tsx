"use client";

import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ActivityView } from "@/features/activities/model/activity";
import { useLists } from "@/features/lists/api/use-lists";
import { UserMenu } from "@/features/profile/components/user-menu";
import { useTags } from "@/features/tags/api/use-tags";
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
}

export function DashboardHeader({ view, onNewActivity }: DashboardHeaderProps) {
  const { q, list: listId, tag: tagId, setParam } = useDashboardParams();
  const { data: lists } = useLists();
  const { data: tags } = useTags();

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

  const activeList = listId
    ? lists?.find((item) => item.id === listId)
    : undefined;
  const activeTag = tagId ? tags?.find((item) => item.id === tagId) : undefined;

  const heading = activeList
    ? activeList.name
    : activeTag
      ? `#${activeTag.name}`
      : VIEW_TITLES[view];

  return (
    <header className="space-y-5">
      <div className="hidden lg:flex lg:items-center lg:justify-between lg:gap-4">
        <SearchField
          value={localQ}
          onChange={handleSearchChange}
          placeholder="Search"
          className="flex-1"
        />
        <div className="flex items-center gap-3 xl:hidden">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg">
            {heading}
          </h1>
          <p className="mt-1 text-xs text-fg-secondary">
            Manage your habits, reminders, events and activities.
          </p>
        </div>
        <Button variant="berry" className="plus-spin" onClick={onNewActivity}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>New Activity</span>
        </Button>
      </div>

      <div className="lg:hidden">
        <SearchField
          value={localQ}
          onChange={handleSearchChange}
          placeholder="Search"
        />
      </div>
    </header>
  );
}
