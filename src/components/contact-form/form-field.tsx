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
  rows = 4,
  ...props
}: FormFieldProps) {
  const baseClass = cn(
    "w-full resize-none border-0 border-b bg-transparent px-0 py-4 text-lg sm:text-xl tracking-tight text-secondary-foreground placeholder:text-secondary-foreground/35 transition-colors duration-300 focus:outline-none",
    error
      ? "border-destructive"
      : "border-secondary-foreground/20 hover:border-secondary-foreground/40 focus:border-secondary-foreground",
  );

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
          "text-destructive text-sm mt-2 h-4 transition-opacity duration-300",
          error ? "opacity-100" : "opacity-0",
        )}
      >
        {error ?? " "}
      </p>
    </div>
  );
}
