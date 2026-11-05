// Temporary in-memory demo API; replaced by HTTP calls in the API integration brief
import { simulateLatency } from "@/shared/lib/simulate-latency";
import type { Tag, TagColor } from "../model/tag";

export class TagConflictError extends Error {
  constructor() {
    super("A tag with this name already exists.");
    this.name = "TagConflictError";
  }
}

export interface TagInput {
  name: string;
  color: TagColor;
}

let tagsStore: Tag[] = [];
let nextTagCounter = 0;

function assertNameAvailable(name: string, exceptId: string | null): void {
  const normalized = name.trim().toLowerCase();
  const taken = tagsStore.some(
    (item) => item.id !== exceptId && item.name.toLowerCase() === normalized,
  );
  if (taken) {
    throw new TagConflictError();
  }
}

export async function fetchTags(): Promise<Tag[]> {
  await simulateLatency();
  return tagsStore.map((tag) => ({ ...tag }));
}

export async function createTag(input: TagInput): Promise<Tag> {
  await simulateLatency();
  assertNameAvailable(input.name, null);
  const created: Tag = {
    id: `tag-${++nextTagCounter}`,
    name: input.name.trim(),
    color: input.color,
  };
  tagsStore = [...tagsStore, created];
  return { ...created };
}

export async function updateTag(
  id: string,
  patch: Partial<TagInput>,
): Promise<Tag> {
  await simulateLatency();
  const existing = tagsStore.find((item) => item.id === id);
  if (!existing) {
    throw new Error(`Tag ${id} not found`);
  }
  if (patch.name !== undefined) {
    assertNameAvailable(patch.name, id);
  }
  const updated: Tag = {
    ...existing,
    name: patch.name !== undefined ? patch.name.trim() : existing.name,
    color: patch.color ?? existing.color,
  };
  tagsStore = tagsStore.map((item) => (item.id === id ? updated : item));
  return { ...updated };
}

export async function deleteTag(id: string): Promise<void> {
  await simulateLatency();
  tagsStore = tagsStore.filter((item) => item.id !== id);
}
