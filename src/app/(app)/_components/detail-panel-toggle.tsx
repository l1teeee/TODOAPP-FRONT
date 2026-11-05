"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { EdgeHandle } from "./edge-handle";
import { useDetailPanelState } from "./use-detail-panel-state";

// Straddles the left border of the detail panel.
export function DetailPanelToggle() {
  const { state, toggle } = useDetailPanelState();
  const collapsed = state === "closed";
  const Icon = collapsed ? ChevronLeft : ChevronRight;

  return (
    <EdgeHandle
      label={collapsed ? "Expand details" : "Collapse details"}
      onClick={toggle}
      className="left-0 hidden -translate-x-1/2 xl:inline-flex"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
    </EdgeHandle>
  );
}
