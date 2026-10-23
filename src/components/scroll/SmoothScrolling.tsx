"use client";

import {
  LENIS_OPTIONS,
  LENIS_REDUCED_MOTION_OPTIONS,
} from "@/components/scroll/config";
import { ReactLenis, type LenisRef } from "lenis/react";
import { cancelFrame, frame, MotionConfig, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useRef } from "react";

export default function SmoothScrolling({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }

    // Lenis must update before Motion reads scroll values.
    frame.read(update, true);
    return () => cancelFrame(update);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={
        prefersReducedMotion ? LENIS_REDUCED_MOTION_OPTIONS : LENIS_OPTIONS
      }
    >
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ReactLenis>
  );
}
