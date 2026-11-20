"use client";

import { ChevronLeft, Landmark, Layers2, Lightbulb, RotateCcw, Shuffle, SkipForward } from "lucide-react";
import { animate as animateValue, AnimatePresence, motion, useDragControls, useIsPresent, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { DoneCard } from "@/components/done-card";
import { ActionBar, capsule, FocusBar } from "@/components/focus";
import { Chip, CitationChip, Kbd, ProgressTrack } from "@/components/ui/bits";
import { GlassButton, GlassIconButton, PrimaryPill } from "@/components/ui/buttons";
import { plural } from "@/lib/plural";
import { dur, ease, project, spring, springMomentum } from "@/lib/motion";
import { cn } from "@/lib/cn";
import type { Flashcard, Rating } from "@/lib/types";

const dots = { error: "bg-error", warning: "bg-warning", success: "bg-success" } as const;
const rateTone = { error: "active:bg-error-soft", warning: "active:bg-warning-soft", success: "active:bg-success-soft" } as const;
const face = "flashcard-face surface col-start-1 row-start-1 flex flex-col rounded-[32px] px-6 pt-8 pb-7 [backface-visibility:hidden] lg:px-10 lg:pt-9 lg:pb-8";
type Departure = { direction: "left" | "right" | "up"; gesture: boolean } | null;
// Long enough to follow the card off screen; the deck catches up with a soft spring.
const fly = { duration: 0.6, ease: ease.inOut } as const;
const deckSpring = { type: "spring", bounce: 0.18, duration: 0.6 } as const;

/** Frames 32 (front), 24 (answer) and 33 (done). Space flips in 3D, 1–3 rates and sends the card left / up / right. */
export function Flashcards({ title, cards, ratings }: { title: string; cards: Flashcard[]; ratings: Rating[] }) {
  const reduce = useReducedMotion();
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  // Keyboard reveal can fade, and keyboard ratings advance instantly.
  const [effect, setEffect] = useState<"none" | "fade" | "reveal">("none");
  const [departure, setDeparture] = useState<Departure>(null);
  const [rated, setRated] = useState<Rating["key"][]>([]);
  const done = pos >= order.length;
  const card = cards[order[Math.min(pos, order.length - 1)]];

  const flip = useCallback((fromPointer: boolean) => {
    setEffect(fromPointer ? "reveal" : "fade");
    setRevealed(true);
  }, []);

  const advance = useCallback((pointer = false, direction: NonNullable<Departure>["direction"] = "up", gesture = false) => {
    setDeparture(pointer ? { direction, gesture } : null);
    setRevealed(false);
    setEffect(pointer ? "fade" : "none");
    setPos((p) => p + 1);
  }, []);

  const rate = useCallback(
    (key: Rating["key"], pointer = false, gesture = false) => {
      setRated((r) => [...r, key]);
      advance(pointer, key === 1 ? "left" : key === 3 ? "right" : "up", gesture);
    },
    [advance],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done || e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement).closest("input,textarea,select")) return;
      if (e.key === " " && !revealed) {
        if ((e.target as HTMLElement).closest("button,a")) return;
        e.preventDefault();
        flip(true);
      } else if (revealed && ["1", "2", "3"].includes(e.key)) {
        e.preventDefault();
        rate(Number(e.key) as Rating["key"], true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done, revealed, flip, rate]);

  const restart = () => {
    setOrder(cards.map((_, i) => i));
    setPos(0);
    setRated([]);
    setDeparture(null);
    setRevealed(false);
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

      <div className={cn("flex w-full flex-1 flex-col items-center gap-6 py-6", done ? "justify-center" : "lg:justify-center")}>
        {done ? (
          <DoneCard celebrate={effect !== "none"}
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
            <div className="w-full overflow-x-clip pb-7">
              <div className="relative mx-auto grid w-full max-w-[640px]">
                {order.slice(pos + 1, pos + 3).map((cardIndex, depth) => (
                  <motion.div
                    key={cardIndex}
                    aria-hidden
                    initial={false}
                    animate={{ y: 14 * (depth + 1), scale: 1 - 0.05 * (depth + 1) }}
                    transition={departure && !reduce ? deckSpring : { duration: 0 }}
                    style={{ zIndex: 2 - depth }}
                    className="flashcard-face surface pointer-events-none absolute inset-0 origin-bottom rounded-[32px]"
                  />
                ))}
                <AnimatePresence initial={false} custom={departure}>
                  <FlashcardSurface key={pos} revealed={revealed} onSwipe={(direction) => rate(direction > 0 ? 3 : 1, true, true)}>
                    <div aria-hidden={revealed || undefined} inert={revealed} className={cn(face, reduce ? revealed && "invisible" : "", !revealed && effect === "fade" && "fade-in")}>
                      <Front card={card} />
                    </div>
                    <div aria-hidden={!revealed || undefined} inert={!revealed} className={cn(face, reduce ? revealed ? "fade-in" : "invisible" : "[transform:rotateY(180deg)]")}>
                      <Back card={card} />
                    </div>
                  </FlashcardSurface>
                </AnimatePresence>
              </div>
            </div>

            {revealed ? (
              <div role="group" aria-label="Jak ti to šlo?" className="glass sticky bottom-chrome z-20 mt-auto flex h-[76px] lg:bottom-6 lg:mt-0 w-full max-w-[640px] gap-1 rounded-full p-1.5">
                {ratings.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={(e) => rate(r.key, e.detail > 0)}
                    aria-keyshortcuts={String(r.key)}
                    className={cn("press flex h-16 flex-1 items-center gap-3 rounded-full px-3 text-left hover:bg-panel hover:shadow-[0_2px_8px_var(--glass-shadow)] focus-visible:bg-panel sm:px-[18px]", rateTone[r.tone])}
                  >
                    <span className="hidden sm:contents">
                      <Kbd className="size-[26px] rounded-lg text-[12px]">{r.key}</Kbd>
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5 text-[14px] font-semibold">
                        <span aria-hidden className={cn("size-[7px] rounded-full", dots[r.tone])} />
                        {r.label}
                      </span>
                      <span className="text-[12px] text-muted">{r.interval}</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <ActionBar label="Kartička" className="mt-auto lg:mt-0 lg:pl-3.5">
                <button type="button" onClick={(e) => advance(e.detail > 0)} className="press flex h-11 items-center gap-1.5 rounded-full px-3.5 text-[14px] font-medium text-muted hover:text-fg">
                  <SkipForward size={15} strokeWidth={1.5} aria-hidden />
                  Přeskočit
                </button>
                <div className="flex-1" />
                <span className="hidden sm:contents">
                  <Kbd className="px-2">mezerník</Kbd>
                </span>
                <PrimaryPill onClick={(e) => flip(e.detail > 0)} size={44} aria-keyshortcuts="Space">
                  Otočit kartičku
                </PrimaryPill>
              </ActionBar>
            )}
          </>
        )}
      </div>
    </>
  );
}

function FlashcardSurface({ revealed, onSwipe, children }: { revealed: boolean; onSwipe: (direction: number) => void; children: ReactNode }) {
  const drag = useDragControls();
  const x = useMotionValue(0);
  // Bound up front: transforms first created by the exit variant never render.
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const rotateZ = useMotionValue(0);
  // Tilt with the finger, like a card held at the bottom.
  const rotate = useTransform(x, [-200, 0, 200], [-8, 0, 8]);
  const reduce = useReducedMotion();
  const present = useIsPresent();

  return (
    <motion.article
      aria-live="polite"
      aria-hidden={!present || undefined}
      inert={!present}
      drag="x"
      dragListener={false}
      dragControls={drag}
      dragMomentum={false}
      dragConstraints={{ left: -76, right: 76 }}
      dragElastic={0.24}
      style={{ x, y, rotate, rotateZ, scale }}
      exit="out"
      variants={{ out: (exit: Departure) => ({
        // Pixels, not %: x is a px motion value shared with the drag, and units can't be mixed.
        x: !reduce && exit ? exit.direction === "left" ? -window.innerWidth : exit.direction === "right" ? window.innerWidth : 0 : 0,
        y: !reduce && exit?.direction === "up" ? -320 : 0,
        // rotateZ, because rotate is derived from x for the drag tilt.
        rotateZ: !reduce && exit ? exit.direction === "left" ? -10 : exit.direction === "right" ? 10 : 0 : 0,
        scale: !reduce && exit?.direction === "up" ? 0.92 : 1,
        opacity: 0,
        transition: !exit
          ? { duration: 0 }
          : reduce
            ? { duration: dur.panel, ease: ease.out }
            : { ...(exit.gesture ? { ...springMomentum, duration: 0.6 } : fly), opacity: { duration: 0.25, delay: 0.35, ease: "linear" } },
      }) }}
      onPointerDown={(e) => {
        if (revealed && !reduce && e.pointerType === "touch" && !(e.target as HTMLElement).closest("a, button")) {
          drag.start(e, { distanceThreshold: 10 });
        }
      }}
      onDragEnd={(_, info) => {
        const projected = info.offset.x + project(info.velocity.x);
        if (Math.abs(projected) >= 100 && Math.abs(info.offset.x) >= 10) {
          onSwipe(Math.sign(projected));
        } else animateValue(x, 0, Math.abs(info.velocity.x) > 100 ? springMomentum : spring);
      }}
      className={cn(
        "grid min-h-[420px] w-full origin-bottom touch-pan-y [perspective:1600px]",
        present ? "relative z-[3]" : "pointer-events-none absolute inset-0 z-10",
      )}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: revealed && !reduce ? 180 : 0, scale: revealed && !reduce ? [1, 1.04, 1] : 1 }}
        transition={{ duration: 0.65, ease: ease.inOut }}
        className="grid [transform-style:preserve-3d]"
      >
        {children}
      </motion.div>
    </motion.article>
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
