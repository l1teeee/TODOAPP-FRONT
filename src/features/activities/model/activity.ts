export type ActivityKind = "habit" | "reminder" | "task";

export type ActivityStatus = "todo" | "in_progress" | "completed";

export type ActivityView =
  | "today"
  | "tomorrow"
  | "next-7-days"
  | "all"
  | "inbox";

export interface Activity {
  id: string;
  kind: ActivityKind;
  title: string;
  description: string | null;
  status: ActivityStatus;
  scheduledDate: string | null;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  icon: string | null;
  listId?: string | null;
  tagIds?: string[];
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityQuery {
  view: ActivityView;
  listId?: string;
  tagId?: string;
  q?: string;
}

export interface ActivityInput {
  kind: ActivityKind;
  title: string;
  description: string | null;
  status: ActivityStatus;
  scheduledDate: string | null;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  icon: string | null;
  listId?: string | null;
  tagIds?: string[];
}

export type ActivityPatch = Partial<ActivityInput>;
