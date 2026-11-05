"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "./profile-api";

export const profileKeys = {
  all: ["profile"] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.all,
    queryFn: fetchProfile,
  });
}
