"use client";

import { useQuery } from "@tanstack/react-query";
import { apiData, getHttpClient } from "./http-client";

async function fetchEnabledModules(): Promise<string[]> {
  const data = apiData(await getHttpClient().GET("/v1/meta"));
  return data.modules;
}

export const enabledModulesKey = ["meta", "modules"] as const;

export function useEnabledModules() {
  return useQuery({
    queryKey: enabledModulesKey,
    queryFn: fetchEnabledModules,
    staleTime: 5 * 60 * 1000,
  });
}
