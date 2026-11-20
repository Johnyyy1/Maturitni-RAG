"use client";

import { BookOpen, ChartNoAxesColumn, Layers2, PanelLeft, Search, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ViewTransition, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { springMomentum } from "@/lib/motion";
import { GlassIconButton } from "@/components/ui/buttons";
import { useUi } from "@/components/providers";
import { Sidebar } from "@/components/shell/sidebar";
import { cn } from "@/lib/cn";

/** Sidebar (≥1024px) or the floating tab bar (below), around the page content. */
export function AppShell({ variant = "student", children }: { variant?: "student" | "editor"; children: ReactNode }) {
  const { sidebarCollapsed, setSidebarCollapsed } = useUi();
  return (
    <>
      <Sidebar variant={variant} />
      {sidebarCollapsed && (
        <div className="fixed top-[22px] left-2.5 z-30 hidden lg:block">
          <GlassIconButton icon={PanelLeft} label="Zobrazit panel" onClick={() => setSidebarCollapsed(false)} />
        </div>
      )}
      <ViewTransition name="studium-content" default={{ "nav-back": "nav-back", default: "page" }}>
        <main id="obsah" className={cn("shell-content min-h-dvh pb-32 lg:pb-0", sidebarCollapsed ? "lg:pl-[56px]" : "lg:pl-[250px]")}>{children}</main>
      </ViewTransition>
      {variant === "student" && <MobileTabBar />}
    </>
  );
}

/** Floating bar at the top of a page. Shows a scroll edge (gradient, not a line) once content moves under it. */
export function TopBar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <>
      <div aria-hidden className="scroll-edge pointer-events-none fixed inset-x-0 top-0 z-10 h-24 bg-linear-to-b from-(--bg-d) from-40% to-transparent" />
      <div className={cn("scroll-lift sticky top-3 z-20 flex h-11 items-center gap-2 lg:top-[22px] lg:h-10", className)}>{children}</div>
    </>
  );
}

const tabs = [
  { label: "Dnes", icon: Sun, href: "/", match: (p: string) => p === "/" },
  { label: "Předměty", icon: BookOpen, href: "/balicky", match: (p: string) => p.startsWith("/predmety") || p.startsWith("/balicky") },
  { label: "Kartičky", icon: Layers2, href: "/karticky", match: (p: string) => p.startsWith("/karticky") },
  { label: "Pokrok", icon: ChartNoAxesColumn },
];

/** MobileTabBar: floating glass capsule plus a separate round search button. */
export function MobileTabBar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const mark = useRef(0);
  const [compact, setCompact] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    if (window.innerWidth < 1024 && (y <= 0 || Math.abs(y - mark.current) > 18)) {
      setCompact(y > mark.current && y > 72);
      mark.current = y;
    }
  });
  const { openCommand } = useUi();
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-36 bg-linear-to-b from-transparent to-(--bg-d) to-75% lg:hidden" />
      <div className="fixed right-3 bottom-[max(20px,env(safe-area-inset-bottom))] left-4 z-30 flex items-center gap-2 lg:hidden">
        <motion.nav initial={false} animate={{ scale: compact && !reduce ? 0.92 : 1 }} aria-label="Hlavní navigace" className="scroll-lift glass flex h-[62px] flex-1 items-center rounded-full p-1 [--g-blur:30px] [--g-b:30px]">
          {tabs.map((t) => {
            const active = !!t.match?.(pathname);
            const cls = cn(
              "press relative flex h-[54px] flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-semibold",
              active ? "text-accent" : "text-fg",
            );
            const body = (
              <>
                {active && <motion.span aria-hidden layoutId="mobile-tab-lens" transition={reduce ? { duration: 0 } : springMomentum} className="absolute inset-0 rounded-full bg-ring" />}
                <t.icon className="relative" size={22} strokeWidth={active ? 2 : 1.5} aria-hidden />
                <span className="relative">{t.label}</span>
              </>
            );
            return t.href ? (
              <Link key={t.label} href={t.href} aria-current={active ? "page" : undefined} className={cls}>
                {body}
              </Link>
            ) : (
              <span key={t.label} aria-disabled="true" title="Připravujeme" className={cls}>
                {body}
              </span>
            );
          })}
        </motion.nav>
        <button
          type="button"
          onClick={openCommand}
          aria-label="Hledat"
          className="glass press flex size-[62px] items-center justify-center rounded-full text-fg [--g-blur:30px] [--g-b:30px]"
        >
          <Search size={22} strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    </>
  );
}
