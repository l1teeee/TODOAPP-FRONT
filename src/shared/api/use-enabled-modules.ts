"use client";

import { useQuery } from "@tanstack/react-query";
import { simulateLatency } from "@/shared/lib/simulate-latency";

// Temporary demo; replaced by GET /v1/meta in the API integration brief
async function fetchEnabledModules(): Promise<string[]> {
  await simulateLatency(100);
  return ["activities", "lists", "tags", "subtasks", "auth-gateway"];
}

export const enabledModulesKey = ["meta", "modules"] as const;

export function useEnabledModules() {
  return useQuery({
    queryKey: enabledModulesKey,
    queryFn: fetchEnabledModules,
    staleTime: Infinity,
  });
}
