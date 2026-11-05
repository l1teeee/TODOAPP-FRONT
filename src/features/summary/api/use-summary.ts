"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSummary } from "./summary-api";

export const summaryKeys = {
  all: ["summary"] as const,
};

export function useSummary() {
  return useQuery({
    queryKey: summaryKeys.all,
    queryFn: fetchSummary,
  });
}
