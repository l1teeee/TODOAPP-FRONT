const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_REGEX = /^\d{6}$/;

export function validateEmailField(email: string): string | undefined {
  const trimmed = email.trim();
  if (!trimmed) {
    return "Email is required.";
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return "Enter a valid email address.";
  }
  return undefined;
}

export function validatePasswordField(password: string): string | undefined {
  if (password.length < 8 || password.length > 72) {
    return "Password must be 8 to 72 characters.";
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Password must include at least one letter and one number.";
  }
  return undefined;
}

export function validateConfirmPasswordField(
  password: string,
  confirmPassword: string,
): string | undefined {
  if (!confirmPassword) {
    return "Please confirm your password.";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }
  return undefined;
}

export function validateFullNameField(fullName: string): string | undefined {
  const trimmed = fullName.trim();
  if (trimmed.length < 1 || trimmed.length > 80) {
    return "Full name must be between 1 and 80 characters.";
  }
  return undefined;
}

export function validateCodeField(code: string): string | undefined {
  if (!CODE_REGEX.test(code)) {
    return "Enter the 6-digit code.";
  }
  return undefined;
}

export interface LoginFieldErrors {
  email?: string;
  password?: string;
}

export function validateLoginForm(values: {
  email: string;
  password: string;
}): LoginFieldErrors {
  const errors: LoginFieldErrors = {};
  const emailError = validateEmailField(values.email);
  if (emailError) errors.email = emailError;
  const passwordError = validatePasswordField(values.password);
  if (passwordError) errors.password = passwordError;
  return errors;
}

export interface RegisterFieldErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function validateRegisterForm(values: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {};
  const fullNameError = validateFullNameField(values.fullName);
  if (fullNameError) errors.fullName = fullNameError;
  const emailError = validateEmailField(values.email);
  if (emailError) errors.email = emailError;
  const passwordError = validatePasswordField(values.password);
  if (passwordError) errors.password = passwordError;
  const confirmError = validateConfirmPasswordField(
    values.password,
    values.confirmPassword,
  );
  if (confirmError) errors.confirmPassword = confirmError;
  return errors;
}

export interface VerifyEmailFieldErrors {
  code?: string;
}

export function validateVerifyEmailForm(values: {
  code: string;
}): VerifyEmailFieldErrors {
  const errors: VerifyEmailFieldErrors = {};
  const codeError = validateCodeField(values.code);
  if (codeError) errors.code = codeError;
  return errors;
}

export interface ForgotPasswordFieldErrors {
  email?: string;
}

export function validateForgotPasswordForm(values: {
  email: string;
}): ForgotPasswordFieldErrors {
  const errors: ForgotPasswordFieldErrors = {};
  const emailError = validateEmailField(values.email);
  if (emailError) errors.email = emailError;
  return errors;
}

export interface ResetPasswordFieldErrors {
  code?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export function validateResetPasswordForm(values: {
  code: string;
  newPassword: string;
  confirmPassword: string;
}): ResetPasswordFieldErrors {
  const errors: ResetPasswordFieldErrors = {};
  const codeError = validateCodeField(values.code);
  if (codeError) errors.code = codeError;
  const passwordError = validatePasswordField(values.newPassword);
  if (passwordError) errors.newPassword = passwordError;
  const confirmError = validateConfirmPasswordField(
    values.newPassword,
    values.confirmPassword,
  );
  if (confirmError) errors.confirmPassword = confirmError;
  return errors;
}
