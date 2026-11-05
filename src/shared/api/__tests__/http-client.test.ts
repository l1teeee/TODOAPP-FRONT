/** @jest-environment node */
import type { Middleware } from "openapi-fetch";

const mockGetSession = jest.fn();
const mockSignOut = jest.fn();
let mockMiddleware: Middleware;
jest.mock("@/shared/auth/supabase-client", () => ({ getSupabaseClient: () => ({ auth: { getSession: mockGetSession, signOut: mockSignOut } }) }));
jest.mock("openapi-fetch", () => ({ __esModule: true, default: () => ({ use: (middleware: Middleware) => { mockMiddleware = middleware; } }) }));

import { getHttpClient } from "../http-client";

test("adds the session bearer token", async () => {
  mockGetSession.mockResolvedValue({ data: { session: { access_token: "token" } }, error: null });
  getHttpClient();
  const request = new Request("http://localhost:4000/v1/me");
  const result = await mockMiddleware.onRequest?.({ request } as Parameters<NonNullable<Middleware["onRequest"]>>[0]);
  expect(result).toBe(request);
  expect(request.headers.get("Authorization")).toBe("Bearer token");
});

test("signs out and redirects on unauthorized responses", async () => {
  const replace = jest.fn();
  Object.defineProperty(globalThis, "window", { configurable: true, value: { location: { replace } } });
  mockSignOut.mockResolvedValue({ error: null });
  getHttpClient();
  const response = new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  await expect(mockMiddleware.onResponse?.({ response } as Parameters<NonNullable<Middleware["onResponse"]>>[0])).rejects.toThrow();
  expect(mockSignOut).toHaveBeenCalledWith({ scope: "local" });
  expect(replace).toHaveBeenCalledWith("/login");
});
