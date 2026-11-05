"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { Alert } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { OtpInput } from "@/shared/ui/otp-input";
import { useVerifySignupCode } from "../api/use-auth";
import {
  authErrorMessage,
  getAuthErrorCode,
  type AuthErrorCode,
} from "../model/auth-error";
import {
  validateCodeField,
  validateVerifyEmailForm,
  type VerifyEmailFieldErrors,
} from "../model/auth-validation";
import { AuthCard } from "./auth-card";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "your email";
  const verifyMutation = useVerifySignupCode();

  const [code, setCode] = useState("");
  const [touched, setTouched] = useState<{ code?: boolean }>({});
  const [errors, setErrors] = useState<VerifyEmailFieldErrors>({});
  const [apiErrorCode, setApiErrorCode] = useState<AuthErrorCode | null>(null);

  const codeRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiErrorCode(null);
    setTouched({ code: true });

    const nextErrors = validateVerifyEmailForm({ code });
    setErrors(nextErrors);

    if (nextErrors.code) {
      codeRef.current?.focus();
      return;
    }

    verifyMutation.mutate(
      { email, code },
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
      title="Check your email"
      subtitle={`We sent a 6-digit code to ${email}.`}
      footer={
        <>
          Wrong email or no code?{" "}
          <Link
            href="/register"
            className="font-semibold text-accent hover:underline"
          >
            Register again
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {apiErrorCode ? (
          <Alert variant="error">{authErrorMessage(apiErrorCode)}</Alert>
        ) : null}

        <Field label="Verification code" error={errors.code}>
          <OtpInput
            ref={codeRef}
            value={code}
            disabled={verifyMutation.isPending}
            onChange={(next) => {
              setCode(next);
              if (touched.code) {
                setErrors((prev) => ({
                  ...prev,
                  code: validateCodeField(next),
                }));
              }
            }}
          />
        </Field>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={verifyMutation.isPending}
        >
          {verifyMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          <span>Verify email</span>
        </Button>
      </form>
    </AuthCard>
  );
}
