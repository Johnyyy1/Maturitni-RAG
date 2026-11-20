"use client";

import { animate, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { dur, ease } from "@/lib/motion";

export function CountUp({ value }: { value: number }) {
  const visual = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = visual.current;
    if (!node || reduce !== false) return;
    const animation = animate(0, value, {
      duration: dur.draw,
      ease: ease.out,
      onUpdate: (current) => { node.textContent = String(Math.round(current)); },
    });
    return () => animation.stop();
  }, [value, reduce]);

  return <><span className="sr-only">{value}</span><span ref={visual} aria-hidden>{value}</span></>;
}
