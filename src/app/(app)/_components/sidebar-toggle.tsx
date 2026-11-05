"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { IconButton } from "@/shared/ui/icon-button";
import { useSidebarState, type SidebarState } from "./use-sidebar-state";

export interface SidebarToggleProps {
  /** Renders only while the sidebar is in this state. */
  showWhen?: SidebarState;
  className?: string;
}

export function SidebarToggle({ showWhen, className }: SidebarToggleProps) {
  const { state, toggle } = useSidebarState();

  if (showWhen && state !== showWhen) return null;

  const collapsed = state === "collapsed";
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <span className={cn("hidden lg:inline-flex", className)}>
      <IconButton
        label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={toggle}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </IconButton>
    </span>
  );
}
