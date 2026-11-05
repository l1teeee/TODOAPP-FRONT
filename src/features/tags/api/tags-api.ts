// Temporary in-memory demo API; replaced by HTTP calls in the API integration brief
import { simulateLatency } from "@/shared/lib/simulate-latency";
import type { Tag } from "../model/tag";

const DEMO_TAGS: Tag[] = [
  { id: "tag-work", name: "work", color: "purple" },
  { id: "tag-uxresearch", name: "uxresearch", color: "blue" },
  { id: "tag-inspiration", name: "inspiration", color: "pink" },
  { id: "tag-meeting", name: "meeting", color: "orange" },
  { id: "tag-designteam", name: "designteam", color: "green" },
];

export async function fetchTags(): Promise<Tag[]> {
  await simulateLatency();
  return DEMO_TAGS.map((tag) => ({ ...tag }));
}
