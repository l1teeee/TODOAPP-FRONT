function required(value: string | undefined, name: string): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`Missing ${name}`);
  }
  return trimmed;
}

function origin(value: string | undefined, name: string): string {
  const raw = required(value, name);
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`${name} must be an HTTP or HTTPS origin`);
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(`${name} must be an HTTP or HTTPS origin`);
  }
  return url.origin;
}

function otpLength(value: string | undefined, name: string): number {
  const raw = required(value, name);
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 6 || parsed > 10) {
    throw new Error(`${name} must be an integer from 6 to 10`);
  }
  return parsed;
}

export const publicEnv = {
  get sentryDsn(): string | undefined {
    const value = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();
    if (!value) return undefined;
    try {
      const url = new URL(value);
      if (url.protocol !== "https:") throw new Error();
    } catch {
      throw new Error("NEXT_PUBLIC_SENTRY_DSN must be an HTTPS URL");
    }
    return value;
  },
  get sentryEnvironment(): string {
    return process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT?.trim() ||
      process.env.NEXT_PUBLIC_VERCEL_ENV?.trim() || "development";
  },
  get sentryTracesSampleRate(): number {
    const value = process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE?.trim();
    if (!value) return 0.2;
    const rate = Number(value);
    if (!Number.isFinite(rate) || rate < 0 || rate > 1) {
      throw new Error("NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE must be a number between 0 and 1");
    }
    return rate;
  },
  get apiUrl(): string {
    return origin(process.env.NEXT_PUBLIC_API_URL, "NEXT_PUBLIC_API_URL");
  },
  get supabaseUrl(): string {
    return origin(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL");
  },
  get supabasePublishableKey(): string {
    return required(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  },
  get otpLength(): number {
    return otpLength(
      process.env.NEXT_PUBLIC_OTP_LENGTH,
      "NEXT_PUBLIC_OTP_LENGTH",
    );
  },
  get turnstileSiteKey(): string {
    return required(
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
    );
  },
};
