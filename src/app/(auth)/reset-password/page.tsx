import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { Skeleton } from "@/shared/ui/skeleton";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Skeleton className="h-80 w-full rounded-card" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
