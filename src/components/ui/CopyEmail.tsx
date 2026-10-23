"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyEmailProps {
  email: string;
  copyLabel: string;
  className?: string;
  linkClassName?: string;
}

export function CopyEmail({ email, copyLabel, className, linkClassName }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
  };

  return (
    <div className={cn("flex items-center gap-x-3", className)}>
      <a href={`mailto:${email}`} className={cn("transition-opacity hover:opacity-70", linkClassName)}>
        {email}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copyLabel}
        className="grid size-8 shrink-0 place-items-center rounded-full border border-current/20 opacity-60 transition hover:opacity-100 cursor-pointer"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "check" : "copy"}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {copied ? <Check size={14} className="text-live" /> : <Copy size={14} />}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
