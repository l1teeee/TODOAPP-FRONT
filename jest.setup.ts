import "@testing-library/jest-dom";

process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000";
process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "test-publishable-key";
process.env.NEXT_PUBLIC_OTP_LENGTH = "8";
process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "test-site-key";
