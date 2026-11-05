import type { DailyBriefInput, DailyBriefItem } from "../model/daily-brief";

const MAX_NEXT_UP = 3;

export interface LocalBrief {
  greeting: string;
  firstName: string | null;
  nextTask: {
    id: string;
    title: string;
    startTime: string;
    location: string | null;
  } | null;
  rest: Array<{ id: string; title: string; startTime: string }>;
  message: string;
}

function composeGreeting(input: DailyBriefInput): string {
  const hour = Number(input.localTime.slice(0, 2));
  const salutation =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return input.firstName ? `${salutation}, ${input.firstName}!` : `${salutation}!`;
}

/** Pending items starting at or after the current time, earliest first. */
function pickNextUp(input: DailyBriefInput): DailyBriefItem[] {
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

export function composeLocalBrief(input: DailyBriefInput): LocalBrief {
  const greeting = composeGreeting(input);
  const [first, ...others] = pickNextUp(input);
  if (!first || first.startTime === null) {
    return {
      greeting,
      firstName: input.firstName,
      nextTask: null,
      rest: [],
      message: "You're all caught up for today.",
    };
  }

  const nextTask = {
    id: first.id,
    title: first.title,
    startTime: first.startTime,
    location: first.location,
  };
  const rest = others.flatMap((item) =>
    item.startTime === null
      ? []
      : [{ id: item.id, title: item.title, startTime: item.startTime }],
  );

  const place = nextTask.location ? ` at ${nextTask.location}` : "";
  let message = `Your next task is ${nextTask.title} at ${nextTask.startTime}${place}.`;
  if (rest.length > 0) {
    const list = rest
      .map((item) => `${item.title} at ${item.startTime}`)
      .join(" and ");
    message += ` Then ${list}.`;
  }

  return { greeting, firstName: input.firstName, nextTask, rest, message };
}
