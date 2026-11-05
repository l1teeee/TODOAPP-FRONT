"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { Alert } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { useSignIn } from "../api/use-auth";
import {
  authErrorMessage,
  getAuthErrorCode,
  type AuthErrorCode,
} from "../model/auth-error";
import {
  validateEmailField,
  validateLoginForm,
  validatePasswordField,
  type LoginFieldErrors,
} from "../model/auth-validation";
import { AuthCard } from "./auth-card";
import { PasswordField } from "./password-field";

export function LoginForm() {
  const router = useRouter();
  const signInMutation = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [errors, setErrors] = useState<LoginFieldErrors>({});
  const [apiErrorCode, setApiErrorCode] = useState<AuthErrorCode | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiErrorCode(null);
    setTouched({ email: true, password: true });

    const nextErrors = validateLoginForm({ email, password });
    setErrors(nextErrors);

    if (nextErrors.email) {
      emailRef.current?.focus();
      return;
    }
    if (nextErrors.password) {
      passwordRef.current?.focus();
      return;
    }

    signInMutation.mutate(
      { email: email.trim(), password },
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
      title="Welcome back"
      subtitle="Log in to continue with your activities."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-accent hover:underline"
          >
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {apiErrorCode ? (
          <Alert variant="error">
            <span>{authErrorMessage(apiErrorCode)}</span>
            {apiErrorCode === "email_not_confirmed" ? (
              <>
                {" "}
                <Link
                  href={`/verify-email?email=${encodeURIComponent(email.trim())}`}
                  className="font-semibold underline"
                >
                  Verify your email
                </Link>
              </>
            ) : null}
          </Alert>
        ) : null}

        <Field label="Email" error={errors.email}>
          <Input
            ref={emailRef}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            disabled={signInMutation.isPending}
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

        <PasswordField
          ref={passwordRef}
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          error={errors.password}
          disabled={signInMutation.isPending}
          onChange={(event) => {
            const next = event.target.value;
            setPassword(next);
            if (touched.password) {
              setErrors((prev) => ({
                ...prev,
                password: validatePasswordField(next),
              }));
            }
          }}
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-accent hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={signInMutation.isPending}
        >
          {signInMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          <span>Log in</span>
        </Button>
      </form>
    </AuthCard>
  );
}
