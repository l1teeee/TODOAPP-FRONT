export type AuthErrorCode =
  | "invalid_credentials"
  | "email_not_confirmed"
  | "invalid_code"
  | "captcha_failed"
  | "weak_password"
  | "rate_limited"
  | "network"
  | "unknown";

export class AuthError extends Error {
  readonly code: AuthErrorCode;

  constructor(code: AuthErrorCode, message?: string) {
    super(message ?? authErrorMessage(code));
    this.name = "AuthError";
    this.code = code;
  }
}

export function authErrorMessage(code: AuthErrorCode): string {
  switch (code) {
    case "invalid_credentials":
      return "Invalid email or password.";
    case "email_not_confirmed":
      return "Please verify your email address before logging in.";
    case "invalid_code":
      return "Invalid or expired verification code.";
    case "captcha_failed":
      return "Security verification failed. Please try again.";
    case "weak_password":
      return "Password is too weak. Choose a stronger password.";
    case "rate_limited":
      return "Too many attempts. Please wait a moment and try again.";
    case "network":
      return "Network error. Check your connection and try again.";
    case "unknown":
    default:
      return "Something went wrong. Please try again.";
  }
}

export function getAuthErrorCode(error: unknown): AuthErrorCode {
  if (error instanceof AuthError) {
    return error.code;
  }
  return "unknown";
}
