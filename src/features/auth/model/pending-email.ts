import { useSyncExternalStore } from "react";

export type PendingEmailFlow = "signup" | "login" | "recovery";

function storageKey(flow: PendingEmailFlow): string {
  return `todo-app:pending-email:${flow}`;
}

export function savePendingEmail(flow: PendingEmailFlow, email: string): void {
  window.sessionStorage.setItem(storageKey(flow), email);
}

export function clearPendingEmail(flow: PendingEmailFlow): void {
  window.sessionStorage.removeItem(storageKey(flow));
}

function subscribeToNothing(): () => void {
  return () => undefined;
}

// undefined while prerendering and hydrating, null when this tab has no pending email for the flow.
export function usePendingEmail(flow: PendingEmailFlow): string | null | undefined {
  return useSyncExternalStore(
    subscribeToNothing,
    () => window.sessionStorage.getItem(storageKey(flow)),
    () => undefined,
  );
}
