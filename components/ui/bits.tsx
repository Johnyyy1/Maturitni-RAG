import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export { ProgressDots } from "./progress-dots";

const chipTones = {
  neutral: "bg-hover text-muted",
  accent: "bg-soft text-accent",
  warning: "bg-warning-soft text-warning",
  success: "bg-success-soft text-success",
} as const;

/** Chip (Štítek): 24 high, 12/600. */
export function Chip({
  icon: Icon,
  dot,
  tone = "neutral",
  className,
  children,
}: {
  icon?: LucideIcon;
  dot?: boolean;
  tone?: keyof typeof chipTones;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span className={cn("inline-flex transition-colors duration-(--dur-hover) ease-[ease] h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-semibold whitespace-nowrap", chipTones[tone], className)}>
      {Icon && <Icon size={13} strokeWidth={2} aria-hidden />}
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}

/** Number badge used inside citation chips and the inspector header. */
export function CitationNumber({ n, active = true, size = 20 }: { n: number; active?: boolean; size?: 16 | 20 }) {
  return (
    <span
      aria-hidden
      className={cn(
        "tnum inline-flex transition-colors duration-(--dur-hover) ease-[ease] shrink-0 items-center justify-center rounded-full font-semibold",
        size === 20 ? "size-5 text-[11px]" : "size-4 text-[10px]",
        active ? "bg-accent text-on-accent" : "bg-strong text-fg",
      )}
    >
      {n}
    </span>
  );
}

/** CitationChip [n]: 30 high. Active when its source is open in the inspector. */
export function CitationChip({
  n,
  label,
  active = true,
  href,
  className,
  ...rest
}: { n: number; label: string; active?: boolean; href?: string } & Omit<ComponentProps<"button">, "children">) {
  const cls = cn(
    "press inline-flex h-[30px] shrink-0 items-center gap-2 self-start rounded-full pr-3 pl-1.5 text-[13px] font-medium whitespace-nowrap",
    active ? "bg-soft text-accent" : "bg-hover text-muted hover:text-fg",
    className,
  );
  // Accessible name starts with the visible label (WCAG 2.5.3).
  const body = (
    <>
      <CitationNumber n={n} active={active} />
      {label}
      <span className="sr-only">(zdroj {n})</span>
    </>
  );
  if (href) {
    return (
      <Link href={href} className={cls}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" {...rest} className={cls}>
      {body}
    </button>
  );
}

/** Keyboard hint (⌘K, ↵, mezerník, 1–3). */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd className={cn("inline-flex h-[22px] shrink-0 items-center justify-center rounded-md bg-ring px-1.5 text-[11px] font-semibold text-muted", className)}>
      {children}
    </kbd>
  );
}

/** Thin progress track. */
export function ProgressTrack({ value, className, fill = "bg-accent", track = "bg-ring-strong", label, animateFill }: { value: number; className?: string; fill?: string; track?: string; label?: string; animateFill?: boolean }) {
  return (
    <span
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      className={cn("block overflow-hidden rounded-[3px]", track, className)}
    >
      <span className={cn("block h-full rounded-[3px]", fill, animateFill && "today-fill")} style={{ width: `${value * 100}%` }} />
    </span>
  );
}

/** ScoreRing: donut with an inner radius of 0.78, sweeping clockwise from the top. */
export function ScoreRing({ value, size = 56, label }: { value: number; size?: 52 | 56; label: string }) {
  const stroke = (size * (1 - 0.78)) / 2;
  const r = (size - stroke) / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--hover)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--accent)" strokeWidth={stroke} pathLength={100} strokeDasharray={`${100 * value} 100`} className="ring-draw" />
    </svg>
  );
}

/** Content card (pevný povrch) with the shared header row. */
export function Card({
  title,
  meta,
  className,
  headerClassName,
  children,
  as: Tag = "section",
}: {
  title?: string;
  meta?: ReactNode;
  className?: string;
  headerClassName?: string;
  children: ReactNode;
  as?: "section" | "div" | "article";
}) {
  return (
    <Tag className={cn("surface flex flex-col", className)} aria-label={title}>
      {title && (
        <div className={cn("flex items-center px-3 pb-3", headerClassName)}>
          <h2 className="flex-1 text-[16px] font-semibold tracking-[-0.2px]">{title}</h2>
          {meta && <span className="tnum text-[13px] font-medium text-muted">{meta}</span>}
        </div>
      )}
      {children}
    </Tag>
  );
}
