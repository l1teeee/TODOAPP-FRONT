import { Suspense } from "react";
import { VerifyLoginForm } from "@/features/auth/components/verify-login-form";
import { Skeleton } from "@/shared/ui/skeleton";

export default function VerifyLoginPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full rounded-card" />}>
      <VerifyLoginForm />
    </Suspense>
  );
}
