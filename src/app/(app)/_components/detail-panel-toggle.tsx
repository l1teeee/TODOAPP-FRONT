"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { EdgeHandle } from "./edge-handle";
import { useDetailPanelState } from "./use-detail-panel-state";

// Straddles the left border of the detail panel.
export function DetailPanelToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const { state, toggle } = useDetailPanelState();
  const collapsed = state === "closed";

  // Collapsing also clears the selection so the panel reopens empty.
  const handleClick = () => {
    if (!collapsed) {
      const params = new URLSearchParams(window.location.search);
      if (params.has("activity")) {
        params.delete("activity");
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      }
    }
    toggle();
  };
  const Icon = collapsed ? ChevronLeft : ChevronRight;

  return (
    <EdgeHandle
      label={collapsed ? "Expand details" : "Collapse details"}
      onClick={handleClick}
      className="left-0 hidden -translate-x-1/2 xl:inline-flex"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
    </EdgeHandle>
  );
}
