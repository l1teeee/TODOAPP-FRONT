// Temporary in-memory demo API; replaced by HTTP calls in the API integration brief
import { simulateLatency } from "@/shared/lib/simulate-latency";
import type { Profile } from "../model/profile";

export interface ProfilePatch {
  displayName?: string | null;
  timezone?: string;
  emailNotifications?: boolean;
}

let profileStore: Profile = {
  id: "user-evelyn",
  email: "evelyn@example.com",
  displayName: "Evelyn",
  timezone: "UTC",
  emailNotifications: true,
};

export async function fetchProfile(): Promise<Profile> {
  await simulateLatency();
  return { ...profileStore };
}

export async function updateProfile(patch: ProfilePatch): Promise<Profile> {
  await simulateLatency();
  profileStore = {
    ...profileStore,
    ...patch,
  };
  return { ...profileStore };
}
