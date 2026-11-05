function readTurnstileSiteKey(): string {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  if (!turnstileSiteKey) {
    throw new Error("Missing NEXT_PUBLIC_TURNSTILE_SITE_KEY");
  }
  return turnstileSiteKey;
}

export const publicEnv = {
  get turnstileSiteKey(): string {
    return readTurnstileSiteKey();
  },
};
