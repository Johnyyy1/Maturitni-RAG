"use client";

import {
  BookOpen,
  ChartNoAxesColumn,
  ChevronsUpDown,
  Layers2,
  ListChecks,
  ListTodo,
  Monitor,
  Moon,
  Package,
  PanelLeft,
  Send,
  Settings,
  ShieldCheck,
  Sun,
  Upload,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Menu } from "@base-ui/react/menu";
import { Tooltip } from "@base-ui/react/tooltip";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { useState, type ReactNode } from "react";
import { DataIcon } from "@/components/icon";
import { useUi } from "@/components/providers";
import { editor, student, studyPackage, subjects } from "@/lib/mock/subjects";
import { cn } from "@/lib/cn";
import type { IconName } from "@/lib/types";

type NavItem = { label: string; icon: LucideIcon | IconName; href?: string; match?: (p: string) => boolean; count?: string };

const studentNav: NavItem[] = [
  { label: "Dnes", icon: Sun, href: "/", match: (p) => p === "/" },
  { label: "Předměty", icon: BookOpen, href: "/balicky", match: (p) => p.startsWith("/balicky") },
  { label: "Kartičky", icon: Layers2, href: "/karticky", match: (p) => p.startsWith("/karticky"), count: String(student.dueCards) },
  { label: "Kvízy", icon: ListChecks, href: "/kvizy/novy", match: (p) => p.startsWith("/kvizy") },
  { label: "Pokrok", icon: ChartNoAxesColumn },
];

const subjectNav: NavItem[] = subjects.map((s) => ({
  label: s.name,
  icon: s.icon,
  href: `/predmety/${s.slug}/otazky/${s.firstQuestion}`,
  match: (p) => p.startsWith(`/predmety/${s.slug}/`),
}));

const editorNav: NavItem[] = [
  { label: "Balíčky", icon: Package },
  { label: "Otázky", icon: ListTodo },
  { label: "Importy", icon: Upload, href: "/redakce/importy/24", match: (p) => p.startsWith("/redakce/importy"), count: "1" },
  { label: "Publikace", icon: Send },
  { label: "Ověřování", icon: ShieldCheck },
];

/** Sidebar: thick glass, brand and collapse button inside the panel. */
export function Sidebar({ variant = "student" }: { variant?: "student" | "editor" }) {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useUi();
  const isEditor = variant === "editor";
  const person = isEditor ? editor : student;
  // The clicked item lights up at once, while the route may still be loading.
  const [pending, setPending] = useState<{ from: string; to: string } | null>(null);
  const current = pending?.from === pathname ? pending.to : pathname;
  const go = (to: string) => setPending({ from: pathname, to });

  return (
    <>
      {sidebarCollapsed && (
        <div className="fixed top-[72px] left-2.5 z-30 hidden flex-col gap-1 lg:flex">
          <Tooltip.Provider delay={400} closeDelay={0}>
            {(isEditor ? editorNav : [...studentNav, ...subjectNav]).filter((item) => item.href).map((item) => (
              <SidebarItem key={item.label} item={item} active={!!item.match?.(current)} onNavigate={go} compact />
            ))}
          </Tooltip.Provider>
        </div>
      )}
      <aside
        aria-label="Postranní panel"
        inert={sidebarCollapsed}
        aria-hidden={sidebarCollapsed || undefined}
        data-collapsed={sidebarCollapsed || undefined}
        className="sidebar-slide glass-thick fixed top-2.5 bottom-2.5 left-2.5 z-30 hidden w-60 flex-col gap-0.5 overflow-y-auto rounded-[22px] p-2.5 lg:flex"
      >
        <div className="flex h-11 shrink-0 items-center pr-1 pl-2.5">
          <Link href="/" className="flex-1 text-[17px] font-semibold tracking-[-0.4px]">
            Studium
          </Link>
          <button
            type="button"
            onClick={() => setSidebarCollapsed(true)}
            aria-label="Skrýt panel"
            title="Skrýt panel"
            className="hit press flex size-8 items-center justify-center rounded-[10px] text-muted hover:bg-ring hover:text-fg"
          >
            <PanelLeft size={17} strokeWidth={1.5} aria-hidden />
          </button>
        </div>

        <Link href="/balicky" className="press flex h-12 shrink-0 items-center gap-2.5 rounded-xl bg-ring px-2.5" aria-label={`Studijní balíček: ${isEditor ? editor.workspace : studyPackage.title}. Změnit`}>
          <span className="flex flex-1 flex-col gap-px">
            <span className="text-[13px] font-semibold">{isEditor ? editor.workspace : studyPackage.title}</span>
            <span className="text-[12px] text-muted">{isEditor ? editor.school : studyPackage.label}</span>
          </span>
          <ChevronsUpDown size={14} strokeWidth={1.5} className="text-muted" aria-hidden />
        </Link>

        <nav aria-label={isEditor ? "Redakce" : "Pracovní prostor"} className="isolate flex flex-col gap-0.5">
          <SectionLabel>{isEditor ? "Redakce" : "Pracovní prostor"}</SectionLabel>
          {(isEditor ? editorNav : studentNav).map((item) => (
            <SidebarItem key={item.label} item={item} active={!!item.match?.(current)} onNavigate={go} />
          ))}
          {!isEditor && (
            <>
              <SectionLabel>Moje předměty</SectionLabel>
              {subjectNav.map((item) => (
                <SidebarItem key={item.label} item={item} active={!!item.match?.(current)} onNavigate={go} />
              ))}
            </>
          )}
        </nav>

        <div className="min-h-4 flex-1" />

        <div className="flex h-[52px] shrink-0 items-center gap-2.5 rounded-xl px-2">
          <span className="mesh-hero flex size-8 items-center justify-center rounded-full text-[12px] font-semibold text-white" aria-hidden>
            {person.initials}
          </span>
          <span className="flex flex-1 flex-col gap-px">
            <span className="text-[13px] font-semibold">{person.name}</span>
            <span className="text-[12px] text-muted">{person.role}</span>
          </span>
          <SettingsMenu />
        </div>
      </aside>
    </>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="px-2.5 pt-[18px] pb-1.5 text-[12px] font-medium text-muted">{children}</p>;
}

function SidebarItem({ item, active, onNavigate, compact = false }: { item: NavItem; active: boolean; onNavigate: (href: string) => void; compact?: boolean }) {
  const reduce = useReducedMotion();
  const color = active ? "text-accent" : "text-muted";
  const icon = typeof item.icon === "string"
    ? <DataIcon name={item.icon} size={16} className={cn("relative", color)} />
    : <item.icon size={16} strokeWidth={active ? 2 : 1.5} className={cn("relative", color)} aria-hidden />;
  const cls = cn("row relative flex shrink-0 items-center gap-2.5 rounded-xl text-[14px]", compact ? "size-10 justify-center" : "h-9 px-2.5", active ? "font-semibold" : "font-medium", !active && item.href && "hover:bg-hover");
  const href = item.href;
  if (!href) return <span aria-disabled="true" title="Připravujeme" className={cls}>{icon}{item.label}</span>;

  const link = (
    <Link href={href} onNavigate={() => onNavigate(href)} aria-label={compact ? item.label : undefined} aria-current={active ? "page" : undefined} className={cls}>
      {active && <motion.span aria-hidden layoutId={compact ? "sidebar-compact-pill" : "sidebar-pill"} transition={reduce ? { duration: 0 } : undefined} className="raised pointer-events-none absolute inset-0 -z-10 rounded-xl" />}
      {icon}
      {!compact && <span className="relative flex-1">{item.label}</span>}
      {!compact && item.count && <span className="tnum relative text-[12px] font-medium text-muted">{item.count}</span>}
    </Link>
  );
  if (!compact) return link;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger render={link} />
      <Tooltip.Portal>
        <Tooltip.Positioner side="right" sideOffset={8} className="z-50">
          <Tooltip.Popup className="tooltip solid rounded-lg px-2.5 py-1.5 text-[13px]">{item.label}</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

const themes = [
  { value: "light", label: "Světlý", icon: Sun },
  { value: "dark", label: "Tmavý", icon: Moon },
  { value: "system", label: "Podle systému", icon: Monitor },
] as const;

/** Settings: appearance menu. Solid (no glass on glass), opens from its trigger. */
export function SettingsMenu({ placement = "up" }: { placement?: "up" | "down" }) {
  const { theme, setTheme } = useTheme();

  return (
    <Menu.Root modal={false}>
      <Menu.Trigger
        aria-label="Nastavení vzhledu"
        className="hit press flex size-8 items-center justify-center rounded-[10px] text-muted hover:bg-ring hover:text-fg"
      >
        <Settings size={16} strokeWidth={1.5} aria-hidden />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side={placement === "up" ? "top" : "bottom"} align="end" sideOffset={8} className="z-50">
          <Menu.Popup aria-label="Vzhled" className="popover solid w-48 rounded-[14px] p-1 shadow-[0_10px_30px_var(--glass-shadow)]">
            <Menu.RadioGroup value={theme ?? ""} onValueChange={(value) => {
              if (document.startViewTransition) {
                document.startViewTransition({ types: ["theme"], update: () => flushSync(() => setTheme(value)) });
              } else setTheme(value);
            }}>
              {themes.map((t) => (
                <Menu.RadioItem key={t.value} value={t.value} className="row flex h-9 items-center gap-2.5 rounded-[10px] px-2.5 text-[14px] font-medium data-checked:text-accent data-highlighted:bg-hover">
                  <t.icon size={16} strokeWidth={1.5} aria-hidden />
                  {t.label}
                </Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
