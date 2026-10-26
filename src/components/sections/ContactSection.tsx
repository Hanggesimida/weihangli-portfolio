import ContactForm from "@/components/contact-form";
import SplitText from "@/components/text/SplitText";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { CONTACT_EMAIL } from "@/config/site";
import { useTranslations } from "next-intl";

export default function ContactSection() {
  const t = useTranslations("Contact");

  return (
    // z-20 so the card slides over About, which is held in place while it recedes.
    // The top margin is the blank space About settles on before Contact arrives (--recede-gap, set in page.tsx).
    <section id="contact" className="relative z-20 mt-(--recede-gap) px-3 pt-3 sm:px-6 sm:pt-6">
      <div className="grid grid-cols-12 gap-y-10 rounded-3xl bg-secondary px-6 py-10 text-secondary-foreground shadow-[inset_0_1px_0_0_rgb(255_255_255/0.1)] sm:gap-y-14 sm:px-10 sm:py-14 md:py-20 lg:gap-x-16 lg:px-16 lg:py-24">
        <div className="col-span-12 flex flex-col justify-between gap-8 sm:gap-12 lg:col-span-7">
          <div className="space-y-5 sm:space-y-8">
            <h2 className="max-w-[12ch] text-[15vw] font-semibold uppercase leading-[0.88] tracking-tighter sm:text-7xl lg:text-[clamp(72px,7.5vw,136px)]">
              <SplitText>{t("heading")}</SplitText>
            </h2>
            <p className="text-xl font-medium tracking-tight text-secondary-foreground/70 sm:text-2xl md:text-3xl">
              {t("subheading")}
            </p>
          </div>

          <div className="space-y-3">
            <span className="eyebrow block text-secondary-foreground/45">{t("direct")}</span>
            <CopyEmail
              email={CONTACT_EMAIL}
              copyLabel={t("copyEmail")}
              linkClassName="break-all text-xl font-medium tracking-tight underline decoration-secondary-foreground/25 underline-offset-[6px] sm:text-2xl lg:text-3xl"
            />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 lg:pt-4">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
