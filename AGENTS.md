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
