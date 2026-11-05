import createClient, { type Client, type Middleware } from "openapi-fetch";
import { getSupabaseClient } from "@/shared/auth/supabase-client";
import { publicEnv } from "@/shared/config/public-env";
import { ApiError } from "./api-error";
import type { paths } from "./schema";

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const { data, error } = await getSupabaseClient().auth.getSession();
    if (error) throw error;
    if (data.session) {
      request.headers.set("Authorization", `Bearer ${data.session.access_token}`);
    }
    return request;
  },
  async onResponse({ response }) {
    if (response.ok) return response;
    const apiError = await ApiError.fromResponse(response);
    if (response.status === 401) {
      try {
        const { error } = await getSupabaseClient().auth.signOut({ scope: "local" });
        if (error) apiError.cause = error;
      } catch (cause) {
        apiError.cause = cause;
      } finally {
        window.location.replace("/login");
      }
    }
    throw apiError;
  },
};

let client: Client<paths> | undefined;

export function getHttpClient(): Client<paths> {
  if (!client) {
    client = createClient<paths>({ baseUrl: publicEnv.apiUrl });
    client.use(authMiddleware);
  }
  return client;
}

export function apiData<T>({ data }: { data?: T }): T {
  if (data === undefined) {
    throw new Error("API response is missing its expected JSON body");
  }
  return data;
}
