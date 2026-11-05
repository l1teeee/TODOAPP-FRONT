import { Suspense } from "react";
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";
import { Skeleton } from "@/shared/ui/skeleton";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full rounded-card" />}>
      <VerifyEmailForm />
    </Suspense>
  );
}
