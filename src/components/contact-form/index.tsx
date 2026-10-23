"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { CONTACT_LIMITS, contactSchema, type ContactInput } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";
import { FormField } from "./form-field";
import { FormSubmitButton } from "./form-button";
import { FormStatusOverlay } from "./form-status";

type FormState = Required<ContactInput>;

const fields = contactSchema.shape;
const isValid = (field: keyof typeof fields, value: string) =>
  fields[field].safeParse(value).success;

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const t = useTranslations("Form");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormState>({
    defaultValues: { name: "", email: "", message: "", website: "" },
  });

  const [status, setStatus] = useState<SubmitStatus>("idle");

  const onSubmit = async (data: FormState) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={cn(
          "space-y-1 sm:space-y-4 transition-opacity duration-300",
          status === "success" || status === "error"
            ? "opacity-0 pointer-events-none"
            : "opacity-100",
        )}
      >
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] size-px opacity-0"
          {...register("website")}
        />

        <FormField
          placeholder={t("namePlaceholder")}
          aria-label={t("namePlaceholder")}
          maxLength={CONTACT_LIMITS.name}
          {...register("name", {
            validate: (v) => isValid("name", v) || t("nameRequired"),
          })}
          error={errors.name?.message}
        />

        <FormField
          type="email"
          placeholder={t("emailPlaceholder")}
          aria-label={t("emailPlaceholder")}
          maxLength={CONTACT_LIMITS.email}
          {...register("email", {
            required: t("emailRequired"),
            validate: (v) => isValid("email", v) || t("emailInvalid"),
          })}
          error={errors.email?.message}
        />

        <FormField
          placeholder={t("messagePlaceholder")}
          aria-label={t("messagePlaceholder")}
          maxLength={CONTACT_LIMITS.message}
          textarea
          {...register("message", {
            validate: (v) => isValid("message", v) || t("messageRequired"),
          })}
          error={errors.message?.message}
        />

        <FormSubmitButton loading={isSubmitting} />
      </form>

      {(status === "success" || status === "error") && (
        <FormStatusOverlay
          status={status}
          onReset={() => {
            setStatus("idle");
            reset();
          }}
        />
      )}
    </div>
  );
}
