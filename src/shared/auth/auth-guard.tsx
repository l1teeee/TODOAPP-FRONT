"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Skeleton } from "@/shared/ui/skeleton";
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

  if (status !== "anonymous") {
    return <Skeleton className="m-auto h-64 w-full max-w-[420px] rounded-card" />;
  }
  return children;
}
