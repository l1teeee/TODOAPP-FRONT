"use client";

import { useCallback, useSyncExternalStore } from "react";

export type DetailPanelState = "open" | "closed";

const STORAGE_KEY = "todo-detail-panel";
const CHANGE_EVENT = "todo-detail-panel-change";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function subscribeNever(): () => void {
  return () => {};
}

function getSnapshot(): DetailPanelState {
  return window.localStorage.getItem(STORAGE_KEY) === "closed"
    ? "closed"
    : "open";
}

function getServerSnapshot(): DetailPanelState {
  return "open";
}

function writeState(next: DetailPanelState): void {
  window.localStorage.setItem(STORAGE_KEY, next);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useDetailPanelState() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // False on the server and the first client render, true after hydration.
  const hydrated = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );

  const toggle = useCallback(() => {
    writeState(getSnapshot() === "closed" ? "open" : "closed");
  }, []);

  const open = useCallback(() => {
    if (getSnapshot() === "closed") {
      writeState("open");
    }
  }, []);

  return { state, hydrated, toggle, open };
}
