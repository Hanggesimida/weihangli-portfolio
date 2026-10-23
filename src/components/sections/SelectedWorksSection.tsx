"use client";

import { useTranslations } from "next-intl";
import Counter from "@/components/counter/Counter";
import ProjectCard from "@/components/project-card/ProjectCard";
import SplitText from "@/components/text/SplitText";
import FadeUp from "@/components/text/FadeUp";
import { useActiveWorkIndex } from "@/hooks/useActiveWorkIndex";
import { PROJECTS } from "@/config/site";

type ProjectCopy = {
  category: string;
  title: string;
  year: string;
  tags: string[];
  summary: string;
};

export default function SelectedWorksSection() {
  const t = useTranslations("Works");
  const copy = t.raw("projects") as Record<(typeof PROJECTS)[number]["id"], ProjectCopy>;
  const merged = PROJECTS.map((project) => ({
    ...project,
    ...copy[project.id],
  }));

  const { displayIndex, setItemRef } = useActiveWorkIndex(merged.length);

  return (
    <section id="works" className="bg-secondary px-6 sm:px-10 pt-20 pb-24 md:pt-32 md:pb-32 text-secondary-foreground">
      <div className="mb-16 md:mb-28">
        <h2 className="mb-12 md:mb-20 text-[13vw] sm:text-6xl leading-[0.9] font-semibold tracking-tighter uppercase md:text-[7vw]">
          <SplitText>{t("heading")}</SplitText>
        </h2>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 flex flex-col gap-x-16 gap-y-5 md:col-start-6 md:col-span-7 sm:flex-row">
            <span className="eyebrow shrink-0 pt-1.5 text-secondary-foreground/50 md:w-32">
              {t("label")}
            </span>

            <FadeUp
              className="w-full max-w-[30ch] text-balance text-xl leading-snug tracking-tight text-secondary-foreground/85 md:text-2xl"
              delay={0.15}
            >
              {t("intro")}
            </FadeUp>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-x-6">
        <div className="sticky top-12 hidden self-start md:col-span-5 md:block">
          <div className="flex items-start gap-4">
            <Counter
              value={displayIndex}
              digitClassName="text-[19vw] font-semibold tracking-tighter tabular-nums text-secondary-foreground/90"
            />
            <span className="eyebrow mt-[1.5vw] text-secondary-foreground/40">
              / {String(merged.length).padStart(2, "0")}
            </span>
          </div>
        </div>
        <div className="col-span-12 flex flex-col gap-y-20 md:col-span-7 md:gap-y-28 lg:gap-y-36">
          {merged.map(({ id, ...project }, idx) => (
            <ProjectCard
              key={id}
              ref={setItemRef(idx)}
              overviewLabel={t("overviewLabel")}
              visitLabel={t("visitLabel")}
              viewLabel={t("viewLabel")}
              {...project}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
