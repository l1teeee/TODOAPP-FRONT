import * as Sentry from "@sentry/nextjs";
import { ApiError } from "@/shared/api/api-error";
import { publicEnv } from "@/shared/config/public-env";

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
      const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
      if (event.message) event.message = event.message.replace(emailPattern, "[email]");
      for (const exception of event.exception?.values ?? []) {
        if (exception.value) exception.value = exception.value.replace(emailPattern, "[email]");
      }
      return event;
    },
    beforeBreadcrumb(breadcrumb) {
      if (breadcrumb.category === "console") return null;
      if ((breadcrumb.category === "fetch" || breadcrumb.category === "xhr") &&
          typeof breadcrumb.data?.url === "string") {
        breadcrumb.data.url = breadcrumb.data.url.split("?")[0];
      }
      return breadcrumb;
    },
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
