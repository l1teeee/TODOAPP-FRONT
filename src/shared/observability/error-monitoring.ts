import * as Sentry from "@sentry/nextjs";
import { ApiError } from "@/shared/api/api-error";
import { publicEnv } from "@/shared/config/public-env";

// Auth URLs can contain email addresses in their query strings.
function stripQueryAndHash(url: string): string {
  try {
    const parsed = new URL(url, window.location.href);
    if (url.startsWith("/") && !url.startsWith("//")) return parsed.pathname;
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url;
  }
}

function redactEmails(text: string): string {
  let decoded = text;
  try {
    decoded = decodeURIComponent(text);
  } catch {
    decoded = text;
  }
  return decoded.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]");
}

function sanitizeBreadcrumb(breadcrumb: Sentry.Breadcrumb): Sentry.Breadcrumb | null {
  if (breadcrumb.category === "console") return null;
  if (breadcrumb.category === "navigation") {
    for (const key of ["from", "to"]) {
      if (typeof breadcrumb.data?.[key] === "string") {
        breadcrumb.data[key] = stripQueryAndHash(breadcrumb.data[key]);
      }
    }
  }
  if ((breadcrumb.category === "fetch" || breadcrumb.category === "xhr") &&
      typeof breadcrumb.data?.url === "string") {
    breadcrumb.data.url = stripQueryAndHash(breadcrumb.data.url);
  }
  return breadcrumb;
}

function sanitizeEvent(event: Sentry.Event): void {
  if (event.request) {
    if (event.request.url) event.request.url = stripQueryAndHash(event.request.url);
    delete event.request.query_string;
  }
  if (event.breadcrumbs) {
    event.breadcrumbs = event.breadcrumbs
      .map(sanitizeBreadcrumb)
      .filter((breadcrumb): breadcrumb is Sentry.Breadcrumb => breadcrumb !== null);
  }
}

function apiOriginPattern(): RegExp {
  const apiUrl = publicEnv.apiUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${apiUrl}/`);
}

export function initErrorMonitoring(): void {
  const dsn = publicEnv.sentryDsn;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: publicEnv.sentryEnvironment,
    tracesSampleRate: publicEnv.sentryTracesSampleRate,
    tracePropagationTargets: [apiOriginPattern()],
    propagateTraceparent: true,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
    ],
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1,
    dataCollection: { userInfo: false, cookies: false, httpHeaders: false, httpBodies: [] },
    beforeSend(event) {
      sanitizeEvent(event);
      if (event.message) event.message = redactEmails(event.message);
      for (const exception of event.exception?.values ?? []) {
        if (exception.value) exception.value = redactEmails(exception.value);
      }
      return event;
    },
    beforeSendTransaction(event) {
      sanitizeEvent(event);
      if (event.transaction?.includes("?")) {
        event.transaction = stripQueryAndHash(event.transaction);
      }
      for (const span of event.spans ?? []) {
        for (const key of ["url", "http.url", "url.full", "http.target"]) {
          const value = span.data[key];
          if (typeof value === "string") span.data[key] = stripQueryAndHash(value);
        }
        if (span.description?.includes("?")) {
          const match = span.description.match(/^(\S+\s+)(\S+)$/);
          span.description = match
            ? `${match[1]}${stripQueryAndHash(match[2])}`
            : stripQueryAndHash(span.description);
        }
      }
      return event;
    },
    beforeBreadcrumb: sanitizeBreadcrumb,
  });
}

export function setMonitoredUser(userId: string | null): void {
  Sentry.setUser(userId ? { id: userId } : null);
}

// 4xx errors are expected; 5xx, network failures, and client bugs in queries are reported.
export function reportApiFailure(error: unknown): void {
  if (error instanceof ApiError && error.status < 500) return;
  Sentry.captureException(error);
}

export function reportRenderError(error: unknown): void {
  Sentry.captureException(error);
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
