/**
 * Motion tokens. The single source of truth for JS; the same values live as CSS variables in
 * app/globals.css (`--ease-*`, `--dur-*`). Don't add curves or durations anywhere else.
 */
export const ease = {
  out: [0.23, 1, 0.32, 1],
  inOut: [0.77, 0, 0.175, 1],
  drawer: [0.32, 0.72, 0, 1],
  icon: [0.2, 0, 0, 1],
} as const;

/** Seconds, for Motion. Mirrors --dur-* in globals.css. */
export const dur = {
  press: 0.12,
  hover: 0.15,
  tooltip: 0.15,
  popover: 0.18,
  panel: 0.24,
  exit: 0.15,
  /** One-off drawings (parabola, score ring, count-up). */
  draw: 0.6,
} as const;

/** Default UI spring (MotionConfig). */
export const spring = { type: "spring", bounce: 0, duration: 0.35 } as const;
/** Icon swaps. */
export const springIcon = { type: "spring", bounce: 0, duration: 0.3 } as const;
/** Only after a gesture with momentum (and the tab bar lens). */
export const springMomentum = { type: "spring", bounce: 0.2, duration: 0.4 } as const;

/** Contextual icon swap (Jakub): scale 0.25 → 1, opacity, blur 4 → 0. */
export const iconSwap = {
  initial: { opacity: 0, scale: 0.25, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.25, filter: "blur(4px)" },
  transition: springIcon,
} as const;

/** Inspector materialising from the right (Studium, Mapa). */
export const inspector = {
  initial: { opacity: 0, x: 16, filter: "blur(4px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: { opacity: 0, x: 16, filter: "blur(4px)", transition: { duration: dur.exit, ease: ease.out } },
} as const;

/** Apple's momentum projection: where a fling with velocity `v` (px/s) comes to rest. */
export function project(v: number, decelerationRate = 0.998) {
  return ((v / 1000) * decelerationRate) / (1 - decelerationRate);
}
