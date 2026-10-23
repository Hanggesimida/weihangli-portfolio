"use client";

import { useEffect, useState } from "react";
import { motion, useAnimate, useReducedMotion } from "motion/react";
import { INTRO } from "@/lib/animations";

export default function PageIntro() {
  const [scope, animate] = useAnimate();
  const [done, setDone] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    animate(
      scope.current,
      prefersReducedMotion ? { opacity: 0 } : { y: "-100%" },
      {
        delay: INTRO.delay,
        duration: prefersReducedMotion ? 0.3 : INTRO.duration,
        ease: INTRO.ease,
      }
    ).then(() => setDone(true));
  }, [animate, scope, prefersReducedMotion]);

  if (done) return null;

  return (
    <motion.div
      ref={scope}
      className="fixed inset-0 bg-secondary pointer-events-none"
      style={{ zIndex: 9998 }}
    />
  );
}
