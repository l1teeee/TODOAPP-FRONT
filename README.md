# TODO App - Frontend

## Overview
A Next.js 16 App Router application deployed on Vercel as a static client app with zero serverless code. It connects to the backend API service (hosted on Railway, repository: [TODOOAPP-BACKEND](https://github.com/l1teeee/TODOOAPP-BACKEND)) and authenticates directly from the browser using Supabase, passing the Supabase access token as a Bearer header to backend endpoints.

## Features
- **Dashboard views**: Today, Upcoming, and filterable task views.
- **Habits**: Daily habit tracker with streak tracking and visual status indicators.
- **Reminders**: Time-sensitive reminders with soft-pulse badges and interactive toggles.
- **Kanban**: Drag-and-drop / column-based board for managing workflow stages.
- **Detail panel with checklist**: Slide-out task details panel with subtasks checklist and metadata editors.
- **Lists and tags**: Custom lists and colored tags for categorizing activities.
- **Completed & Trash**: Archive of finished activities and soft-delete trash recovery view.
- **Summary**: Overview metrics of completed tasks, habits, and productivity history.
- **Settings**: User profile, preferences, notifications, and theme settings.
- **AI hero**: AI-powered productivity assistant powered by DeepInfra when enabled by the backend.
- **Empty workspace or sample data**: Onboarding options to start blank or load realistic sample tasks.
- **Authentication**: Password login, email OTP verification code login, registration, and forgot password flows.
- **Bot protection**: Cloudflare Turnstile verification on register and forgot-password pages.
- **Themes**: System preference, light, and dark mode themes with view transitions.

## Architecture
- **Runtime model**: Next.js 16 static client app. No serverless functions, no route handlers (`route.ts`), no server actions (`"use server"`), no `proxy.ts` or middleware, no server-side data fetching, and no `cookies()` or `headers()`. Every route prerenders as a static shell; data is fetched purely in the browser.
- **Structure**:
  - `src/app/`: UI composition root, contains routes and layouts only.
  - `src/features/<name>/`: Isolated feature folders (e.g. `activities`, `lists`, `tags`, `subtasks`, `ai`, `auth`, `summary`) containing:
    - `api/`: TanStack Query hooks consuming the shared HTTP client.
    - `components/`: UI components private to the feature.
    - `model/`: Types, mappers, and state schemas.
  - `src/shared/`: Shared infrastructure:
    - `ui/`: Design system controls and primitives.
    - `api/`: Typed HTTP client (`openapi-fetch`) and generated OpenAPI types.
    - `auth/`: Supabase browser client and token management.
    - `config/`: Validated public environment variables.
    - `lib/`: General utility functions and motion helpers.
- **Feature independence**: A feature never imports another feature. `src/shared` never imports a feature. Pages and layouts in `src/app` connect features via props and slots. Removing a feature is as simple as deleting its folder and references in `src/app`.
- **Dynamic module visibility**: The backend `GET /v1/meta` endpoint reports active feature modules. The frontend dynamically hides the UI for any module not returned.

```
src/
├── app/                  # Routes, layouts, and composition root
├── features/             # Independent domain features
│   ├── activities/
│   ├── ai/
│   ├── auth/
│   ├── habits/
│   ├── lists/
│   ├── reminders/
│   ├── subtasks/
│   ├── summary/
│   └── tags/
└── shared/               # Shared libraries and primitives
    ├── api/              # openapi-fetch client and schema
    ├── auth/             # Supabase browser client
    ├── config/           # Validated environment variables
    ├── lib/              # Utilities
    └── ui/               # Reusable UI components
```

## Design System
- **Palette tokens**: Defined with CSS custom properties using `light-dark()` colors for `--canvas`, `--surface`, `--surface-muted`, `--line`, `--line-strong`, `--fg`, `--fg-secondary`, `--fg-muted`, `--accent`, `--berry`, `--navy`, plus dedicated habit and tag color scales.
- **Typography**: Nunito (`--font-nunito`), loaded via `next/font/google` and mapped to `font-sans`.
- **GSAP motion rules**: Smooth micro-interactions, subtle hover scale/rotation effects on buttons and icons, plus keyframe animations for checkmarks, bell swings, and spinners.
- **Reduced motion**: Full `@media (prefers-reduced-motion: reduce)` support instantly zeroing animation and transition durations and disabling continuous keyframes.
- **View transitions**: Native CSS view transitions (`::view-transition-old(root)`, `::view-transition-new(root)`) and `theme-fading` transitions for seamless theme toggling without flash.

## Stack
### Runtime Dependencies
- `@gsap/react`: `^2.1.2`
- `@marsidev/react-turnstile`: `1.6.3`
- `@paper-design/shaders-react`: `0.0.82`
- `@supabase/supabase-js`: `2.119.0`
- `@tanstack/react-query`: `5.106.1`
- `clsx`: `^2.1.1`
- `gsap`: `^3.15.0`
- `lucide-react`: `1.69.0`
- `next`: `16.4.2`
- `openapi-fetch`: `0.17.0`
- `radix-ui`: `1.8.1`
- `react`: `19.3.0`
- `react-dom`: `19.3.0`

### Dev Dependencies
- `@playwright/test`: `1.64.1`
- `@tailwindcss/turbopack`: `^4`
- `@testing-library/jest-dom`: `7.0.1`
- `@testing-library/react`: `16.3.3`
- `@testing-library/user-event`: `14.6.8`
- `@types/jest`: `30.0.0`
- `@types/node`: `^20`
- `@types/react`: `^19`
- `@types/react-dom`: `^19`
- `eslint`: `^9`
- `eslint-config-next`: `16.4.2`
- `jest`: `30.5.2`
- `jest-environment-jsdom`: `30.5.2`
- `openapi-typescript`: `7.13.0`
- `tailwindcss`: `^4`
- `typescript`: `^5`

## Getting Started
### Prerequisites
- Node 24 (specified in `package.json` engines)
- npm

### Installation & Local Setup
1. Install dependencies (this also triggers the `prepare` script to configure git hooks):
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Configure the five public environment variables in `.env.local`:
   - `NEXT_PUBLIC_API_URL`: Backend API base URL (e.g. `http://localhost:4000` locally, or Railway service URL).
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (`https://<project-ref>.supabase.co`).
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase publishable (anon) key for browser authentication.
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: Cloudflare Turnstile site key (Cloudflare's always-pass test key `1x00000000000000000000AA` can be used in local development).
   - `NEXT_PUBLIC_OTP_LENGTH`: Email OTP code length (must match the Supabase Auth Email OTP Length setting, typically `6`).
4. Start the backend service first (e.g. at `http://localhost:4000`).
5. Start the frontend development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Contract
The frontend client uses typed API contracts generated directly from OpenAPI specifications:
1. Copy the backend `openapi.json` to `src/shared/api/openapi.json`.
2. Generate TypeScript types using:
   ```bash
   npm run api:types
   ```
   This generates `src/shared/api/schema.d.ts` consumed by `openapi-fetch`.

## Scripts
| Script | Command | Description |
| --- | --- | --- |
| `dev` | `next dev` | Starts Next.js development server on port 3000 |
| `build` | `next build` | Builds static application for production |
| `start` | `next start` | Runs built production application |
| `lint` | `eslint` | Lints codebase using ESLint |
| `typecheck` | `tsc --noEmit` | Checks TypeScript types without emitting files |
| `test` | `jest` | Runs unit and component tests |
| `test:agent` | `jest --runInBand` | Runs unit tests sequentially |
| `test:e2e` | `playwright test` | Runs Playwright end-to-end tests |
| `check` | `npm run lint && npm run typecheck && npm run build` | Complete quality check: lint, typecheck, build |
| `api:types` | `openapi-typescript src/shared/api/openapi.json -o src/shared/api/schema.d.ts` | Generates TypeScript interfaces from OpenAPI spec |
| `prepare` | `node scripts/install-git-hooks.mjs` | Configures git `core.hooksPath` to `.githooks` |

## Testing
- **Jest**: Unit and component testing:
  ```bash
  npm test
  # or in single thread
  npm run test:agent
  ```
- **Playwright**: End-to-end browser testing:
  - Requires `.env.e2e.local` (copied from `.env.e2e.example`).
  - `global-setup.ts` manages a fresh test user (`e2e@example.com` or custom) by deleting and recreating it on every run, disabling email notifications, authenticating via Supabase, and saving browser storage state to `e2e/.auth/user.json`.
  - Install Playwright Chromium browser once:
    ```bash
    npx playwright install chromium
    ```
  - Ensure the backend (port 4000) and frontend (port 3000) servers are running, then run:
    ```bash
    npm run test:e2e
    ```

## Observability
When `NEXT_PUBLIC_SENTRY_DSN` is set for the `todo-app-frontend` project, Sentry reports render errors, unhandled errors, API failures with status 500 or higher, and network failures, associated with the signed-in user id. Traces propagate to the API. Replays record only sessions with an error and mask all text.

- `NEXT_PUBLIC_SENTRY_DSN`: Sentry project DSN; empty disables reporting.
- `NEXT_PUBLIC_SENTRY_ENVIRONMENT`: Sentry environment; set to `production` on Vercel.
- `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE`: trace sampling rate from 0 to 1; defaults to 1.
- `SENTRY_AUTH_TOKEN`: Sentry organization token, set only in the Vercel environment; enables source map uploads for readable stack traces.

## Deploy on Vercel
1. Import the repository into Vercel.
2. Select framework preset `Next.js`.
3. Node 24 is automatically selected from the `engines` field in `package.json`.
4. Configure environment variables with production values:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (production site key from Cloudflare Turnstile)
   - `NEXT_PUBLIC_OTP_LENGTH`
5. In the backend settings, add the Vercel production domain to `CORS_ORIGINS`.
6. In Supabase Dashboard > Authentication > URL Configuration, add the Vercel domain to Site URL and Redirect URLs.

## Security
- **Content Security Policy & Headers**: Configured in `next.config.ts`, including strict CSP directives (`default-src 'self'`, `frame-ancestors 'none'`, restricted `script-src` and `connect-src`), `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, and `Permissions-Policy`.
- **Dependabot**: Configured in `.github/dependabot.yml` for automated weekly npm updates and security fixes.
- **Review Agents**:
  - `.claude/agents/security-reviewer.md`: Verifies secrets, static runtime surface, XSS protections, token handling, Turnstile flow, and security headers.
  - `.claude/agents/quality-reviewer.md`: Enforces architecture boundaries, feature independence, error handling, accessibility, and zero-suppression hygiene.
- **Snyk Integration**: Snyk Open Source dependency scanning (`snyk test`) and static application security testing with Snyk Code (`snyk code test`).
- **Pre-push Gate & Security Advisor**:
  - `.githooks/pre-push` enforces that `npm run check`, `npm run test:agent`, `npm audit --omit=dev --audit-level=high`, and Snyk scans pass before code can be pushed to remote (bypassable only via temporary `SKIP_SNYK=1`).
  - `.claude/agents/security-advisor.md` acts as an automated gatekeeper running the test plan, dependency audits, Snyk vulnerability scans, and code review checklists before merges or pushes.
