"use client";

import { motion } from "motion/react";
import { useLayoutEffect, useRef, useState, type Ref } from "react";
import { cn } from "@/lib/utils";

type CounterProps = {
  value: number;
  duration?: number;
  digits?: number;
  className?: string;
  digitClassName?: string;
};

function Digit({
  value,
  height,
  duration,
  digitClassName,
  measureRef,
}: {
  value: number;
  height: number;
  duration: number;
  digitClassName?: string;
  measureRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      className={cn("overflow-y-clip", digitClassName, "leading-[0.8]")}
      style={{ height: height || "auto" }}
    >
      <motion.div
        animate={{ y: height ? -value * height : 0 }}
        transition={{ type: "tween", duration, ease: "easeInOut" }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <div
            key={n}
            ref={n === 0 ? measureRef : undefined}
            className="flex items-center justify-center"
          >
            {n}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Counter({
  value,
  duration = 0.8,
  digits = 2,
  className,
  digitClassName,
}: CounterProps) {
  const [height, setHeight] = useState(0);
  const measureRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const updateHeight = () => {
      if (!measureRef.current) return;
      setHeight(measureRef.current.getBoundingClientRect().height);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [digitClassName]);

  const digitList = String(value)
    .padStart(digits, "0")
    .slice(-digits)
    .split("");

  return (
    <div className={cn("flex", className)} aria-hidden="true">
      {digitList.map((d, i) => (
        <Digit
          key={i}
          value={Number(d)}
          height={height}
          duration={duration}
          digitClassName={digitClassName}
          measureRef={i === 0 ? measureRef : undefined}
        />
      ))}
    </div>
  );
}
