import { CountUp } from "@/components/ui/count-up";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Finished session (frame 33): badge, headline, three stats, next actions. */
export function DoneCard({
  title,
  text,
  stats,
  actions,
  celebrate = false,
}: {
  title: string;
  text: string;
  stats: { value: number; label: string; tone?: "success" | "warning" }[];
  actions: ReactNode;
  celebrate?: boolean;
}) {
  return (
    <section aria-labelledby="hotovo" className="surface flex w-full max-w-[560px] flex-col items-center rounded-[32px] px-6 pt-11 pb-9 text-center lg:px-10">
      <span className="flex size-[72px] items-center justify-center rounded-full bg-success-soft text-success">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m5 12 4 4L19 6" pathLength={1} strokeDasharray="1 1" className={celebrate ? "badge-draw" : undefined} />
        </svg>
      </span>
      <h1 id="hotovo" className="mt-5 text-[30px] font-semibold tracking-[-0.8px]">
        {title}
      </h1>
      <p className="mt-2 text-[16px] text-muted">{text}</p>
      <dl className="mt-7 grid w-full grid-cols-3 gap-2.5 text-left">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse gap-0.5 rounded-[18px] bg-hover p-4">
            <dt className="text-[13px] text-muted">{s.label}</dt>
            <dd className={cn("tnum text-[26px] font-semibold tracking-[-0.6px]", s.tone === "success" && "text-success", s.tone === "warning" && "text-warning")}>
              {celebrate ? <CountUp value={s.value} /> : s.value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-7 flex flex-wrap justify-center gap-2.5">{actions}</div>
    </section>
  );
}
