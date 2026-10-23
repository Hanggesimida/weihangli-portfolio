"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";
import { SECTION_IDS } from "@/components/scroll/config";
import SplitText from "@/components/text/SplitText";
import { useScrollTo } from "@/hooks/useScrollTo";
import { RollingText } from "@/components/ui/RollingText";
import { SOCIAL_LINKS } from "@/config/site";

function LocalClock() {
  const locale = useLocale();
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZoneName: "short",
        }),
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [locale]);

  return (
    <span className="block text-xl font-medium tracking-tight tabular-nums text-foreground/85 sm:text-2xl md:text-3xl">
      {time || "\u00A0"}
    </span>
  );
}

function WeChatItem({ label, qrAlt }: { label: string; qrAlt: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative inline-block"
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={linkClass}
      >
        <RollingText>{label}</RollingText>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="tooltip"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 z-10 mb-3 w-44 rounded-2xl bg-secondary p-2.5 shadow-xl"
          >
            <Image
              src="/images/footer/wechat.webp"
              alt={qrAlt}
              width={160}
              height={160}
              className="size-full rounded-xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const linkClass =
  "group text-lg lg:text-xl tracking-tight text-foreground/70 transition-colors hover:text-foreground cursor-pointer";

function Column({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h3 className="eyebrow mb-5 border-b border-foreground/15 pb-3 text-foreground/50">{title}</h3>
      {children}
    </div>
  );
}

export default function Footer() {
  const t = useTranslations("Nav");
  const tFooter = useTranslations("Footer");
  const scrollTo = useScrollTo();

  return (
    <footer className="flex flex-col gap-16 overflow-hidden px-6 pt-24 pb-6 sm:px-10 md:gap-24 md:pt-32">
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12">
        <Column title={tFooter("menu")} className="md:col-span-3">
          <ul className="flex flex-col gap-1.5">
            {SECTION_IDS.map((id) => (
              <li key={id}>
                <button type="button" onClick={() => scrollTo(id)} className={`${linkClass} text-left`}>
                  <RollingText>{t(id)}</RollingText>
                </button>
              </li>
            ))}
          </ul>
        </Column>

        <Column title={tFooter("socials")} className="md:col-span-3">
          <ul className="flex flex-col gap-1.5">
            {SOCIAL_LINKS.map((item) => (
              <li key={item.id}>
                <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  <RollingText>{tFooter(item.id)}</RollingText>
                </a>
              </li>
            ))}
            <li>
              <WeChatItem label={tFooter("wechat")} qrAlt={tFooter("wechatQrAlt")} />
            </li>
          </ul>
        </Column>

        <Column title={tFooter("localTime")} className="md:col-span-3 md:col-start-7">
          <LocalClock />
        </Column>

        <div className="flex items-end justify-end md:col-span-3">
          <button
            type="button"
            aria-label={tFooter("scrollToTop")}
            onClick={() => scrollTo("home")}
            className="group grid size-16 place-items-center overflow-hidden rounded-full bg-foreground text-background transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-90 cursor-pointer md:size-20"
          >
            <ArrowUp className="size-6 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 md:size-7" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <p
          aria-hidden="true"
          className="flex justify-between gap-[0.2em] whitespace-nowrap text-[15.5vw] font-semibold uppercase leading-[0.72] tracking-tighter text-foreground/90 scale-y-[0.88] origin-bottom md:text-[17vw]"
        >
          <SplitText decorative stagger={0.03} threshold={0.5}>WEIHANG</SplitText>
          <SplitText decorative stagger={0.03} threshold={0.5} delay={0.15}>LI</SplitText>
        </p>
        <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-foreground/15 pt-5 sm:flex-row sm:items-center">
          <p className="eyebrow text-foreground/50">
            © {new Date().getFullYear()} Weihang Li. {tFooter("rights")}
          </p>
          <LocaleSwitcher />
        </div>
      </div>
    </footer>
  );
}
