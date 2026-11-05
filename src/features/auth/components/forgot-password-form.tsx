"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { Alert } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { useRequestPasswordReset } from "../api/use-auth";
import {
  authErrorMessage,
  getAuthErrorCode,
  type AuthErrorCode,
} from "../model/auth-error";
import {
  validateEmailField,
  validateForgotPasswordForm,
  type ForgotPasswordFieldErrors,
} from "../model/auth-validation";
import { AuthCard } from "./auth-card";
import { TurnstileField, type TurnstileFieldHandle } from "./turnstile-field";

export function ForgotPasswordForm() {
  const router = useRouter();
  const requestResetMutation = useRequestPasswordReset();

  const [email, setEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [touched, setTouched] = useState<{ email?: boolean }>({});
  const [errors, setErrors] = useState<ForgotPasswordFieldErrors>({});
  const [apiErrorCode, setApiErrorCode] = useState<AuthErrorCode | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const turnstileRef = useRef<TurnstileFieldHandle>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiErrorCode(null);
    setTouched({ email: true });

    const nextErrors = validateForgotPasswordForm({ email });
    setErrors(nextErrors);

    if (nextErrors.email) {
      emailRef.current?.focus();
      return;
    }
    if (!turnstileToken) {
      return;
    }

    const trimmedEmail = email.trim();
    requestResetMutation.mutate(
      { email: trimmedEmail, turnstileToken },
      {
        onSuccess: () => {
          router.push(
            `/reset-password?email=${encodeURIComponent(trimmedEmail)}`,
          );
        },
        onError: (error) => {
          setApiErrorCode(getAuthErrorCode(error));
          turnstileRef.current?.reset();
        },
      },
    );
  };

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we will send you a 6-digit code."
      footer={
        <Link
          href="/login"
          className="font-semibold text-accent hover:underline"
        >
          Back to log in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {apiErrorCode ? (
          <Alert variant="error">{authErrorMessage(apiErrorCode)}</Alert>
        ) : null}

        <Field label="Email" error={errors.email}>
          <Input
            ref={emailRef}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            disabled={requestResetMutation.isPending}
            onChange={(event) => {
              const next = event.target.value;
              setEmail(next);
              if (touched.email) {
                setErrors((prev) => ({
                  ...prev,
                  email: validateEmailField(next),
                }));
              }
            }}
          />
        </Field>

        <TurnstileField ref={turnstileRef} onToken={setTurnstileToken} />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={!turnstileToken || requestResetMutation.isPending}
        >
          {requestResetMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          <span>Send code</span>
        </Button>
      </form>
    </AuthCard>
  );
}
