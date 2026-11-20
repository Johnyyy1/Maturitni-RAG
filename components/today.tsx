import { ChevronRight, History, Layers2 } from "lucide-react";
import Link from "next/link";
import { DataIcon } from "@/components/icon";
import { GlassButton, PrimaryPill } from "@/components/ui/buttons";
import { Card, ProgressTrack } from "@/components/ui/bits";
import { dueItems, subjects, today, week } from "@/lib/mock/subjects";
import { plural } from "@/lib/plural";
import { cn } from "@/lib/cn";
import type { DueStatus } from "@/lib/types";

const dot: Record<DueStatus, string> = { wrong: "bg-error", cards: "bg-warning", planned: "bg-accent" };
const c = today.continueItem;

/** Hero card “Pokračovat” (desktop 21). */
export function HeroDesktop() {
  return (
    <section aria-label="Pokračovat" className="mesh-hero relative h-[280px] overflow-hidden rounded-[28px] text-white shadow-[0_16px_40px_#2B55CC33]">
      <HeroGraph />
      <div className="absolute top-8 left-9 flex h-[216px] w-[520px] max-w-[calc(100%-72px)] flex-col">
        <span className="glass-thin glass-on-hero inline-flex h-7 items-center gap-1.5 self-start rounded-full pr-3 pl-2.5 text-[12px] font-semibold">
          <History size={14} strokeWidth={2} aria-hidden />
          {c.badge}
        </span>
        <h2 className="mt-[18px] text-[36px] leading-[1.1] font-semibold tracking-[-1px]">{c.title}</h2>
        <p className="mt-2 text-[15px] font-medium text-white/72">{c.meta}</p>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <PrimaryPill href={c.href} tone="light" arrow>
            Pokračovat
          </PrimaryPill>
          <GlassButton href="/karticky" icon={Layers2} variant="hero">
            Kartičky k tématu
          </GlassButton>
          <div className="flex flex-col gap-1.5 pl-3">
            <span className="tnum text-[12px] font-semibold">
              {c.stepsDone} z {c.stepsTotal} kroků
            </span>
            <ProgressTrack value={c.stepsDone / c.stepsTotal} className="h-1 w-[120px]" track="bg-white/20" fill="bg-white" label="Postup tématem" animateFill />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Parabola with its vertex, drawn on a 24px grid (decorative). */
function HeroGraph() {
  const xs = Array.from({ length: 20 }, (_, i) => i * 24);
  const ys = Array.from({ length: 12 }, (_, i) => 4 + i * 24);
  return (
    <div aria-hidden className="absolute top-0 right-0 hidden h-[280px] w-[470px] xl:block">
      <svg width="470" height="280" viewBox="0 0 470 280" className="absolute inset-0 overflow-visible">
        {xs.map((x) => (
          <rect key={`x${x}`} x={x} y={0} width={1} height={280} fill="#FFFFFF14" />
        ))}
        {ys.map((y) => (
          <rect key={`y${y}`} x={0} y={y} width={470} height={1} fill="#FFFFFF14" />
        ))}
        <rect x={0} y={220} width={470} height={1} fill="#FFFFFF40" />
        <rect x={240} y={0} width={1} height={280} fill="#FFFFFF40" />
        <path className="today-draw [--d:70ms]" pathLength={1} strokeDasharray="1 1" strokeDashoffset={0} d="M100 -10q140 460 280 0" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
        <circle className="today-materialize [--d:670ms] origin-center [transform-box:fill-box]" cx={240} cy={220} r={4.5} fill="#fff" stroke="var(--hero-a)" strokeWidth={3} />
      </svg>
      <span className="today-materialize glass-thin glass-on-hero absolute [--d:670ms] top-[150px] left-[262px] flex h-9 items-center gap-2 rounded-full px-3.5 [--g-y:6px] [--g-b:18px]">
        <span className="text-[12px] font-medium text-white/70">Vrchol</span>
        <span className="text-[13px] font-semibold text-white">{c.vertex}</span>
      </span>
    </div>
  );
}

/** Hero card “Pokračovat” (mobile 25). */
export function HeroMobile() {
  return (
    <section aria-label="Pokračovat" className="mesh-hero flex flex-col overflow-hidden rounded-[26px] p-5 text-white shadow-[0_12px_30px_#2B55CC40]">
      <span className="glass-thin glass-on-hero inline-flex h-[26px] items-center gap-1.5 self-start rounded-full pr-2.5 pl-2 text-[12px] font-semibold">
        <History size={13} strokeWidth={2} aria-hidden />
        {c.mobileBadge}
      </span>
      <h2 className="mt-3.5 text-[26px] font-semibold tracking-[-0.6px]">{c.title}</h2>
      <p className="tnum mt-1 text-[13px] font-medium text-white/72">{c.mobileMeta}</p>
      <ProgressTrack value={c.stepsDone / c.stepsTotal} className="mt-3.5 h-[5px] w-full" track="bg-white/20" fill="bg-white" label="Postup tématem" animateFill />
      <PrimaryPill href={c.href} tone="light" arrow size={48} full className="mt-[18px] text-[15px]">
        Pokračovat
      </PrimaryPill>
    </section>
  );
}

/** “Dnes k opakování”: one list for both layouts (rows with dividers on mobile, hover rows on desktop). */
export function DueList() {
  return (
    <ul className="flex flex-col">
      {dueItems.map((item, i) => (
        <li key={item.title}>
          {i > 0 && <span aria-hidden className="ml-[50px] block h-px bg-border lg:hidden" />}
          <Link href={item.href} className="row group flex h-[62px] items-center gap-3.5 px-4 lg:h-[60px] lg:rounded-[14px] lg:px-3 lg:hover:bg-hover">
            <DataIcon name={item.icon} size={20} className="size-5 text-muted lg:size-[18px]" />
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-[16px] font-medium lg:text-[14px]">{item.title}</span>
              <span className="flex items-center gap-1.5 text-[13px] text-muted">
                <span aria-hidden className={cn("size-1.5 rounded-full", dot[item.status])} />
                <span className="lg:hidden">{item.mobileStatusLabel}</span>
                <span className="hidden lg:inline">{item.statusLabel}</span>
              </span>
            </span>
            <span className="hidden text-[13px] font-medium text-muted group-hover:text-fg lg:inline">{item.action}</span>
            <ChevronRight size={16} strokeWidth={1.5} className="nudge text-strong lg:text-muted" aria-hidden />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function DueCard({ className }: { className?: string }) {
  return (
    <Card title="Dnes k opakování" meta={plural(dueItems.length, "položka", "položky", "položek")} className={cn("rounded-[22px] pt-5 pr-2 pb-2 pl-2", className)}>
      <DueList />
    </Card>
  );
}

export function SubjectsCard({ className }: { className?: string }) {
  return (
    <Card title="Moje předměty" className={cn("rounded-[22px] pt-5 pr-2 pb-2 pl-2", className)}>
      <ul className="flex flex-col">
        {subjects.map((s) => (
          <li key={s.slug}>
            <Link href={`/predmety/${s.slug}/otazky/${s.firstQuestion}`} className="row flex flex-col gap-2.5 rounded-[14px] p-3 hover:bg-hover">
              <span className="flex items-center gap-3">
                <DataIcon name={s.icon} size={18} className="text-muted" />
                <span className="flex flex-1 flex-col gap-0.5">
                  <span className="text-[14px] font-medium">{s.name}</span>
                  <span className="text-[13px] text-muted">{s.area}</span>
                </span>
                <span className="tnum text-[13px] font-medium text-muted">
                  {s.done} z {s.total}
                </span>
              </span>
              <ProgressTrack value={s.progress} className="h-1.5 w-full" track="bg-hover" label={`${s.name}: ${s.done} z ${s.total} otázek`} />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function WeekCard({ className }: { className?: string }) {
  const max = Math.max(...week.days.map((d) => d.minutes));
  return (
    <Card title="Tento týden" className={cn("rounded-[22px] pt-5 pr-2 pb-2 pl-2", className)}>
      <div className="flex flex-col gap-1 px-3 pt-1">
        <p className="tnum text-[30px] font-semibold tracking-[-0.8px]">{week.total}</p>
        <p className="text-[13px] font-medium text-success">{week.delta}</p>
      </div>
      <div className="min-h-6 flex-1" />
      <ul aria-label="Čas studia po dnech" className="flex h-[170px] items-end gap-2 px-3 pb-3">
        {week.days.map((d, i) => (
          <li key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span
              aria-hidden
              className={cn("today-bar w-full rounded-md", d.today ? "bg-accent" : d.minutes ? "bg-strong" : "bg-hover")}
              style={{ height: d.minutes ? Math.round((d.minutes / max) * 112) : 4, "--d": `${[140, 153, 165, 176, 186, 194, 200][i]}ms` } as React.CSSProperties}
            />
            <span className={cn("text-[11px] font-medium", d.today ? "text-fg" : "text-muted")}>
              {d.label}
              <span className="sr-only">: {d.minutes} min</span>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function MobileSubjects() {
  return (
    <ul className="grid grid-cols-2 gap-2.5">
      {subjects.map((s) => (
        <li key={s.slug}>
          <Link href={`/predmety/${s.slug}/otazky/${s.firstQuestion}`} className="card-link surface flex h-[120px] flex-col gap-1.5 rounded-[22px] p-4">
            <DataIcon name={s.icon} size={20} className="text-accent" />
            <span className="flex-1" />
            <span className="text-[16px] font-semibold">{s.name}</span>
            <span className="tnum text-[13px] text-muted">
              {s.done} z {s.total} otázek
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
