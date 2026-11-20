"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { dur, ease, iconSwap } from "@/lib/motion";

export function IconSwap({ state, children, instant }: { state: string; children: ReactNode; instant?: boolean }) {
  const reduce = useReducedMotion();
  if (instant) return <span className="inline-flex shrink-0">{children}</span>;

  return (
    <span className="inline-grid shrink-0 place-items-center">
      <AnimatePresence initial={false}>
        <motion.span
          key={state}
          {...iconSwap}
          initial={reduce ? { opacity: 0 } : iconSwap.initial}
          exit={{ ...(reduce ? { opacity: 0 } : iconSwap.exit), transition: { duration: dur.exit, ease: ease.out } }}
          className="col-start-1 row-start-1"
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
