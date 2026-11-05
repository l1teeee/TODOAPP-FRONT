// Temporary in-memory demo API; replaced by HTTP calls in the API integration brief
import { simulateLatency } from "@/shared/lib/simulate-latency";
import type { Profile } from "../model/profile";

const DEMO_PROFILE: Profile = {
  id: "user-evelyn",
  email: "evelyn@example.com",
  displayName: "Evelyn",
  timezone: "UTC",
  emailNotifications: true,
};

export async function fetchProfile(): Promise<Profile> {
  await simulateLatency();
  return { ...DEMO_PROFILE };
}
