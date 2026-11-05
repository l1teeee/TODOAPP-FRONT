"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { useCreateActivity } from "@/features/activities/api/use-activities";
import type {
  ActivityInput,
  ActivityKind,
  ActivityStatus,
} from "@/features/activities/model/activity";
import { useCreateList, useLists } from "@/features/lists/api/use-lists";
import {
  useCreateSubtask,
  useToggleSubtask,
} from "@/features/subtasks/api/use-subtasks";
import { useCreateTag, useTags } from "@/features/tags/api/use-tags";
import type { TagColor } from "@/features/tags/model/tag";
import { addDaysFormatted } from "@/shared/lib/dates";

const ONBOARDING_KEY = "todo-onboarding";
const ONBOARDING_EVENT = "todo-onboarding-change";

function subscribeOnboarding(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(ONBOARDING_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(ONBOARDING_EVENT, onChange);
  };
}

/** True on the server and the first client render so the card never flashes. */
export function useOnboardingDismissed(): boolean {
  return useSyncExternalStore(
    subscribeOnboarding,
    () => window.localStorage.getItem(ONBOARDING_KEY) === "dismissed",
    () => true,
  );
}

export function dismissOnboarding(): void {
  window.localStorage.setItem(ONBOARDING_KEY, "dismissed");
  window.dispatchEvent(new Event(ONBOARDING_EVENT));
}

const SAMPLE_LISTS = [
  { name: "Work", icon: "briefcase" },
  { name: "Freelance", icon: "pen-tool" },
  { name: "Workout", icon: "zap" },
  { name: "Learning", icon: "globe" },
  { name: "Reading", icon: "book-open" },
] as const;

const SAMPLE_TAGS: ReadonlyArray<{ name: string; color: TagColor }> = [
  { name: "work", color: "purple" },
  { name: "uxresearch", color: "blue" },
  { name: "inspiration", color: "pink" },
  { name: "meeting", color: "orange" },
  { name: "designteam", color: "green" },
];

interface SampleActivity {
  kind: ActivityKind;
  title: string;
  description: string;
  status?: ActivityStatus;
  dayOffset?: number | null;
  startTime?: string;
  endTime?: string;
  location?: string;
  icon?: string;
  list?: string;
  tags?: string[];
  subtasks?: Array<{ title: string; isDone: boolean }>;
}

const SAMPLE_ACTIVITIES: readonly SampleActivity[] = [
  {
    kind: "habit",
    title: "Observing",
    description: "Morning sky and bird observation routine.",
    startTime: "07:00",
    endTime: "07:30",
    icon: "telescope",
    list: "Learning",
    tags: ["inspiration"],
  },
  {
    kind: "habit",
    title: "Cooking",
    description: "Prepare healthy meals for the day.",
    startTime: "09:00",
    endTime: "10:00",
    icon: "chef-hat",
  },
  {
    kind: "habit",
    title: "Self Caring",
    description: "Skincare and mindfulness break.",
    startTime: "11:00",
    endTime: "12:00",
    icon: "sparkles",
  },
  {
    kind: "habit",
    title: "Singing",
    description: "Vocal warmups and practice session.",
    startTime: "14:00",
    endTime: "14:30",
    icon: "mic",
    list: "Learning",
  },
  {
    kind: "habit",
    title: "Reading",
    description: "Read 20 pages of current book.",
    startTime: "16:00",
    endTime: "17:30",
    icon: "book-open",
    list: "Reading",
    tags: ["inspiration"],
  },
  {
    kind: "reminder",
    title: "Gym Session Week 3",
    description:
      "Day for biceps, legs, and back. The target is 20 for biceps, 10 for legs, and 15 for back.",
    dayOffset: 0,
    startTime: "15:00",
    location: "Dona Gym",
    list: "Workout",
    tags: ["work"],
    subtasks: [
      { title: "10x rep biceps", isDone: true },
      { title: "5x rep legs", isDone: false },
      { title: "5x rep back", isDone: false },
      { title: "Stretch 10 minutes", isDone: false },
      { title: "Cool down walk", isDone: false },
    ],
  },
  {
    kind: "reminder",
    title: "Advanced Piano Class",
    description: "Practicing melody with Mrs. Angeline.",
    dayOffset: 0,
    startTime: "19:00",
    location: "Mrs. Angeline house",
    list: "Learning",
  },
  {
    kind: "reminder",
    title: "Product Design Webinar",
    description: "Tokopedia Product Design Webinar.",
    dayOffset: 0,
    startTime: "20:00",
    location: "Online",
    list: "Learning",
    tags: ["inspiration"],
  },
  {
    kind: "reminder",
    title: "Design Critique Sync",
    description: "Review updated mobile flows with the product squad.",
    dayOffset: 1,
    startTime: "11:00",
    location: "Studio Room B",
    list: "Work",
    tags: ["designteam"],
  },
  {
    kind: "reminder",
    title: "Book Club Discussion",
    description: "Chapters 5 to 8 notes and discussion.",
    dayOffset: 3,
    startTime: "18:00",
    location: "Community Library",
    list: "Reading",
    tags: ["inspiration"],
  },
  {
    kind: "task",
    title: "UX Researching - Phase 2",
    description: "Conduct user interview with 3 personas.",
    dayOffset: 0,
    list: "Work",
    tags: ["work"],
  },
  {
    kind: "task",
    title: "Wireframe onboarding",
    description: "Low-fidelity screens for first-time user flow.",
    dayOffset: 1,
    list: "Freelance",
    tags: ["uxresearch"],
  },
  {
    kind: "task",
    title: "Daily Team Meeting",
    description: "Daily meeting with team and stakeholders.",
    status: "in_progress",
    dayOffset: 0,
    list: "Work",
    tags: ["designteam"],
  },
  {
    kind: "task",
    title: "Refine design tokens",
    description: "Audit light and dark contrast ratios across components.",
    status: "in_progress",
    dayOffset: 1,
    list: "Work",
    tags: ["designteam"],
  },
  {
    kind: "task",
    title: "Meeting with Client",
    description: "Meeting for understanding the brief.",
    status: "completed",
    list: "Freelance",
    tags: ["work"],
  },
  {
    kind: "task",
    title: "Send invoice",
    description: "Send Q1 milestone invoice to accounting.",
    status: "completed",
    list: "Freelance",
    tags: ["meeting"],
  },
];

/**
 * Loads the sample workspace through the feature hooks.
 */
export function useLoadSampleData() {
  const { data: existingLists } = useLists();
  const { data: existingTags } = useTags();
  const createList = useCreateList();
  const createTag = useCreateTag();
  const createActivity = useCreateActivity();
  const createSubtask = useCreateSubtask();
  const toggleSubtask = useToggleSubtask();
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const listIds = new Map<string, string>();
      for (const sample of SAMPLE_LISTS) {
        const existing = existingLists?.find(
          (item) => item.name.toLowerCase() === sample.name.toLowerCase(),
        );
        const id = existing
          ? existing.id
          : (await createList.mutateAsync(sample)).id;
        listIds.set(sample.name, id);
      }

      const tagIds = new Map<string, string>();
      for (const sample of SAMPLE_TAGS) {
        const existing = existingTags?.find((item) => item.name === sample.name);
        const id = existing
          ? existing.id
          : (await createTag.mutateAsync(sample)).id;
        tagIds.set(sample.name, id);
      }

      const now = new Date();
      for (const sample of SAMPLE_ACTIVITIES) {
        const input: ActivityInput = {
          kind: sample.kind,
          title: sample.title,
          description: sample.description,
          status: sample.status ?? "todo",
          scheduledDate:
            sample.dayOffset === undefined || sample.dayOffset === null
              ? null
              : addDaysFormatted(now, sample.dayOffset),
          startTime: sample.startTime ?? null,
          endTime: sample.endTime ?? null,
          location: sample.location ?? null,
          icon: sample.icon ?? null,
          listId: sample.list ? (listIds.get(sample.list) ?? null) : null,
          tagIds: (sample.tags ?? []).flatMap((name) => {
            const id = tagIds.get(name);
            return id ? [id] : [];
          }),
        };
        const created = await createActivity.mutateAsync(input);

        for (const subtask of sample.subtasks ?? []) {
          const createdSubtask = await createSubtask.mutateAsync({
            activityId: created.id,
            title: subtask.title,
          });
          if (subtask.isDone) {
            await toggleSubtask.mutateAsync({
              id: createdSubtask.id,
              activityId: created.id,
              isDone: true,
            });
          }
        }
      }

      dismissOnboarding();
    } finally {
      setIsLoading(false);
    }
  }, [
    existingLists,
    existingTags,
    createList,
    createTag,
    createActivity,
    createSubtask,
    toggleSubtask,
  ]);

  return { load, isLoading };
}
