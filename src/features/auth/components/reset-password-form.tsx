"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { publicEnv } from "@/shared/config/public-env";
import { Alert } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { OtpInput } from "@/shared/ui/otp-input";
import { useResetPassword } from "../api/use-auth";
import {
  authErrorMessage,
  getAuthErrorCode,
  type AuthErrorCode,
} from "../model/auth-error";
import {
  validateCodeField,
  validateConfirmPasswordField,
  validatePasswordField,
  validateResetPasswordForm,
  type ResetPasswordFieldErrors,
} from "../model/auth-validation";
import { AuthCard } from "./auth-card";
import { PasswordField } from "./password-field";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const resetMutation = useResetPassword();

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState<{
    code?: boolean;
    newPassword?: boolean;
    confirmPassword?: boolean;
  }>({});
  const [errors, setErrors] = useState<ResetPasswordFieldErrors>({});
  const [apiErrorCode, setApiErrorCode] = useState<AuthErrorCode | null>(null);

  const codeRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiErrorCode(null);
    setTouched({
      code: true,
      newPassword: true,
      confirmPassword: true,
    });

    const nextErrors = validateResetPasswordForm(
      {
        code,
        newPassword,
        confirmPassword,
      },
      publicEnv.otpLength,
    );
    setErrors(nextErrors);

    if (nextErrors.code) {
      codeRef.current?.focus();
      return;
    }
    if (nextErrors.newPassword) {
      newPasswordRef.current?.focus();
      return;
    }
    if (nextErrors.confirmPassword) {
      confirmPasswordRef.current?.focus();
      return;
    }

    resetMutation.mutate(
      { email, code, newPassword },
      {
        onSuccess: () => {
          router.push("/today");
        },
        onError: (error) => {
          setApiErrorCode(getAuthErrorCode(error));
        },
      },
    );
  };

  return (
    <AuthCard
      title="Set a new password"
      footer={
        <Link href="/login">Back to log in</Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {apiErrorCode ? (
          <Alert variant="error">{authErrorMessage(apiErrorCode)}</Alert>
        ) : null}

        <Field label={`${publicEnv.otpLength}-digit code`} error={errors.code}>
          <OtpInput
            length={publicEnv.otpLength}
            ref={codeRef}
            value={code}
            disabled={resetMutation.isPending}
            onChange={(next) => {
              setCode(next);
              if (touched.code) {
                setErrors((prev) => ({
                  ...prev,
                  code: validateCodeField(next, publicEnv.otpLength),
                }));
              }
            }}
          />
        </Field>

        <PasswordField
          ref={newPasswordRef}
          label="New password"
          hint="At least 8 characters with a letter and a number"
          autoComplete="new-password"
          placeholder="Enter new password"
          value={newPassword}
          error={errors.newPassword}
          disabled={resetMutation.isPending}
          onChange={(event) => {
            const next = event.target.value;
            setNewPassword(next);
            if (touched.newPassword || touched.confirmPassword) {
              setErrors((prev) => ({
                ...prev,
                ...(touched.newPassword
                  ? { newPassword: validatePasswordField(next) }
                  : {}),
                ...(touched.confirmPassword
                  ? {
                      confirmPassword: validateConfirmPasswordField(
                        next,
                        confirmPassword,
                      ),
                    }
                  : {}),
              }));
            }
          }}
        />

        <PasswordField
          ref={confirmPasswordRef}
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Repeat new password"
          value={confirmPassword}
          error={errors.confirmPassword}
          disabled={resetMutation.isPending}
          onChange={(event) => {
            const next = event.target.value;
            setConfirmPassword(next);
            if (touched.confirmPassword) {
              setErrors((prev) => ({
                ...prev,
                confirmPassword: validateConfirmPasswordField(
                  newPassword,
                  next,
                ),
              }));
            }
          }}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={resetMutation.isPending}
        >
          {resetMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          <span>Update password</span>
        </Button>
      </form>
    </AuthCard>
  );
}
