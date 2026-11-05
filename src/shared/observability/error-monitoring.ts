import * as Sentry from "@sentry/nextjs";
import { ApiError } from "@/shared/api/api-error";
import { publicEnv } from "@/shared/config/public-env";

// Auth URLs and attributes can carry email addresses, sometimes percent-encoded.
function stripQueryAndHash(url: string): string {
  try {
    const parsed = new URL(url, window.location.href);
    if (url.startsWith("/") && !url.startsWith("//")) return parsed.pathname;
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url;
  }
}

function stripQueryFromName(text: string): string {
  return text.split(/[?#]/, 1)[0];
}

function redactEmails(text: string): string {
  let decoded = text;
  for (let i = 0; i < 2; i++) {
    decoded = decoded.replace(/%[0-9A-F]{2}/gi, (sequence) =>
      String.fromCharCode(parseInt(sequence.slice(1), 16)),
    );
  }
  return decoded.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]");
}

function scrubValue(value: unknown, depth = 4): unknown {
  if (typeof value === "string") {
    const text = /^(https?:\/\/|\/)/i.test(value) ? stripQueryAndHash(value) : value;
    return redactEmails(text);
  }
  if (depth <= 0) return value;
  if (Array.isArray(value)) return value.map((item) => scrubValue(item, depth - 1));
  if (value && typeof value === "object" &&
      (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)) {
    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      result[key] = scrubValue(item, depth - 1);
    }
    return result;
  }
  return value;
}

function scrubAttributes(data: Record<string, unknown> | undefined): void {
  if (!data) return;
  for (const key of ["http.query", "url.query", "http.fragment", "url.fragment"]) {
    delete data[key];
  }
  for (const key of Object.keys(data)) {
    data[key] = scrubValue(data[key]);
  }
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
  scrubAttributes(breadcrumb.data);
  if (breadcrumb.message) breadcrumb.message = scrubValue(breadcrumb.message) as string;
  return breadcrumb;
}

function sanitizeEvent(event: Sentry.Event): void {
  if (event.request) {
    if (event.request.url) event.request.url = stripQueryAndHash(event.request.url);
    delete event.request.query_string;
  }
  scrubAttributes(event.contexts?.trace?.data);
  scrubAttributes(event.extra);
  if (event.tags) {
    for (const key of Object.keys(event.tags)) {
      const value = event.tags[key];
      if (typeof value === "string") event.tags[key] = scrubValue(value) as string;
    }
  }
  if (event.transaction) event.transaction = scrubValue(stripQueryFromName(event.transaction)) as string;
  for (const span of event.spans ?? []) {
    scrubAttributes(span.data);
    if (span.description) span.description = scrubValue(stripQueryFromName(span.description)) as string;
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
