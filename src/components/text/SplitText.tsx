"use client";

import { motion, useInView, Variants } from "motion/react";
import { useRef } from "react";
import { EASE_OUT } from "@/lib/animations";

interface SplitTextProps {
  children: string;
  className?: string;
  /** 每个字符入场的持续时间（秒），默认 0.5 */
  duration?: number;
  /** 相邻字符之间的延迟（秒），默认 0.04 */
  stagger?: number;
  /** 初始向上偏移量（px），默认 40 */
  yOffset?: number;
  /** 触发动画时，视口内的阈值，默认 0.3 */
  threshold?: number;
  /** 是否只触发一次，默认 true */
  once?: boolean;
}

const containerVariants: Variants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: {
      staggerChildren: stagger,
    },
  }),
};

export default function SplitText({
  children,
  className,
  duration = 0.5,
  stagger = 0.04,
  yOffset = 40,
  threshold = 0.3,
  once = true,
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { amount: threshold, once });

  const charVariants: Variants = {
    hidden: { opacity: 0, y: yOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, ease: EASE_OUT },
    },
  };

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className ?? ""}`}
      variants={containerVariants}
      custom={stagger}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      aria-label={children}
    >
      {children.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={charVariants}
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : undefined }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}
