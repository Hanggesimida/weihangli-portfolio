"use client";

import FadeUp from "@/components/text/FadeUp";
import SplitText from "@/components/text/SplitText";
import { useTranslations } from "next-intl";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

type Service = {
  number: string;
  title: string;
  description: string;
  skills: string[];
};

const height = (el?: HTMLDivElement) => el?.getBoundingClientRect().height ?? 0;

export default function WhatIDoSection() {
  const t = useTranslations("WhatIDo");
  const services = t.raw("services") as Service[];

  const headerRefs = useRef<HTMLDivElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const [heights, setHeights] = useState(() => ({
    headers: Array<number>(services.length).fill(0),
    cards: Array<number>(services.length).fill(0),
  }));

  const measure = useCallback(() => {
    setHeights({
      headers: services.map((_, i) => height(headerRefs.current[i])),
      cards: services.map((_, i) => height(cardRefs.current[i])),
    });
  }, [services]);

  const offsets = useMemo(() => {
    const tops = heights.headers.map((_, i) =>
      heights.headers.slice(0, i).reduce((sum, h) => sum + h, 0),
    );
    const bottoms = tops.map((top, i) => top + heights.cards[i]);
    const maxBottom = Math.max(...bottoms);
    return tops.map((top, i) => ({ top, extra: maxBottom - bottoms[i] }));
  }, [heights]);

  useLayoutEffect(() => {
    const nodes = [...headerRefs.current, ...cardRefs.current].filter(Boolean);
    if (nodes.length !== services.length * 2) return;

    measure();

    const ro = new ResizeObserver(measure);
    nodes.forEach((node) => ro.observe(node));
    return () => ro.disconnect();
  }, [measure, services.length]);

  return (
    <section id="services" className="px-6 sm:px-10 pt-16 md:pt-24 bg-secondary rounded-t-3xl text-secondary-foreground relative z-10">
      <div className="mb-12 md:mb-24">
        <h2 className="text-[13vw] sm:text-6xl md:text-[8vw] font-semibold tracking-tighter uppercase leading-[0.9] mb-12 md:mb-20">
          <SplitText>{t("heading")}</SplitText>
        </h2>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-start-6 md:col-span-7 flex flex-col sm:flex-row gap-x-16 gap-y-5">
            <span className="eyebrow shrink-0 pt-1.5 text-secondary-foreground/50 md:w-32">
              {t("label")}
            </span>

            <FadeUp
              className="w-full max-w-[36ch] text-balance text-xl md:text-2xl leading-snug tracking-tight text-secondary-foreground/85"
              delay={0.15}
            >
              {t("intro")}
            </FadeUp>
          </div>
        </div>
      </div>

      <div className="py-4">
        {services.map((service, index) => {
          const { top, extra } = offsets[index];
          return (
            <div
              key={service.number}
              ref={(el) => {
                if (el) cardRefs.current[index] = el;
              }}
              className="sticky border-t border-secondary-border bg-secondary [--sticky-top:8vh] sm:[--sticky-top:15vh] md:[--sticky-top:20vh] [--sticky-bottom:2em] md:[--sticky-bottom:8em]"
              style={{
                top: `calc(var(--sticky-top) + ${top}px)`,
                marginBottom: `calc(${extra}px + var(--sticky-bottom))`,
                zIndex: index,
              }}
            >
              <div
                ref={(el) => {
                  if (el) headerRefs.current[index] = el;
                }}
                className="flex items-baseline gap-4 md:grid md:grid-cols-12 md:gap-x-6"
              >
                <span className="eyebrow shrink-0 text-secondary-foreground/50 md:col-span-2 md:text-sm">
                  ({service.number})
                </span>

                <h3 className="md:col-span-7 md:col-start-6 text-[2.5rem] leading-none md:text-5xl lg:text-6xl font-semibold py-6 md:py-8 tracking-tighter">
                  {service.title}
                </h3>
              </div>

              <div className="md:grid md:grid-cols-12 min-h-[40vh] md:gap-x-6 pb-6">
                <div className="md:col-span-7 md:col-start-6 space-y-8">
                  <p className="max-w-[42ch] text-balance text-lg md:text-xl leading-snug tracking-tight text-secondary-foreground/75">
                    {service.description}
                  </p>

                  <ul className="border-t border-secondary-border">
                    {service.skills.map((skill, i) => (
                      <li
                        key={i}
                        className="group flex items-baseline gap-5 md:gap-8 border-b border-secondary-border py-4 md:py-5"
                      >
                        <span className="eyebrow text-secondary-foreground/40 transition-colors duration-300 group-hover:text-secondary-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-2xl md:text-4xl tracking-tighter font-semibold text-secondary-foreground/90 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3">
                          {skill}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
