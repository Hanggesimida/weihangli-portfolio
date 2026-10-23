"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUp } from "lucide-react";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { SECTION_IDS } from "@/components/scroll/config";
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

  return <span className="font-mono font-medium uppercase text-secondary/60 text-base">{time}</span>;
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
        className="group text-secondary/60 tracking-tighter hover:text-secondary/80 transition-colors overflow-hidden cursor-pointer"
      >
        <RollingText className="text-base sm:text-lg lg:text-xl">{label}</RollingText>
      </button>
      {open && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 z-10 mb-2 w-40 -translate-x-1/2 rounded-md border bg-background p-2 shadow-md"
        >
          <Image
            src="/images/footer/wechat.webp"
            alt={qrAlt}
            width={160}
            height={160}
            className="size-full rounded-md"
          />
        </div>
      )}
    </div>
  );
}

function ScrollToTopButton({
  onClick,
  ariaLabel,
}: {
  onClick: () => void;
  ariaLabel: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center justify-center rounded-full bg-scroll-top-surface p-6 hover:scale-90 active:scale-95 transition-transform duration-300 cursor-pointer overflow-hidden"
    >
      <motion.div
        animate={hovered ? { y: [0, -14, 0] } : { y: 0 }}
        transition={
          hovered
            ? { duration: 0.6, ease: "easeInOut" }
            : { duration: 0.2 }
        }
      >
        <ArrowUp className="md:size-6 lg:size-10 text-scroll-top-foreground" />
      </motion.div>
    </button>
  );
}

export default function Footer() {
  const t = useTranslations("Nav");
  const tFooter = useTranslations("Footer");
  const scrollTo = useScrollTo();

  return (
    <footer className="px-10 py-12 flex flex-col gap-12">
      <div className="grid grid-cols-2 gap-y-10 md:grid-cols-12 gap-x-8">
        <div className="flex flex-col md:col-span-6">
          <h3 className="mb-3 border-b-[1.5px] border-foreground/30 pb-2 font-bold text-lg lg:text-xl tracking-tighter text-secondary/80">
            {tFooter("menu")}
          </h3>
          <ul className="flex flex-col gap-1.5">
            {SECTION_IDS.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => scrollTo(id)}
                  className="group text-left text-secondary/60 sm:text-lg lg:text-xl tracking-tighter cursor-pointer hover:text-secondary/80 transition-colors overflow-hidden"
                >
                  <RollingText className="text-base sm:text-lg lg:text-xl">{t(id)}</RollingText>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col md:col-span-3">
          <h3 className="mb-3 border-b-[1.5px] border-foreground/30 pb-2 font-bold text-lg lg:text-xl tracking-tighter text-secondary/80">
            {tFooter("socials")}
          </h3>
          <ul className="flex flex-col gap-1.5">
            {SOCIAL_LINKS.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group text-secondary/60 tracking-tighter hover:text-secondary/80 transition-colors overflow-hidden"
                >
                  <RollingText className="text-base sm:text-lg lg:text-xl">{tFooter(item.id)}</RollingText>
                </a>
              </li>
            ))}
            <li>
              <WeChatItem label={tFooter("wechat")} qrAlt={tFooter("wechatQrAlt")} />
            </li>
          </ul>
        </div>
      </div>

      <div className="flex w-full items-end justify-between md:grid md:grid-cols-12 gap-x-8">
        <div className="hidden md:col-span-6 md:block" aria-hidden />

        <div className="flex flex-col text-sm md:col-span-3">
          <span className="font-bold uppercase tracking-tighter text-secondary/80 text-base sm:text-lg">
            {tFooter("localTime")}
          </span>
          <LocalClock />
        </div>

        <div className="hidden md:flex md:col-span-3 justify-end">
          <ScrollToTopButton
            ariaLabel={tFooter("scrollToTop")}
            onClick={() => scrollTo("home")}
          />
        </div>
      </div>
    </footer>
  );
}
