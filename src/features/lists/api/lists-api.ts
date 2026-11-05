// Temporary in-memory demo API; replaced by HTTP calls in the API integration brief
import { simulateLatency } from "@/shared/lib/simulate-latency";
import type { List } from "../model/list";

export class ListConflictError extends Error {
  constructor() {
    super("A list with this name already exists.");
    this.name = "ListConflictError";
  }
}

export interface ListInput {
  name: string;
  icon: string;
}

let listsStore: List[] = [];
let nextListCounter = 0;

function assertNameAvailable(name: string, exceptId: string | null): void {
  const normalized = name.trim().toLowerCase();
  const taken = listsStore.some(
    (item) => item.id !== exceptId && item.name.toLowerCase() === normalized,
  );
  if (taken) {
    throw new ListConflictError();
  }
}

export async function fetchLists(): Promise<List[]> {
  await simulateLatency();
  return listsStore.map((item) => ({ ...item }));
}

export async function createList(input: ListInput): Promise<List> {
  await simulateLatency();
  assertNameAvailable(input.name, null);
  const created: List = {
    id: `list-${++nextListCounter}`,
    name: input.name.trim(),
    icon: input.icon,
  };
  listsStore = [...listsStore, created];
  return { ...created };
}

export async function updateList(
  id: string,
  patch: Partial<ListInput>,
): Promise<List> {
  await simulateLatency();
  const existing = listsStore.find((item) => item.id === id);
  if (!existing) {
    throw new Error(`List ${id} not found`);
  }
  if (patch.name !== undefined) {
    assertNameAvailable(patch.name, id);
  }
  const updated: List = {
    ...existing,
    name: patch.name !== undefined ? patch.name.trim() : existing.name,
    icon: patch.icon ?? existing.icon,
  };
  listsStore = listsStore.map((item) => (item.id === id ? updated : item));
  return { ...updated };
}

export async function deleteList(id: string): Promise<void> {
  await simulateLatency();
  listsStore = listsStore.filter((item) => item.id !== id);
}
