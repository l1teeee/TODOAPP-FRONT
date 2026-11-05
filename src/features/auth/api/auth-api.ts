// Temporary in-memory demo API; replaced by HTTP calls in the API integration brief
import { simulateLatency } from "@/shared/lib/simulate-latency";
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

export async function signIn({
  email,
  password,
}: SignInVariables): Promise<void> {
  void email;
  await simulateLatency();
  if (password === "wrong-password1") {
    throw new AuthError("invalid_credentials");
  }
}

export async function register({
  fullName,
  email,
  password,
  turnstileToken,
}: RegisterVariables): Promise<void> {
  void fullName;
  void email;
  void password;
  await simulateLatency();
  if (!turnstileToken) {
    throw new AuthError("captcha_failed");
  }
}

export async function verifySignupCode({
  email,
  code,
}: VerifySignupCodeVariables): Promise<void> {
  void email;
  await simulateLatency();
  if (code === "000000") {
    throw new AuthError("invalid_code");
  }
}

export async function requestPasswordReset({
  email,
  turnstileToken,
}: RequestPasswordResetVariables): Promise<void> {
  void email;
  await simulateLatency();
  if (!turnstileToken) {
    throw new AuthError("captcha_failed");
  }
}

export async function resetPassword({
  email,
  code,
  newPassword,
}: ResetPasswordVariables): Promise<void> {
  void email;
  void newPassword;
  await simulateLatency();
  if (code === "000000") {
    throw new AuthError("invalid_code");
  }
}

export async function signOut(): Promise<void> {
  await simulateLatency();
}
