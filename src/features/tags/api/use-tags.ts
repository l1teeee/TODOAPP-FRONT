"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTags } from "./tags-api";

export const tagKeys = {
  all: ["tags"] as const,
};

export function useTags() {
  return useQuery({
    queryKey: tagKeys.all,
    queryFn: fetchTags,
  });
}
