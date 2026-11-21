"use client";

import { BorderBeam, type BorderBeamProps } from "border-beam";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";

const noop = () => () => {};

// The library's light preset is tuned for a near-invisible glow; on white glass it reads as a smudge.
// These multipliers feed the opacity calc() of the stroke, inner glow and bloom layers.
const lightBoost = { "--beam-stroke-opacity": 5, "--beam-inner-opacity": 2.5, "--beam-bloom-opacity": 2.5 } as CSSProperties;
// In dark mode the pill's slim segments need a little more presence than the card preset.
const darkBoost = { "--beam-stroke-opacity": 2.4, "--beam-inner-opacity": 2.4, "--beam-bloom-opacity": 2.6 } as CSSProperties;

/** Calm pace along the border. */
const SPEED = 150; // px/s
/** The beam is a chain of short segments (head first) so it can be long and still bend around the ends. */
const SEGMENTS = 7;
/** Beam length, capped to a third of the border on small pills. */
const LENGTH = 300; // px

/** Head (warm) → tail (cool); the focus ring uses the same colours. */
const palette = ["255, 120, 40", "255, 50, 100", "240, 50, 180", "180, 40, 240", "100, 70, 255", "40, 140, 255", "30, 185, 170"];

type Size = { w: number; h: number };

/**
 * The library spins one conic mask around the element's centre at a constant angle per second.
 * On a wide pill that crosses each rounded end in a few degrees (the beam "jumps" top → bottom),
 * and its colour spots, placed for a card, leave whole edges uncoloured.
 *
 * Here each segment is a short conic whose centre slides along the pill's spine and only turns at
 * the ends, so every border point is h/2 away from it: a segment keeps its size and moves at
 * constant speed (keyframes are timed by arc length). Segments share the path, each a fixed
 * distance behind the previous one, so the whole beam bends around the ends without stretching.
 */
function pillCss({ w, h }: Size, dark: boolean) {
  const r = h / 2;
  const straight = Math.max(0, w - h);
  const total = 2 * straight + 2 * Math.PI * r;
  const duration = total / SPEED;
  const gap = Math.min(LENGTH, total / 3) / (SEGMENTS - 1);
  const at = (len: number) => `${((len / total) * 100).toFixed(3)}%`;
  // Stops are given in degrees from a segment's heading (50% of its conic).
  const deg = (d: number) => `${(50 + d / 3.6).toFixed(2)}%`;
  const seg = Array.from({ length: SEGMENTS }, (_, i) => {
    const fade = (1 - i / SEGMENTS) ** 0.9; // the tail fades out
    const from = `from var(--pa${i}-{id}) at var(--px${i}-{id}) 50%`;
    const cone = (rgb: string, a: number) =>
      `conic-gradient(${from}, rgba(${rgb}, 0) ${deg(-60)}, rgba(${rgb}, ${a.toFixed(3)}) ${deg(-30)}, rgba(${rgb}, ${a.toFixed(3)}) ${deg(30)}, rgba(${rgb}, 0) ${deg(60)})`;
    return {
      fade,
      cone,
      color: palette[Math.round((i * (palette.length - 1)) / (SEGMENTS - 1))],
      // Head first; the others started earlier by their distance behind it.
      animation: `pill-${i}-{id} ${duration.toFixed(2)}s linear ${(-(SEGMENTS - 1 - i) * gap / SPEED).toFixed(3)}s infinite`,
      css: `
@property --pa${i}-{id} { syntax: "<angle>"; inherits: true; initial-value: 0deg; }
@property --px${i}-{id} { syntax: "<length>"; inherits: true; initial-value: 0px; }
@keyframes pill-${i}-{id} {
  0% { --pa${i}-{id}: -180deg; --px${i}-{id}: ${r}px; }
  ${at(straight)} { --pa${i}-{id}: -180deg; --px${i}-{id}: ${w - r}px; }
  ${at(straight + Math.PI * r)} { --pa${i}-{id}: 0deg; --px${i}-{id}: ${w - r}px; }
  ${at(2 * straight + Math.PI * r)} { --pa${i}-{id}: 0deg; --px${i}-{id}: ${r}px; }
  100% { --pa${i}-{id}: 180deg; --px${i}-{id}: ${r}px; }
}`,
    };
  });
  const c = dark ? "255, 255, 255" : "0, 0, 0";
  const anims = seg.map((s) => s.animation).join(", ");
  const ring = "linear-gradient(#fff 0 0), linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)";
  // ::before (inner glow) keeps an inset shadow instead of a filled background: filled, a conic shows as a spotlight cone.
  return `${seg.map((s) => s.css).join("")}
[data-beam="{id}"][data-active] { animation: ${anims}, beam-fade-in-{id} 0.6s ease forwards; }
[data-beam="{id}"][data-fading] { animation: ${anims}, beam-fade-out-{id} 0.5s ease forwards; }
[data-beam="{id}"][data-active]::after, [data-beam="{id}"][data-fading]::after {
  padding: 1.5px;
  background: ${seg.slice(0, 3).map((s) => s.cone(c, (dark ? 0.55 : 0.3) * s.fade)).join(", ")}, ${seg.map((s) => s.cone(s.color, s.fade)).join(", ")};
  -webkit-mask-image: ${ring};
  mask-image: ${ring};
}
[data-beam="{id}"][data-active]::before, [data-beam="{id}"][data-fading]::before {
  background: none;
  box-shadow: inset 0 0 ${dark ? "18px 3px" : "12px 1px"} rgba(140, 80, 255, ${dark ? 1 : 0.35});
  -webkit-mask-image: ${seg.map((s) => s.cone("255, 255, 255", s.fade)).join(", ")};
  mask-image: ${seg.map((s) => s.cone("255, 255, 255", s.fade)).join(", ")};
}
[data-beam="{id}"] [data-beam-bloom] { background: ${seg.map((s) => s.cone(c, (dark ? 0.7 : 0.5) * s.fade)).join(", ")}; }`;
}

/** Focus feedback: a calm palette ring with a soft halo, faded in while the pill is focused.
 * The halo is an outer box-shadow, which is never painted under the element, so the frosted glass stays untinted. */
const focusCss = (dark: boolean) => `
[data-beam="{id}"] > [data-pill-ring], [data-beam="{id}"] > [data-pill-halo] {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 320ms ease-out;
}
[data-beam="{id}"] > [data-pill-ring] {
  z-index: 2;
  background: linear-gradient(90deg, ${[...palette].reverse().map((rgb) => `rgb(${rgb})`).join(", ")});
  padding: 1.5px;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
}
[data-beam="{id}"] > [data-pill-halo] {
  box-shadow: -14px 0 26px -6px rgba(${palette[6]}, ${dark ? 0.6 : 0.4}), 14px 0 26px -6px rgba(${palette[0]}, ${dark ? 0.6 : 0.4}), 0 0 20px -4px rgba(${palette[3]}, ${dark ? 0.6 : 0.4});
}
[data-beam="{id}"] > [data-pill-ring][data-on] { opacity: ${dark ? 0.85 : 0.7}; }
[data-beam="{id}"] > [data-pill-halo][data-on] { opacity: 1; }
@media (prefers-reduced-motion: reduce) {
  [data-beam="{id}"] > [data-pill-ring], [data-beam="{id}"] > [data-pill-halo] { transition: none; }
}`;

type PillBeamProps = Omit<BorderBeamProps, "size" | "borderRadius" | "duration"> & {
  /** The pill has focus: the beam rests and a calm ring lights up instead. */
  focused?: boolean;
};

/** border-beam travelling all the way around a pill-shaped child; follows the app theme, pauses with reduced motion. */
export function PillBeam({ active = true, focused = false, style, children, ...props }: PillBeamProps) {
  const reduce = useReducedMotion();
  const { resolvedTheme } = useTheme();
  // The theme is only known on the client; the server and hydration render use light so the beam's <style> matches.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const theme = mounted && resolvedTheme === "dark" ? "dark" : "light";
  const dark = theme === "dark";

  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);
      setSize((s) => (s?.w === w && s.h === h ? s : { w, h }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <BorderBeam
      ref={ref}
      size="md"
      colorVariant="colorful"
      strength={0.7}
      theme={theme}
      borderRadius={size ? size.h / 2 : undefined}
      // The beam layers clip themselves (clip-path); the root's overflow: hidden would only cut off the child's shadow.
      css={'[data-beam="{id}"] { overflow: visible; }' + focusCss(dark) + (size ? pillCss(size, dark) : "")}
      style={{ ...(dark ? darkBoost : lightBoost), ...style }}
      {...props}
      // Wait for the measurement so the first loop already follows the pill.
      active={active && !focused && !reduce && size !== null}
    >
      {children}
      <span aria-hidden data-pill-halo="" data-on={focused ? "" : undefined} />
      <span aria-hidden data-pill-ring="" data-on={focused ? "" : undefined} />
    </BorderBeam>
  );
}
