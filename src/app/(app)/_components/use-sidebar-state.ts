"use client";

import { useCallback, useSyncExternalStore } from "react";

export type SidebarState = "expanded" | "collapsed";

const STORAGE_KEY = "todo-sidebar";
const CHANGE_EVENT = "todo-sidebar-change";

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

function getSnapshot(): SidebarState {
  return window.localStorage.getItem(STORAGE_KEY) === "collapsed"
    ? "collapsed"
    : "expanded";
}

function getServerSnapshot(): SidebarState {
  return "expanded";
}

export function useSidebarState() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // False on the server and the first client render, true after hydration.
  const hydrated = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );

  const toggle = useCallback(() => {
    const next: SidebarState = getSnapshot() === "collapsed" ? "expanded" : "collapsed";
    window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { state, hydrated, toggle };
}
