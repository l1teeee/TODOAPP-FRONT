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
