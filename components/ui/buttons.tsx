import Link from "next/link";
import { ArrowRight, ChevronLeft, type LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ActionProps = {
  href?: string;
  transitionTypes?: string[];
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<"button">, "className" | "children">;

/** Renders a Link for navigation and a button for actions. */
function Action({ href, className, children, type = "button", transitionTypes, ...rest }: ActionProps) {
  if (href) {
    return (
      <Link href={href} transitionTypes={transitionTypes} className={className} {...(rest as Omit<ComponentProps<"a">, "href">)}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={className} {...rest}>
      {children}
    </button>
  );
}

const pillHeights = { 40: "h-10", 44: "h-11", 46: "h-[46px]", 48: "h-12", 52: "h-[52px]" } as const;
const pillPadding = { 40: "px-[18px]", 44: "px-5", 46: "px-5", 48: "px-5", 52: "px-5" } as const;

type PillProps = ActionProps & {
  size?: keyof typeof pillHeights;
  /** Arrow on the right: only for navigation actions. */
  arrow?: boolean;
  /** White pill on the blue hero. */
  tone?: "ink" | "light";
  full?: boolean;
};

/** PrimaryPill: ink fill, label 14/500. */
export function PrimaryPill({ size = 40, arrow, tone = "ink", full, className, children, ...rest }: PillProps) {
  return (
    <Action
      {...rest}
      className={cn(
        "hit press inline-flex shrink-0 items-center gap-2 rounded-full text-[14px] font-medium tracking-[-0.1px] whitespace-nowrap disabled:opacity-50",
        pillHeights[size],
        arrow ? "pr-4 pl-[18px]" : pillPadding[size],
        tone === "ink" ? "ink" : "bg-white text-[#14182B] shadow-[inset_0_1px_0_#ffffff33,0_4px_12px_var(--glass-shadow)]",
        full && "w-full justify-center",
        className,
      )}
    >
      {children}
      {arrow && <ArrowRight className="nudge" size={16} strokeWidth={2} aria-hidden />}
    </Action>
  );
}

type GlassButtonProps = ActionProps & {
  icon?: LucideIcon;
  size?: 40 | 44;
  /** glass: chrome. solid: a control inside glass or on content. hero: glass over the hero mesh. */
  variant?: "glass" | "solid" | "hero";
  full?: boolean;
};

/** GlassButton: icon 16 + label 14/500, 40 high. */
export function GlassButton({ icon: Icon, size = 40, variant = "glass", full, className, children, ...rest }: GlassButtonProps) {
  return (
    <Action
      {...rest}
      className={cn(
        "hit press inline-flex shrink-0 items-center gap-2 rounded-full pr-4 pl-3.5 text-[14px] font-medium tracking-[-0.1px] whitespace-nowrap",
        size === 40 ? "h-10" : "h-11",
        variant === "glass" && "glass-thin text-fg",
        variant === "solid" && "solid text-fg",
        variant === "hero" && "glass-thin glass-on-hero text-white",
        full && "w-full justify-center",
        className,
      )}
    >
      {Icon && <Icon size={16} strokeWidth={1.75} aria-hidden />}
      {children}
      {(rest["aria-disabled"] === true || rest["aria-disabled"] === "true") && (
        <span className="-mr-1.5 rounded-full bg-hover px-1.5 py-0.5 text-[11px] font-semibold text-muted">Brzy</span>
      )}
    </Action>
  );
}

type IconButtonProps = Omit<ActionProps, "children"> & {
  icon: LucideIcon;
  label: string;
  size?: 32 | 36 | 40 | 44 | 52;
  iconSize?: number;
  variant?: "glass" | "plain";
};

const iconBox = { 32: "size-8", 36: "size-9", 40: "size-10", 44: "size-11", 52: "size-[52px]" } as const;

/** GlassIconButton: round, icon only, always labelled. Small sizes keep a 40px hit area. */
export function GlassIconButton({ icon: Icon, label, size = 40, iconSize = 18, variant = "glass", className, ...rest }: IconButtonProps) {
  return (
    <Action
      {...rest}
      transitionTypes={Icon === ChevronLeft ? ["nav-back"] : undefined}
      aria-label={label}
      title={label}
      className={cn(
        "press inline-flex shrink-0 items-center justify-center rounded-full text-fg",
        iconBox[size],
        size < 44 && "hit",
        variant === "glass" ? "glass-thin" : "hover:bg-ring",
        className,
      )}
    >
      <Icon size={iconSize} strokeWidth={1.75} aria-hidden />
    </Action>
  );
}
