"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useSession } from "./use-session";

export function RequireSession({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "anonymous") router.replace("/login");
  }, [status, router]);

  return status === "authenticated" ? children : fallback;
}

export function RedirectIfSession({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.replace("/today");
  }, [status, router]);

  // Always render the page so it prerenders into the static shell; an
  // authenticated user is redirected by the effect above.
  return children;
}
