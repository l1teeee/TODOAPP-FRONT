export interface DailyBriefItem {
  id: string;
  kind: "habit" | "reminder" | "task";
  title: string;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  status: "todo" | "in_progress" | "completed";
}

export interface DailyBriefInput {
  firstName: string | null;
  /** Local time as HH:MM. */
  localTime: string;
  locale: string;
  items: DailyBriefItem[];
}

export type DailyBriefSource = "ai" | "local";

export interface DailyBrief {
  message: string;
  source: DailyBriefSource;
}
