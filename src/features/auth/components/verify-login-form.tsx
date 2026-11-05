"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { publicEnv } from "@/shared/config/public-env";
import { Alert } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { OtpInput } from "@/shared/ui/otp-input";
import { useRequestLoginCode, useVerifyLoginCode } from "../api/use-auth";
import {
  authErrorMessage,
  getAuthErrorCode,
  type AuthErrorCode,
} from "../model/auth-error";
import { validateCodeField } from "../model/auth-validation";
import { AuthCard } from "./auth-card";

const RESEND_COOLDOWN_SECONDS = 60;

export function VerifyLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const verifyMutation = useVerifyLoginCode();
  const resendMutation = useRequestLoginCode();

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | undefined>(undefined);
  const [apiErrorCode, setApiErrorCode] = useState<AuthErrorCode | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiErrorCode(null);

    const error = validateCodeField(code, publicEnv.otpLength);
    setCodeError(error);
    if (error) {
      codeRef.current?.focus();
      return;
    }

    verifyMutation.mutate(
      { email, code },
      {
        onSuccess: () => {
          router.push("/today");
        },
        onError: (cause) => {
          setApiErrorCode(getAuthErrorCode(cause));
        },
      },
    );
  };

  const handleResend = () => {
    setApiErrorCode(null);
    resendMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setSecondsLeft(RESEND_COOLDOWN_SECONDS);
        },
        onError: (cause) => {
          setApiErrorCode(getAuthErrorCode(cause));
        },
      },
    );
  };

  return (
    <AuthCard
      title="Check your email"
      subtitle={`We sent a ${publicEnv.otpLength}-digit code to ${email || "your email"}.`}
      footer={
        <Link
          href="/login/code"
          className="font-semibold text-accent hover:underline"
        >
          Use a different email
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {apiErrorCode ? (
          <Alert variant="error">{authErrorMessage(apiErrorCode)}</Alert>
        ) : null}

        <Field label="Login code" error={codeError}>
          <OtpInput
            length={publicEnv.otpLength}
            ref={codeRef}
            value={code}
            disabled={verifyMutation.isPending}
            onChange={(next) => {
              setCode(next);
              setCodeError(undefined);
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
          <span>Log in</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          disabled={secondsLeft > 0 || resendMutation.isPending}
          onClick={handleResend}
        >
          <span>
            {secondsLeft > 0 ? `Resend code in ${secondsLeft}s` : "Resend code"}
          </span>
        </Button>
      </form>
    </AuthCard>
  );
}
