import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Floating glass bar of focus screens (exam, quiz, flashcards): no sidebar. */
export function FocusBar({ left, center, right }: { left: ReactNode; center?: ReactNode; right?: ReactNode }) {
  return (
    <div className="scroll-lift fixed inset-x-4 top-3 z-20 grid h-11 grid-cols-[1fr_auto_1fr] items-center gap-2 lg:inset-x-6 lg:top-5">
      <div className="justify-self-start">{left}</div>
      <div className="flex min-w-0 items-center gap-2">{center}</div>
      <div className="justify-self-end">{right ?? <span className="block size-11" />}</div>
    </div>
  );
}

/** Glass capsule in the focus bar (blur 24). Use on a div or a button. */
export const capsule =
  "glass flex h-11 min-w-0 items-center gap-2.5 rounded-full pr-[18px] pl-3.5 text-[13px] [--g-b:20px] [--g-blur:24px] [--g-y:6px]";

/** Bottom action bar of focus screens: glass, sticks to the bottom when content is tall. */
export function ActionBar({ children, className, label = "Akce" }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "scroll-lift glass sticky bottom-[max(20px,env(safe-area-inset-bottom))] z-20 flex h-[68px] w-full max-w-[500px] items-center gap-2.5 rounded-full px-2 [--g-b:30px] lg:bottom-6 lg:h-16 lg:pr-2.5 lg:pl-[22px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
