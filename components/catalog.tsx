"use client";

import { BadgeCheck, Check, KeyRound, LockOpen, School, SearchX, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { dur, ease, springIcon } from "@/lib/motion";
import { useState, type CSSProperties } from "react";
import { DataIcon } from "@/components/icon";
import { TopBar } from "@/components/shell/app-shell";
import { Chip } from "@/components/ui/bits";
import { GlassButton, PrimaryPill } from "@/components/ui/buttons";
import { GlassSearch } from "@/components/ui/search";
import { Segmented } from "@/components/ui/segmented";
import { StateCard } from "@/components/ui/state";
import { searchPackages, type PackageFilter } from "@/lib/api";
import { upcomingPackages } from "@/lib/mock/catalog";
import type { Package } from "@/lib/types";

const filters = [
  { label: "Vše", value: "vse" },
  { label: "Maturita", value: "maturita" },
  { label: "Odborné", value: "odborne" },
];

/** Frame 34. */
export function Catalog() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<PackageFilter>("vse");
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const results = searchPackages(query, filter);
  const reduce = useReducedMotion();
  const move = !reduce && searchPackages("", "vse").length <= 30;
  const codeButton = (
    <GlassButton icon={KeyRound} variant="solid" aria-disabled title="Zadání kódu připravujeme">
      Zadat kód
    </GlassButton>
  );

  return (
    <div className="px-4 pt-3 pb-6 lg:px-10 lg:pt-[22px]">
      <div className="hidden lg:contents">
        <TopBar>
          <Segmented label="Filtr balíčků" value={filter} onChange={(v) => setFilter(v as PackageFilter)} items={filters} />
          <div className="flex-1" />
          <GlassSearch placeholder="Hledat balíček nebo předmět" value={query} onChange={setQuery} className="w-[300px]" />
        </TopBar>
      </div>
      <div className="flex flex-col gap-2 lg:hidden">
        <GlassSearch placeholder="Hledat balíček nebo předmět" value={query} onChange={setQuery} className="h-11 w-full" />
        <Segmented label="Filtr balíčků" value={filter} onChange={(v) => setFilter(v as PackageFilter)} items={filters} className="self-start" />
      </div>

      <header className="mt-6 flex flex-col gap-2 lg:mt-[34px]">
        <h1 className="text-[30px] font-bold tracking-[-0.8px] lg:text-[36px] lg:font-semibold lg:tracking-[-1px]">Studijní balíčky</h1>
        <p className="text-[16px] text-muted lg:text-[17px]">Vyber si balíček a přidej si jeho předměty do přípravy.</p>
      </header>

      <ul className={results.length ? "relative mt-8 grid gap-3.5 md:grid-cols-2" : "relative"}>
        <AnimatePresence initial={false} mode="popLayout">
          {results.map((p) => (
            <motion.li
              key={p.id}
              layout={move ? "position" : false}
              exit={move ? { opacity: 0, transition: { duration: dur.exit, ease: ease.out } } : undefined}
            >
              <PackageCard pkg={p} added={added[p.id] ?? p.added} onAdd={() => {
                setAdded((a) => ({ ...a, [p.id]: true }));
                toast.success("Přidáno do přípravy");
              }} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {!results.length && (
        <StateCard
          className="mt-6 max-w-[620px]"
          role="status"
          icon={SearchX}
          tone="accent"
          title="Žádný balíček neodpovídá hledání"
          text="Zkus jiný název předmětu nebo zruš filtry. Balíčky od školy odemkneš kódem."
          actions={
            <>
              <GlassButton
                icon={X}
                variant="solid"
                onClick={() => {
                  setQuery("");
                  setFilter("vse");
                }}
              >
                Vymazat hledání a filtry
              </GlassButton>
              {codeButton}
            </>
          }
        />
      )}

      <aside aria-label="Kód od školy" className="glass mt-3.5 flex min-h-16 flex-wrap items-center gap-3 rounded-[22px] py-3 pr-2.5 pl-5">
        <School size={18} strokeWidth={1.5} aria-hidden />
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="text-[14px] font-semibold">Máš kód od školy?</p>
          <p className="text-[13px] text-muted">Odemkne balíčky, které připravili tvoji učitelé.</p>
        </div>
        {codeButton}
      </aside>

      <section aria-labelledby="pripravujeme" className="mt-7 flex flex-col gap-3">
        <h2 id="pripravujeme" className="text-[16px] font-semibold">
          Připravujeme
        </h2>
        <ul className="grid gap-3.5 md:grid-cols-3">
          {upcomingPackages.map((u) => (
            <li key={u.title} className="surface flex h-[76px] items-center gap-3.5 rounded-[20px] px-[18px]">
              <DataIcon name={u.icon} size={20} className="text-muted" />
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-[15px] font-semibold">{u.title}</p>
                <p className="text-[13px] text-muted">{u.kind}</p>
              </div>
              <Chip>Brzy</Chip>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function PackageCard({ pkg, added, onAdd }: { pkg: Package; added: boolean; onAdd: () => void }) {
  const reduce = useReducedMotion();
  return (
    <article aria-labelledby={`p-${pkg.id}`} className="surface flex flex-col rounded-[28px] p-2">
      <div
        className="mesh-hero flex h-[150px] flex-col justify-between rounded-[20px] p-4"
        style={pkg.cover && ({ "--hero-d": pkg.cover[0], "--hero-a": pkg.cover[1], "--hero-b": pkg.cover[2], "--hero-c": pkg.cover[3] } as CSSProperties)}
      >
        <div className="flex justify-between text-[12px] font-semibold text-white">
          <span className="glass-thin glass-on-hero flex h-7 items-center gap-1.5 rounded-full pr-3 pl-2.5">
            {pkg.access === "open" ? <LockOpen size={13} strokeWidth={2} aria-hidden /> : <School size={13} strokeWidth={2} aria-hidden />}
            {pkg.access === "open" ? "Volný přístup" : "Školní přístup"}
          </span>
          <span className="tnum glass-thin glass-on-hero flex h-7 items-center rounded-full px-3">{pkg.questions} otázek</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 px-4 pt-[18px] pb-4">
        <h2 id={`p-${pkg.id}`} className="text-[20px] font-semibold tracking-[-0.4px]">
          {pkg.title}
        </h2>
        <p className="text-[14px] text-muted">{pkg.description}</p>
        <ul aria-label="Předměty" className="mt-3.5 flex flex-wrap gap-1.5">
          {pkg.subjects.map((s) => (
            <li key={s}>
              <Chip>{s}</Chip>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-center gap-2">
          <p className="flex flex-1 items-center gap-1.5 text-[13px] text-muted">
            <BadgeCheck size={15} strokeWidth={1.75} className="text-success" aria-hidden />
            {pkg.status}
          </p>
          <motion.div layout={reduce ? false : "size"} className="flex shrink-0 justify-center">
            {added ? (
              <span role="status" className="flex h-10 items-center gap-1.5 rounded-full bg-success-soft px-3.5 text-[14px] font-semibold text-success">
                <motion.span initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.25, filter: "blur(4px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={springIcon}>
                  <Check size={15} strokeWidth={2} aria-hidden />
                </motion.span>
                V přípravě
              </span>
            ) : (
              <PrimaryPill onClick={onAdd}>Přidat předměty</PrimaryPill>
            )}
          </motion.div>
        </div>
      </div>
    </article>
  );
}
