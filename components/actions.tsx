"use client";

import { Bookmark, Check, Flag } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { GlassButton } from "@/components/ui/buttons";
import { cn } from "@/lib/cn";

/** Save a question. Outline by default, filled when active. */
export function BookmarkButton({ size = 40, bare }: { size?: 36 | 40 | 44; bare?: boolean }) {
  const [saved, setSaved] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? "Odebrat z uložených" : "Uložit otázku"}
      title={saved ? "Uloženo" : "Uložit"}
      onClick={() => {
        if (!saved) toast.success("Uloženo");
        setSaved(!saved);
      }}
      className={cn(
        "press inline-flex shrink-0 items-center justify-center rounded-full",
        size === 36 ? "size-9" : size === 40 ? "size-10" : "size-11",
        bare ? "hover:bg-ring" : "glass-thin",
        saved ? "text-accent" : "text-fg",
      )}
    >
      <Bookmark size={18} strokeWidth={1.75} fill={saved ? "currentColor" : "none"} aria-hidden />
    </button>
  );
}

export function ReportSourceButton() {
  const [sent, setSent] = useState(false);
  return (
    <GlassButton variant="solid" icon={sent ? Check : Flag} disabled={sent} onClick={() => setSent(true)} aria-live="polite">
      {sent ? "Nahlášeno redakci" : "Nahlásit chybějící zdroj"}
    </GlassButton>
  );
}
