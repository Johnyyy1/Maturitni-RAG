"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Item = { label: string; value: string; href?: string };

/**
 * GlassSegmented. `glass` sits in chrome (40 high, segments 32); `solid` is the form control
 * inside content (44 high, segments 36, fills the width).
 */
export function Segmented({
  items,
  value,
  onChange,
  label,
  material = "glass",
  className,
}: {
  items: Item[];
  value: string;
  onChange?: (value: string) => void;
  label: string;
  material?: "glass" | "solid";
  className?: string;
}) {
  const id = useId();
  const reduce = useReducedMotion();
  const isNav = items.some((i) => i.href);
  const solid = material === "solid";

  const Wrapper = isNav ? "nav" : "div";
  return (
    <Wrapper
      aria-label={label}
      role={isNav ? undefined : "radiogroup"}
      className={cn(
        "flex items-center gap-0.5 rounded-full p-1",
        solid ? "h-11 w-full bg-hover" : "glass-thin h-10",
        className,
      )}
    >
      {items.map((item) => {
        const active = item.value === value;
        const inner = (
          <>
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                transition={reduce ? { duration: 0 } : spring}
                className="raised absolute inset-0 rounded-full"
              />
            )}
            <span className="relative">{item.label}</span>
          </>
        );
        const cls = cn(
          "relative transition-colors duration-(--dur-hover) ease-[ease] inline-flex items-center justify-center rounded-full whitespace-nowrap",
          solid ? "tnum h-9 flex-1 text-[14px]" : "h-8 px-3.5 text-[13px]",
          active ? "font-semibold text-fg" : "font-medium text-muted hover:text-fg",
        );
        return item.href ? (
          <Link key={item.value} href={item.href} aria-current={active ? "page" : undefined} className={cls}>
            {inner}
          </Link>
        ) : (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange?.(item.value)}
            className={cls}
          >
            {inner}
          </button>
        );
      })}
    </Wrapper>
  );
}
