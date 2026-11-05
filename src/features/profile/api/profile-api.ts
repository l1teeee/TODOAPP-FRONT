import { apiData, getHttpClient } from "@/shared/api/http-client";
import type { Profile } from "../model/profile";

export interface ProfilePatch {
  displayName?: string | null;
  timezone?: string;
  emailNotifications?: boolean;
}

const syncedUsers = new Set<string>();

export async function fetchProfile(): Promise<Profile> {
  const profile = apiData(await getHttpClient().GET("/v1/me"));
  if (!syncedUsers.has(profile.id)) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const updated = timezone !== profile.timezone
      ? await updateProfile({ timezone })
      : profile;
    syncedUsers.add(profile.id);
    return updated;
  }
  return profile;
}

export async function updateProfile(patch: ProfilePatch): Promise<Profile> {
  return apiData(await getHttpClient().PATCH("/v1/me", { body: patch }));
}
