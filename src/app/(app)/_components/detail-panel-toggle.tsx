"use client";

import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { IconButton } from "@/shared/ui/icon-button";
import {
  useDetailPanelState,
  type DetailPanelState,
} from "./use-detail-panel-state";

export interface DetailPanelToggleProps {
  /** Renders only while the panel is in this state. */
  showWhen?: DetailPanelState;
  className?: string;
}

export function DetailPanelToggle({
  showWhen,
  className,
}: DetailPanelToggleProps) {
  const { state, toggle } = useDetailPanelState();

  if (showWhen && state !== showWhen) return null;

  const closed = state === "closed";
  const Icon = closed ? PanelRightOpen : PanelRightClose;

  return (
    <span className={cn("hidden xl:inline-flex", className)}>
      <IconButton label={closed ? "Show details" : "Hide details"} onClick={toggle}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </IconButton>
    </span>
  );
}
