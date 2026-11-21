import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const tones = {
  warning: "bg-warning-soft text-warning",
  error: "bg-error-soft text-error",
  accent: "bg-soft text-accent",
} as const;

/**
 * EmptyState / ErrorState from frame 39: what happened, what stayed saved, what to do next.
 * `caption` is the small label the design system page shows above each state.
 */
export function StateCard({
  icon: Icon,
  tone,
  avatar,
  title,
  text,
  actions,
  caption,
  role,
  className,
}: (
  | { icon: LucideIcon; tone: keyof typeof tones; avatar?: never }
  | { avatar: ReactNode; icon?: never; tone?: never }
) & {
  title: string;
  text: string;
  actions?: ReactNode;
  caption?: string;
  role?: "alert" | "status";
  className?: string;
}) {
  return (
    <section role={role} aria-label={caption ?? title} className={cn("surface flex flex-col rounded-[26px] p-7", className)}>
      {caption && <p className="text-[12px] font-semibold text-muted">{caption}</p>}
      <div className="min-h-4 flex-1" />
      {avatar ?? (Icon && tone && (
        <span className={cn("flex size-11 items-center justify-center rounded-full", tones[tone])}>
          <Icon size={20} strokeWidth={1.75} aria-hidden />
        </span>
      ))}
      <h2 className="mt-4 text-[22px] font-semibold tracking-[-0.5px]">{title}</h2>
      <p className="mt-1.5 max-w-[440px] text-[15px] leading-[1.5] text-muted">{text}</p>
      {actions && <div className="mt-[18px] flex flex-wrap gap-2">{actions}</div>}
    </section>
  );
}
