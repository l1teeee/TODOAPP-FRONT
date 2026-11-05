import { apiData, getHttpClient } from "@/shared/api/http-client";
import type { Profile } from "../model/profile";

export interface ProfilePatch {
  displayName?: string | null;
  timezone?: string;
  emailNotifications?: boolean;
}

export async function fetchProfile(): Promise<Profile> {
  return apiData(await getHttpClient().GET("/v1/me"));
}

export async function updateProfile(patch: ProfilePatch): Promise<Profile> {
  return apiData(await getHttpClient().PATCH("/v1/me", { body: patch }));
}
