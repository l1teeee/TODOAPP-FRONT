"use client";

import { useQuery } from "@tanstack/react-query";
import { formatLocalDate } from "@/shared/lib/dates";
import { useEnabledModules } from "@/shared/api/use-enabled-modules";
import { composeLocalBrief } from "../lib/compose-local-brief";
import type { DailyBrief, DailyBriefInput } from "../model/daily-brief";
import { writeDailyBrief } from "./assistant-api";

const AI_MODULE = "ai-assistant";
const THIRTY_MINUTES = 30 * 60 * 1000;

function itemsSignature(input: DailyBriefInput): string {
  return input.items
    .map((item) => `${item.id}@${item.startTime ?? ""}`)
    .join(",");
}

export function useDailyBrief(input: DailyBriefInput) {
  const { data: modules } = useEnabledModules();
  const aiEnabled = modules?.includes(AI_MODULE) ?? false;

  const aiQuery = useQuery({
    queryKey: [
      "daily-brief",
      formatLocalDate(new Date()),
      itemsSignature(input),
    ],
    queryFn: async (): Promise<DailyBrief> => {
      try {
        return { message: await writeDailyBrief(input), source: "ai" };
      } catch {
        return { message: composeLocalBrief(input).message, source: "local" };
      }
    },
    enabled: aiEnabled,
    staleTime: THIRTY_MINUTES,
  });

  const brief: DailyBrief =
    aiEnabled && aiQuery.data
      ? aiQuery.data
      : { message: composeLocalBrief(input).message, source: "local" };

  return {
    brief,
    isAiEnabled: aiEnabled,
    isRefreshing: aiQuery.isFetching,
    refresh: () => {
      void aiQuery.refetch();
    },
  };
}
