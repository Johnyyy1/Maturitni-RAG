"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { spring } from "@/lib/motion";

/** ProgressSteps: 6px dots, the current one stretched to 20px. */
export function ProgressDots({ total, current, results, instant }: { total: number; current: number; results: ("ok" | "bad" | undefined)[]; instant?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <span className="flex items-center gap-1" role="img" aria-label={`Otázka ${current + 1} z ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <motion.span
          key={i}
          layout={total <= 30 && !instant && !reduce}
          transition={spring}
          className={cn(
            "h-1.5 rounded-[3px]",
            !instant && "transition-colors duration-(--dur-hover) ease-[ease]",
            i === current ? "w-5" : "w-1.5",
            results[i] === "ok" ? "bg-success" : results[i] === "bad" ? "bg-error" : i === current ? "bg-accent" : "bg-ring-strong",
          )}
        />
      ))}
    </span>
  );
}
