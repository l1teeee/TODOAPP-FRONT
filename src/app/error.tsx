"use client";

import { Button } from "@/shared/ui/button";
import { reportRenderError } from "@/shared/observability/error-monitoring";
import { useEffect } from "react";

export default function AppError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    reportRenderError(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-canvas p-6 text-center" role="alert">
      <h2 className="text-xl font-bold text-fg">Something went wrong</h2>
      <p className="text-sm text-fg-secondary">
        Please try again.
      </p>
      <Button onClick={() => retry()}>Try again</Button>
    </div>
  );
}
