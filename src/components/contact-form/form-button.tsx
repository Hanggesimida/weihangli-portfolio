"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Spinner } from "@/components/ui/spinner";

export type FormSubmitButtonProps = {
  loading: boolean;
};

export function FormSubmitButton({ loading }: FormSubmitButtonProps) {
  const t = useTranslations("Form");

  return (
    <button
      type="submit"
      disabled={loading}
      className="group mt-4 inline-flex w-full items-center justify-between gap-2 rounded-full bg-secondary-foreground py-2 pl-7 pr-2 text-base font-semibold tracking-tight text-secondary transition-colors duration-300 hover:bg-white active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed sm:text-lg cursor-pointer"
    >
      {loading ? t("submitSending") : t("submitIdle")}
      <span className="grid size-11 place-items-center rounded-full bg-secondary text-secondary-foreground transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45">
        {loading ? (
          <Spinner className="size-[1.125em] shrink-0" />
        ) : (
          <ArrowUpRight className="size-5" />
        )}
      </span>
    </button>
  );
}
