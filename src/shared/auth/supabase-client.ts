import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { publicEnv } from "@/shared/config/public-env";

const REMEMBER_KEY = "todo-remember-me";

let client: SupabaseClient | undefined;

export function setRememberMe(remember: boolean): void {
  window.localStorage.setItem(REMEMBER_KEY, String(remember));
}

// Keeps the session in localStorage when "remember me" is on (default) and in
// sessionStorage otherwise, so it ends with the browser session.
const authStorage = {
  getItem: (key: string): string | null =>
    window.sessionStorage.getItem(key) ?? window.localStorage.getItem(key),
  setItem: (key: string, value: string): void => {
    const remember = window.localStorage.getItem(REMEMBER_KEY) !== "false";
    const target = remember ? window.localStorage : window.sessionStorage;
    const other = remember ? window.sessionStorage : window.localStorage;
    other.removeItem(key);
    target.setItem(key, value);
  },
  removeItem: (key: string): void => {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  },
};

export function getSupabaseClient(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("Supabase auth is only available in the browser");
  }
  if (!client) {
    client = createClient(publicEnv.supabaseUrl, publicEnv.supabasePublishableKey, {
      auth: {
        persistSession: true,
        storage: authStorage,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    });
  }
  return client;
}
