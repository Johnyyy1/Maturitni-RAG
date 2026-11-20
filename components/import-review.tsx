"use client";

import { Circle, CircleAlert, CircleCheck, CircleDot, FileSpreadsheet, Lock, LockOpen, Plus, RefreshCw, X, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { IconSwap } from "@/components/ui/icon-swap";
import { useState } from "react";
import { Breadcrumb } from "@/components/question";
import { TopBar } from "@/components/shell/app-shell";
import { Chip } from "@/components/ui/bits";
import { GlassButton, PrimaryPill } from "@/components/ui/buttons";
import { plural } from "@/lib/plural";
import { cn } from "@/lib/cn";
import type { ImportJob } from "@/lib/types";

const steps: { label: string; state: "done" | "current" | "todo" }[] = [
  { label: "Soubor", state: "done" },
  { label: "Rozbor", state: "done" },
  { label: "Validace", state: "current" },
  { label: "Publikace", state: "todo" },
];
const stepIcon: Record<string, LucideIcon> = { done: CircleCheck, current: CircleDot, todo: Circle };

/** Frame 35 (editor workspace). */
export function ImportReview({ job }: { job: ImportJob }) {
  const reduce = useReducedMotion();
  const [onlyErrors, setOnlyErrors] = useState(false);
  const errors = job.rows.filter((r) => r.error).length;
  const rows = onlyErrors ? job.rows.filter((r) => r.error) : job.rows;
  const errorsLabel = plural(errors, "chybu", "chyby", "chyb");

  return (
    <div className="flex min-h-dvh flex-col px-4 pt-3 lg:px-10 lg:pt-[22px]">
      <TopBar>
        <Breadcrumb items={[{ label: "Importy" }, { label: `Import č. ${job.id}` }]} />
        <div className="flex-1" />
        <GlassButton icon={X} aria-disabled title="Rušení importu připravujeme">
          Zrušit import
        </GlassButton>
      </TopBar>

      <header className="mt-[30px] flex flex-wrap items-end gap-4">
        <div className="flex flex-1 flex-col gap-2.5">
          <div className="flex flex-wrap gap-1.5">
            <Chip icon={FileSpreadsheet}>{job.file}</Chip>
            <Chip>{job.pkg}</Chip>
          </div>
          <h1 className="text-[30px] font-semibold tracking-[-0.8px] lg:text-[36px] lg:tracking-[-1px]">Kontrola importu</h1>
        </div>
        <ol aria-label="Postup importu" className="glass flex h-11 max-w-full items-center gap-0.5 overflow-x-auto rounded-full px-1.5 [--g-b:20px] [--g-blur:24px] [--g-y:6px]">
          {steps.map((step) => {
            const s = !errors && step.state === "current" ? { ...step, state: "done" } : !errors && step.state === "todo" ? { ...step, state: "current" } : step;
            const Icon = stepIcon[s.state];
            return (
              <li
                key={s.label}
                aria-current={s.state === "current" ? "step" : undefined}
                className={cn(
                  "relative flex h-8 items-center gap-1.5 rounded-full pr-3 pl-2 text-[13px]",
                  s.state === "current" ? "font-semibold" : "font-medium",
                  s.state === "todo" && "text-muted",
                )}
              >
                {s.state === "current" && <motion.span layoutId="import-step" transition={reduce ? { duration: 0 } : undefined} className="raised absolute inset-0 rounded-full" aria-hidden />}
                <Icon size={14} strokeWidth={2} className={cn("relative", s.state === "done" ? "text-success" : s.state === "current" ? "text-accent" : "text-muted")} aria-hidden />
                <span className="relative">{s.label}</span>
                {s.state === "done" && <span className="sr-only"> (hotovo)</span>}
              </li>
            );
          })}
        </ol>
      </header>

      <ul aria-label="Souhrn importu" className="mt-10 grid gap-3.5 sm:grid-cols-3">
        <Stat value={job.newCount} label="Nových otázek" icon={Plus} />
        <Stat value={job.updatedCount} label="Aktualizovaných" icon={RefreshCw} />
        <Stat value={errors} label="Chyby k opravě" icon={CircleAlert} error />
      </ul>

      <div className="surface mt-6 overflow-x-auto rounded-[22px] p-2">
        <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
          <caption className="sr-only">Otázky v importu</caption>
          <thead>
            <tr className="h-11 text-[12px] font-semibold text-muted">
              <th className="px-4 font-semibold">Otázka</th>
              <th className="w-[150px] px-1.5 font-semibold">Předmět</th>
              <th className="w-[140px] px-1.5 font-semibold">Změna</th>
              <th className="w-[260px] px-1.5 font-semibold">Stav</th>
              <th className="w-[106px] pr-4 pl-1.5 font-semibold">Verze</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.title} className={cn("row h-14 hover:bg-hover [&>*:first-child]:rounded-l-[14px] [&>*:last-child]:rounded-r-[14px]", r.error && "bg-warning-soft [&>*]:bg-warning-soft")}>
                <th scope="row" className="px-4 text-[14px] font-medium">
                  {r.title}
                </th>
                <td className="px-1.5 text-[13px] text-muted">{r.subject}</td>
                <td className="px-1.5">{r.change === "new" ? <Chip tone="accent">Nová</Chip> : <Chip>Aktualizace</Chip>}</td>
                <td className="px-1.5">
                  <span className={cn("flex items-center gap-1.5 text-[13px]", r.error ? "font-semibold text-error" : "font-medium text-muted")}>
                    {r.error ? <CircleAlert size={15} strokeWidth={2} aria-hidden /> : <CircleCheck size={15} strokeWidth={2} className="text-success" aria-hidden />}
                    {r.error ?? "Bez chyb"}
                  </span>
                </td>
                <td className="tnum pr-4 pl-1.5 text-[13px] text-muted">{r.version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex-1" />
      <div
        role="status"
        className="scroll-lift glass sticky bottom-6 z-20 mx-auto mt-4 mb-6 flex min-h-16 w-full max-w-[810px] items-center gap-3 rounded-full py-2 pr-2.5 pl-[22px] [--g-b:30px]"
      >
        <IconSwap state={errors ? "locked" : "ready"}>
          {errors ? <Lock size={16} className="text-warning" aria-hidden /> : <LockOpen size={16} className="text-success" aria-hidden />}
        </IconSwap>
        <div className="flex flex-1 flex-col gap-px">
          <p className={cn("text-[14px] font-semibold transition-colors duration-(--dur-hover) ease-[ease]", !errors && "text-success")}>
            {errors ? "Publikace je zablokovaná" : "Import je připravený k publikaci"}
          </p>
          {errors > 0 && <p className="text-[13px] text-muted">Oprav {errorsLabel}. Studenti uvidí jen ověřené otázky.</p>}
        </div>
        {errors > 0 && (
          <PrimaryPill arrow size={44} aria-pressed={onlyErrors} onClick={() => {
            if (!onlyErrors) toast.warning("Import zablokován");
            setOnlyErrors(!onlyErrors);
          }}>
            {onlyErrors ? "Zobrazit vše" : `Zkontrolovat ${errorsLabel}`}
          </PrimaryPill>
        )}
      </div>
    </div>
  );
}

function Stat({ value, label, icon: Icon, error }: { value: number; label: string; icon: LucideIcon; error?: boolean }) {
  return (
    <li className="surface flex items-center gap-3.5 rounded-[20px] px-5 py-[18px]">
      <p className="flex flex-1 flex-col gap-0.5">
        <span className={cn("tnum text-[28px] font-semibold tracking-[-0.7px]", error && "text-error")}>{value}</span>
        <span className="text-[13px] text-muted">{label}</span>
      </p>
      <Icon size={20} strokeWidth={1.5} className={error ? "text-error" : "text-strong"} aria-hidden />
    </li>
  );
}
