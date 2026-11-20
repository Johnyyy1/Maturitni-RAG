"use client";

import { useRef } from "react";
import { Check, CircleCheck, CircleX } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { iconSwap } from "@/lib/motion";
import { cn } from "@/lib/cn";

export type OptionState = "idle" | "selected" | "correct" | "wrong" | "dimmed";

/** OptionRow: an answer with its key (A–D). A native radio keeps it accessible. */
export function OptionRow({
  name,
  value,
  label,
  state,
  disabled,
  onSelect,
  instant,
}: {
  name: string;
  value: string;
  label: string;
  state: OptionState;
  disabled?: boolean;
  onSelect?: (instant: boolean) => void;
  instant?: boolean;
}) {
  const reduce = useReducedMotion();
  const pointer = useRef(false);
  const strong = state === "selected" || state === "correct" || state === "wrong";
  return (
    <label
      onPointerDown={() => { pointer.current = true; }}
      onKeyDown={() => { pointer.current = false; }}
      className={cn(
        "flex min-h-[60px] items-center gap-3.5 rounded-2xl py-3 pr-[18px] pl-3 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
        state === "idle" && "row bg-panel shadow-[inset_0_0_0_1px_var(--ring-strong)] hover:bg-hover",
        state === "dimmed" && "bg-panel opacity-55 shadow-[inset_0_0_0_1px_var(--ring-strong)]",
        state === "selected" && "bg-soft shadow-[inset_0_0_0_1.5px_var(--accent)]",
        state === "correct" && "bg-success-soft shadow-[inset_0_0_0_1.5px_var(--success)]",
        state === "wrong" && "bg-error-soft shadow-[inset_0_0_0_1.5px_var(--error)]",
        disabled && !instant && "option-result",
        disabled ? "cursor-default" : "cursor-pointer",
      )}
    >
      <input type="radio" name={name} value={value} checked={state === "selected"} disabled={disabled} onChange={() => { onSelect?.(!pointer.current); pointer.current = false; }} className="sr-only" />
      <kbd
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-[10px] text-[13px] font-semibold",
          !instant && "option-key",
          state === "selected" && "bg-accent text-on-accent",
          state === "correct" && "bg-success text-white dark:text-[#0E1220]",
          state === "wrong" && "bg-error text-white dark:text-[#0E1220]",
          (state === "idle" || state === "dimmed") && "bg-hover text-muted",
        )}
      >
        {value}
      </kbd>
      <span className={cn("flex-1 text-[16px]", strong ? "font-semibold" : "font-medium")}>{label}</span>
      {state === "selected" && (
        <motion.span {...iconSwap} initial={instant ? false : reduce ? { opacity: 0 } : iconSwap.initial}>
          <Check size={18} strokeWidth={2} className="text-accent" aria-hidden />
        </motion.span>
      )}
      {state === "correct" && <CircleCheck size={18} strokeWidth={2} className="text-success" aria-label="Správná odpověď" />}
      {state === "wrong" && <CircleX size={18} strokeWidth={2} className="text-error" aria-label="Tvoje odpověď, nesprávná" />}
    </label>
  );
}
