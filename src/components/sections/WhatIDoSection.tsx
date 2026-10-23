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

function getOffsets(prefix: number[], index: number) {
  const top = prefix[index];
  const remaining = prefix[prefix.length - 1] - prefix[index + 1];
  return { top, remaining };
}

export default function WhatIDoSection() {
  const t = useTranslations("WhatIDo");
  const services = t.raw("services") as Service[];

  const headerRefs = useRef<HTMLDivElement[]>([]);
  const [headerHeightsPx, setHeaderHeightsPx] = useState<number[]>(() =>
    Array(services.length).fill(0),
  );

  const measure = useCallback(() => {
    setHeaderHeightsPx(
      services.map(
        (_, i) => headerRefs.current[i]?.getBoundingClientRect().height ?? 0,
      ),
    );
  }, [services]);

  const prefixHeights = useMemo(() => {
    const arr = [0];
    for (let i = 0; i < headerHeightsPx.length; i++) {
      arr[i + 1] = arr[i] + headerHeightsPx[i];
    }
    return arr;
  }, [headerHeightsPx]);

  useLayoutEffect(() => {
    const nodes = headerRefs.current.filter(Boolean) as HTMLDivElement[];
    if (nodes.length !== services.length) return;

    measure();

    const observers = nodes.map((node) => {
      const ro = new ResizeObserver(measure);
      ro.observe(node);
      return ro;
    });

    return () => {
      observers.forEach((o) => o.disconnect());
    };
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
          const { top: topOffsetPx, remaining: remainingHeadersPx } = getOffsets(
            prefixHeights,
            index,
          );
          return (
            <div
              key={service.number}
              className="sticky border-t border-secondary-border bg-secondary [--sticky-top:8vh] sm:[--sticky-top:15vh] md:[--sticky-top:20vh] [--sticky-bottom:2em] md:[--sticky-bottom:8em]"
              style={{
                top: `calc(var(--sticky-top) + ${topOffsetPx}px)`,
                marginBottom: `calc(${remainingHeadersPx}px + var(--sticky-bottom))`,
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
