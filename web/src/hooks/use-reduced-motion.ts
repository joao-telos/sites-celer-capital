"use client";

import { useSyncExternalStore } from "react";

const query =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

function subscribe(callback: () => void) {
  query?.addEventListener("change", callback);
  return () => query?.removeEventListener("change", callback);
}

function getSnapshot() {
  return query?.matches ?? false;
}

function getServerSnapshot() {
  // Assume motion allowed on the server — matches on the client right after
  // hydration via useSyncExternalStore, no manual effect/setState needed.
  return false;
}

/**
 * Subscribes to `prefers-reduced-motion` via useSyncExternalStore — the
 * React-recommended way to read external browser APIs without a manual
 * setState-in-effect (which triggers cascading renders).
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
