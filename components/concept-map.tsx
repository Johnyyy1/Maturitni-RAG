"use client";

import { ArrowRight, ChevronLeft, Eye, List, Maximize2, Minus, Network, Plus, X, Zap } from "lucide-react";
import { animate, AnimatePresence, motion, useDragControls, useMotionValue, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CitationChip, Chip } from "@/components/ui/bits";
import { GlassButton, GlassIconButton, PrimaryPill } from "@/components/ui/buttons";
import { Segmented } from "@/components/ui/segmented";
import { Sheet } from "@/components/ui/sheet";
import { questionHref } from "@/lib/mock/questions";
import { inspector, spring } from "@/lib/motion";
import { cn } from "@/lib/cn";
import type { ConceptNode, Question } from "@/lib/types";

const W = 812;
const H = 880;

export function ConceptMap({ question, nodes, edges }: { question: Question; nodes: ConceptNode[]; edges: Record<string, string> }) {
  const [selected, setSelected] = useState<string | null>("atentat");
  const [sheet, setSheet] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [list, setList] = useState(false);
  const canvas = useRef<HTMLDivElement>(null);
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const drag = useDragControls();
  const moved = useRef(false);
  const pinch = useRef<{ distance: number; zoom: number } | null>(null);
  const reduce = useReducedMotion();
  const node = nodes.find((n) => n.id === selected);
  const studyHref = questionHref(question, "studium");

  const select = (id: string) => {
    if (window.matchMedia("(min-width: 1024px)").matches) setSelected(id);
    else setSheet(id);
  };

  const fit = () => {
    const el = canvas.current;
    if (el?.clientWidth) {
      x.jump(0);
      y.jump(0);
      setZoom(Math.max(0.3, Math.min(1, Math.floor(Math.min(el.clientWidth / W, el.clientHeight / H) * 20) / 20)));
    }
  };

  // Start fitted when the canvas is smaller than the drawing.
  useLayoutEffect(fit, [x, y]);

  useEffect(() => {
    if (reduce) scale.jump(zoom);
    else {
      const animation = animate(scale, zoom, spring);
      return () => animation.stop();
    }
  }, [zoom, scale, reduce]);

  useEffect(() => {
    const el = canvas.current;
    if (!el || list) return;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((z) => Math.max(0.3, Math.min(2, z * Math.exp(-e.deltaY * 0.002))));
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [list]);

  const path = new Set<string>();
  for (let current = node; current?.parent && !path.has(current.id); current = nodes.find((n) => n.id === current?.parent)) {
    path.add(current.id);
  }

  return (
    <div className="flex gap-3 lg:h-dvh lg:py-2.5 lg:pr-2.5 lg:pl-3">
      {/* Mobile: accessible list of relations (no canvas) */}
      <div className="flex flex-1 flex-col px-4 pt-3 lg:hidden">
        <div className="sticky top-3 z-20 flex h-11 items-center gap-2">
          <GlassIconButton href={questionHref(question)} icon={ChevronLeft} label="Zpět na otázku" size={44} />
          <div className="flex-1" />
          <Segmented
            label="Režim otázky"
            value="mapa"
            items={[
              { label: "Studovat", value: "studium", href: studyHref },
              { label: "Mapa", value: "mapa", href: questionHref(question, "mapa") },
              { label: "Vyzkoušet se", value: "zkouska", href: questionHref(question, "zkouska") },
            ]}
          />
        </div>
        <h1 className="mt-6 text-[30px] leading-[1.1] font-bold tracking-[-0.8px]">Mapa pojmů</h1>
        <p className="mt-1.5 text-[16px] text-muted">{question.title}</p>
        <div className="surface mt-[18px] rounded-[22px] p-2">
          <RelationList nodes={nodes} selected={sheet} onSelect={select} />
        </div>
      </div>

      {/* Desktop canvas */}
      <section aria-label="Mapa pojmů" className="surface relative hidden min-w-0 flex-1 overflow-hidden rounded-[22px] lg:block">
        <div className="absolute inset-x-4 top-3.5 z-10 flex h-10 items-center gap-2">
          <div className="glass-thin flex h-10 items-center gap-2 rounded-full pr-4 pl-3.5 text-[13px]">
            <Link href={questionHref(question)} aria-label="Zpět na otázku" className="hit flex items-center gap-2">
              <Network size={15} strokeWidth={2} aria-hidden />
              <span className="font-semibold">Mapa pojmů</span>
            </Link>
            <span className="font-medium text-muted">Otázka {question.id}</span>
          </div>
          <div className="flex-1" />
          <div role="group" aria-label="Přiblížení" className="glass-thin flex h-10 items-center rounded-full px-1">
            <GlassIconButton icon={Minus} label="Oddálit" size={32} iconSize={15} variant="plain" onClick={() => setZoom((z) => Math.max(0.3, +(z - 0.1).toFixed(2)))} />
            <button type="button" onClick={() => { x.jump(0); y.jump(0); setZoom(1); }} aria-label="Obnovit přiblížení" className="tnum h-8 w-14 rounded-full text-[13px] font-semibold hover:bg-ring">
              {Math.round(zoom * 100)} %
            </button>
            <GlassIconButton icon={Plus} label="Přiblížit" size={32} iconSize={15} variant="plain" onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)))} />
            <GlassIconButton icon={Maximize2} label="Přizpůsobit oknu" size={32} iconSize={15} variant="plain" onClick={fit} />
          </div>
          <GlassButton icon={List} aria-pressed={list} onClick={() => setList((v) => !v)}>
            {list ? "Mapa" : "Seznam vazeb"}
          </GlassButton>
        </div>

        {list ? (
          <div className="h-full overflow-y-auto px-6 pt-20 pb-20">
            <h2 className="sr-only">Seznam vazeb</h2>
            <div className="mx-auto max-w-[560px]">
              <RelationList nodes={nodes} selected={selected} onSelect={select} />
            </div>
          </div>
        ) : (
          <div
            ref={canvas}
            className="absolute inset-0 cursor-grab touch-none [contain:paint] active:cursor-grabbing"
            onPointerDown={(e) => {
              if (!e.isPrimary) return;
              moved.current = false;
              drag.start(e, { distanceThreshold: 10 });
            }}
            onTouchStart={(e) => {
              if (e.touches.length !== 2) return;
              const [a, b] = Array.from(e.touches);
              drag.cancel();
              moved.current = true;
              scale.stop();
              x.stop();
              y.stop();
              pinch.current = { distance: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), zoom: scale.get() };
            }}
            onTouchMove={(e) => {
              if (!pinch.current?.distance || e.touches.length !== 2) return;
              const [a, b] = Array.from(e.touches);
              const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
              scale.jump(Math.max(0.3, Math.min(2, pinch.current.zoom * distance / pinch.current.distance)));
            }}
            onTouchEnd={() => {
              if (!pinch.current) return;
              pinch.current = null;
              setZoom(scale.get());
            }}
            onTouchCancel={() => {
              pinch.current = null;
              setZoom(scale.get());
            }}
            onClickCapture={(e) => { if (moved.current && e.detail > 0) e.stopPropagation(); }}
          >
            <motion.div
              drag
              dragControls={drag}
              dragListener={false}
              dragMomentum={!reduce}
              dragConstraints={canvas}
              onDragStart={() => { moved.current = true; }}
              className="absolute top-0 left-1/2 -translate-x-1/2"
              style={{ x, y, width: W, height: H }}
            >
              <motion.div style={{ scale, transformOrigin: "50% 40%" }} className="size-full">
                <svg aria-hidden width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute top-[90px] left-0">
                  {Object.entries(edges).map(([id, d]) => (
                    <path key={id} d={d} fill="none" stroke={path.has(id) ? "var(--accent)" : "var(--axis)"} strokeWidth={1.5} strokeLinecap="round" className="map-edge" />
                  ))}
                </svg>
                <ul aria-label="Pojmy">
                  {nodes.map((n) => (
                    <li key={n.id} className="absolute" style={{ left: n.x, top: n.y }}>
                      <MapNode node={n} active={selected === n.id} onSelect={() => select(n.id)} />
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </div>
        )}

        <p className="glass-thin absolute bottom-4 left-4 flex h-10 items-center gap-1.5 rounded-full pr-4 pl-3.5 text-[12px] font-medium text-muted">
          <Eye size={14} strokeWidth={1.5} aria-hidden />
          Pouze pro čtení
        </p>
      </section>

      <AnimatePresence initial={false}>
        {node && <Inspector key="detail" node={node} nodes={nodes} studyHref={studyHref} onClose={() => setSelected(null)} onSelect={setSelected} />}
      </AnimatePresence>

      <Sheet open={sheet !== null} onClose={() => setSheet(null)} label="Vybraný pojem">
        {sheet && (
          <div className="flex flex-col overflow-y-auto px-5 pb-5">
            <NodeDetail node={nodes.find((n) => n.id === sheet)!} nodes={nodes} studyHref={studyHref} onClose={() => setSheet(null)} onSelect={setSheet} />
          </div>
        )}
      </Sheet>
    </div>
  );
}

function MapNode({ node, active, onSelect }: { node: ConceptNode; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "press flex items-center gap-2 rounded-full whitespace-nowrap shadow-[0_2px_8px_var(--glass-shadow)]",
        node.root ? "h-12 bg-fg px-[22px] text-[16px] font-semibold text-on-fg" : "h-10 px-4 text-[14px]",
        !node.root && !active && "bg-panel font-medium shadow-[inset_0_0_0_1px_var(--ring-strong),0_2px_8px_var(--glass-shadow)] hover:shadow-[inset_0_0_0_1px_var(--accent),0_2px_8px_var(--glass-shadow)]",
        !node.root && active && "bg-soft font-semibold text-accent shadow-[inset_0_0_0_1.5px_var(--accent),0_2px_8px_var(--glass-shadow)]",
      )}
    >
      {active && !node.root && <span aria-hidden className="size-[7px] rounded-full bg-accent" />}
      {node.label}
    </button>
  );
}

/** The map as a nested list: the accessible alternative to the canvas. */
function RelationList({ nodes, selected, onSelect }: { nodes: ConceptNode[]; selected: string | null; onSelect: (id: string) => void }) {
  const children = (id?: string) => nodes.filter((n) => n.parent === id);
  const render = (list: ConceptNode[], depth: number) => (
    <ul className={cn("flex flex-col gap-0.5", depth > 0 && "ml-5 border-l border-border pl-2")}>
      {list.map((n) => (
        <li key={n.id}>
          <button
            type="button"
            onClick={() => onSelect(n.id)}
            aria-current={selected === n.id ? "true" : undefined}
            className={cn(
              "row flex h-11 w-full items-center gap-2 rounded-xl px-3 text-left text-[15px] hover:bg-hover",
              depth === 0 ? "font-semibold" : "font-medium",
              selected === n.id && "bg-soft text-accent",
            )}
          >
            <span className="flex-1">{n.label}</span>
            {n.parent && <span className="sr-only">, navazuje na {nodes.find((p) => p.id === n.parent)?.label}</span>}
            <ArrowRight size={15} strokeWidth={1.5} className="text-muted" aria-hidden />
          </button>
          {children(n.id).length > 0 && render(children(n.id), depth + 1)}
        </li>
      ))}
    </ul>
  );
  return render(children(undefined), 0);
}

function Inspector(props: { node: ConceptNode; nodes: ConceptNode[]; studyHref: string; onClose: () => void; onSelect: (id: string) => void }) {
  const reduce = useReducedMotion();
  return (
    <motion.aside
      aria-label="Vybraný pojem"
      {...inspector}
      initial={reduce ? { opacity: 0 } : inspector.initial}
      exit={reduce ? { opacity: 0, transition: inspector.exit.transition } : inspector.exit}
      className="glass-thick hidden w-[344px] shrink-0 flex-col overflow-y-auto rounded-[22px] pt-3.5 pr-3.5 pb-5 pl-5 lg:flex"
    >
      <NodeDetail {...props} />
    </motion.aside>
  );
}

function NodeDetail({ node, nodes, studyHref, onClose, onSelect }: { node: ConceptNode; nodes: ConceptNode[]; studyHref: string; onClose: () => void; onSelect: (id: string) => void }) {
  const d = node.detail;
  const related = d?.related ?? nodes.filter((n) => n.parent === node.id).map((n) => n.label);
  return (
    <>
      <div className="flex h-10 shrink-0 items-center">
        <p className="flex-1 text-[12px] font-semibold text-muted">Vybraný pojem</p>
        <GlassIconButton icon={X} label="Zavřít" size={32} iconSize={16} variant="plain" onClick={onClose} />
      </div>
      <div key={node.id} className="flex flex-col gap-2.5 pt-3.5 pr-1.5">
        <h2 className="text-[24px] font-semibold tracking-[-0.6px]">{node.label}</h2>
        {d && (
          <>
            <Chip icon={Zap} tone="accent" className="self-start">
              {d.kind}
            </Chip>
            <p className="text-[14px] leading-[1.6] text-muted">{d.text}</p>
            <CitationChip n={1} label={d.citation} href={`${studyHref}#zdroj-1`} />
          </>
        )}
        <PrimaryPill href={studyHref} arrow size={44} full className="mt-2">
          Studovat tento pojem
        </PrimaryPill>
      </div>
      {related.length > 0 && (
        <div className="mt-6 flex flex-col gap-2 pr-1.5">
          <p className="text-[12px] font-semibold text-muted">Navazuje na</p>
          <ul className="flex flex-col gap-2">
            {related.map((label) => {
              const target = nodes.find((n) => n.label === label);
              const cls = "solid press flex h-11 w-full items-center rounded-xl px-3 text-left text-[14px] font-medium";
              const body = (
                <>
                  <span className="flex-1">{label}</span>
                  <ArrowRight size={15} strokeWidth={1.5} className="text-muted" aria-hidden />
                </>
              );
              return (
                <li key={label}>
                  {target ? (
                    <button type="button" className={cls} onClick={() => onSelect(target.id)}>
                      {body}
                    </button>
                  ) : (
                    <Link href={studyHref} className={cls}>
                      {body}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
