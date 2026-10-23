export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://weihangli.dev";

export const CONTACT_EMAIL = "hanggesimida@gmail.com";

export const SOCIAL_LINKS = [
  { id: "github", href: "https://github.com/hanggesimida" },
  { id: "telegram", href: "https://t.me/WeihangLi" },
  { id: "instagram", href: "https://www.instagram.com/lwphgr/" },
  { id: "whatsapp", href: "https://wa.me/8613728215486" },
] as const;

export type SocialId = (typeof SOCIAL_LINKS)[number]["id"];

export const PROJECTS = [
  {
    id: "keyboardDesigner",
    bgImage: "/images/projects/works_bg_04.webp",
    previewImage: "/images/projects/works_kbd.png",
    siteUrl: "https://kbd.weihangli.dev",
    githubUrl: "https://github.com/Hanggesimida/keyboard-designer",
  },
  {
    id: "portfolio",
    bgImage: "/images/projects/works_bg_01.webp",
    previewImage: "/images/projects/works_portfolio.jpg",
    githubUrl: "https://github.com/Hanggesimida/weihangli-portfolio",
  },
  {
    id: "hynel",
    bgImage: "/images/projects/works_bg_02.webp",
    previewImage: "/images/projects/works_hynel.png",
    siteUrl: "https://www.hynel-energy.com",
  },
  {
    id: "vehicleSearch",
    bgImage: "/images/projects/works_bg_03.webp",
    previewImage: "/images/projects/works_vehicle_search.jpg",
  },
] as const;

export const SKILL_GROUPS = [
  {
    id: "languages",
    items: ["JavaScript", "TypeScript", "Java", "Python", "Dart", "SQL"],
  },
  {
    id: "frameworks",
    items: [
      "Vue",
      "React",
      "Next.js",
      "Node.js",
      "Express.js",
      "NestJS",
      "Electron",
      "React Native",
      "Spring Boot",
      "Three.js",
      "ECharts",
      "Tailwind CSS",
      "Framer Motion",
      "GSAP",
    ],
  },
  {
    id: "tools",
    items: [
      "Git",
      "Apifox",
      "Docker",
      "Vercel",
      "Alibaba Cloud",
      "Tencent Cloud",
      "Prisma",
      "PostgreSQL",
      "MySQL",
      "SQLite",
      "Redis",
    ],
  },
] as const;
