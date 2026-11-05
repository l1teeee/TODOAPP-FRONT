import { cn } from "@/shared/lib/cn";
import type { List } from "../model/list";
import { ListIcon } from "./list-icon";

export interface ListLabelProps {
  list: List;
  className?: string;
}

export function ListLabel({ list, className }: ListLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium text-fg-secondary",
        className,
      )}
    >
      <ListIcon icon={list.icon} className="h-3.5 w-3.5 text-fg-muted" />
      <span>{list.name}</span>
    </span>
  );
}
