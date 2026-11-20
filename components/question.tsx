import { ArrowUpRight, Check, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { DataIcon } from "@/components/icon";
import { cn } from "@/lib/cn";
import type { OutlineStep, Source, StepState } from "@/lib/types";

/** Breadcrumb: glass capsule with a back button. */
export function Breadcrumb({ back, items }: { back?: string; items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Drobečková navigace" className={cn("glass-thin flex h-10 min-w-0 items-center gap-1.5 rounded-full pr-3.5", back ? "pl-1.5" : "pl-4")}>
      {back && (
        <Link href={back} aria-label="Zpět" title="Zpět" className="hit press flex size-7 shrink-0 items-center justify-center rounded-full bg-ring text-fg">
          <ChevronLeft size={16} strokeWidth={2} aria-hidden />
        </Link>
      )}
      <ol className="flex min-w-0 items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={item.label}>
              {i > 0 && <ChevronRight size={12} strokeWidth={1.5} className="shrink-0 text-muted" aria-hidden />}
              <li className={cn("truncate text-[13px]", last ? "font-semibold text-fg" : "font-medium text-muted")} aria-current={last ? "page" : undefined}>
                {item.href && !last ? (
                  <Link href={item.href} className="transition-colors duration-(--dur-hover) ease-[ease] hover:text-fg">
                    {item.label}
                  </Link>
                ) : (
                  item.label
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export function StepBadge({ state, n, size = 28 }: { state: StepState; n: number; size?: 26 | 28 }) {
  return (
    <span
      className={cn(
        "tnum flex shrink-0 items-center justify-center rounded-full text-[12px] font-semibold",
        size === 28 ? "size-7" : "size-[26px]",
        state === "done" && "bg-success-soft text-success",
        state === "current" && "bg-accent text-on-accent",
        state === "todo" && "text-muted shadow-[inset_0_0_0_1.5px_var(--ring-strong)]",
      )}
    >
      {state === "done" ? <Check size={size === 28 ? 14 : 13} strokeWidth={2.25} aria-label="Hotovo" /> : n}
    </span>
  );
}

/** Study outline. Desktop rows show the guiding question; mobile rows only the title. */
export function OutlineList({ steps, href }: { steps: OutlineStep[]; href: string }) {
  return (
    <ol className="flex flex-col gap-0.5">
      {steps.map((s, i) => (
        <li key={s.title}>
          <Link
            href={href}
            aria-current={s.state === "current" ? "step" : undefined}
            className={cn(
              "flex h-14 items-center gap-3.5 px-4 lg:h-[76px] lg:rounded-[14px] lg:px-3",
              s.state === "current" ? "lg:bg-hover" : "lg:hover:bg-hover",
            )}
          >
            <span className="lg:hidden">
              <StepBadge state={s.state} n={i + 1} size={26} />
            </span>
            <span className="hidden lg:block">
              <StepBadge state={s.state} n={i + 1} />
            </span>
            <span className="flex flex-1 flex-col gap-[3px]">
              <span className={cn("text-[16px] lg:text-[15px]", s.state === "current" ? "font-semibold" : "font-medium")}>{s.title}</span>
              <span className="hidden text-[13px] text-muted lg:block">{s.question}</span>
            </span>
            {s.state === "current" && <span className="hidden text-[13px] font-semibold text-accent lg:inline">Pokračovat</span>}
            <ChevronRight size={16} strokeWidth={1.5} className="text-strong" aria-hidden />
          </Link>
        </li>
      ))}
    </ol>
  );
}

export function SourceList({ sources, href }: { sources: Source[]; href: string }) {
  return (
    <ul className="flex flex-col gap-0.5">
      {sources.map((s) => (
        <li key={s.n}>
          <Link href={`${href}#zdroj-${s.n}`} className="row flex h-[58px] items-center gap-3.5 rounded-[14px] px-3 hover:bg-hover">
            <DataIcon name={s.icon} size={18} className="text-muted" />
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-[14px] font-medium">{s.title}</span>
              <span className="text-[13px] text-muted">{s.listMeta}</span>
            </span>
            <ArrowUpRight size={16} strokeWidth={1.5} className="text-strong" aria-hidden />
          </Link>
        </li>
      ))}
    </ul>
  );
}
