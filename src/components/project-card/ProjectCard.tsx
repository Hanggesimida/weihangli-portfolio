"use client";

import { useState, type ReactNode, type Ref } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Badge from "@/components/badge/Badge";
import DecryptedText from "@/components/text/DecryptedText";
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
  siteUrl?: string;
  githubUrl?: string;
  videoElement?: ReactNode;
  className?: string;
}

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
  siteUrl,
  githubUrl,
  videoElement,
  className,
}: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.5;

  return (
    <div
      className={cn("space-y-2", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        ref={ref}
        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-md p-7 sm:p-9 xl:p-18"
      >
        <Image
          src={bgImage}
          alt=""
          aria-hidden
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
        />

        {/* In-flow stack so preview (+ overview on hover) stay vertically centered as a group */}
        <div className="relative z-10 w-full">
          <motion.div
            className="relative z-10 w-full aspect-[4/3] overflow-hidden rounded-lg bg-background/90 shadow-2xl will-change-transform"
            animate={{
              scale: hovered && !prefersReducedMotion ? 1.02 : 1,
            }}
            transition={{ duration, ease: EASE }}
          >
            {videoElement ? (
              videoElement
            ) : previewImage ? (
              <Image
                src={previewImage}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                Video Placeholder
              </div>
            )}
          </motion.div>

          {/* Desktop: expands in flow so the whole group re-centers on the bg */}
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
            <div className="pt-3">
              <p className="mb-1.5 font-mono text-xs font-medium uppercase tracking-tight text-white/70 [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]">
                {overviewLabel}
              </p>
              <p className="max-w-[52ch] text-sm leading-snug text-white/90 line-clamp-3 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] md:text-[0.95rem]">
                {summary}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-y-4 lg:flex-row">
        <div className="flex flex-col gap-y-2">
          <DecryptedText
            stagger={48}
            duration={330}
            scrambleSpeed={34}
            className="block font-mono font-medium text-secondary-foreground/70 tracking-tight leading-none uppercase"
          >
            {category}
          </DecryptedText>
          <DecryptedText
            stagger={48}
            duration={330}
            scrambleSpeed={34}
            className="block text-[clamp(27px,2.5vw,43px)] font-semibold leading-none tracking-tighter"
          >
            {title}
          </DecryptedText>
        </div>

        <div className="flex items-end gap-x-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
          <Badge variant="filled">{year}</Badge>
        </div>
      </div>

      {(siteUrl || githubUrl) && (
        <div className="flex items-center gap-x-5 font-mono text-xs font-medium uppercase tracking-tight">
          {siteUrl && (
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-x-1 text-secondary-foreground/70 transition-colors hover:text-secondary-foreground"
            >
              {visitLabel ?? "Visit"}
              <ArrowUpRight className="h-[1.1em] w-[1.1em]" />
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-x-1 text-secondary-foreground/70 transition-colors hover:text-secondary-foreground"
            >
              GitHub
              <ArrowUpRight className="h-[1.1em] w-[1.1em]" />
            </a>
          )}
        </div>
      )}

      {/* Mobile: always-visible summary under title meta */}
      <div className="space-y-1.5 md:hidden">
        <p className="font-mono text-xs font-medium uppercase tracking-tight text-secondary-foreground/50">
          {overviewLabel}
        </p>
        <p className="max-w-[52ch] text-sm leading-snug text-secondary-foreground/70">
          {summary}
        </p>
      </div>
    </div>
  );
}
