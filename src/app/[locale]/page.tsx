import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SelectedWorksSection from "@/components/sections/SelectedWorksSection";
import WhatIDoSection from "@/components/sections/WhatIDoSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";
import PageIntro from "@/components/layout/PageIntro";
import { setRequestLocale } from "next-intl/server";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative">
      <PageIntro />
      <HeroSection />
      <WhatIDoSection />
      <SelectedWorksSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
