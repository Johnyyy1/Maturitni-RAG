"use client";

import { BorderBeam, type BorderBeamProps } from "border-beam";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Animated glow around the border of its child (border-beam), following the app theme and reduced motion. */
export function Beam(props: BorderBeamProps) {
  const reduce = useReducedMotion();
  const { resolvedTheme } = useTheme();
  // The theme is only known on the client; the server and hydration render use light so the beam's <style> matches.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const theme = mounted && resolvedTheme === "dark" ? "dark" : "light";
  // The beam layers clip themselves (clip-path); the root's overflow: hidden would only cut off the child's shadow.
  return <BorderBeam size="md" colorVariant="colorful" strength={0.7} theme={theme} active={!reduce} css={'[data-beam="{id}"] { overflow: visible; }'} {...props} />;
}
