"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { EdgeHandle } from "./edge-handle";
import { useSidebarState } from "./use-sidebar-state";

// Straddles the right border of the sidebar (or of the rail once collapsed).
export function SidebarToggle() {
  const { state, toggle } = useSidebarState();
  const collapsed = state === "collapsed";
  const Icon = collapsed ? ChevronRight : ChevronLeft;

  return (
    <EdgeHandle
      label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      onClick={toggle}
      className="right-0 hidden translate-x-1/2 lg:inline-flex"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
    </EdgeHandle>
  );
}
