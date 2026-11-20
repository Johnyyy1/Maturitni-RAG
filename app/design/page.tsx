import { BookOpen, CircleAlert, FileText, KeyRound, Layers2, List, Search, SearchX, X, BookX } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ReportSourceButton } from "@/components/actions";
import { DemoTutorUnavailable } from "@/components/design-demos";
import { Chip, CitationChip, ProgressDots, ScoreRing } from "@/components/ui/bits";
import { GlassButton, GlassIconButton, PrimaryPill } from "@/components/ui/buttons";
import { OptionRow } from "@/components/ui/option-row";
import { GlassSearch } from "@/components/ui/search";
import { Segmented } from "@/components/ui/segmented";
import { StateCard } from "@/components/ui/state";

export const metadata: Metadata = { title: "Design systém" };

const materials = [
  { name: "Tenký", use: "Tlačítka a kapsle · blur 16", cls: "glass-thin [--g-y:6px] [--g-b:16px]", dark: false },
  { name: "Běžný", use: "Lišty a panely · blur 28", cls: "glass", dark: false },
  { name: "Silný", use: "Postranní panel · blur 40", cls: "glass-thick", dark: true },
];

/** Frame 20 (materials and components) and frame 39 (states). */
export default function DesignPage() {
  // Internal reference page: development only.
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <main id="obsah" className="flex flex-col gap-9 px-4 py-10 lg:p-16">
      <header className="flex flex-col gap-2.5">
        <h1 className="text-[40px] font-semibold tracking-[-1px]">Liquid glass</h1>
        <p className="max-w-[640px] text-[16px] leading-[1.5] text-muted">
          Sklo patří ovládání a navigaci, obsah zůstává pevný. Silnější materiál odděluje oblasti, tenký zvýrazňuje ovládací prvky. Nikdy sklo na skle.
        </p>
      </header>

      <section aria-label="Ukázka materiálů" className="mesh-hero relative flex flex-col items-center gap-6 overflow-hidden rounded-[28px] p-6 md:h-[300px] md:flex-row md:p-10">
        <span aria-hidden className="absolute top-[-60px] left-[120px] size-[260px] rounded-full bg-[#9DB4FF99] blur-[30px]" />
        <span aria-hidden className="absolute top-[150px] left-[620px] size-[220px] rounded-full bg-[#9FD3F799] blur-[30px]" />
        <span aria-hidden className="absolute top-[-40px] left-[1000px] size-[240px] rounded-full bg-[#7FE0C899] blur-[30px]" />
        {materials.map((m) => (
          <div key={m.name} className={`${m.cls} flex h-[200px] w-full flex-col justify-end gap-1.5 rounded-3xl p-6`}>
            <p className={`text-[20px] font-semibold tracking-[-0.3px] ${m.dark ? "text-fg" : "text-white"}`}>{m.name}</p>
            <p className={`text-[13px] font-medium ${m.dark ? "text-muted" : "text-white/80"}`}>{m.use}</p>
          </div>
        ))}
      </section>

      <section aria-labelledby="komponenty" className="flex flex-col gap-6">
        <h2 id="komponenty" className="sr-only">
          Komponenty
        </h2>
        <div className="flex flex-wrap items-end gap-x-14 gap-y-8">
          <Cell label="Glass / Ikona">
            <GlassIconButton icon={Search} label="Hledat" />
          </Cell>
          <Cell label="Glass / Tlačítko">
            <GlassButton icon={Layers2}>Kartičky</GlassButton>
          </Cell>
          <Cell label="Pilulka / Primární">
            <PrimaryPill arrow>Pokračovat</PrimaryPill>
          </Cell>
          <Cell label="Glass / Vyhledávání">
            <GlassSearch />
          </Cell>
          <Cell label="Glass / Přepínač">
            <Segmented
              label="Režim"
              value="studium"
              items={[
                { label: "Studovat", value: "studium", href: "/design" },
                { label: "Mapa", value: "mapa", href: "/predmety/dejepis/otazky/7/mapa" },
                { label: "Vyzkoušet se", value: "zkouska", href: "/predmety/dejepis/otazky/7/zkouska" },
              ]}
            />
          </Cell>
        </div>
        <div className="flex flex-wrap items-end gap-x-14 gap-y-8">
          <Cell label="Pevné tlačítko (ve skle)">
            <GlassButton icon={BookOpen} variant="solid">
              Studovat
            </GlassButton>
          </Cell>
          <Cell label="Štítky">
            <div className="flex flex-wrap gap-1.5">
              <Chip>Ústní okruh</Chip>
              <Chip tone="accent">Nová</Chip>
              <Chip tone="warning" dot>
                Potřeba opakovat
              </Chip>
            </div>
          </Cell>
          <Cell label="Citace [n]">
            <div className="flex flex-wrap gap-2">
              <CitationChip n={1} label="Studijní podklad, kap. 4" href="/predmety/dejepis/otazky/7/studium#zdroj-1" />
              <CitationChip n={2} label="Časová osa 1900–1914" active={false} href="/predmety/dejepis/otazky/7/studium#zdroj-2" />
            </div>
          </Cell>
          <Cell label="Průběh">
            <ProgressDots total={8} current={1} results={["ok"]} />
          </Cell>
          <Cell label="Skóre">
            <ScoreRing value={2 / 3} label="2 ze 3 kritérií splněno" />
          </Cell>
        </div>
        <div className="grid max-w-[700px] gap-2.5" role="radiogroup" aria-label="Ukázka možností">
          <OptionRow name="ukazka" value="A" label="Výchozí" state="idle" disabled />
          <OptionRow name="ukazka" value="B" label="Vybraná" state="selected" disabled />
          <OptionRow name="ukazka" value="C" label="Správná po vyhodnocení" state="correct" disabled />
        </div>
      </section>

      <section aria-labelledby="stavy" className="flex flex-col gap-7">
        <header className="flex flex-col gap-2">
          <h2 id="stavy" className="text-[36px] font-semibold tracking-[-1px]">
            Stavy a chyby
          </h2>
          <p className="text-[17px] text-muted">Každý stav říká, co se stalo, co zůstalo uložené a co můžeš udělat dál.</p>
        </header>
        <div className="grid gap-4 lg:grid-cols-2">
          <StateCard
            caption="Studium · bez podkladu"
            className="min-h-[300px]"
            icon={BookX}
            tone="warning"
            title="K této části nemám ověřený podklad"
            text="Tutor neodpoví, dokud nenajde zdroj v balíčku. Můžeš otevřít osnovu nebo napsat redakci."
            actions={
              <>
                <GlassButton icon={List} variant="solid" href="/predmety/dejepis/otazky/7">
                  Otevřít osnovu
                </GlassButton>
                <ReportSourceButton />
              </>
            }
          />
          <DemoTutorUnavailable />
          <StateCard
            caption="Rozbor · vyhodnocení nedostupné"
            className="min-h-[300px]"
            icon={CircleAlert}
            tone="error"
            title="Orientační vyhodnocení teď není dostupné"
            text="Tvoje odpověď je uložená. Rozbor doplníme, jakmile bude služba zase běžet."
            actions={
              <>
                <PrimaryPill href="/predmety/dejepis/otazky/7/rozbor/2">Zkusit vyhodnotit znovu</PrimaryPill>
                <GlassButton icon={FileText} variant="solid" aria-disabled>
                  Zobrazit odpověď
                </GlassButton>
              </>
            }
          />
          <StateCard
            caption="Katalog · nic nenalezeno"
            className="min-h-[300px]"
            icon={SearchX}
            tone="accent"
            title="Žádný balíček neodpovídá hledání"
            text="Zkus jiný název předmětu nebo zruš filtry. Balíčky od školy odemkneš kódem."
            actions={
              <>
                <GlassButton icon={X} variant="solid" href="/balicky">
                  Vymazat hledání a filtry
                </GlassButton>
                <GlassButton icon={KeyRound} variant="solid" aria-disabled>
                  Zadat kód
                </GlassButton>
              </>
            }
          />
        </div>
      </section>
    </main>
  );
}

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex max-w-full flex-col gap-3">
      <p className="text-[12px] font-medium text-muted">{label}</p>
      {children}
    </div>
  );
}
