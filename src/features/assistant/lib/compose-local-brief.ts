import type { DailyBriefInput, DailyBriefItem } from "../model/daily-brief";

const MAX_NEXT_UP = 3;

export function composeGreeting(input: DailyBriefInput): string {
  const hour = Number(input.localTime.slice(0, 2));
  const salutation =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return input.firstName ? `${salutation}, ${input.firstName}!` : `${salutation}!`;
}

/** Pending items starting at or after the current time, earliest first. */
export function pickNextUp(input: DailyBriefInput): DailyBriefItem[] {
  return input.items
    .filter(
      (item) =>
        item.status !== "completed" &&
        item.startTime !== null &&
        item.startTime >= input.localTime,
    )
    .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""))
    .slice(0, MAX_NEXT_UP);
}

export function composeLocalBrief(input: DailyBriefInput): string {
  const [first, ...rest] = pickNextUp(input);
  if (!first) {
    return "You're all caught up for today.";
  }

  const place = first.location ? ` at ${first.location}` : "";
  const sentences = [`Next up: ${first.title} at ${first.startTime}${place}.`];
  for (const item of rest) {
    sentences.push(`Then ${item.title} at ${item.startTime}.`);
  }
  return sentences.join(" ");
}
