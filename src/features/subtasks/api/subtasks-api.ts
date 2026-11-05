// Temporary in-memory demo API; replaced by HTTP calls in the API integration brief
import { simulateLatency } from "@/shared/lib/simulate-latency";
import type { Subtask } from "../model/subtask";

let subtasksStore: Subtask[] = [
  {
    id: "sub-1",
    activityId: "act-rem-1",
    title: "10x rep biceps",
    isDone: true,
    position: 1,
  },
  {
    id: "sub-2",
    activityId: "act-rem-1",
    title: "5x rep legs",
    isDone: false,
    position: 2,
  },
  {
    id: "sub-3",
    activityId: "act-rem-1",
    title: "5x rep back",
    isDone: false,
    position: 3,
  },
  {
    id: "sub-4",
    activityId: "act-rem-1",
    title: "Stretch 10 minutes",
    isDone: false,
    position: 4,
  },
  {
    id: "sub-5",
    activityId: "act-rem-1",
    title: "Cool down walk",
    isDone: false,
    position: 5,
  },
];

let nextSubtaskCounter = 100;

export async function fetchSubtasks(activityId: string): Promise<Subtask[]> {
  await simulateLatency();
  return subtasksStore
    .filter((sub) => sub.activityId === activityId)
    .sort((a, b) => a.position - b.position)
    .map((sub) => ({ ...sub }));
}

export async function createSubtask(input: {
  activityId: string;
  title: string;
}): Promise<Subtask> {
  await simulateLatency();
  const existing = subtasksStore.filter(
    (sub) => sub.activityId === input.activityId,
  );
  const maxPos = existing.reduce((max, item) => Math.max(max, item.position), 0);
  const created: Subtask = {
    id: `sub-${++nextSubtaskCounter}`,
    activityId: input.activityId,
    title: input.title.trim(),
    isDone: false,
    position: maxPos + 1,
  };
  subtasksStore = [...subtasksStore, created];
  return { ...created };
}

export async function toggleSubtask(input: {
  id: string;
  activityId: string;
  isDone: boolean;
}): Promise<Subtask> {
  await simulateLatency();
  const target = subtasksStore.find(
    (sub) => sub.id === input.id && sub.activityId === input.activityId,
  );
  if (!target) {
    throw new Error(`Subtask ${input.id} not found`);
  }
  const updated: Subtask = { ...target, isDone: input.isDone };
  subtasksStore = subtasksStore.map((sub) =>
    sub.id === input.id ? updated : sub,
  );
  return { ...updated };
}

export async function deleteSubtask(input: {
  id: string;
  activityId: string;
}): Promise<void> {
  await simulateLatency();
  subtasksStore = subtasksStore.filter(
    (sub) => !(sub.id === input.id && sub.activityId === input.activityId),
  );
}
