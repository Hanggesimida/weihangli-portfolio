"use client";

import type { InputHTMLAttributes, Ref, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type FormFieldProps = {
  ref?: Ref<HTMLInputElement | HTMLTextAreaElement>;
  placeholder: string;
  error?: string;
  type?: string;
  textarea?: boolean;
  rows?: number;
} & InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;

export function FormField({
  ref,
  placeholder,
  error,
  type = "text",
  textarea = false,
  rows = 5,
  ...props
}: FormFieldProps) {
  const baseClass =
    "w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 focus:border-white/35 text-secondary-foreground placeholder:text-white/30 focus:outline-none focus:ring-3 focus:ring-white/20 transition text-lg sm:text-xl font-mono font-normal tracking-tight";

  return (
    <div>
      {textarea ? (
        <textarea
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          ref={ref as Ref<HTMLTextAreaElement>}
          placeholder={placeholder}
          rows={rows}
          className={baseClass}
        />
      ) : (
        <input
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
          ref={ref as Ref<HTMLInputElement>}
          type={type}
          placeholder={placeholder}
          className={baseClass}
        />
      )}
      <p
        className={cn(
          "text-destructive text-sm mt-0.5 sm:mt-1 h-3 sm:h-4 transition-all duration-300",
          error ? "opacity-100" : "opacity-0",
        )}
      >
        {error ?? " "}
      </p>
    </div>
  );
}
