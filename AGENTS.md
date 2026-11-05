# Agents Guide

## Runtime model
Next.js 16 App Router deployed on Vercel as a static client app. No serverless code: no route handlers (`route.ts`), no server actions (`"use server"`), no `proxy.ts` or middleware, no server-side data fetching, no `cookies()` or `headers()`. Every route prerenders as a static shell; data loads in the browser from the backend API (`NEXT_PUBLIC_API_URL`) with the Supabase access token as a Bearer token.

## Structure
- `src/app/`: holds routes and layouts only and is the UI composition root.
- `src/features/<name>/`: holds one feature per backend module (for example activities, lists, tags, subtasks, ai, auth, summary) with `api/` (TanStack Query hooks over the shared client), `components/` and `model/` (types and mappers).
- `src/shared/`: holds `ui/` (design system), `api/` (typed HTTP client and generated OpenAPI types), `auth/` (Supabase browser client), `config/` (validated env) and `lib/`.

## Feature independence
A feature never imports another feature; `src/shared` never imports a feature; pages and layouts in `src/app` connect features through props and slots. Removing a feature means deleting its folder and its usages in `src/app`. The backend `GET /v1/meta` returns the enabled modules; hide the UI of a module the backend does not list.

## Next.js
Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` because version 16 changed APIs. `cacheComponents` is on: client components that read search params must render inside `<Suspense>`.

## Commands
- `npm run dev` (port 3000)
- `npm run check` (lint, typecheck, build)

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
