"use client";

import DecryptedText from "@/components/text/DecryptedText";
import FadeUp from "@/components/text/FadeUp";
import SplitText from "@/components/text/SplitText";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";

const SKILL_ITEMS = [
  [
    "JavaScript",
    "TypeScript",
    "Java",
    "Python",
    "Dart",
    "SQL",
  ],
  [
    "Vue",
    "React",
    "Next.js",
    "Node.js",
    "Express.js",
    "NestJS",
    "Electron",
    "React Native",
    "Spring Boot",
    "Three.js",
    "ECharts",
    "Tailwind CSS",
    "Framer Motion",
    "GSAP",
  ],
  [
    "Git",
    "Apifox",
    "Docker",
    "Vercel",
    "Alibaba Cloud",
    "Tencent Cloud",
    "Prisma",
    "PostgreSQL",
    "MySQL",
    "SQLite",
    "Redis",
  ],
] as const;

export default function AboutSection() {
  const t = useTranslations("About");
  const sectionRef = useRef<HTMLElement>(null);

  const skillGroups = useMemo(() => {
    const titles = t.raw("skillGroups") as { title: string }[];
    return titles.map((g, i) => ({
      title: g.title,
      items: [...SKILL_ITEMS[i]],
    }));
  }, [t]);

  // Driven by Lenis (same frame as the scroll write) instead of useScroll, which lags one frame.
  const scrollYProgress = useMotionValue(0);

  const updateProgress = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.height === 0) return;
    scrollYProgress.set(Math.min(Math.max(-rect.top / rect.height, 0), 1));
  }, [scrollYProgress]);

  useLenis(updateProgress);

  useEffect(() => {
    updateProgress();
    window.addEventListener("resize", updateProgress, { passive: true });
    return () => window.removeEventListener("resize", updateProgress);
  }, [updateProgress]);

  const scale = useTransform(scrollYProgress, [0.1, 1], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="mt-[-2vh]"
    >
      <div className="relative z-10">
        <motion.div
          style={{ scale, y, willChange: "transform", transformOrigin: "top center" }}
          className="rounded-b-3xl bg-secondary px-10 pt-0 sm:pt-20 md:pt-[15vh] pb-20 sm:pb-40 text-secondary-foreground space-y-20 md:space-y-20"
        >
          <div className="grid grid-cols-12 gap-x-6 gap-y-12">
            <h2 className="order-2 col-span-12 flex flex-col lg:pt-24 font-semibold tracking-tighter leading-none md:order-1 lg:col-span-6 text-[50px] sm:text-7xl md:text-[88px] lg:text-[96px]">
              <span className="block">
                <SplitText stagger={0.04} duration={0.8} yOffset={50}>
                  {t("line1")}
                </SplitText>
              </span>
              <span className="block">
                <SplitText stagger={0.04} duration={0.8} yOffset={50}>
                  {t("line2")}
                </SplitText>
              </span>
              <span className="block">
                <SplitText stagger={0.04} duration={0.8} yOffset={50}>
                  {t("line3")}
                </SplitText>
              </span>
            </h2>

            <div className="order-1 col-span-12 overflow-hidden md:order-2 lg:col-span-6">
              <section className="self-start px-3 py-5 md:px-6">
                <div className="mx-auto max-w-6xl">
                  <div className="mb-8 text-center tracking-tighter font-semibold text-[40px] sm:text-[50px] md:text-[clamp(70px,calc(70px+(90-70)*((100vw-768px)/(1280-768))),90px)] xl:text-[90px] leading-none">
                    {t("skillsHeading")}
                  </div>

                  <div className="grid grid-cols-3 gap-0 p-0 md:gap-5 md:p-5">
                    {skillGroups.map((group) => (
                      <div key={group.title} className="p-2">
                        <h4 className="hidden md:flex text-xl font-semibold mb-4 tracking-tighter">
                          {group.title}
                        </h4>
                        <ul className="space-y-1 text-base md:text-lg lg:text-xl">
                          {group.items.map((item) => (
                            <li key={item}>
                              <DecryptedText once={false} className="font-mono font-normal text-secondary-foreground/75">
                                {item}
                              </DecryptedText>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-x-6 gap-y-10">
            <div className="pointer-events-none relative col-span-12 aspect-[4/5] w-full self-start overflow-clip rounded-md md:col-span-3">
              <Image
                src="/images/about/me.webp"
                alt={t("aboutImageAlt")}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover object-center"
              />
            </div>

            <div className="col-span-12 flex flex-col gap-y-9 lg:gap-y-18 md:col-span-7 md:col-start-6">
              <FadeUp
                className="max-w-[39ch] text-balance text-2xl md:text-3xl lg:text-4xl font-medium leading-snug tracking-tight"
                once={false}
              >
                {t("lead")}
              </FadeUp>

              <div className="flex flex-col gap-x-10 gap-y-4 lg:flex-row">
                <span className="font-mono uppercase text-secondary-foreground/70">
                  {t("aboutLabel")}
                </span>

                <div className="flex max-w-[38ch] flex-col gap-y-4 text-balance text-base md:text-lg lg:text-xl text-secondary-foreground/75 tracking-tight font-normal">
                  <FadeUp once={false}>
                    <p>{t("p1")}</p>
                  </FadeUp>

                  <FadeUp delay={0.12} once={false}>
                    <p>{t("p2")}</p>
                  </FadeUp>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
