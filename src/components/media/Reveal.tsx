"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";
import { EASE_IN_OUT, EASE_OUT_EXPO } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const reduced = useReducedMotion();
  const shown = isInView || reduced;

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        className="size-full overflow-hidden"
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        animate={{ clipPath: shown ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
        transition={{ duration: reduced ? 0 : 1.1, ease: EASE_IN_OUT, delay }}
      >
        <motion.div
          className="relative size-full"
          initial={{ scale: 1.15 }}
          animate={{ scale: shown ? 1 : 1.15 }}
          transition={{ duration: 1.5, ease: EASE_OUT_EXPO, delay }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
