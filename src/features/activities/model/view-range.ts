import { addDaysFormatted, formatLocalDate } from "@/shared/lib/dates";
import type { Activity, ActivityView } from "./activity";

export type ViewDateRange =
  | { mode: "range"; start: string; end: string }
  | { mode: "all" }
  | { mode: "unscheduled" };

export function viewRange(view: ActivityView, today: Date): ViewDateRange {
  switch (view) {
    case "today": {
      const dateStr = formatLocalDate(today);
      return { mode: "range", start: dateStr, end: dateStr };
    }
    case "tomorrow": {
      const dateStr = addDaysFormatted(today, 1);
      return { mode: "range", start: dateStr, end: dateStr };
    }
    case "next-7-days": {
      return {
        mode: "range",
        start: formatLocalDate(today),
        end: addDaysFormatted(today, 6),
      };
    }
    case "inbox":
      return { mode: "unscheduled" };
    case "all":
    default:
      return { mode: "all" };
  }
}

export function matchesViewRange(
  activity: Activity,
  view: ActivityView,
  today: Date,
): boolean {
  if (activity.kind === "habit") {
    return view !== "inbox";
  }

  const range = viewRange(view, today);
  if (range.mode === "all") {
    return true;
  }
  if (range.mode === "unscheduled") {
    return activity.scheduledDate === null;
  }
  if (!activity.scheduledDate) {
    return false;
  }
  return (
    activity.scheduledDate >= range.start && activity.scheduledDate <= range.end
  );
}
