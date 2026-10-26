"use client";

import DecryptedText from "@/components/text/DecryptedText";
import FadeUp from "@/components/text/FadeUp";
import SplitText from "@/components/text/SplitText";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { SKILL_GROUPS } from "@/config/site";

// Center of the visible part of About while it is stuck, so it shrinks toward the middle.
const RECEDE_ORIGIN = "50% calc(100% - (100svh - var(--recede-gap)) / 2)";

/** Final scale once Contact covers About; phones shrink further so the receding edges read on a narrow screen. */
const RECEDE_SCALE = 0.9;
const RECEDE_SCALE_MOBILE = 0.8;
/** Matches Tailwind's `md` breakpoint. */
const MOBILE_MAX_WIDTH = 768;

export default function AboutSection() {
  const t = useTranslations("About");
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const progress = useMotionValue(0);
  const endScale = useMotionValue(RECEDE_SCALE);
  const { scrollY } = useScroll();

  // The section is sticky (compositor-driven, so it holds steady under native touch scroll too) with its
  // bottom resting --recede-gap above the viewport bottom. Its parent ends with Contact, so it is released
  // once Contact's bottom lines up with it. JS only drives the recede, which starts when Contact reaches
  // About's bottom edge and ends when Contact covers it (or fills the space above the gap).
  useEffect(() => {
    const el = sectionRef.current;
    const next = el?.nextElementSibling;
    if (!el || !next) return;

    const update = () => {
      const aboutBottom = el.getBoundingClientRect().bottom;
      const { top, height } = next.getBoundingClientRect();
      const distance = Math.min(height, aboutBottom);
      progress.set(distance > 0 ? Math.min(Math.max((aboutBottom - top) / distance, 0), 1) : 0);
    };

    const observer = new ResizeObserver(() => {
      el.style.setProperty("--about-h", `${el.offsetHeight}px`);
      endScale.set(window.innerWidth < MOBILE_MAX_WIDTH ? RECEDE_SCALE_MOBILE : RECEDE_SCALE);
      update();
    });
    observer.observe(el);
    const unsubscribe = scrollY.on("change", update);
    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }, [scrollY, progress, endScale]);

  const scale = useTransform([progress, endScale], ([p, end]: number[]) => 1 - (1 - end) * p);
  const dim = useTransform(progress, [0, 1], [0, 0.6]);

  return (
    <>
      {/* Anchor at About's natural position; the sticky section's own rect drifts while held. */}
      <div id="about" aria-hidden="true" className="mt-[-2vh]" />
      <section
        ref={sectionRef}
        className="sticky top-[calc(100svh_-_var(--recede-gap)_-_var(--about-h))] z-10"
      >
        <motion.div
          className="relative"
          style={reducedMotion ? undefined : { scale, transformOrigin: RECEDE_ORIGIN }}
        >
          {!reducedMotion && (
            <motion.div
              aria-hidden="true"
              style={{ opacity: dim }}
              className="pointer-events-none absolute inset-0 z-10 rounded-b-3xl bg-black"
            />
          )}
          <div className="rounded-b-3xl bg-secondary px-6 sm:px-10 pt-16 md:pt-[14vh] pb-20 sm:pb-32 text-secondary-foreground space-y-20 md:space-y-32">
            <div className="grid grid-cols-12 gap-x-6 gap-y-14">
              <h2 className="col-span-12 flex flex-col font-semibold tracking-tighter leading-[0.9] uppercase lg:col-span-6 text-[15vw] sm:text-7xl md:text-[88px] lg:text-[7vw]">
                <SplitText>{t("line1")}</SplitText>
                <SplitText delay={0.1}>{t("line2")}</SplitText>
                <SplitText delay={0.2}>{t("line3")}</SplitText>
              </h2>

              <div className="col-span-12 lg:col-span-6 lg:pt-3">
                <h3 className="mb-6 text-3xl md:text-4xl font-semibold tracking-tighter">
                  {t("skillsHeading")}
                </h3>
                <div className="divide-y divide-secondary-border border-y border-secondary-border">
                  {SKILL_GROUPS.map((group) => (
                    <div key={group.id} className="grid gap-4 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                      <h4 className="eyebrow pt-2 text-secondary-foreground/50">
                        {t(`skillGroups.${group.id}`)}
                      </h4>
                      <ul className="flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="rounded-full border border-secondary-foreground/15 px-3 py-1.5 font-mono text-sm text-secondary-foreground/80 transition-colors duration-300 hover:border-secondary-foreground/60 hover:text-secondary-foreground"
                          >
                            <DecryptedText>{item}</DecryptedText>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-x-6 gap-y-10">
              <div className="relative col-span-12 aspect-[4/5] w-full self-start overflow-hidden rounded-2xl sm:col-span-8 md:col-span-4 lg:col-span-3">
                <Image
                  src="/images/about/me.webp"
                  alt={t("aboutImageAlt")}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover object-center grayscale transition-[filter] duration-700 hover:grayscale-0"
                />
              </div>

              <div className="col-span-12 flex flex-col gap-y-10 lg:gap-y-16 md:col-span-7 md:col-start-6">
                <FadeUp className="max-w-[30ch] text-balance text-3xl md:text-4xl lg:text-[2.75rem] font-medium leading-[1.15] tracking-tight">
                  {t("lead")}
                </FadeUp>

                <div className="flex flex-col gap-x-16 gap-y-5 lg:flex-row">
                  <span className="eyebrow shrink-0 pt-1.5 text-secondary-foreground/50 lg:w-32">
                    {t("aboutLabel")}
                  </span>

                  <div className="flex max-w-[42ch] flex-col gap-y-5 text-pretty text-lg lg:text-xl leading-relaxed text-secondary-foreground/75 tracking-tight">
                    <FadeUp>
                      <p>{t("p1")}</p>
                    </FadeUp>
                    <FadeUp delay={0.12}>
                      <p>{t("p2")}</p>
                    </FadeUp>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
