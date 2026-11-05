"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { Alert } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { useRequestLoginCode } from "../api/use-auth";
import {
  authErrorMessage,
  getAuthErrorCode,
  type AuthErrorCode,
} from "../model/auth-error";
import { validateEmailField } from "../model/auth-validation";
import { AuthCard } from "./auth-card";

export function LoginCodeForm() {
  const router = useRouter();
  const requestMutation = useRequestLoginCode();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [apiErrorCode, setApiErrorCode] = useState<AuthErrorCode | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiErrorCode(null);

    const error = validateEmailField(email);
    setEmailError(error);
    if (error) {
      emailRef.current?.focus();
      return;
    }

    const trimmed = email.trim();
    requestMutation.mutate(
      { email: trimmed },
      {
        onSuccess: () => {
          router.push(`/login/verify?email=${encodeURIComponent(trimmed)}`);
        },
        onError: (cause) => {
          setApiErrorCode(getAuthErrorCode(cause));
        },
      },
    );
  };

  return (
    <AuthCard
      title="Log in with a code"
      subtitle="Enter your email and we will send you a 6-digit code."
      footer={
        <Link
          href="/login"
          className="font-semibold text-accent hover:underline"
        >
          Use your password instead
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {apiErrorCode ? (
          <Alert variant="error">{authErrorMessage(apiErrorCode)}</Alert>
        ) : null}

        <Field label="Email" error={emailError}>
          <Input
            ref={emailRef}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            disabled={requestMutation.isPending}
            onChange={(event) => {
              setEmail(event.target.value);
              setEmailError(undefined);
            }}
          />
        </Field>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={requestMutation.isPending}
        >
          {requestMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          <span>Send code</span>
        </Button>
      </form>
    </AuthCard>
  );
}
