"use client";

import { useTranslations } from "next-intl";
import Counter from "@/components/counter/Counter";
import ProjectCard from "@/components/project-card/ProjectCard";
import SplitText from "@/components/text/SplitText";
import FadeUp from "@/components/text/FadeUp";
import { useActiveWorkIndex } from "@/hooks/useActiveWorkIndex";

const PROJECT_ASSETS = [
  {
    bgImage: "/images/projects/works_bg_01.webp",
    previewImage: "/images/projects/works_profolio.jpg",
  },
  {
    bgImage: "/images/projects/works_bg_04.webp",
    previewImage: "/images/projects/works_kbd.png",
    siteUrl: "https://kbd.weihangli.dev",
    githubUrl: "https://github.com/Hanggesimida/keyboard-designer",
  },
  {
    bgImage: "/images/projects/works_bg_02.webp",
    previewImage: "/images/projects/works_hynel.jpg",
  },
  {
    bgImage: "/images/projects/works_bg_03.webp",
    previewImage: "/images/projects/works_vehicle_search.jpg",
  },
] as const;

type ProjectCopy = {
  category: string;
  title: string;
  year: string;
  tags: string[];
  summary: string;
};

export default function SelectedWorksSection() {
  const t = useTranslations("Works");
  const projects = t.raw("projects") as ProjectCopy[];
  const overviewLabel = t("overviewLabel");
  const visitLabel = t("visitLabel");
  const merged = PROJECT_ASSETS.map((assets, idx) => ({
    ...assets,
    ...projects[idx],
  }));

  const { displayIndex, setItemRef } = useActiveWorkIndex(merged.length);

  return (
    <section id="works" className="space-y-12 bg-secondary px-10 pt-10 pb-20 sm:py-20 text-secondary-foreground">
      <div>
        <SplitText stagger={0.04} duration={0.8} yOffset={50} className="mb-20 text-6xl leading-none font-semibold tracking-tighter uppercase md:text-[7vw]">
          {t("heading")}
        </SplitText>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 flex flex-col gap-x-18 gap-y-6 md:col-start-6 md:col-span-7 sm:flex-row">
            <span className="text-md text-nowrap text-secondary-foreground/50 tracking-tighter uppercase">
              {t("label")}
            </span>

            <FadeUp
              className="w-full max-w-[25ch] text-balance text-lg leading-snug font-light text-secondary-foreground/80 md:text-2xl"
              delay={0.15}
              once={false}
            >
              {t("intro")}
            </FadeUp>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12 sticky top-12 hidden self-start md:col-start-1 md:col-span-5 md:block">
          <Counter
            value={displayIndex}
            digitClassName="text-[22vw] font-mono text-secondary-foreground/80"
          />
        </div>
        <div className="col-span-12 flex flex-col gap-y-18 md:gap-y-20 lg:gap-y-28 md:col-span-7 md:pt-5">
          {merged.map((project, idx) => (
            <ProjectCard
              key={`${project.title}-${idx}`}
              ref={setItemRef(idx)}
              overviewLabel={overviewLabel}
              visitLabel={visitLabel}
              {...project}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
