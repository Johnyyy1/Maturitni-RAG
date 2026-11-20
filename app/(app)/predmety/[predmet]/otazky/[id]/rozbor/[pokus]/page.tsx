import { BookOpen, ChevronLeft, CircleAlert, CornerDownRight, Ellipsis, FileCheck, FileText, Info, Minus, Network, Check, Share } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RetryButton } from "@/components/retry";
import { RouteLoading } from "@/components/loading";
import { Breadcrumb } from "@/components/question";
import { TopBar } from "@/components/shell/app-shell";
import { CountUp } from "@/components/ui/count-up";
import { Chip, CitationChip, ScoreRing } from "@/components/ui/bits";
import { GlassButton, GlassIconButton, PrimaryPill } from "@/components/ui/buttons";
import { StateCard } from "@/components/ui/state";
import { getAttempt } from "@/lib/api";
import { loadQuestion } from "@/lib/load";
import { questionHref } from "@/lib/mock/questions";
import { attempts } from "@/lib/mock/study";
import { cn } from "@/lib/cn";
import type { Attempt, Criterion, Question } from "@/lib/types";

type Props = PageProps<"/predmety/[predmet]/otazky/[id]/rozbor/[pokus]">;

export function generateStaticParams() {
  return Object.keys(attempts).map((k) => {
    const [predmet, id, pokus] = k.split("/");
    return { predmet, id, pokus };
  });
}

export const metadata: Metadata = { title: "Rozbor odpovědi" };

export default function ReviewPage(props: Props) {
  return (
    <Suspense fallback={<RouteLoading />}>
      <ReviewContent {...props} />
    </Suspense>
  );
}

async function ReviewContent({ params }: Props) {
  const { question: q } = await loadQuestion(params);
  const { pokus } = await params;
  const attempt = await getAttempt(q.subject, q.id, pokus);
  if (attempt === undefined) notFound();

  const bar = (
    <div className="hidden lg:contents">
    <TopBar>
      <Breadcrumb back={questionHref(q)} items={[{ label: `Otázka ${q.id}` }, { label: "Rozbor pokusu" }]} />
      <div className="flex-1" />
      <GlassIconButton icon={Ellipsis} label="Další akce" aria-disabled />
    </TopBar>
    </div>
  );
  const mobileBar = (
    <div className="sticky top-3 z-20 flex h-11 items-center gap-2 lg:hidden">
      <GlassIconButton href={questionHref(q)} icon={ChevronLeft} label="Zpět na otázku" size={44} />
      <div className="flex-1" />
      <div className="glass-thin flex h-11 items-center rounded-full px-1 [--g-b:20px] [--g-y:6px]">
        <GlassIconButton icon={Share} label="Sdílet" size={36} variant="plain" aria-disabled />
        <GlassIconButton icon={Ellipsis} label="Další akce" size={36} variant="plain" aria-disabled />
      </div>
    </div>
  );

  if (attempt === null) {
    return (
      <div className="px-4 pt-3 lg:px-10 lg:pt-[22px]">
        {bar}
        {mobileBar}
        <h1 className="mt-6 text-[30px] font-bold tracking-[-0.8px] lg:mt-[34px] lg:text-[36px] lg:font-semibold lg:tracking-[-1px]">Rozbor odpovědi</h1>
        {/* Frame 39 · “Rozbor · vyhodnocení nedostupné” */}
        <StateCard
          className="mt-6 max-w-[620px]"
          role="alert"
          icon={CircleAlert}
          tone="error"
          title="Orientační vyhodnocení teď není dostupné"
          text="Tvoje odpověď je uložená. Rozbor doplníme, jakmile bude služba zase běžet."
          actions={
            <>
              <RetryButton>Zkusit vyhodnotit znovu</RetryButton>
              <GlassButton icon={FileText} variant="solid" aria-disabled title="Zobrazení odpovědi připravujeme">
                Zobrazit odpověď
              </GlassButton>
            </>
          }
        />
      </div>
    );
  }

  const met = attempt.criteria.filter((c) => c.met).length;
  const total = attempt.criteria.length;

  return (
    <>
      {/* Desktop · frame 28 */}
      <div className="hidden px-10 pt-[22px] pb-6 lg:block">
        {bar}
        <header className="mt-[30px] flex items-end gap-6">
          <div className="flex flex-1 flex-col gap-2.5">
            <Chip icon={Info} className="self-start">
              Orientační hodnocení AI · ne oficiální výsledek
            </Chip>
            <h1 className="text-[36px] font-semibold tracking-[-1px]">Rozbor odpovědi</h1>
            <p className="text-[17px] text-muted">{attempt.summary}</p>
          </div>
          <div className="surface flex items-center gap-3.5 rounded-[22px] py-3 pr-5 pl-3">
            <ScoreRing value={met / total} label={`${met} ze ${total} kritérií splněno`} />
            <div className="flex flex-col gap-0.5" aria-hidden>
              <span className="tnum text-[22px] font-semibold tracking-[-0.4px]">
                <CountUp value={met} /> ze {total}
              </span>
              <span className="text-[13px] text-muted">kritérií splněno</span>
            </div>
          </div>
        </header>

        <div className="mt-7 grid gap-3.5 xl:h-[404px] xl:grid-cols-[1fr_460px]">
          <AnswerCard attempt={attempt} />
          <section aria-labelledby="kriteria" className="surface flex flex-col gap-1 rounded-[22px] px-2.5 pt-[22px] pb-2.5">
            <h2 id="kriteria" className="px-3 pb-2 text-[16px] font-semibold">
              Hodnoticí kritéria
            </h2>
            <CriteriaList criteria={attempt.criteria} q={q} />
          </section>
        </div>

        <section aria-labelledby="co-dal" className="surface mt-3.5 flex min-h-[224px] items-center gap-7 rounded-[22px] p-7">
          <div className="flex flex-1 flex-col gap-2">
            <h2 id="co-dal" className="text-[13px] font-semibold text-accent">
              Co procvičit dál
            </h2>
            <p className="max-w-[560px] text-[22px] leading-[1.3] font-semibold tracking-[-0.4px]">{attempt.next}</p>
            <NextActions q={q} />
          </div>
          <div className="mesh-hero hidden h-[168px] w-[340px] flex-col justify-center gap-2.5 rounded-[18px] p-5 xl:flex">
            {[
              ["Příčina", "Dlouhodobý tlak"],
              ["Záminka", "Událost, která spustí"],
            ].map(([term, def]) => (
              <p key={term} className="glass-thin glass-on-hero flex h-[52px] items-center rounded-2xl px-4 text-[14px] text-white">
                <span className="w-[90px] font-semibold">{term}</span>
                <span className="text-white/80">{def}</span>
              </p>
            ))}
          </div>
        </section>
      </div>

      {/* Mobile · frame 38 */}
      <div className="flex flex-col px-4 pt-3 lg:hidden">
        {mobileBar}
        <Chip icon={Info} className="mt-4 self-start">
          Orientační hodnocení AI
        </Chip>
        <h1 className="mt-2.5 text-[30px] font-bold tracking-[-0.8px]">Rozbor odpovědi</h1>
        <p className="mt-1.5 text-[16px] leading-[1.45] text-muted">{attempt.summary}</p>
        <div className="surface mt-[18px] flex items-center gap-3.5 rounded-[22px] p-4">
          <ScoreRing value={met / total} size={52} label={`${met} ze ${total} kritérií splněno`} />
          <div className="flex flex-col gap-0.5">
            <span className="tnum text-[18px] font-semibold">
              <CountUp value={met} /> ze {total} kritérií
            </span>
            <span className="text-[13px] text-muted">Zpětná vazba, ne výsledek maturity</span>
          </div>
        </div>
        <div className="surface mt-3 rounded-[22px] p-1.5">
          <CriteriaList criteria={attempt.criteria} q={q} compact />
        </div>
        <section className="surface mt-3 flex flex-col gap-2.5 rounded-[22px] p-[18px]">
          <h2 className="text-[13px] font-semibold text-accent">Co procvičit dál</h2>
          <p className="text-[17px] leading-[1.35] font-semibold">{attempt.next}</p>
          <PrimaryPill href="/kvizy/prvni-svetova-valka" arrow size={46} full>
            Procvičit rozdíl
          </PrimaryPill>
        </section>
      </div>
    </>
  );
}

function AnswerCard({ attempt }: { attempt: Attempt }) {
  const a = attempt.answer;
  return (
    <section aria-labelledby="odpoved" className="surface flex flex-col gap-3.5 rounded-[22px] p-6">
      <div className="flex items-center">
        <h2 id="odpoved" className="flex-1 text-[16px] font-semibold">
          Tvoje odpověď
        </h2>
        <span className="tnum text-[13px] text-muted">{attempt.submitted}</span>
      </div>
      <p className="text-[16px] leading-[1.6]">{a.before}</p>
      <figure className="flash-warning flex flex-col gap-1.5 rounded-[4px_12px_12px_4px] border-l-[3px] border-warning bg-warning-soft px-3.5 py-3">
        <blockquote className="text-[16px] leading-[1.6] font-medium">{a.flagged}</blockquote>
        <figcaption className="flex items-center gap-1.5 text-[13px] font-semibold text-warning">
          <CornerDownRight size={14} strokeWidth={2} aria-hidden />
          {a.note}
        </figcaption>
      </figure>
      <p className="text-[16px] leading-[1.6]">{a.after}</p>
      <div className="flex-1" />
      <GlassButton icon={FileCheck} variant="solid" className="self-start" aria-disabled title="Vzorovou odpověď připravujeme">
        Porovnat se vzorovou odpovědí
      </GlassButton>
    </section>
  );
}

function CriteriaList({ criteria, q, compact }: { criteria: Criterion[]; q: Question; compact?: boolean }) {
  return (
    <ul className="flex flex-col gap-0.5 lg:gap-1">
      {criteria.map((c) => (
        <li key={c.title} className={cn("flex gap-3 rounded-2xl p-3 lg:rounded-[14px] lg:p-3.5", !c.met && "bg-warning-soft")}>
          <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full", c.met ? "bg-success-soft text-success" : "bg-warning text-white")}>
            {c.met ? <Check size={13} strokeWidth={2.5} aria-label="Splněno" /> : <Minus size={13} strokeWidth={2.5} aria-label="Nesplněno" />}
          </span>
          <div className="flex flex-1 flex-col gap-[3px]">
            <p className="text-[15px] font-semibold">{c.title}</p>
            {(!compact || !c.met) && <p className="text-[13px] text-muted">{compact ? (c.mobileDetail ?? c.detail) : c.detail}</p>}
            {c.citation && (
              <CitationChip n={c.citation.n} label={compact ? c.citation.mobileLabel : c.citation.label} href={`${questionHref(q, "studium")}#zdroj-${c.citation.n}`} className="mt-[3px]" />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function NextActions({ q }: { q: Question }) {
  return (
    <div className="flex flex-wrap gap-2.5 pt-2.5">
      <PrimaryPill href="/kvizy/prvni-svetova-valka" arrow size={44}>
        Procvičit rozdíl
      </PrimaryPill>
      <GlassButton href={`${questionHref(q, "studium")}#zdroj-1`} icon={BookOpen} variant="solid" size={44}>
        Otevřít podklad
      </GlassButton>
      <GlassButton href={questionHref(q, "mapa")} icon={Network} variant="solid" size={44}>
        Zobrazit v mapě
      </GlassButton>
    </div>
  );
}
