"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>[]{}";

interface DecryptedTextProps {
  children: string;
  className?: string;
  /** 相邻字符开始解码的间隔（ms），默认 60 */
  stagger?: number;
  /** 每个字符解码阶段的持续时间（ms），默认 400 */
  duration?: number;
  /** 乱码刷新频率（ms），默认 40 */
  scrambleSpeed?: number;
  /** 触发动画时的视口阈值，默认 0.3 */
  threshold?: number;
  /** 是否只触发一次，默认 true */
  once?: boolean;
  /** 自定义乱码字符集 */
  chars?: string;
}

export default function DecryptedText({
  children,
  className,
  stagger = 60,
  duration = 400,
  scrambleSpeed = 40,
  threshold = 0.3,
  once = true,
  chars = DEFAULT_CHARS,
}: DecryptedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const charsRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { amount: threshold, once });
  const prefersReducedMotion = useReducedMotion();
  const original = Array.from(children);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const nodes = Array.from(charsRef.current?.children ?? []) as HTMLElement[];
    const target = Array.from(children);
    const randomChar = () => chars[Math.floor(Math.random() * chars.length)];
    const write = (node: HTMLElement, value: string) => {
      if (node.firstChild) node.firstChild.nodeValue = value;
    };
    const scrambleAll = () =>
      nodes.forEach((node, i) => {
        if (target[i] !== " ") write(node, randomChar());
      });

    scrambleAll();
    if (!isInView) return;

    let raf = 0;
    let lastScramble = 0;
    let start: number | null = null;
    const resolved = target.map((c) => c === " ");

    const tick = (now: number) => {
      start ??= now;
      const elapsed = now - start;
      const shouldScramble = now - lastScramble >= scrambleSpeed;
      if (shouldScramble) lastScramble = now;

      let pending = false;
      nodes.forEach((node, i) => {
        if (resolved[i]) return;
        const begin = i * stagger;
        if (elapsed >= begin + duration) {
          write(node, target[i]);
          resolved[i] = true;
          return;
        }
        pending = true;
        if (elapsed >= begin && shouldScramble) write(node, randomChar());
      });

      if (pending) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, prefersReducedMotion, children, chars, stagger, duration, scrambleSpeed]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{children}</span>
      <span ref={charsRef} aria-hidden="true">
        {original.map((char, i) => (
          <span
            key={i}
            className="inline-block"
            style={{ whiteSpace: char === " " ? "pre" : undefined }}
          >
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}
