# TODO App - Frontend

## Overview
Next.js 16 static client app deployed on Vercel with no serverless code. It communicates with the backend API service (hosted on Railway, repository: https://github.com/l1teeee/TODOOAPP-BACKEND) and authenticates using Supabase.

## Stack
### Dependencies
- `@gsap/react`: `^2.1.2`
- `clsx`: `^2.1.1`
- `gsap`: `^3.15.0`
- `next`: `16.4.2`
- `react`: `19.3.0`
- `react-dom`: `19.3.0`

### DevDependencies
- `@tailwindcss/turbopack`: `^4`
- `@types/node`: `^20`
- `@types/react`: `^19`
- `@types/react-dom`: `^19`
- `eslint`: `^9`
- `eslint-config-next`: `16.4.2`
- `tailwindcss`: `^4`
- `typescript`: `^5`

## Architecture
- **Runtime model**: Next.js 16 App Router deployed on Vercel as a static client app. No serverless code: no route handlers (`route.ts`), no server actions (`"use server"`), no `proxy.ts` or middleware, no server-side data fetching, no `cookies()` or `headers()`. Every route prerenders as a static shell; data loads in the browser from the backend API (`NEXT_PUBLIC_API_URL`) with the Supabase access token as a Bearer token.
- **Structure tree**:
  - `src/app/`: UI composition root, holds routes and layouts only.
  - `src/features/<name>/`: One feature per backend module (e.g. activities, lists, tags, subtasks, ai, auth, summary) with `api/` (TanStack Query hooks over the shared client), `components/`, and `model/` (types and mappers).
  - `src/shared/`: Shared infrastructure including `ui/` (design system), `api/` (typed HTTP client and generated OpenAPI types), `auth/` (Supabase browser client), `config/` (validated env), and `lib/`.
- **Feature independence**: A feature never imports another feature; `src/shared` never imports a feature; pages and layouts in `src/app` connect features through props and slots. Removing a feature means deleting its folder and usages in `src/app`. The backend `GET /v1/meta` returns enabled modules; hide the UI of a module the backend does not list.

## Requirements
- Node 24
- npm

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in the values:
   ```bash
   cp .env.example .env.local
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts
| Script | Command | Description |
| --- | --- | --- |
| `dev` | `next dev` | Starts the Next.js development server on port 3000 |
| `build` | `next build` | Builds the application for production |
| `start` | `next start` | Runs the built application |
| `lint` | `eslint` | Lints the codebase using ESLint |
| `typecheck` | `tsc --noEmit` | Validates TypeScript types across the codebase |
| `check` | `npm run lint && npm run typecheck && npm run build` | Runs lint, typecheck, and build in sequence |

## Environment variables
| Name | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL (Railway service). Local: http://localhost:4000 |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL (Project Settings > API) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase publishable (anon) key. Public by design; never put the service role key here |

## Testing
Run unit and component tests with `npm test` or `npm run test:agent`.

For end-to-end tests, copy `.env.e2e.example` to `.env.e2e.local` and fill in the Supabase URL, secret key, publishable key and test user password. Set the dedicated test email if needed (the default is `e2e@example.com`). The setup deletes and recreates that user on every run, and disables email notifications. Keep this file private. The optional API and frontend URLs default to `http://localhost:4000` and `http://localhost:3000`.

Start the API on port 4000 and the frontend dev server on port 3000 before testing. Install the browser once with `npx playwright install chromium`, then run `npm run test:e2e`.

## Deploy on Vercel
1. Import repository `https://github.com/l1teeee/TODOAPP-FRONT` into Vercel.
2. Select framework preset `Next.js`.
3. Node 24 is automatically selected from the `engines` field in `package.json`.
4. Configure the three environment variables (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) with the production API and Supabase URLs/keys.
5. Add the Vercel production domain to the backend `CORS_ORIGINS`.

## Origin
Generated from the owner's MINIMAL template; `three` and `@react-three/fiber` (and `@types/three`) were removed because the app does not use 3D.
