"use client";

import { motion, useInView, Variants } from "motion/react";
import { useRef } from "react";
import { EASE_OUT } from "@/lib/animations";

interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  /** 动画持续时间（秒），默认 0.7 */
  duration?: number;
  /** 触发前的延迟（秒），默认 0 */
  delay?: number;
  /** 初始向上偏移量（px），默认 30 */
  yOffset?: number;
  /** 触发动画时，视口内的阈值，默认 0.3 */
  threshold?: number;
  /** 是否只触发一次，默认 true */
  once?: boolean;
}

export default function FadeUp({
  children,
  className,
  duration = 0.7,
  delay = 0,
  yOffset = 30,
  threshold = 0.3,
  once = true,
}: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: threshold, once });

  const variants: Variants = {
    hidden: { opacity: 0, y: yOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        delay,
        ease: EASE_OUT,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}
