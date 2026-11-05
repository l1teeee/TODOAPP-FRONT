"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export interface DashboardParams {
  q: string;
  list: string | null;
  tag: string | null;
  activity: string | null;
  setParam: (
    key: "q" | "list" | "tag" | "activity",
    value: string | null,
  ) => void;
  setParams: (
    updates: Partial<Record<"q" | "list" | "tag" | "activity", string | null>>,
  ) => void;
}

export function useDashboardParams(): DashboardParams {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const list = searchParams.get("list");
  const tag = searchParams.get("tag");
  const activity = searchParams.get("activity");

  const setParams = useCallback(
    (
      updates: Partial<
        Record<"q" | "list" | "tag" | "activity", string | null>
      >,
    ) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, val] of Object.entries(updates)) {
        if (val === null || val === undefined || val === "") {
          next.delete(key);
        } else {
          next.set(key, val);
        }
      }
      const queryString = next.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const setParam = useCallback(
    (key: "q" | "list" | "tag" | "activity", value: string | null) => {
      setParams({ [key]: value });
    },
    [setParams],
  );

  return {
    q,
    list,
    tag,
    activity,
    setParam,
    setParams,
  };
}
