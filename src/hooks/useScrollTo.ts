"use client";

import {
  SCROLL_DURATION,
  SCROLL_EASING,
  type SectionId,
} from "@/components/scroll/config";
import { useLenis } from "lenis/react";

export type { SectionId };

export function useScrollTo() {
  const lenis = useLenis();

  return (sectionId: SectionId) => {
    const target = sectionId === "home" ? 0 : `#${sectionId}`;

    if (lenis) {
      // Overlay menus call lenis.stop(); resume so programmatic scroll still runs.
      if (lenis.isStopped) lenis.start();
      lenis.scrollTo(target, { duration: SCROLL_DURATION, easing: SCROLL_EASING });
      return;
    }

    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };
}
