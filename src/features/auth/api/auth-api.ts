import { isAuthError as isSupabaseAuthError } from "@supabase/supabase-js";
import { ApiError } from "@/shared/api/api-error";
import { getHttpClient } from "@/shared/api/http-client";
import { getSupabaseClient } from "@/shared/auth/supabase-client";
import { AuthError } from "../model/auth-error";

export interface SignInVariables {
  email: string;
  password: string;
}

export interface RegisterVariables {
  fullName: string;
  email: string;
  password: string;
  turnstileToken: string;
}

export interface VerifySignupCodeVariables {
  email: string;
  code: string;
}

export interface RequestPasswordResetVariables {
  email: string;
  turnstileToken: string;
}

export interface ResetPasswordVariables {
  email: string;
  code: string;
  newPassword: string;
}

export interface RequestLoginCodeVariables {
  email: string;
}

export interface VerifyLoginCodeVariables {
  email: string;
  code: string;
}

function toAuthError(error: unknown, verifying: boolean): AuthError {
  if (error instanceof AuthError) return error;
  if (
    error instanceof TypeError ||
    (isSupabaseAuthError(error) && error.name === "AuthRetryableFetchError")
  ) {
    return new AuthError("network");
  }
  if (!(error instanceof ApiError) && !isSupabaseAuthError(error)) {
    return new AuthError("unknown");
  }

  const { code, status } = error;
  if (
    status === 429 ||
    code === "over_email_send_rate_limit" ||
    code === "over_request_rate_limit"
  ) {
    return new AuthError("rate_limited");
  }
  if (code === "invalid_credentials") return new AuthError("invalid_credentials");
  if (code === "email_not_confirmed") return new AuthError("email_not_confirmed");
  if (code === "CAPTCHA_FAILED") return new AuthError("captcha_failed");
  if (code === "weak_password") return new AuthError("weak_password");
  if (
    error instanceof ApiError &&
    code === "VALIDATION_ERROR" &&
    Array.isArray(error.details) &&
    error.details.some((issue: unknown) =>
      typeof issue === "object" && issue !== null &&
      "path" in issue && typeof issue.path === "string" &&
      issue.path.split("/").includes("password"),
    )
  ) {
    return new AuthError("weak_password");
  }
  if (
    code === "otp_expired" ||
    code === "invalid_otp" ||
    (verifying && status === 400)
  ) {
    return new AuthError("invalid_code");
  }
  return new AuthError("unknown");
}

async function authRequest(
  request: () => Promise<{ error?: unknown }>,
  verifying = false,
): Promise<void> {
  try {
    const { error } = await request();
    if (error) throw error;
  } catch (error) {
    throw toAuthError(error, verifying);
  }
}

export async function requestLoginCode({
  email,
}: RequestLoginCodeVariables): Promise<void> {
  await authRequest(() =>
    getHttpClient().POST("/v1/auth/login-code", { body: { email } }),
  );
}

export async function verifyLoginCode({
  email,
  code,
}: VerifyLoginCodeVariables): Promise<void> {
  await authRequest(() =>
    getSupabaseClient().auth.verifyOtp({ email, token: code, type: "magiclink" }),
    true,
  );
}

export async function signIn({
  email,
  password,
}: SignInVariables): Promise<void> {
  await authRequest(() =>
    getSupabaseClient().auth.signInWithPassword({ email, password }),
  );
}

export async function register(variables: RegisterVariables): Promise<void> {
  await authRequest(() =>
    getHttpClient().POST("/v1/auth/register", { body: variables }),
  );
}

export async function verifySignupCode({
  email,
  code,
}: VerifySignupCodeVariables): Promise<void> {
  await authRequest(() =>
    getSupabaseClient().auth.verifyOtp({ email, token: code, type: "signup" }),
    true,
  );
}

export async function requestPasswordReset(
  variables: RequestPasswordResetVariables,
): Promise<void> {
  await authRequest(() =>
    getHttpClient().POST("/v1/auth/password-reset", { body: variables }),
  );
}

export async function resetPassword({
  email,
  code,
  newPassword,
}: ResetPasswordVariables): Promise<void> {
  await authRequest(() =>
    getSupabaseClient().auth.verifyOtp({ email, token: code, type: "recovery" }),
    true,
  );
  await authRequest(() =>
    getSupabaseClient().auth.updateUser({ password: newPassword }),
  );
}

export async function signOut(): Promise<void> {
  await authRequest(() => getSupabaseClient().auth.signOut());
}
