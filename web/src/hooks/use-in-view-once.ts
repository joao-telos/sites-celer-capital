"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Native IntersectionObserver, no animation library involved. Replaces
 * Magic UI's BlurFade/`useInView` (from the `motion` package), which froze
 * the renderer for 30s+ whenever its observer fired — reproduced in both
 * dev and production builds, not just a dev-mode slowdown. See
 * docs/superpowers/specs/2026-07-10-visual-pivot-v2.md for the story.
 */
export function useInViewOnce<T extends HTMLElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- options is expected to be a stable literal at each call site
  }, []);

  return { ref, inView };
}
