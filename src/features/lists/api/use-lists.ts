"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchLists } from "./lists-api";

export const listKeys = {
  all: ["lists"] as const,
};

export function useLists() {
  return useQuery({
    queryKey: listKeys.all,
    queryFn: fetchLists,
  });
}
