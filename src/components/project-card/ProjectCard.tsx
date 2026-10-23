"use client";

import { useState, type MouseEvent, type ReactNode, type Ref } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import Badge from "@/components/badge/Badge";
import DecryptedText from "@/components/text/DecryptedText";
import SplitText from "@/components/text/SplitText";
import { EASE_OUT as EASE } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  ref?: Ref<HTMLDivElement>;
  bgImage: string;
  /** 内层预览图（替代 Video Placeholder），后续可换为视频 */
  previewImage?: string;
  category: string;
  title: string;
  year: string;
  tags?: string[];
  summary: string;
  overviewLabel: string;
  visitLabel?: string;
  viewLabel?: string;
  siteUrl?: string;
  githubUrl?: string;
  videoElement?: ReactNode;
  className?: string;
}

const linkClass =
  "eyebrow inline-flex items-center gap-1.5 rounded-full border border-secondary-foreground/25 px-4 py-2.5 text-xs text-secondary-foreground/85 transition-colors duration-300 hover:border-secondary-foreground hover:bg-secondary-foreground hover:text-secondary";

export default function ProjectCard({
  ref,
  bgImage,
  previewImage,
  category,
  title,
  year,
  tags = ["Development"],
  summary,
  overviewLabel,
  visitLabel,
  viewLabel = "View",
  siteUrl,
  githubUrl,
  videoElement,
  className,
}: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.5;
  const href = siteUrl ?? githubUrl;

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40, mass: 0.5 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40, mass: 0.5 });

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  };

  const visual = (
    <>
      <Image
        src={bgImage}
        alt=""
        aria-hidden
        fill
        sizes="(max-width: 768px) 100vw, 60vw"
        className="object-cover object-center"
      />

      <div className="relative z-10 w-full">
        <motion.div
          className="relative z-10 w-full aspect-[4/3] overflow-hidden rounded-lg bg-background/90 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)] will-change-transform"
          animate={{ scale: hovered && !prefersReducedMotion ? 1.03 : 1 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {videoElement ? (
            videoElement
          ) : previewImage ? (
            <Image
              src={previewImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 90vw, 50vw"
              className="object-cover object-top"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              Video Placeholder
            </div>
          )}
        </motion.div>

        <motion.div
          className="pointer-events-none hidden overflow-hidden md:block"
          initial={false}
          animate={{
            height: hovered ? "auto" : 0,
            opacity: hovered ? 1 : 0,
          }}
          transition={{
            duration,
            ease: EASE,
            opacity: {
              duration: prefersReducedMotion ? 0 : 0.35,
              delay: hovered && !prefersReducedMotion ? 0.05 : 0,
            },
          }}
        >
          <div className="pt-4">
            <p className="eyebrow mb-2 text-xs text-white/70 [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]">
              {overviewLabel}
            </p>
            <p className="max-w-[52ch] text-sm leading-snug text-white/90 line-clamp-3 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] md:text-[0.95rem]">
              {summary}
            </p>
          </div>
        </motion.div>
      </div>

      {href && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-20 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-secondary-foreground px-5 py-3 text-sm font-semibold tracking-tight text-secondary md:inline-flex"
          style={{ x: springX, y: springY }}
          initial={false}
          animate={{ scale: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {viewLabel}
          <ArrowUpRight className="size-4" />
        </motion.span>
      )}
    </>
  );

  const visualClass = cn(
    "relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl p-6 sm:p-9 xl:p-16",
    href && "md:cursor-none",
  );

  return (
    <article
      className={cn("space-y-5", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div ref={ref}>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${title} — ${visitLabel ?? viewLabel}`}
            className={visualClass}
            onMouseMove={onMouseMove}
          >
            {visual}
          </a>
        ) : (
          <div className={visualClass}>{visual}</div>
        )}
      </div>

      <div className="flex flex-col justify-between gap-y-4 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-y-3">
          <DecryptedText
            stagger={40}
            duration={330}
            scrambleSpeed={34}
            className="eyebrow block text-secondary-foreground/55"
          >
            {category}
          </DecryptedText>
          <h3 className="text-[clamp(30px,2.8vw,46px)] font-semibold leading-none tracking-tighter">
            <SplitText stagger={0.015}>{title}</SplitText>
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
          <Badge variant="filled">{year}</Badge>
        </div>
      </div>

      <p className="max-w-[52ch] text-base leading-snug text-secondary-foreground/70 md:hidden">
        {summary}
      </p>

      {(siteUrl || githubUrl) && (
        <div className="flex flex-wrap items-center gap-2">
          {siteUrl && (
            <a href={siteUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {visitLabel ?? "Visit"}
              <ArrowUpRight className="size-3.5" />
            </a>
          )}
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              GitHub
              <ArrowUpRight className="size-3.5" />
            </a>
          )}
        </div>
      )}
    </article>
  );
}
