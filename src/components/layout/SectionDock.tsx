"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue } from "motion/react";
import { useLenis } from "lenis/react";
import { useTranslations } from "next-intl";
import { ChevronUp } from "lucide-react";
import { SCROLL_DURATION, SECTION_IDS, type SectionId } from "@/components/scroll/config";
import { RollingText } from "@/components/ui/RollingText";
import { useScrollTo } from "@/hooks/useScrollTo";
import { EASE_OUT_EXPO } from "@/lib/animations";
import { cn } from "@/lib/utils";

/** A section becomes active once its top crosses this viewport ratio. */
const ACTIVATION_LINE_RATIO = 0.4;
/** Scroll distance (px) in one direction before the dock retracts / returns. */
const RETRACT_AFTER = 60;
const RETURN_AFTER = 24;
const MENU_ID = "section-dock-menu";
const SPRING = { duration: 0.45, ease: EASE_OUT_EXPO };

const pad = (n: number) => String(n).padStart(2, "0");

export default function SectionDock() {
  const t = useTranslations("Nav");
  const tDock = useTranslations("Dock");
  const scrollTo = useScrollTo();
  const [active, setActive] = useState(0);
  const [inRange, setInRange] = useState(false);
  const [retracted, setRetracted] = useState(false);
  const [open, setOpen] = useState(false);
  const progress = useMotionValue(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const anchorRef = useRef(0);
  const navigatingUntilRef = useRef(0);
  const hoverOpenRef = useRef(false);

  const expanded = open && inRange;
  const visible = inRange && (!retracted || expanded);

  const sync = (scroll: number) => {
    const vh = window.innerHeight;
    let next = 0;
    SECTION_IDS.forEach((id, i) => {
      const top = document.getElementById(id)?.getBoundingClientRect().top;
      if (top !== undefined && top <= vh * ACTIVATION_LINE_RATIO) next = i;
    });
    setActive(next);

    const footerTop = document.querySelector("footer")?.getBoundingClientRect().top ?? Infinity;
    setInRange(scroll >= vh * 0.8 && footerTop > vh * 0.9);

    const delta = scroll - anchorRef.current;
    if (performance.now() < navigatingUntilRef.current) {
      anchorRef.current = scroll;
    } else if (delta > RETRACT_AFTER) {
      anchorRef.current = scroll;
      setRetracted(true);
    } else if (delta < -RETURN_AFTER) {
      anchorRef.current = scroll;
      setRetracted(false);
    }
  };

  const lenis = useLenis(({ scroll, progress: p }) => {
    progress.set(p);
    sync(scroll);
  });

  useEffect(() => {
    anchorRef.current = window.scrollY;
    const onResize = () => sync(window.scrollY);
    const raf = requestAnimationFrame(onResize);
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [lenis]);

  useEffect(() => {
    if (!expanded) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus({ preventScroll: true });
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [expanded]);

  // Event timeStamp shares performance.now()'s clock; keeps the dock up during programmatic scroll.
  const go = (id: SectionId, timeStamp: number) => {
    hoverOpenRef.current = false;
    setOpen(false);
    setRetracted(false);
    navigatingUntilRef.current = timeStamp + SCROLL_DURATION * 1000;
    scrollTo(id);
  };

  const activeId = SECTION_IDS[active];

  return (
    <>
      <AnimatePresence>
        {expanded && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[89] touch-none bg-black/50 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.nav
        aria-label={tDock("label")}
        inert={!visible}
        initial={false}
        animate={visible ? { y: 0, opacity: 1 } : { y: 96, opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[90] flex justify-center px-4 sm:bottom-6"
      >
        <motion.div
          ref={panelRef}
          layout
          transition={{ layout: SPRING }}
          style={{ borderRadius: 26 }}
          onPointerEnter={(e) => {
            if (e.pointerType !== "mouse") return;
            hoverOpenRef.current = true;
            setOpen(true);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType !== "mouse") return;
            hoverOpenRef.current = false;
            setOpen(false);
          }}
          className={cn(
            "flex flex-col-reverse overflow-hidden bg-background text-foreground ring-1 ring-black/10 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.55)] md:flex-row md:items-stretch",
            visible && "pointer-events-auto",
          )}
        >
          <motion.button
            ref={toggleRef}
            layout="position"
            type="button"
            aria-expanded={expanded}
            aria-controls={MENU_ID}
            onClick={() => {
              if (!hoverOpenRef.current) setOpen((v) => !v);
            }}
            className="relative flex shrink-0 cursor-pointer items-center gap-3 pt-3 pb-4 pl-5 pr-4"
          >
            <span className="sr-only">{tDock("toggle")}</span>
            <span className="eyebrow tabular-nums text-foreground/45">
              {pad(active + 1)} / {pad(SECTION_IDS.length)}
            </span>
            <span className="relative block h-[1.3em] flex-1 overflow-hidden text-left text-[15px] font-medium leading-[1.3em] tracking-tight">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={activeId}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={SPRING}
                  className="block whitespace-nowrap"
                >
                  {t(activeId)}
                </motion.span>
              </AnimatePresence>
            </span>
            <ChevronUp
              aria-hidden="true"
              className={cn(
                "size-4 text-foreground/60 transition-transform duration-300",
                expanded ? "rotate-180 md:-rotate-90" : "md:rotate-90",
              )}
            />
            <span aria-hidden="true" className="absolute inset-x-5 bottom-2 h-px overflow-hidden bg-foreground/15">
              <motion.span style={{ scaleX: progress }} className="absolute inset-0 origin-left bg-foreground/70" />
            </span>
          </motion.button>

          <AnimatePresence initial={false} mode="popLayout">
            {expanded && (
              <motion.ul
                id={MENU_ID}
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.25, delay: 0.1 } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="flex w-[min(calc(100vw-2rem),20rem)] flex-col gap-0.5 border-b border-foreground/10 p-2 md:w-auto md:flex-row md:items-center md:border-b-0 md:border-l md:p-1.5"
              >
                {SECTION_IDS.map((id, i) => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={(e) => go(id, e.timeStamp)}
                      aria-current={i === active ? "location" : undefined}
                      className={cn(
                        "group flex w-full cursor-pointer items-baseline gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors md:rounded-full md:px-3.5 md:py-2",
                        i === active
                          ? "bg-foreground/10 text-foreground"
                          : "text-foreground/55 hover:text-foreground",
                      )}
                    >
                      <span className="eyebrow tabular-nums text-foreground/40 md:hidden">{pad(i + 1)}</span>
                      <span className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight md:text-[15px] md:font-medium">
                        <RollingText>{t(id)}</RollingText>
                      </span>
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.nav>
    </>
  );
}
