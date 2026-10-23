"use client";

import coverImage from "@/assets/image/cover.jpg";
import Header from "@/components/layout/Header";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";
import SplitText from "@/components/text/SplitText";
import { HERO_BASE_DELAY, HERO_VARIANTS, HERO_IMAGE_VARIANTS } from "@/lib/animations";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useLenis } from "lenis/react";
import { motion, useMotionValue, useTransform } from "motion/react";
import Image from "next/image";
import { useMemo, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useScrollTo } from "@/hooks/useScrollTo";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/utils";

const WIPE_EASE = [0.25, 0.46, 0.45, 0.94] as const;

function CtaButton({ label, onClick, className }: { label: string; onClick: () => void; className: string }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        "relative overflow-hidden inline-flex items-center rounded-full bg-foreground/85 text-background font-bold uppercase tracking-tight cursor-pointer",
        className,
      )}
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      initial="initial"
    >
      <motion.span
        className="absolute inset-0 bg-foreground rounded-full"
        variants={{ initial: { x: "-101%" }, hover: { x: "0%" } }}
        transition={{ duration: 0.4, ease: WIPE_EASE }}
      />
      <span className="relative z-10">{label}</span>
      <motion.span
        className="relative z-10"
        variants={{ initial: { x: 0, y: 0 }, hover: { x: 3, y: -3 } }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <ArrowUpRight className="w-[1em] h-[1em] ml-1.5" />
      </motion.span>
    </motion.button>
  );
}

function Availability({ label, className }: { label: string; className?: string }) {
  return (
    <p className={cn("eyebrow inline-flex items-center gap-2 text-foreground/70", className)}>
      <span className="relative flex size-2" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-live opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-live" />
      </span>
      {label}
    </p>
  );
}

export default function HeroSection() {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const scrollTo = useScrollTo();
  const containerRef = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const wideDate = locale !== "en";

  const todayLabel = useMemo(() => {
    if (!hydrated) return "\u00A0";
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "2-digit",
    }).format(new Date());
  }, [hydrated, locale]);

  const scrollProgress = useMotionValue(0);

  // actualScroll is the pixel-snapped position the browser rendered, not Lenis's fractional value.
  useLenis(({ actualScroll }) => {
    const el = containerRef.current;
    if (!el) return;
    const progress = Math.min(Math.max((actualScroll - el.offsetTop) / el.offsetHeight, 0), 1);
    scrollProgress.set(progress);
  });

  const y = useTransform(scrollProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollProgress, [0, 1], [1, 0.9]);

  return (
    <div id="home" ref={containerRef} className="relative h-svh min-h-[560px] z-0">
      <div className="h-full flex flex-col px-6 pb-6 sm:px-8 sm:pb-8">
        <Header />

        <motion.div
          className="flex-1 flex flex-col"
          style={{ y, opacity, scale, willChange: "transform", backfaceVisibility: "hidden" }}
        >
          <div className="flex-1 min-h-[30px]" />

          <div className="flex flex-col">
            <h1 className="text-[19vw] leading-[0.8] font-semibold tracking-tighter uppercase md:text-[17.5vw] md:leading-[0.7] whitespace-nowrap flex flex-col md:flex-row md:justify-between text-foreground/95 scale-y-[0.88] origin-bottom">
              <span className="sr-only">Weihang Li</span>
              <SplitText decorative delay={HERO_BASE_DELAY} stagger={0.035} duration={1.1}>
                WEIHANG
              </SplitText>
              <SplitText decorative delay={HERO_BASE_DELAY + 0.2} stagger={0.035} duration={1.1}>
                LI
              </SplitText>
            </h1>

            <div className="relative grid grid-cols-12 gap-x-4 gap-y-6 md:hidden">
              <motion.div
                className="col-span-12 space-y-5 mt-5"
                variants={HERO_VARIANTS}
                initial="hidden"
                animate="visible"
                custom={2}
              >
                <p className="text-lg leading-snug max-w-[30ch] text-balance text-foreground/70 font-medium tracking-tight">
                  {t("tagline")}
                </p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                  <CtaButton
                    label={t("cta")}
                    onClick={() => scrollTo("contact")}
                    className="px-5 py-3.5 text-sm"
                  />
                  <LocaleSwitcher />
                </div>
              </motion.div>

              <motion.div
                className="col-span-4 overflow-hidden rounded-xl"
                variants={HERO_IMAGE_VARIANTS}
                initial="hidden"
                animate="visible"
                custom={3}
              >
                <Image
                  src={coverImage}
                  alt={t("imageAlt")}
                  sizes="30vw"
                  className="aspect-[3/4] w-full h-full object-cover grayscale"
                />
              </motion.div>

              <motion.div
                className="col-span-8 flex flex-col items-end justify-end gap-2"
                variants={HERO_VARIANTS}
                initial="hidden"
                animate="visible"
                custom={4}
              >
                <Availability label={t("availabilityDesktop")} />
                <p
                  className={cn(
                    "whitespace-nowrap font-semibold uppercase leading-[0.85] tracking-tighter text-foreground/85",
                    wideDate ? "text-4xl" : "text-5xl",
                  )}
                >
                  {todayLabel}
                </p>
              </motion.div>
            </div>

            <div className="hidden md:grid md:grid-cols-12 gap-x-6 mt-10">
              <motion.div
                className="col-span-4 flex flex-col justify-end"
                variants={HERO_VARIANTS}
                initial="hidden"
                animate="visible"
                custom={2}
              >
                <ArrowDownRight className="text-foreground/40 size-10 lg:size-12 -ml-1.5 mb-8 lg:mb-10" strokeWidth={1.5} />
                <p className="text-2xl xl:text-3xl tracking-tight leading-[1.3] max-w-[26ch] text-balance text-foreground/70 font-medium">
                  {t("tagline")}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <CtaButton
                    label={t("cta")}
                    onClick={() => scrollTo("contact")}
                    className="px-6 py-4 text-base lg:px-8 lg:py-5 lg:text-lg"
                  />
                  <LocaleSwitcher />
                </div>
              </motion.div>

              <div className="col-span-4 flex justify-center items-end">
                <motion.div
                  className="h-[46vh] max-h-[560px] aspect-[3/4] overflow-hidden rounded-xl"
                  variants={HERO_IMAGE_VARIANTS}
                  initial="hidden"
                  animate="visible"
                  custom={3}
                >
                  <Image
                    src={coverImage}
                    alt={t("imageAlt")}
                    sizes="35vh"
                    preload
                    className="h-full w-full object-cover object-center grayscale"
                  />
                </motion.div>
              </div>

              <motion.div
                className="col-span-4 flex flex-col justify-end items-end gap-3"
                variants={HERO_VARIANTS}
                initial="hidden"
                animate="visible"
                custom={4}
              >
                <Availability label={t("availabilityDesktop")} className="xl:text-sm" />
                <p
                  className={cn(
                    "whitespace-nowrap text-foreground/85 font-semibold uppercase leading-[0.8] tracking-tighter",
                    wideDate ? "text-[5.5vw]" : "text-[8vw]",
                  )}
                >
                  {todayLabel}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
