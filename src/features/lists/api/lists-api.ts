// Temporary in-memory demo API; replaced by HTTP calls in the API integration brief
import { simulateLatency } from "@/shared/lib/simulate-latency";
import type { List } from "../model/list";

const DEMO_LISTS: List[] = [
  { id: "list-work", name: "Work", icon: "briefcase" },
  { id: "list-freelance", name: "Freelance", icon: "pen-tool" },
  { id: "list-workout", name: "Workout", icon: "zap" },
  { id: "list-learning", name: "Learning", icon: "globe" },
  { id: "list-reading", name: "Reading", icon: "book-open" },
];

export async function fetchLists(): Promise<List[]> {
  await simulateLatency();
  return DEMO_LISTS.map((item) => ({ ...item }));
}
