import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { publicEnv } from "@/shared/config/public-env";

let client: SupabaseClient | undefined;

export function getSupabaseClient(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("Supabase auth is only available in the browser");
  }
  if (!client) {
    client = createClient(publicEnv.supabaseUrl, publicEnv.supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    });
  }
  return client;
}
