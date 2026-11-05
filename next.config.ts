import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";
import { publicEnv } from "./src/shared/config/public-env";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [{ source: "/", destination: "/today", permanent: false }];
  },
  async headers() {
    const sentryDsn = publicEnv.sentryDsn;
    const sentryOrigin = sentryDsn ? ` ${new URL(sentryDsn).origin}` : "";
    const scriptSources = process.env.NODE_ENV === "development"
      ? "'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com"
      : "'self' 'unsafe-inline' https://challenges.cloudflare.com";
    const csp = [
      "default-src 'self'",
      `script-src ${scriptSources}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      `connect-src 'self' ${publicEnv.apiUrl} ${publicEnv.supabaseUrl} https://challenges.cloudflare.com${sentryOrigin}`,
      "frame-src https://challenges.cloudflare.com",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    return [{
      source: "/:path*",
      headers: [
        { key: "Content-Security-Policy", value: csp },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Without the token the plugin still emits browser source maps that nobody uploads or deletes, leaving them publicly served.
export default process.env.SENTRY_AUTH_TOKEN ? withSentryConfig(nextConfig, {
  org: "numen-ne",
  project: "todo-app-frontend",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  sourcemaps: { deleteSourcemapsAfterUpload: true },
  telemetry: false,
}) : nextConfig;
