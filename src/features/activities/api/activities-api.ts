// Temporary in-memory demo API; replaced by HTTP calls in the API integration brief
import { addDaysFormatted, formatLocalDate } from "@/shared/lib/dates";
import { simulateLatency } from "@/shared/lib/simulate-latency";
import type {
  Activity,
  ActivityInput,
  ActivityPatch,
  ActivityQuery,
} from "../model/activity";
import { matchesViewRange } from "../model/view-range";

function buildInitialActivities(): Activity[] {
  const now = new Date();
  const todayStr = formatLocalDate(now);
  const tomorrowStr = addDaysFormatted(now, 1);
  const inThreeDaysStr = addDaysFormatted(now, 3);

  return [
    {
      id: "act-hab-1",
      kind: "habit",
      title: "Observing",
      description: "Morning sky and bird observation routine.",
      status: "todo",
      scheduledDate: null,
      startTime: "07:00",
      endTime: "07:30",
      location: null,
      icon: "telescope",
      listId: "list-learning",
      tagIds: ["tag-inspiration"],
      completedAt: null,
      createdAt: "2026-01-01T07:00:00.000Z",
      updatedAt: "2026-01-01T07:00:00.000Z",
    },
    {
      id: "act-hab-2",
      kind: "habit",
      title: "Cooking",
      description: "Prepare healthy meals for the day.",
      status: "todo",
      scheduledDate: null,
      startTime: "09:00",
      endTime: "10:00",
      location: null,
      icon: "chef-hat",
      listId: null,
      tagIds: [],
      completedAt: null,
      createdAt: "2026-01-01T09:00:00.000Z",
      updatedAt: "2026-01-01T09:00:00.000Z",
    },
    {
      id: "act-hab-3",
      kind: "habit",
      title: "Self Caring",
      description: "Skincare and mindfulness break.",
      status: "todo",
      scheduledDate: null,
      startTime: "11:00",
      endTime: "12:00",
      location: null,
      icon: "sparkles",
      listId: null,
      tagIds: [],
      completedAt: null,
      createdAt: "2026-01-01T11:00:00.000Z",
      updatedAt: "2026-01-01T11:00:00.000Z",
    },
    {
      id: "act-hab-4",
      kind: "habit",
      title: "Singing",
      description: "Vocal warmups and practice session.",
      status: "todo",
      scheduledDate: null,
      startTime: "14:00",
      endTime: "14:30",
      location: null,
      icon: "mic",
      listId: "list-learning",
      tagIds: [],
      completedAt: null,
      createdAt: "2026-01-01T14:00:00.000Z",
      updatedAt: "2026-01-01T14:00:00.000Z",
    },
    {
      id: "act-hab-5",
      kind: "habit",
      title: "Reading",
      description: "Read 20 pages of current book.",
      status: "todo",
      scheduledDate: null,
      startTime: "16:00",
      endTime: "17:30",
      location: null,
      icon: "book-open",
      listId: "list-reading",
      tagIds: ["tag-inspiration"],
      completedAt: null,
      createdAt: "2026-01-01T16:00:00.000Z",
      updatedAt: "2026-01-01T16:00:00.000Z",
    },
    {
      id: "act-rem-1",
      kind: "reminder",
      title: "Gym Session Week 3",
      description:
        "Day for biceps, legs, and back. The target is 20 for biceps, 10 for legs, and 15 for back.",
      status: "todo",
      scheduledDate: todayStr,
      startTime: "15:00",
      endTime: null,
      location: "Dona Gym",
      icon: null,
      listId: "list-workout",
      tagIds: ["tag-work"],
      completedAt: null,
      createdAt: "2026-01-02T08:00:00.000Z",
      updatedAt: "2026-01-02T08:00:00.000Z",
    },
    {
      id: "act-rem-2",
      kind: "reminder",
      title: "Advanced Piano Class",
      description: "Practicing melody with Mrs. Angeline.",
      status: "todo",
      scheduledDate: todayStr,
      startTime: "19:00",
      endTime: null,
      location: "Mrs. Angeline house",
      icon: null,
      listId: "list-learning",
      tagIds: [],
      completedAt: null,
      createdAt: "2026-01-02T09:00:00.000Z",
      updatedAt: "2026-01-02T09:00:00.000Z",
    },
    {
      id: "act-rem-3",
      kind: "reminder",
      title: "Product Design Webinar",
      description: "Tokopedia Product Design Webinar.",
      status: "todo",
      scheduledDate: todayStr,
      startTime: "20:00",
      endTime: null,
      location: "Online",
      icon: null,
      listId: "list-learning",
      tagIds: ["tag-inspiration"],
      completedAt: null,
      createdAt: "2026-01-02T10:00:00.000Z",
      updatedAt: "2026-01-02T10:00:00.000Z",
    },
    {
      id: "act-rem-4",
      kind: "reminder",
      title: "Design Critique Sync",
      description: "Review updated mobile flows with the product squad.",
      status: "todo",
      scheduledDate: tomorrowStr,
      startTime: "11:00",
      endTime: null,
      location: "Studio Room B",
      icon: null,
      listId: "list-work",
      tagIds: ["tag-designteam"],
      completedAt: null,
      createdAt: "2026-01-02T11:00:00.000Z",
      updatedAt: "2026-01-02T11:00:00.000Z",
    },
    {
      id: "act-rem-5",
      kind: "reminder",
      title: "Book Club Discussion",
      description: "Chapters 5 to 8 notes and discussion.",
      status: "todo",
      scheduledDate: inThreeDaysStr,
      startTime: "18:00",
      endTime: null,
      location: "Community Library",
      icon: null,
      listId: "list-reading",
      tagIds: ["tag-inspiration"],
      completedAt: null,
      createdAt: "2026-01-02T12:00:00.000Z",
      updatedAt: "2026-01-02T12:00:00.000Z",
    },
    {
      id: "act-task-1",
      kind: "task",
      title: "UX Researching - Phase 2",
      description: "Conduct user interview with 3 personas.",
      status: "todo",
      scheduledDate: todayStr,
      startTime: null,
      endTime: null,
      location: null,
      icon: null,
      listId: "list-work",
      tagIds: ["tag-work"],
      completedAt: null,
      createdAt: "2026-01-03T15:00:00.000Z",
      updatedAt: "2026-01-03T15:00:00.000Z",
    },
    {
      id: "act-task-2",
      kind: "task",
      title: "Wireframe onboarding",
      description: "Low-fidelity screens for first-time user flow.",
      status: "todo",
      scheduledDate: tomorrowStr,
      startTime: null,
      endTime: null,
      location: null,
      icon: null,
      listId: "list-freelance",
      tagIds: ["tag-uxresearch"],
      completedAt: null,
      createdAt: "2026-01-03T14:00:00.000Z",
      updatedAt: "2026-01-03T14:00:00.000Z",
    },
    {
      id: "act-task-3",
      kind: "task",
      title: "Daily Team Meeting",
      description: "Daily meeting with team and stakeholders.",
      status: "in_progress",
      scheduledDate: todayStr,
      startTime: null,
      endTime: null,
      location: null,
      icon: null,
      listId: "list-work",
      tagIds: ["tag-designteam"],
      completedAt: null,
      createdAt: "2026-01-03T13:00:00.000Z",
      updatedAt: "2026-01-03T13:00:00.000Z",
    },
    {
      id: "act-task-4",
      kind: "task",
      title: "Refine design tokens",
      description: "Audit light and dark contrast ratios across components.",
      status: "in_progress",
      scheduledDate: tomorrowStr,
      startTime: null,
      endTime: null,
      location: null,
      icon: null,
      listId: "list-work",
      tagIds: ["tag-designteam"],
      completedAt: null,
      createdAt: "2026-01-03T12:00:00.000Z",
      updatedAt: "2026-01-03T12:00:00.000Z",
    },
    {
      id: "act-task-5",
      kind: "task",
      title: "Meeting with Client",
      description: "Meeting for understanding the brief.",
      status: "completed",
      scheduledDate: null,
      startTime: null,
      endTime: null,
      location: null,
      icon: null,
      listId: "list-freelance",
      tagIds: ["tag-work"],
      completedAt: "2026-01-03T10:30:00.000Z",
      createdAt: "2026-01-03T11:00:00.000Z",
      updatedAt: "2026-01-03T11:00:00.000Z",
    },
    {
      id: "act-task-6",
      kind: "task",
      title: "Send invoice",
      description: "Send Q1 milestone invoice to accounting.",
      status: "completed",
      scheduledDate: null,
      startTime: null,
      endTime: null,
      location: null,
      icon: null,
      listId: "list-freelance",
      tagIds: ["tag-meeting"],
      completedAt: "2026-01-03T09:30:00.000Z",
      createdAt: "2026-01-03T10:00:00.000Z",
      updatedAt: "2026-01-03T10:00:00.000Z",
    },
  ];
}

let activitiesStore: Activity[] = buildInitialActivities();
let nextActivityCounter = 100;

function compareActivities(a: Activity, b: Activity): number {
  if (a.kind !== b.kind) {
    const order = { habit: 0, reminder: 1, task: 2 };
    return order[a.kind] - order[b.kind];
  }
  if (a.kind === "habit") {
    return (a.startTime ?? "").localeCompare(b.startTime ?? "");
  }
  if (a.kind === "reminder") {
    const dateCmp = (a.scheduledDate ?? "").localeCompare(
      b.scheduledDate ?? "",
    );
    if (dateCmp !== 0) return dateCmp;
    return (a.startTime ?? "").localeCompare(b.startTime ?? "");
  }
  return b.createdAt.localeCompare(a.createdAt);
}

export async function fetchActivities(
  query: ActivityQuery,
): Promise<Activity[]> {
  await simulateLatency();
  const today = new Date();
  const normalizedQ = query.q?.trim().toLowerCase() ?? "";

  return activitiesStore
    .filter((activity) => {
      if (!matchesViewRange(activity, query.view, today)) {
        return false;
      }
      if (query.listId && activity.listId !== query.listId) {
        return false;
      }
      if (query.tagId && !(activity.tagIds ?? []).includes(query.tagId)) {
        return false;
      }
      if (normalizedQ) {
        const inTitle = activity.title.toLowerCase().includes(normalizedQ);
        const inDesc = (activity.description ?? "")
          .toLowerCase()
          .includes(normalizedQ);
        if (!inTitle && !inDesc) {
          return false;
        }
      }
      return true;
    })
    .sort(compareActivities)
    .map((item) => ({ ...item, tagIds: item.tagIds ? [...item.tagIds] : [] }));
}

export async function fetchActivity(id: string): Promise<Activity | null> {
  await simulateLatency();
  const found = activitiesStore.find((item) => item.id === id);
  if (!found) return null;
  return { ...found, tagIds: found.tagIds ? [...found.tagIds] : [] };
}

export async function createActivity(input: ActivityInput): Promise<Activity> {
  await simulateLatency();
  const nowIso = new Date().toISOString();
  const created: Activity = {
    id: `act-${++nextActivityCounter}`,
    kind: input.kind,
    title: input.title.trim(),
    description: input.description?.trim() ? input.description.trim() : null,
    status: input.status,
    scheduledDate: input.kind === "habit" ? null : input.scheduledDate,
    startTime: input.startTime,
    endTime: input.endTime,
    location: input.location?.trim() ? input.location.trim() : null,
    icon: input.icon,
    listId: input.listId ?? null,
    tagIds: input.tagIds ? [...input.tagIds] : [],
    completedAt: input.status === "completed" ? nowIso : null,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
  activitiesStore = [created, ...activitiesStore];
  return { ...created };
}

export async function updateActivity(
  id: string,
  patch: ActivityPatch,
): Promise<Activity> {
  await simulateLatency();
  const existing = activitiesStore.find((item) => item.id === id);
  if (!existing) {
    throw new Error(`Activity ${id} not found`);
  }
  const nowIso = new Date().toISOString();
  const nextStatus = patch.status ?? existing.status;
  const updated: Activity = {
    ...existing,
    ...patch,
    completedAt:
      nextStatus === "completed"
        ? (existing.completedAt ?? nowIso)
        : null,
    updatedAt: nowIso,
  };
  activitiesStore = activitiesStore.map((item) =>
    item.id === id ? updated : item,
  );
  return { ...updated };
}

export async function trashActivity(id: string): Promise<void> {
  await simulateLatency();
  activitiesStore = activitiesStore.filter((item) => item.id !== id);
}
