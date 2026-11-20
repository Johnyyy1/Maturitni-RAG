"use client";

import { ChevronLeft, Landmark, Layers2, Lightbulb, RotateCcw, RotateCw, Shuffle, SkipForward } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { DoneCard } from "@/components/done-card";
import { ActionBar, capsule, FocusBar } from "@/components/focus";
import { Chip, CitationChip, Kbd, ProgressTrack } from "@/components/ui/bits";
import { GlassButton, GlassIconButton, PrimaryPill } from "@/components/ui/buttons";
import { plural } from "@/lib/plural";
import { cn } from "@/lib/cn";
import type { Flashcard, Rating } from "@/lib/types";

const dots = { error: "bg-error", warning: "bg-warning", success: "bg-success" } as const;
/** Pressed rating flashes its own tone before the card leaves. */
const rateTone = { error: "active:bg-error-soft", warning: "active:bg-warning-soft", success: "active:bg-success-soft" } as const;

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
/** Cards visible under the top one. */
const DEPTH = 2;

type Exit = "left" | "right" | "aside";

/** Frames 32 (front), 24 (answer) and 33 (done). Space flips, 1–3 rates. */
export function Flashcards({ title, cards, ratings }: { title: string; cards: Flashcard[]; ratings: Rating[] }) {
  const reduce = useReducedMotion() ?? false;
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  // Clicks and Space animate; rating with 1–3 stays instant.
  const [animate, setAnimate] = useState(false);
  // Where the top card leaves to: the rating decides the direction.
  const [exit, setExit] = useState<Exit>("aside");
  const [rated, setRated] = useState<Rating["key"][]>([]);
  const done = pos >= order.length;
  const motionOn = animate && !reduce;

  const flip = useCallback((fromPointer: boolean) => {
    setAnimate(fromPointer);
    setRevealed(true);
  }, []);

  const advance = useCallback((to: Exit, fromPointer: boolean) => {
    setAnimate(fromPointer);
    setExit(to);
    setRevealed(false);
    setPos((p) => p + 1);
  }, []);

  const rate = useCallback(
    (key: Rating["key"], fromPointer: boolean) => {
      setRated((r) => [...r, key]);
      advance(key === 1 ? "left" : key === 3 ? "right" : "aside", fromPointer);
    },
    [advance],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done || e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement).closest("input,textarea,select")) return;
      if (e.key === " " && !revealed) {
        if ((e.target as HTMLElement).closest("button,a")) return;
        e.preventDefault();
        // A flashcard turning over is the point of the screen, so Space animates like a click.
        flip(true);
      } else if (revealed && ["1", "2", "3"].includes(e.key)) {
        e.preventDefault();
        rate(Number(e.key) as Rating["key"], false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done, revealed, flip, rate]);

  const restart = () => {
    setOrder(cards.map((_, i) => i));
    setPos(0);
    setRated([]);
    setRevealed(false);
    setAnimate(false);
  };

  const known = rated.filter((r) => r === 3).length;

  return (
    <>
      <FocusBar
        left={<GlassIconButton href="/" icon={ChevronLeft} label="Zpět" size={44} />}
        center={
          !done && (
            <div className={cn(capsule, "gap-3.5 px-[18px]")}>
              <Layers2 size={16} strokeWidth={1.5} className="hidden text-muted sm:block" aria-hidden />
              <span className="hidden font-semibold sm:inline">{title}</span>
              <ProgressTrack value={(pos + 1) / order.length} className="h-1.5 w-24" label="Postup balíčkem" />
              <span className="tnum font-medium text-muted">
                {pos + 1} z {order.length}
              </span>
            </div>
          )
        }
        right={
          !done && (
            <GlassIconButton
              icon={Shuffle}
              label="Zamíchat zbývající"
              size={44}
              onClick={() =>
                setOrder((o) => [...o.slice(0, pos + 1), ...o.slice(pos + 1).sort(() => Math.random() - 0.5)])
              }
            />
          )
        }
      />

      <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 py-6">
        {done ? (
          <DoneCard
            title="Na dnešek máš hotovo"
            text="Další kartičky se ti připraví zítra ráno."
            stats={[
              { value: rated.length, label: plural(rated.length, "kartička", "kartičky", "kartiček").replace(/^\d+ /, "") },
              { value: known, label: "umím", tone: "success" },
              { value: rated.length - known, label: "zopakovat", tone: "warning" },
            ]}
            actions={
              <>
                <PrimaryPill href="/balicky" arrow size={44}>
                  Procházet předměty
                </PrimaryPill>
                <GlassButton icon={RotateCcw} variant="solid" size={44} onClick={restart}>
                  Projít znovu
                </GlassButton>
              </>
            }
          />
        ) : (
          <>
            <CardStack order={order} pos={pos} cards={cards} revealed={revealed} exit={exit} motionOn={motionOn} reduce={reduce} />

            <AnimatePresence mode="popLayout" initial={false}>
              {revealed ? (
                <motion.div
                  key="rate"
                  role="group"
                  aria-label="Jak ti to šlo?"
                  initial={motionOn ? { opacity: 0, transform: "translateY(10px) scale(0.98)" } : false}
                  animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={{ duration: 0.22, ease: EASE_OUT }}
                  className="glass sticky bottom-6 z-20 flex h-[76px] w-full max-w-[640px] gap-1 rounded-full p-1.5"
                >
                  {ratings.map((r, i) => (
                    <motion.button
                      key={r.key}
                      type="button"
                      onClick={() => rate(r.key, true)}
                      aria-keyshortcuts={String(r.key)}
                      initial={motionOn ? { opacity: 0, transform: "translateY(6px)" } : false}
                      animate={{ opacity: 1, transform: "translateY(0px)" }}
                      transition={{ duration: 0.2, ease: EASE_OUT, delay: motionOn ? 0.06 + i * 0.04 : 0 }}
                      className={cn("rate group flex h-16 flex-1 items-center gap-3 rounded-full px-3 text-left sm:px-[18px]", rateTone[r.tone])}
                    >
                      <span className="hidden sm:contents">
                        <Kbd className="rate-key size-[26px] rounded-lg text-[12px]">{r.key}</Kbd>
                      </span>
                      <span className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1.5 text-[14px] font-semibold">
                          <span aria-hidden className={cn("rate-dot size-[7px] rounded-full", dots[r.tone])} />
                          {r.label}
                        </span>
                        <span className="text-[12px] text-muted">{r.interval}</span>
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="flip"
                  initial={motionOn ? { opacity: 0, transform: "translateY(10px) scale(0.98)" } : false}
                  animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={{ duration: 0.22, ease: EASE_OUT }}
                  className="sticky bottom-[max(20px,env(safe-area-inset-bottom))] z-20 flex w-full justify-center lg:bottom-6"
                >
                  <ActionBar label="Kartička" className="static lg:pl-3.5">
                    <button
                      type="button"
                      onClick={() => advance("aside", true)}
                      className="press flex h-11 items-center gap-1.5 rounded-full px-3.5 text-[14px] font-medium text-muted transition-[color,background-color,transform] hover:bg-ring hover:text-fg"
                    >
                      <SkipForward size={15} strokeWidth={1.5} aria-hidden />
                      Přeskočit
                    </button>
                    <div className="flex-1" />
                    <span className="hidden sm:contents">
                      <Kbd className="px-2">mezerník</Kbd>
                    </span>
                    <PrimaryPill onClick={() => flip(true)} size={44} aria-keyshortcuts="Space" className="group lift">
                      <RotateCw size={15} strokeWidth={2} aria-hidden className="flip-icon" />
                      Otočit kartičku
                    </PrimaryPill>
                  </ActionBar>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </>
  );
}

function Front({ card }: { card: Flashcard }) {
  return (
    <div className="flex flex-1 flex-col justify-between gap-8">
      <div className="flex items-center">
        <p className="flex-1 text-[12px] font-semibold text-accent">Otázka</p>
        <Chip icon={Landmark}>Dějepis</Chip>
      </div>
      <h1 className="text-[28px] leading-[1.15] font-semibold tracking-[-0.8px] lg:text-[36px] lg:tracking-[-1px]">{card.question}</h1>
      <p className="flex items-center gap-2 text-[13px] text-muted">
        <Lightbulb size={15} strokeWidth={1.5} aria-hidden />
        {card.hint}
      </p>
    </div>
  );
}

function Back({ card }: { card: Flashcard }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-[12px] font-semibold text-muted">Otázka</p>
        <p className="text-[17px] font-medium text-muted">{card.question}</p>
      </div>
      <hr className="mt-6 mb-7 border-border" />
      <p className="text-[12px] font-semibold text-accent">Odpověď</p>
      <h1 className="mt-2.5 text-[24px] leading-[1.25] font-semibold tracking-[-0.7px] lg:text-[28px]">{card.answer}</h1>
      <p className="mt-5 text-[16px] leading-[1.55] text-muted">{card.detail}</p>
      <CitationChip n={1} label={card.citation} href="/predmety/dejepis/otazky/7/studium#zdroj-1" className="mt-7" />
    </>
  );
}

type StackProps = {
  order: number[];
  pos: number;
  cards: Flashcard[];
  revealed: boolean;
  exit: Exit;
  motionOn: boolean;
  reduce: boolean;
};

/** Pose of a card `depth` places under the top one. Same transform template everywhere so motion can interpolate it. */
function pose(depth: number) {
  const d = Math.min(depth, DEPTH + 1);
  return {
    transform: `translateX(0%) translateY(${d * 14}px) rotate(0deg) scale(${1 - d * 0.05})`,
    opacity: d > DEPTH ? 0 : 1,
  };
}

const exits: Record<Exit, { transform: string; opacity: number }> = {
  left: { transform: "translateX(-115%) translateY(20px) rotate(-8deg) scale(1)", opacity: 0 },
  right: { transform: "translateX(115%) translateY(20px) rotate(8deg) scale(1)", opacity: 0 },
  aside: { transform: "translateX(0%) translateY(-40px) rotate(0deg) scale(0.92)", opacity: 0 },
};

/** The deck: top card flips in 3D, the next ones peek out underneath and move up when it leaves. */
function CardStack({ order, pos, cards, revealed, exit, motionOn, reduce }: StackProps) {
  const visible = order.slice(pos, pos + DEPTH + 1);
  return (
    // Clip sideways so a card flying off never adds a horizontal scrollbar.
    <div className="w-full [overflow-x:clip] pb-[28px]">
      <div className="relative mx-auto grid w-full max-w-[640px] [perspective:1600px]">
        <AnimatePresence initial={false} custom={{ exit, motionOn }}>
          {visible.map((cardIndex, depth) => {
            const top = depth === 0;
            return (
              <motion.div
                key={cardIndex}
                custom={{ exit, motionOn }}
                variants={{
                  hidden: pose(DEPTH + 1),
                  shown: pose(depth),
                  gone: (c: { exit: Exit; motionOn: boolean }) => ({
                    ...exits[c.exit],
                    // The leaving card stays above the one taking its place.
                    zIndex: 20,
                    transition: c.motionOn ? { duration: 0.38, ease: EASE_OUT } : { duration: 0 },
                  }),
                }}
                initial="hidden"
                animate="shown"
                exit="gone"
                transition={motionOn ? { duration: 0.42, ease: EASE_OUT } : { duration: 0 }}
                style={{ zIndex: 10 - depth, transformOrigin: "50% 100%" }}
                aria-hidden={!top || undefined}
                inert={!top || undefined}
                className="col-start-1 row-start-1 grid"
              >
                <FlipCard card={cards[cardIndex]} revealed={top && revealed} motionOn={motionOn} reduce={reduce} top={top} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --surface is 95% opaque; the solid page colour underneath keeps the cards below from showing through.
const face = "surface [background:linear-gradient(var(--surface),var(--surface)),var(--bg-d)]! col-start-1 row-start-1 flex min-h-[420px] flex-col rounded-[32px] px-6 pt-8 pb-7 [backface-visibility:hidden] lg:px-10 lg:pt-9 lg:pb-8";

/**
 * Both faces share one grid cell, so the card keeps the height of the taller face and never jumps when it turns.
 * Reduced motion swaps the faces with a short cross-fade instead of rotating.
 */
function FlipCard({ card, revealed, motionOn, reduce, top }: { card: Flashcard; revealed: boolean; motionOn: boolean; reduce: boolean; top: boolean }) {
  return (
    <article
      aria-live={top ? "polite" : undefined}
      style={{ transform: `rotateY(${revealed && !reduce ? 180 : 0}deg)` }}
      className={cn("grid [transform-style:preserve-3d]", motionOn && "flip-turn")}
    >
      <div
        aria-hidden={revealed || undefined}
        inert={revealed || undefined}
        className={cn(face, reduce && "transition-opacity duration-200", reduce && revealed && "opacity-0")}
      >
        <Front card={card} />
      </div>
      {top && (
        <div
          aria-hidden={!revealed || undefined}
          inert={!revealed || undefined}
          className={cn(face, !reduce && "[transform:rotateY(180deg)]", reduce && "transition-opacity duration-200", reduce && !revealed && "opacity-0")}
        >
          <Back card={card} />
        </div>
      )}
    </article>
  );
}
