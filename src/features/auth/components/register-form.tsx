"use client";

import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { Alert } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { useRegister } from "../api/use-auth";
import {
  authErrorMessage,
  getAuthErrorCode,
  type AuthErrorCode,
} from "../model/auth-error";
import {
  validateConfirmPasswordField,
  validateEmailField,
  validateFullNameField,
  validatePasswordField,
  validateRegisterForm,
  type RegisterFieldErrors,
} from "../model/auth-validation";
import { AuthCard } from "./auth-card";
import { PasswordField } from "./password-field";
import { TurnstileField, type TurnstileFieldHandle } from "./turnstile-field";

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [touched, setTouched] = useState<{
    fullName?: boolean;
    email?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
  }>({});
  const [errors, setErrors] = useState<RegisterFieldErrors>({});
  const [apiErrorCode, setApiErrorCode] = useState<AuthErrorCode | null>(null);

  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const turnstileRef = useRef<TurnstileFieldHandle>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiErrorCode(null);
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const nextErrors = validateRegisterForm({
      fullName,
      email,
      password,
      confirmPassword,
    });
    setErrors(nextErrors);

    if (nextErrors.fullName) {
      fullNameRef.current?.focus();
      return;
    }
    if (nextErrors.email) {
      emailRef.current?.focus();
      return;
    }
    if (nextErrors.password) {
      passwordRef.current?.focus();
      return;
    }
    if (nextErrors.confirmPassword) {
      confirmPasswordRef.current?.focus();
      return;
    }
    if (!turnstileToken) {
      return;
    }

    const trimmedEmail = email.trim();
    registerMutation.mutate(
      {
        fullName: fullName.trim(),
        email: trimmedEmail,
        password,
        turnstileToken,
      },
      {
        onSuccess: () => {
          router.push(
            `/verify-email?email=${encodeURIComponent(trimmedEmail)}`,
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
      title="Create your account"
      subtitle="Start organizing your day."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-accent hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {apiErrorCode ? (
          <Alert variant="error">{authErrorMessage(apiErrorCode)}</Alert>
        ) : null}

        <Field label="Full name" error={errors.fullName}>
          <Input
            ref={fullNameRef}
            type="text"
            autoComplete="name"
            placeholder="Evelyn Carter"
            value={fullName}
            disabled={registerMutation.isPending}
            onChange={(event) => {
              const next = event.target.value;
              setFullName(next);
              if (touched.fullName) {
                setErrors((prev) => ({
                  ...prev,
                  fullName: validateFullNameField(next),
                }));
              }
            }}
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <Input
            ref={emailRef}
            type="email"
            leadingIcon={<Mail className="h-4 w-4" />}
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            disabled={registerMutation.isPending}
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
          hint="At least 8 characters with a letter and a number"
          autoComplete="new-password"
          placeholder="Create a password"
          value={password}
          error={errors.password}
          disabled={registerMutation.isPending}
          onChange={(event) => {
            const next = event.target.value;
            setPassword(next);
            if (touched.password || touched.confirmPassword) {
              setErrors((prev) => ({
                ...prev,
                ...(touched.password
                  ? { password: validatePasswordField(next) }
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
          placeholder="Repeat your password"
          value={confirmPassword}
          error={errors.confirmPassword}
          disabled={registerMutation.isPending}
          onChange={(event) => {
            const next = event.target.value;
            setConfirmPassword(next);
            if (touched.confirmPassword) {
              setErrors((prev) => ({
                ...prev,
                confirmPassword: validateConfirmPasswordField(password, next),
              }));
            }
          }}
        />

        <TurnstileField ref={turnstileRef} onToken={setTurnstileToken} />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={!turnstileToken || registerMutation.isPending}
        >
          {registerMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          <span>Create account</span>
        </Button>
      </form>
    </AuthCard>
  );
}
