import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const urlFor = (locale: (typeof routing.locales)[number]) =>
  new URL(getPathname({ href: "/", locale }), SITE_URL).toString();

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(routing.locales.map((l) => [l, urlFor(l)]));

  return routing.locales.map((locale) => ({
    url: urlFor(locale),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));
}
