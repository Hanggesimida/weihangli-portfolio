"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useLenis } from "lenis/react";
import { SECTION_IDS, type SectionId } from "@/components/scroll/config";
import { useLenisLock } from "@/hooks/useLenisLock";
import { useScrollTo } from "@/hooks/useScrollTo";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";

const socialLinks = [
  { labelKey: "github" as const, href: "https://github.com/hanggesimida" },
  { labelKey: "telegram" as const, href: "https://t.me/WeihangLi" },
  { labelKey: "instagram" as const, href: "https://www.instagram.com/lwphgr/" },
  { labelKey: "whatsapp" as const, href: "https://wa.me/8613728215486" },
];

const EMAIL = "hanggesimida@gmail.com";

const EASE = [0.76, 0, 0.24, 1] as const;

const menuVariants = {
  closed: { x: "100%", transition: { duration: 0.6, ease: EASE } },
  opened: { x: "0%", transition: { duration: 0.6, ease: EASE } },
};

const linkVariants = {
  initial: { y: 20, opacity: 0 },
  enter: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, delay: 0.3 + i * 0.08, ease: EASE },
  }),
};

const footerVariants = {
  initial: { y: 12, opacity: 0 },
  enter: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, delay: 0.35, ease: EASE },
  },
};

export default function NavOverlay() {
  const t = useTranslations("Nav");
  const tOverlay = useTranslations("NavOverlay");
  const locale = useLocale();
  const isChinese = locale.startsWith("zh");
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hoveredId, setHoveredId] = useState<SectionId | null>(null);
  const scrollTo = useScrollTo();

  useLenisLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useLenis(({ scroll }) => {
    const next = scroll >= window.innerHeight * 0.8;
    setShowButton((prev) => (prev === next ? prev : next));
  });

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const close = () => setIsOpen(false);

  return (
    <>
      <motion.button
        animate={{ opacity: showButton ? 1 : 0, scale: showButton ? 1 : 0.8 }}
        whileHover={{ scale: 0.9 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        style={{ pointerEvents: showButton ? "auto" : "none", cursor: "pointer" }}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? tOverlay("closeMenu") : tOverlay("openMenu")}
        aria-expanded={isOpen}
        aria-controls="nav-overlay"
        inert={!showButton && !isOpen}
        type="button"
        className="fixed top-9 right-8 z-[9999] p-3 bg-secondary-foreground rounded-full shadow-lg"
      >
        <svg width="35" height="35" viewBox="0 0 35 35" style={{ display: "block" }}>
          <motion.line
            x1="2" y1="13.5" x2="33" y2="13.5"
            stroke="black" strokeWidth="2" strokeLinecap="round"
            animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 4 : 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{ transformOrigin: "50% 50%", transformBox: "fill-box" }}
          />
          <motion.line
            x1="2" y1="21.5" x2="33" y2="21.5"
            stroke="black" strokeWidth="2" strokeLinecap="round"
            animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -4 : 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{ transformOrigin: "50% 50%", transformBox: "fill-box" }}
          />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            aria-hidden="true"
            className="fixed inset-0 bg-black/50 backdrop-blur-lg"
            style={{ zIndex: 997 }}
          />
        )}
      </AnimatePresence>

      <motion.div
        variants={menuVariants}
        initial="closed"
        animate={isOpen ? "opened" : "closed"}
        onClick={close}
        id="nav-overlay"
        inert={!isOpen}
        className="fixed top-0 right-0 h-screen w-screen flex justify-end"
        style={{ zIndex: 998 }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full relative flex max-w-2xl flex-col justify-end overflow-hidden xl:max-w-3xl"
        >
          <nav className="relative h-full px-10 sm:px-16 flex items-center">
            <ul
              className="flex flex-col justify-center"
              onMouseLeave={isChinese ? () => setHoveredId(null) : undefined}
            >
              {SECTION_IDS.map((id, i) => {
                const isDimmed = isChinese && hoveredId !== null && hoveredId !== id;
                return (
                  <li key={id} className="relative flex items-center overflow-hidden">
                    <motion.button
                      type="button"
                      custom={i}
                      variants={linkVariants}
                      initial="initial"
                      animate={
                        isChinese
                          ? { ...(isOpen ? { y: 0, opacity: isDimmed ? 0.25 : 1 } : { y: 20, opacity: 0 }), scale: isDimmed ? 0.9 : 1 }
                          : isOpen ? "enter" : "initial"
                      }
                      transition={{ duration: 0.3, ease: EASE }}
                      onMouseEnter={isChinese ? () => setHoveredId(id) : undefined}
                      onClick={() => {
                        close();
                        scrollTo(id);
                      }}
                      className="group relative inline-block text-secondary-foreground font-bold uppercase leading-none tracking-tighter select-none cursor-pointer"
                      style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
                    >
                      {t(id)}
                      {!isChinese && (
                        <span className="absolute left-0 bottom-1 h-0.5 w-0 bg-secondary-foreground transition-all duration-500 group-hover:w-full" />
                      )}
                    </motion.button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <motion.div
            variants={footerVariants}
            initial="initial"
            animate={isOpen ? "enter" : "initial"}
            className="flex flex-col items-start gap-y-6 px-10 pb-10 sm:px-16 sm:pb-14"
          >
            <LocaleSwitcher tone="onDark" className="text-sm" />
            <div className="flex flex-col">
              <span className="text-base font-bold uppercase text-white/40">
                {tOverlay("emailLabel")}
              </span>
              <div className="flex items-center gap-x-2">
                <a
                  href={`mailto:${EMAIL}`}
                  className="font-mono font-medium text-secondary-foreground text-base"
                >
                  {EMAIL}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label={tOverlay("copyEmail")}
                  className="text-white/40 hover:text-secondary-foreground transition-colors duration-200 cursor-pointer"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copied ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check size={14} className="text-green-400" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Copy size={14} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>

            <ul className="flex flex-nowrap gap-x-6">
              {socialLinks.map(({ labelKey, href }) => (
                <li key={labelKey}>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={href}
                    className="relative text-secondary-foreground font-medium text-base transition-colors duration-300 hover:text-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {tOverlay(labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
