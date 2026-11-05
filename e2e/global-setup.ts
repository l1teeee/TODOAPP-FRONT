import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, expect, type FullConfig } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

export default async function globalSetup(config: FullConfig) {
  const envFile = resolve(".env.e2e.local");
  if (!existsSync(envFile)) throw new Error("Missing .env.e2e.local; copy .env.e2e.example and fill it in.");
  process.loadEnvFile(envFile);
  const url = process.env.E2E_SUPABASE_URL;
  const secret = process.env.E2E_SUPABASE_SECRET_KEY;
  const publishable = process.env.E2E_SUPABASE_PUBLISHABLE_KEY;
  const email = process.env.E2E_USER_EMAIL || "e2e@example.com";
  const password = process.env.E2E_USER_PASSWORD;
  if (!url || !secret || !publishable || !password) throw new Error("Missing E2E Supabase URL, keys or user password in .env.e2e.local.");
  const admin = createClient(url, secret, { auth: { persistSession: false } });
  let pageNumber = 1;
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page: pageNumber, perPage: 1000 });
    if (error) throw new Error(`Could not list E2E users: ${error.message}`);
    const existing = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (existing) {
      const { error: deleteError } = await admin.auth.admin.deleteUser(existing.id);
      if (deleteError) throw new Error(`Could not delete E2E user: ${deleteError.message}`);
      break;
    }
    if (data.users.length < 1000) break;
    pageNumber += 1;
  }
  const { error: createError } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name: "E2E Tester" } });
  if (createError) throw new Error(`Could not create E2E user: ${createError.message}`);
  const client = createClient(url, publishable, { auth: { persistSession: false } });
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.session) throw new Error(`Could not authenticate E2E user: ${error?.message ?? "missing session"}`);
  const apiUrl = process.env.E2E_API_URL || "http://localhost:4000";
  const headers = { Authorization: `Bearer ${data.session.access_token}`, "Content-Type": "application/json" };
  const profile = await fetch(`${apiUrl}/v1/me`, { headers });
  if (!profile.ok) throw new Error(`E2E profile GET failed: HTTP ${profile.status}`);
  const update = await fetch(`${apiUrl}/v1/me`, { method: "PATCH", headers, body: JSON.stringify({ emailNotifications: false, timezone: "America/El_Salvador" }) });
  if (!update.ok) throw new Error(`E2E profile PATCH failed: HTTP ${update.status}`);
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${process.env.E2E_BASE_URL || config.projects[0].use.baseURL || "http://localhost:3000"}/login`);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page).toHaveURL(/\/today/);
    mkdirSync("e2e/.auth", { recursive: true });
    await context.storageState({ path: "e2e/.auth/user.json" });
  } finally {
    await browser.close();
  }
}
