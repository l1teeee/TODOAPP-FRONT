"use client";

import { useEffect } from "react";
import { reportRenderError } from "@/shared/observability/error-monitoring";

export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    reportRenderError(error);
  }, [error]);

  return (
    <html lang="en">
      <body role="alert">
        <h1>Something went wrong</h1>
        <p>Please reload the page.</p>
        <button onClick={() => retry()}>Try again</button>
      </body>
    </html>
  );
}
