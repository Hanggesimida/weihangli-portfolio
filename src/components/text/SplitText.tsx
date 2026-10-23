"use client";

import { motion, useInView } from "motion/react";
import { Fragment, useRef } from "react";
import { EASE_OUT_EXPO } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  children: string;
  className?: string;
  /** 每个字符入场的持续时间（秒），默认 0.9 */
  duration?: number;
  /** 相邻字符之间的延迟（秒），默认 0.025 */
  stagger?: number;
  /** 整体延迟（秒），默认 0 */
  delay?: number;
  /** 触发动画时，视口内的阈值，默认 0.3 */
  threshold?: number;
  /** 是否只触发一次，默认 true */
  once?: boolean;
  /** 由外层提供可访问文本时设为 true，内部不再输出 sr-only 文本 */
  decorative?: boolean;
}

const CJK = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff\uff00-\uffef]/;

function tokenize(text: string) {
  return text.split(" ").map((word) =>
    CJK.test(word) ? Array.from(word).map((c) => [c]) : [Array.from(word)],
  );
}

export default function SplitText({
  children,
  className,
  duration = 0.9,
  stagger = 0.025,
  delay = 0,
  threshold = 0.3,
  once = true,
  decorative = false,
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { amount: threshold, once });
  const words = tokenize(children);
  let index = 0;

  return (
    <span ref={ref} className={cn("inline-block", className)}>
      {!decorative && <span className="sr-only">{children}</span>}
      <span aria-hidden="true">
        {words.map((tokens, wi) => (
          <Fragment key={wi}>
            {tokens.map((chars, ti) => (
              <span
                key={ti}
                className="inline-block overflow-hidden whitespace-nowrap pt-[0.1em] pb-[0.15em] -mt-[0.1em] -mb-[0.15em]"
              >
                {chars.map((char, ci) => {
                  const i = index++;
                  return (
                    <motion.span
                      key={ci}
                      className="inline-block"
                      initial={{ y: "1.25em" }}
                      animate={{ y: isInView ? "0em" : "1.25em" }}
                      transition={{ duration, ease: EASE_OUT_EXPO, delay: delay + i * stagger }}
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </span>
            ))}
            {wi < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </span>
  );
}
