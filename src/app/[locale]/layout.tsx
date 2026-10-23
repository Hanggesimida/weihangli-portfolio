import "@/styles/globals.css";
import NavOverlay from "@/components/layout/NavOverlay";
import SmoothScrolling from "@/components/scroll/SmoothScrolling";
import { SITE_URL } from "@/config/site";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Figtree, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";

// 定义字体
const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

// 构建时（Build Time）告诉 Next.js：“我有 en, zh-CN, zh-TW, ja, ko 这几种语言，请把它们全部预渲染成静态 HTML”。
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// 根据当前的 locale，它去翻译文件的 Metadata 命名空间下寻找 title 和 description，让搜索引擎在不同语言下看到不同的网页标题。
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const title = t("title");
  const description = t("description");
  const url = getPathname({ href: "/", locale });

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, getPathname({ href: "/", locale: l })]),
        ),
        "x-default": getPathname({ href: "/", locale: routing.defaultLocale }),
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName: "Weihang Li",
      title,
      description,
      locale: locale.replace("-", "_"),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${figtree.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          <SmoothScrolling>
            <NavOverlay />
            {children}
          </SmoothScrolling>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}