"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { publicEnv } from "@/shared/config/public-env";
import { useTheme } from "@/shared/theme/use-theme";
import { Alert } from "@/shared/ui/alert";

export interface TurnstileFieldHandle {
  reset: () => void;
}

export interface TurnstileFieldProps {
  onToken: (token: string | null) => void;
}

function subscribeNoop(): () => void {
  return () => {};
}

export const TurnstileField = forwardRef<
  TurnstileFieldHandle,
  TurnstileFieldProps
>(({ onToken }, ref) => {
  const { resolved } = useTheme();
  const widgetRef = useRef<TurnstileInstance | undefined>(undefined);
  const [hasError, setHasError] = useState(false);
  const isClient = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  useImperativeHandle(ref, () => ({
    reset: () => {
      setHasError(false);
      onToken(null);
      widgetRef.current?.reset();
    },
  }));

  return (
    <div className="space-y-2">
      {isClient ? (
        <Turnstile
          ref={widgetRef}
          siteKey={publicEnv.turnstileSiteKey}
          options={{ theme: resolved, size: "flexible" }}
          onSuccess={(token) => {
            setHasError(false);
            onToken(token);
          }}
          onExpire={() => {
            onToken(null);
          }}
          onError={() => {
            setHasError(true);
            onToken(null);
          }}
        />
      ) : (
        <div className="h-[65px] w-full" aria-hidden="true" />
      )}
      {hasError ? (
        <Alert variant="error">Verification failed. Try again.</Alert>
      ) : null}
    </div>
  );
});

TurnstileField.displayName = "TurnstileField";
