"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  register,
  requestPasswordReset,
  resetPassword,
  signIn,
  signOut,
  verifySignupCode,
  type RegisterVariables,
  type RequestPasswordResetVariables,
  type ResetPasswordVariables,
  type SignInVariables,
  type VerifySignupCodeVariables,
} from "./auth-api";

export function useSignIn() {
  return useMutation({
    mutationFn: (variables: SignInVariables) => signIn(variables),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (variables: RegisterVariables) => register(variables),
  });
}

export function useVerifySignupCode() {
  return useMutation({
    mutationFn: (variables: VerifySignupCodeVariables) =>
      verifySignupCode(variables),
  });
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (variables: RequestPasswordResetVariables) =>
      requestPasswordReset(variables),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (variables: ResetPasswordVariables) => resetPassword(variables),
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
