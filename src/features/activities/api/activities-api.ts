// Temporary in-memory demo API; replaced by HTTP calls in the API integration brief
import { simulateLatency } from "@/shared/lib/simulate-latency";
import type {
  Activity,
  ActivityInput,
  ActivityPatch,
  ActivityQuery,
} from "../model/activity";
import { matchesViewRange } from "../model/view-range";

let activitiesStore: Activity[] = [];
let nextActivityCounter = 100;

function cloneActivity(item: Activity): Activity {
  return { ...item, tagIds: item.tagIds ? [...item.tagIds] : [] };
}

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
      if (activity.deletedAt !== null) {
        return false;
      }
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
    .map(cloneActivity);
}

export async function fetchActivity(id: string): Promise<Activity | null> {
  await simulateLatency();
  const found = activitiesStore.find(
    (item) => item.id === id && item.deletedAt === null,
  );
  if (!found) return null;
  return cloneActivity(found);
}

export async function listCompleted(): Promise<Activity[]> {
  await simulateLatency();
  return activitiesStore
    .filter(
      (activity) =>
        activity.deletedAt === null && activity.status === "completed",
    )
    .sort((a, b) =>
      (b.completedAt ?? b.updatedAt).localeCompare(
        a.completedAt ?? a.updatedAt,
      ),
    )
    .map(cloneActivity);
}

export async function listTrashed(): Promise<Activity[]> {
  await simulateLatency();
  return activitiesStore
    .filter((activity) => activity.deletedAt !== null)
    .sort((a, b) => (b.deletedAt ?? "").localeCompare(a.deletedAt ?? ""))
    .map(cloneActivity);
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
    deletedAt: null,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
  activitiesStore = [created, ...activitiesStore];
  return cloneActivity(created);
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
      nextStatus === "completed" ? (existing.completedAt ?? nowIso) : null,
    updatedAt: nowIso,
  };
  activitiesStore = activitiesStore.map((item) =>
    item.id === id ? updated : item,
  );
  return cloneActivity(updated);
}

export async function trashActivity(id: string): Promise<void> {
  await simulateLatency();
  const nowIso = new Date().toISOString();
  activitiesStore = activitiesStore.map((item) =>
    item.id === id
      ? { ...item, deletedAt: nowIso, updatedAt: nowIso }
      : item,
  );
}

export async function restoreActivity(id: string): Promise<Activity> {
  await simulateLatency();
  const existing = activitiesStore.find((item) => item.id === id);
  if (!existing) {
    throw new Error(`Activity ${id} not found`);
  }
  const nowIso = new Date().toISOString();
  const restored: Activity = {
    ...existing,
    deletedAt: null,
    updatedAt: nowIso,
  };
  activitiesStore = activitiesStore.map((item) =>
    item.id === id ? restored : item,
  );
  return cloneActivity(restored);
}

export async function deleteActivityForever(id: string): Promise<void> {
  await simulateLatency();
  activitiesStore = activitiesStore.filter((item) => item.id !== id);
}
