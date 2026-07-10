"use client";

import { useSyncExternalStore } from "react";

const SCROLL_THRESHOLD = 72;

function subscribe(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function getSnapshot() {
  return window.scrollY > SCROLL_THRESHOLD;
}

function getServerSnapshot() {
  return false;
}

/**
 * True once the page has scrolled past the navbar's own height — used to
 * switch the header from transparent/full-width to a compact pill.
 * useSyncExternalStore again (see use-reduced-motion.ts) instead of a
 * manual scroll-listener effect with setState.
 */
export function useScrolled() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
