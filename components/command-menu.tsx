"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BookOpen, CornerDownLeft, Layers2, ListChecks, Package, Palette, Search, Sun, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Kbd } from "@/components/ui/bits";
import { getSubject } from "@/lib/mock/subjects";
import { questionHref, questions } from "@/lib/mock/questions";
import { dur, ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Entry = { label: string; hint: string; href: string; icon: LucideIcon; group: "Otázky" | "Stránky" };

const entries: Entry[] = [
  ...questions.map((q) => ({
    label: q.title,
    hint: getSubject(q.subject)?.name ?? "",
    href: questionHref(q),
    icon: BookOpen,
    group: "Otázky" as const,
  })),
  { label: "Dnes", hint: "Přehled", href: "/", icon: Sun, group: "Stránky" },
  { label: "Studijní balíčky", hint: "Katalog", href: "/balicky", icon: Package, group: "Stránky" },
  { label: "Kartičky", hint: "Opakování", href: "/karticky", icon: Layers2, group: "Stránky" },
  { label: "Nový kvíz", hint: "Kvízy", href: "/kvizy/novy", icon: ListChecks, group: "Stránky" },
  // Internal reference page: only offered while developing.
  ...(process.env.NODE_ENV === "development" ? [{ label: "Design systém", hint: "Materiály", href: "/design", icon: Palette, group: "Stránky" as const }] : []),
];

const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\s+/g, " ").toLowerCase();

/** CommandMenu (⌘K): thick glass panel over the page, searches questions and pages. */
export function CommandMenu({ open, instant, onClose }: { open: boolean; instant?: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const reduce = useReducedMotion();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = fold(query.trim());
    return q ? entries.filter((e) => fold(`${e.label} ${e.hint}`).includes(q)) : entries;
  }, [query]);

  useEffect(() => {
    const d = ref.current;
    if (open && d && !d.open) {
      setQuery("");
      setActive(0);
      d.showModal();
    }
  }, [open]);

  const go = (e: Entry | undefined) => {
    if (!e) return;
    onClose();
    router.push(e.href);
  };

  return (
    <dialog
      ref={ref}
      aria-label="Hledat otázky a pojmy"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-[#0b0d1426]"
    >
      <AnimatePresence onExitComplete={() => ref.current?.close()}>
        {open && (
          <motion.div
            initial={instant ? false : reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={{ duration: instant ? 0 : dur.exit, ease: ease.out }}
            style={{ transformOrigin: "50% 0%" }}
            className="glass-thick mx-auto mt-[12vh] w-[min(560px,calc(100%-32px))] overflow-hidden rounded-[22px]"
          >
            <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
              <Search size={18} strokeWidth={1.75} className="text-muted" aria-hidden />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((i) => Math.min(i + 1, Math.max(0, results.length - 1)));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((i) => Math.max(i - 1, 0));
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    go(results[active]);
                  }
                }}
                role="combobox"
                aria-expanded
                aria-controls={listId}
                aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
                aria-label="Hledat otázky a pojmy"
                placeholder="Hledat otázky a pojmy"
                className="h-full flex-1 bg-transparent text-[16px] text-fg outline-none placeholder:text-muted"
              />
              <Kbd>esc</Kbd>
            </div>
            <ul id={listId} role="listbox" aria-label="Výsledky" className="max-h-[min(420px,60vh)] overflow-y-auto p-2">
              {results.length === 0 && <li className="px-3 py-6 text-center text-[14px] text-muted">Nic jsme nenašli</li>}
              {results.map((e, i) => (
                <li
                  key={e.href}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseMove={() => setActive(i)}
                  onClick={() => go(e)}
                  className={cn("flex h-12 cursor-pointer items-center gap-3 rounded-xl px-3", i === active && "raised")}
                >
                  <e.icon size={16} strokeWidth={1.75} className={i === active ? "text-accent" : "text-muted"} aria-hidden />
                  <span className="flex-1 truncate text-[14px] font-medium">{e.label}</span>
                  <span className="text-[13px] text-muted">{e.hint}</span>
                  {i === active && <CornerDownLeft size={14} strokeWidth={1.75} className="text-muted" aria-hidden />}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}
