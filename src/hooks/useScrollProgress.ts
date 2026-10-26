"use client";

import { useLenis } from "lenis/react";
import { useMotionValue, type MotionValue } from "motion/react";
import type { RefObject } from "react";

/** Returns the [start, end] scroll positions (px) that map to progress 0 → 1. */
export type ScrollRange = (el: HTMLElement, viewportHeight: number) => readonly [number, number];

export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  range: ScrollRange,
): MotionValue<number> {
  const progress = useMotionValue(0);

  // actualScroll is the pixel-snapped position the browser rendered, not Lenis's fractional value.
  useLenis(({ actualScroll }) => {
    const el = ref.current;
    if (!el) return;
    const [start, end] = range(el, window.innerHeight);
    progress.set(Math.min(Math.max((actualScroll - start) / Math.max(end - start, 1), 0), 1));
  });

  return progress;
}
