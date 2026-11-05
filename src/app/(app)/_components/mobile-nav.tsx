"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { UserMenu } from "@/features/profile/components/user-menu";
import { ThemeToggle } from "@/shared/theme/theme-toggle";
import { IconButton } from "@/shared/ui/icon-button";
import { Sheet } from "@/shared/ui/sheet";
import { AppRail } from "./app-rail";
import { AppSidebar } from "./app-sidebar";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-2.5 lg:hidden">
      <div className="flex items-center gap-2">
        <IconButton
          label="Open navigation menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </IconButton>
        <span className="text-sm font-semibold text-fg">TODO App</span>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>

      <Sheet
        open={open}
        onOpenChange={setOpen}
        side="left"
        title="Navigation"
        description="Browse views, lists and tags"
        className="p-0"
      >
        <div className="flex h-full min-h-0">
          <AppRail onNavigate={() => setOpen(false)} />
          <AppSidebar
            onNavigate={() => setOpen(false)}
            className="flex-1 border-r-0"
          />
        </div>
      </Sheet>
    </div>
  );
}
