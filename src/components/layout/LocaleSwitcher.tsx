"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LOCALE_LABEL_KEYS = {
  en: "en",
  "zh-CN": "zhCN",
  "zh-TW": "zhTW",
  ja: "ja",
  ko: "ko",
} as const satisfies Record<(typeof routing.locales)[number], string>;

type Tone = "default" | "onDark";

export default function LocaleSwitcher({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: Tone;
}) {
  const t = useTranslations("LocaleSwitcher");
  const pathname = usePathname();
  const locale = useLocale();

  const active =
    tone === "onDark"
      ? "font-medium text-secondary-foreground"
      : "font-medium text-foreground/80";
  const inactive =
    tone === "onDark"
      ? "text-secondary-foreground/45 hover:text-secondary-foreground"
      : "text-muted-foreground hover:text-foreground/70";
  const divider =
    tone === "onDark" ? "text-secondary-foreground/25" : "text-muted-foreground/35";

  return (
    <nav
      className={cn(
        "font-mono text-xs uppercase tracking-wider",
        className,
      )}
      aria-label={t("label")}
    >
      <ul className="flex flex-wrap items-center gap-x-2">
        {routing.locales.map((code, index) => (
          <li key={code} className="flex items-center gap-x-2">
            {index > 0 && (
              <span className={divider} aria-hidden>
                /
              </span>
            )}
            <Link
              href={pathname}
              locale={code}
              className={cn(
                "transition-colors duration-200",
                locale === code ? active : inactive,
              )}
            >
              {t(LOCALE_LABEL_KEYS[code])}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
