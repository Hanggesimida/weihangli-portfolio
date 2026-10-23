"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { HEADER_SECTION_IDS } from "@/components/scroll/config";
import { RollingText } from "@/components/ui/RollingText";
import { useScrollTo } from "@/hooks/useScrollTo";
import { HERO_VARIANTS } from "@/lib/animations";

export default function Header() {
  const t = useTranslations("Nav");
  const tHeader = useTranslations("Header");
  const scrollTo = useScrollTo();

  return (
    <motion.header
      className="flex justify-between items-start pt-5 sm:pt-8"
      variants={HERO_VARIANTS}
      initial="hidden"
      animate="visible"
      custom={0}
    >
      <button
        type="button"
        onClick={() => scrollTo("home")}
        className="text-base leading-snug text-foreground/80 tracking-tight text-left font-medium cursor-pointer md:text-lg lg:text-xl"
      >
        <span className="block md:hidden">{tHeader("roleMobile1")}</span>
        <span className="block md:hidden">{tHeader("roleMobile2")}</span>
        <span className="hidden md:block">{tHeader("roleDesktop")}</span>
      </button>
      <nav className="flex flex-col items-end gap-0.5 md:flex-row md:items-center md:gap-7">
        {HEADER_SECTION_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollTo(id)}
            className="group text-base text-foreground/80 hover:text-foreground transition-colors md:text-lg lg:text-xl tracking-tight cursor-pointer font-medium"
          >
            <RollingText>{t(id)}</RollingText>
          </button>
        ))}
      </nav>
    </motion.header>
  );
}
