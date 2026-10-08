import type { LenisOptions } from "lenis";

export const SECTION_IDS = [
  "home",
  "services",
  "works",
  "about",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/** Header omits home (logo handles it). */
export const HEADER_SECTION_IDS = SECTION_IDS.filter(
  (id): id is Exclude<SectionId, "home"> => id !== "home",
);

export const SCROLL_DURATION = 1.2;

/** Lenis's default expo-out; passed explicitly so programmatic scrolls don't inherit the wheel easing. */
export const SCROLL_EASING = (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t));

const WHEEL_DURATION = 1;
const WHEEL_LINEAR_MIX = 0.2;

/**
 * easeOutCubic with a bit of linear mixed in, so the curve still has speed at the end.
 * Scroll positions snap to whole pixels; a curve whose speed decays to zero (lerp, expo-out)
 * leaves the last pixel waiting ~10 frames, which reads as a "click" after the scroll seems stopped.
 */
const wheelEasing = (t: number) =>
  (1 - WHEEL_LINEAR_MIX) * (1 - (1 - t) ** 3) + WHEEL_LINEAR_MIX * t;

export const LENIS_OPTIONS = {
  duration: WHEEL_DURATION,
  easing: wheelEasing,
  smoothWheel: true,
  autoRaf: false,
  syncTouch: false,
} as const satisfies LenisOptions;

export const LENIS_REDUCED_MOTION_OPTIONS = {
  ...LENIS_OPTIONS,
  lerp: 1,
  duration: 0,
  smoothWheel: false,
} as const satisfies LenisOptions;
