import { Suspense } from "react";
import { RouteLoading } from "@/components/loading";
import { BookOpen, BookX, ChevronLeft, Clock3, History, Mic, Network } from "lucide-react";
import type { Metadata } from "next";
import { BookmarkButton, ReportSourceButton } from "@/components/actions";
import { DataIcon } from "@/components/icon";
import { Breadcrumb, OutlineList, SourceList } from "@/components/question";
import { TopBar } from "@/components/shell/app-shell";
import { Card, Chip } from "@/components/ui/bits";
import { GlassButton, GlassIconButton, PrimaryPill } from "@/components/ui/buttons";
import { StateCard } from "@/components/ui/state";
import { loadQuestion, questionParams } from "@/lib/load";
import { questionHref } from "@/lib/mock/questions";
import type { Question } from "@/lib/types";

export const generateStaticParams = questionParams;

export async function generateMetadata({ params }: PageProps<"/predmety/[predmet]/otazky/[id]">): Promise<Metadata> {
  const { question } = await loadQuestion(params);
  return { title: question.title };
}

export default function QuestionPage(props: PageProps<"/predmety/[predmet]/otazky/[id]">) {
  return (
    <Suspense fallback={<RouteLoading />}>
      <QuestionPageContent {...props} />
    </Suspense>
  );
}

async function QuestionPageContent({ params }: PageProps<"/predmety/[predmet]/otazky/[id]">) {
  const { question: q, subject } = await loadQuestion(params);
  const d = q.detail;
  const done = d?.outline.filter((s) => s.state === "done").length ?? 0;

  return (
    <>
      {/* Desktop · frame 26 */}
      <div className="hidden px-10 pt-[22px] pb-6 lg:block">
        <TopBar>
          <Breadcrumb back="/" items={[...q.trail.map((label) => ({ label })), { label: `Otázka ${q.id}` }]} />
          <div className="flex-1" />
          <BookmarkButton />
        </TopBar>
        <header className="mt-[34px] flex flex-col gap-3">
          {d && (
            <div className="flex gap-1.5">
              <Chip icon={d.tags[0].startsWith("Ústní") ? Mic : undefined}>{d.tags[0]}</Chip>
              <Chip>{d.tags[1]}</Chip>
            </div>
          )}
          <h1 className="text-[36px] leading-[1.1] font-semibold tracking-[-1px]">{q.title}</h1>
        </header>

        {d ? (
          <>
            <section aria-labelledby="zadani" className="surface mt-10 flex flex-col gap-4 rounded-[26px] px-8 py-7">
              <h2 id="zadani" className="text-[13px] font-semibold text-accent">
                Zadání
              </h2>
              <p className="max-w-[820px] text-[24px] leading-[1.35] font-medium tracking-[-0.5px]">{d.prompt}</p>
              <QuestionActions q={q} />
            </section>
            <div className="mt-[22px] grid gap-3.5 xl:h-[424px] xl:grid-cols-[1fr_380px]">
              <Card title="Studijní osnova" meta={`${done} ze ${d.outline.length} hotovo`} className="gap-0.5 rounded-[22px] px-2.5 pt-[22px] pb-2.5">
                <OutlineList steps={d.outline} href={questionHref(q, "studium")} />
              </Card>
              <div className="flex flex-col gap-3.5">
                <Card title="Zdroje k otázce" className="gap-0.5 rounded-[22px] px-2.5 pt-[22px] pb-2.5" headerClassName="pb-2.5">
                  <SourceList sources={d.sources} href={questionHref(q, "studium")} />
                </Card>
                {d.lastAttempt && <LastAttempt q={q} />}
              </div>
            </div>
          </>
        ) : (
          <NoSource className="mt-6" />
        )}
      </div>

      {/* Mobile · frame 36 */}
      <div className="flex flex-col px-4 pt-3 lg:hidden">
        <div className="sticky top-3 z-20 flex h-11 items-center gap-2">
          <GlassIconButton href="/" icon={ChevronLeft} label="Zpět" size={44} />
          <div className="flex-1" />
          <div className="glass-thin flex h-11 items-center rounded-full px-1 [--g-y:6px] [--g-b:20px]">
            <BookmarkButton size={36} bare />
          </div>
        </div>
        <div className="mt-4 flex gap-1.5">
          <Chip>
            <DataIcon name={subject.icon} size={13} strokeWidth={2} />
            {subject.name}
          </Chip>
          {d && <Chip>{`${d.tags[0]} ${q.id}`}</Chip>}
        </div>
        <h1 className="mt-2.5 text-[30px] leading-[1.1] font-bold tracking-[-0.8px]">{q.title}</h1>
        {d ? (
          <>
            <section aria-labelledby="zadani-m" className="surface mt-[18px] flex flex-col gap-3 rounded-[24px] p-5">
              <h2 id="zadani-m" className="text-[13px] font-semibold text-accent">
                Zadání
              </h2>
              <p className="text-[18px] leading-[1.4] font-medium tracking-[-0.2px]">{d.prompt}</p>
              <PrimaryPill href={questionHref(q, "zkouska")} arrow size={48} full className="mt-1">
                Vyzkoušet se
              </PrimaryPill>
              <div className="flex gap-2">
                <GlassButton href={questionHref(q, "studium")} icon={BookOpen} variant="solid" size={44} full className="flex-1">
                  Studovat
                </GlassButton>
                {d.map && (
                  <GlassButton href={questionHref(q, "mapa")} icon={Network} variant="solid" size={44} full className="flex-1">
                    Mapa
                  </GlassButton>
                )}
              </div>
            </section>
            <h2 className="mt-6 text-[20px] font-semibold tracking-[-0.4px]">Studijní osnova</h2>
            <div className="surface mt-2.5 rounded-[22px] py-1">
              <OutlineList steps={d.outline} href={questionHref(q, "studium")} />
            </div>
          </>
        ) : (
          <NoSource className="mt-[18px]" />
        )}
      </div>
    </>
  );
}

function QuestionActions({ q }: { q: Question }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 pt-2">
      <PrimaryPill href={questionHref(q, "zkouska")} arrow size={44}>
        Vyzkoušet se
      </PrimaryPill>
      <GlassButton href={questionHref(q, "studium")} icon={BookOpen} variant="solid" size={44}>
        Studovat
      </GlassButton>
      {q.detail?.map && (
        <GlassButton href={questionHref(q, "mapa")} icon={Network} variant="solid" size={44}>
          Mapa pojmů
        </GlassButton>
      )}
      <span className="w-px" />
      <span className="flex items-center gap-1.5 text-[13px] text-muted">
        <Clock3 size={15} strokeWidth={1.5} aria-hidden />
        {q.detail?.duration}
      </span>
    </div>
  );
}

function LastAttempt({ q }: { q: Question }) {
  const a = q.detail!.lastAttempt!;
  return (
    <section aria-label="Poslední pokus" className="surface flex flex-1 flex-col gap-2.5 rounded-[22px] p-[22px]">
      <div className="flex items-center">
        <h2 className="flex-1 text-[16px] font-semibold">Poslední pokus</h2>
        <span className="text-[13px] text-muted">{a.when}</span>
      </div>
      <Chip tone="warning" dot className="self-start">
        {a.status}
      </Chip>
      <p className="text-[14px] leading-[1.5] text-muted">{a.note}</p>
      <div className="flex-1" />
      <GlassButton href={questionHref(q, `rozbor/${a.attempt}`)} icon={History} variant="solid" className="self-start">
        Otevřít rozbor
      </GlassButton>
    </section>
  );
}

/** Frame 39 · “Studium · bez podkladu”. */
function NoSource({ className }: { className?: string }) {
  return (
    <StateCard
      className={className}
      role="status"
      icon={BookX}
      tone="warning"
      title="K této části nemám ověřený podklad"
      text="Tutor neodpoví, dokud nenajde zdroj v balíčku. Můžeš otevřít osnovu nebo napsat redakci."
      actions={<ReportSourceButton />}
    />
  );
}
