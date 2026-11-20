"use client";

import { Check, LoaderCircle, ChevronsUpDown, CircleCheck, CircleX, CloudCheck, Eye, EyeOff, Mic, X } from "lucide-react";
import { Select } from "@base-ui/react/select";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { IconSwap } from "@/components/ui/icon-swap";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState, type FormEvent } from "react";
import { ActionBar, capsule, FocusBar } from "@/components/focus";
import { GlassButton, GlassIconButton, PrimaryPill } from "@/components/ui/buttons";
import { Sheet } from "@/components/ui/sheet";
import { submitAttempt } from "@/lib/api";
import { questionHref } from "@/lib/mock/questions";
import { plural } from "@/lib/plural";
import { cn } from "@/lib/cn";
import type { ExamNumber, Question } from "@/lib/types";

function useElapsed() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setS((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function readDraft(key: string) {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

export function ExamView({ question }: { question: Question }) {
  const exam = question.exam;
  const [showTime, setShowTime] = useState(false);
  const elapsed = useElapsed();

  return (
    <>
      <FocusBar
        left={<GlassIconButton href={questionHref(question)} icon={X} label="Ukončit pokus" size={44} />}
        center={
          <div className={capsule}>
            <span aria-hidden className="live size-2 shrink-0 rounded-full bg-error" />
            <span className="font-semibold whitespace-nowrap">Zkouška nanečisto</span>
            <span className="hidden truncate font-medium text-muted lg:inline">{exam.label}</span>
          </div>
        }
        right={
          <span className="hidden lg:contents">
          <button
            type="button"
            aria-pressed={showTime}
            onClick={() => setShowTime((v) => !v)}
            aria-label={showTime ? "Skrýt čas" : "Zobrazit čas"}
            className={cn(capsule, "press gap-2 pr-4")}
          >
            {showTime ? <Eye size={16} strokeWidth={1.5} className="text-muted" aria-hidden /> : <EyeOff size={16} strokeWidth={1.5} className="text-muted" aria-hidden />}
            <span className="tnum font-semibold">{showTime ? elapsed : "Čas skrytý"}</span>
          </button>
          </span>
        }
      />
      {exam.type === "text" ? <TextTask question={question} /> : <NumberTask question={question} exam={exam} />}
    </>
  );
}

function TextTask({ question }: { question: Question }) {
  const exam = question.exam;
  const router = useRouter();
  const key = `koncept:${question.subject}/${question.id}`;
  const [text, setText] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [submission, setSubmission] = useState<"idle" | "sending" | "sent">("idle");
  const [confirming, setConfirming] = useState(false);
  const reduce = useReducedMotion();
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const fieldId = useId();

  // Restore the draft after hydration (localStorage is not available on the server).
  useEffect(() => {
    const draft = readDraft(key);
    if (draft) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage after hydration
      setText(draft);
      setSaveState("saved");
    }
  }, [key]);

  useEffect(() => {
    if (saveState !== "saving") return;
    const t = setTimeout(() => {
      try {
        if (text) localStorage.setItem(key, text);
        else localStorage.removeItem(key);
        setSaveState(text ? "saved" : "idle");
      } catch {
        setSaveState("idle");
      }
    }, 2000);
    return () => clearTimeout(t);
  }, [text, key, saveState]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (words && submission === "idle") setConfirming(true);
  }

  async function send() {
    setConfirming(false);
    setSubmission("sending");
    try {
      const { attempt } = await submitAttempt(question.subject, question.id, text);
      setSubmission("sent");
      setSaveState("idle");
      try {
        localStorage.removeItem(key);
      } catch {}
      router.push(questionHref(question, `rozbor/${attempt}`));
    } catch {
      setSubmission("idle");
      toast.error("Odpověď se nepodařilo odevzdat");
    }
  }

  function submitButton(size: 44 | 52) {
    return (
      <motion.div layout={reduce ? false : "size"} className={size === 52 ? cn("ml-auto flex justify-end lg:hidden", submission === "idle" && "flex-1") : "hidden lg:flex"}>
        <PrimaryPill type="submit" size={size} full={size === 52 && submission === "idle"} disabled={!words || submission !== "idle"}
          aria-label={submission === "sending" ? "Odevzdávám odpověď" : submission === "sent" ? "Odpověď odevzdána" : "Odevzdat odpověď"}
          aria-busy={submission === "sending"}>
          {submission === "idle" ? "Odevzdat odpověď" : (
            <IconSwap state={submission}>
              {submission === "sending" ? <LoaderCircle size={18} className="spin" aria-hidden /> : <Check size={18} aria-hidden />}
            </IconSwap>
          )}
        </PrimaryPill>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="flex w-full flex-1 flex-col items-center gap-6 pb-6 lg:pt-5">
      <section
        aria-labelledby="ukol"
        className="flex h-[calc(100dvh-190px-var(--safe-t)-var(--chrome-b))] max-h-[600px] min-h-[360px] w-full max-w-[780px] flex-col lg:surface lg:h-[min(648px,calc(100dvh-252px))] lg:max-h-none lg:rounded-[30px] lg:px-11 lg:pt-10 lg:pb-7"
      >
        <p className="text-[13px] font-semibold text-accent lg:hidden">{exam.label}</p>
        <h1 id="ukol" className="mt-2 text-[28px] leading-[1.1] font-bold tracking-[-0.7px] lg:mt-0 lg:text-[32px] lg:font-semibold lg:tracking-[-0.9px]">
          {exam.title}
        </h1>
        <p className="mt-2.5 text-[16px] leading-[1.5] text-muted lg:mt-3 lg:text-[17px]">{exam.prompt}</p>
        <div className="surface mt-[18px] flex flex-1 flex-col rounded-[22px] p-[18px] lg:mt-6 lg:rounded-[18px] lg:bg-app lg:px-5 lg:shadow-[inset_0_0_0_1px_var(--ring-strong)]">
          <label htmlFor={fieldId} className="sr-only">
            Tvoje odpověď
          </label>
          <textarea
            id={fieldId}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setSaveState("saving");
            }}
            placeholder="Napiš odpověď vlastními slovy…"
            className="flex-1 resize-none bg-transparent text-[16px] leading-[1.6] text-fg outline-none placeholder:text-muted lg:text-[17px]"
          />
          <div className="flex items-center gap-1.5 pt-2 text-[12px] text-muted lg:hidden">
            <EyeOff size={14} strokeWidth={1.5} aria-hidden />
            <span className="flex-1">Čas se měří na pozadí</span>
            <span className="tnum font-medium">{plural(words, "slovo", "slova", "slov")}</span>
          </div>
        </div>
        <div className="mt-3.5 hidden items-center gap-4 text-[13px] text-muted lg:flex">
          <span className="flex flex-1 items-center gap-1.5" aria-live="polite">
            {saveState !== "idle" && (
              <>
                <IconSwap state={saveState}>
                  {saveState === "saved" ? <CloudCheck size={15} className="text-success" aria-hidden /> : <LoaderCircle size={15} className="spin" aria-hidden />}
                </IconSwap>
                {saveState === "saved" ? "Uloženo průběžně" : "Ukládám…"}
              </>
            )}
          </span>
          <span className="tnum font-medium">{plural(words, "slovo", "slova", "slov")}</span>
        </div>
      </section>

      <ActionBar label="Odevzdání" className="lg:pl-3.5">
        <span className="hidden lg:contents">
          <GlassIconButton icon={Mic} label="Diktovat" size={44} variant="plain" aria-disabled />
        </span>
        <span className="hidden flex-1 text-[13px] text-muted lg:block">Po odevzdání uvidíš rozbor</span>
        <span className="lg:hidden">
          <GlassIconButton icon={Mic} label="Diktovat" size={52} variant="plain" iconSize={20} aria-disabled />
        </span>
        {submitButton(44)}
        {submitButton(52)}
      </ActionBar>

      <Sheet open={confirming} onClose={() => setConfirming(false)} label="Odevzdat odpověď?">
        <div className="flex flex-col gap-1.5 px-5 pt-2 pb-5">
          <h2 className="text-[22px] font-semibold tracking-[-0.5px]">Odevzdat odpověď?</h2>
          <p className="text-[15px] leading-[1.5] text-muted">
            <span className="tnum font-medium text-fg">{plural(words, "slovo", "slova", "slov")}</span> · Po odevzdání už odpověď neupravíš a otevře se rozbor.
          </p>
          <div className="mt-4 flex gap-2">
            <GlassButton variant="solid" size={44} full className="flex-1" onClick={() => setConfirming(false)}>
              Ještě upravit
            </GlassButton>
            <PrimaryPill size={44} full className="flex-1" onClick={() => void send()}>
              Odevzdat
            </PrimaryPill>
          </div>
        </div>
      </Sheet>
    </form>
  );
}

function NumberTask({ question, exam }: { question: Question; exam: ExamNumber }) {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState(exam.units?.[0]);
  const [work, setWork] = useState("");
  const [result, setResult] = useState<"ok" | "bad" | null>(null);
  const ids = { value: useId(), unit: useId(), work: useId() };
  const parsed = Number(value.replace(",", "."));

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim() || Number.isNaN(parsed)) return;
    setResult(parsed === exam.key.value && unit === exam.key.unit ? "ok" : "bad");
  }

  const field = "w-full rounded-[14px] bg-panel text-fg outline-none shadow-[inset_0_0_0_1px_var(--ring-strong)] focus-visible:shadow-[inset_0_0_0_2px_var(--accent)] focus-visible:outline-none";

  return (
    <form onSubmit={submit} className="flex w-full flex-1 flex-col items-center gap-6 pb-6 lg:pt-5">
      <section aria-labelledby="uloha" className="surface flex w-full max-w-[472px] flex-col rounded-[28px] px-8 pt-8 pb-7">
        <p className="text-[13px] font-semibold text-accent">{exam.label}</p>
        <h1 id="uloha" className="mt-2.5 text-[28px] font-semibold tracking-[-0.7px]">
          {exam.title}
        </h1>
        <p className="mt-2.5 text-[16px] leading-[1.55] text-muted">{exam.prompt}</p>
        <div className="mt-6 flex gap-2.5">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor={ids.value} className="text-[13px] font-semibold">
              Výsledek
            </label>
            <input
              id={ids.value}
              inputMode="decimal"
              autoComplete="off"
              value={value}
              disabled={!!result}
              onChange={(e) => setValue(e.target.value)}
              aria-invalid={result === "bad"}
              className={cn(field, "tnum h-[52px] px-4 text-[20px] font-semibold")}
            />
          </div>
          {exam.units && (
          <div className="flex w-[120px] flex-col gap-2">
            <label htmlFor={ids.unit} className="text-[13px] font-semibold">
              Jednotka
            </label>
            <Select.Root value={unit} disabled={!!result} onValueChange={(next) => { if (next) setUnit(next); }}>
              <Select.Trigger id={ids.unit} className={cn(field, "flex h-[52px] items-center justify-between px-4 text-[16px] font-medium")}>
                <Select.Value />
                <Select.Icon><ChevronsUpDown size={14} className="text-muted" aria-hidden /></Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Positioner alignItemWithTrigger={false} sideOffset={6} className="z-50">
                  <Select.Popup className="popover solid min-w-(--anchor-width) rounded-xl p-1 shadow-[0_10px_30px_var(--glass-shadow)]">
                    <Select.List>
                      {exam.units.map((u) => (
                        <Select.Item key={u} value={u} className="row flex h-10 items-center justify-between gap-2 rounded-lg px-3 data-highlighted:bg-hover">
                          <Select.ItemText>{u}</Select.ItemText>
                          <Select.ItemIndicator><Check size={14} aria-hidden /></Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.List>
                  </Select.Popup>
                </Select.Positioner>
              </Select.Portal>
            </Select.Root>
          </div>
          )}
        </div>
        <div className="mt-[18px] flex flex-col gap-2">
          <label htmlFor={ids.work} className="flex gap-1.5 text-[13px]">
            <span className="font-semibold">Postup</span>
            <span className="text-muted">nepovinné</span>
          </label>
          <textarea
            id={ids.work}
            value={work}
            disabled={!!result}
            onChange={(e) => setWork(e.target.value)}
            className={cn(field, "h-[120px] resize-none bg-app px-4 py-3.5 text-[16px]")}
          />
        </div>
      </section>

      <ActionBar label="Odevzdání" className="max-w-[472px] lg:pl-[22px]">
        <span aria-live="polite" className="flex flex-1 items-center gap-1.5 pl-3 text-[13px] text-muted lg:pl-0">
          {result === "ok" && (
            <>
              <CircleCheck size={16} strokeWidth={2} className="text-success" aria-hidden />
              <span className="font-semibold text-success">Správně</span> · podle klíče
            </>
          )}
          {result === "bad" && (
            <>
              <CircleX size={16} strokeWidth={2} className="text-error" aria-hidden />
              <span className="font-semibold text-error">Nesprávně</span>
              <span className="tnum">
                · správně je {[exam.key.value, exam.key.unit].filter(Boolean).join(" ")}
              </span>
            </>
          )}
          {!result && "Po odevzdání uvidíš rozbor"}
        </span>
        {result ? (
          <PrimaryPill href={questionHref(question)} size={44} arrow>
            Zpět na otázku
          </PrimaryPill>
        ) : (
          <PrimaryPill type="submit" size={44} disabled={!value.trim()}>
            Odevzdat
          </PrimaryPill>
        )}
      </ActionBar>
    </form>
  );
}
