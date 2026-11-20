"use client";

import { Drawer } from "@base-ui/react/drawer";
import { useState, type ReactNode } from "react";

/** Bottom sheet sized to its content, at most 85dvh; longer content scrolls inside. */
export function Sheet({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: ReactNode }) {
  const [previous, setPrevious] = useState(children);
  if (open && children !== previous) setPrevious(children);

  return (
    <Drawer.Root open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <Drawer.Portal>
        <Drawer.Backdrop className="sheet-backdrop fixed inset-0 z-40 bg-[#0b0d1466]" />
        <Drawer.Viewport className="fixed inset-0 z-50 flex items-end justify-center px-2">
          <Drawer.Popup className="sheet-popup glass-thick flex max-h-[85dvh] w-full max-w-[640px] flex-col rounded-t-[28px]">
            <Drawer.Title className="sr-only">{label}</Drawer.Title>
            <div className="flex h-7 shrink-0 touch-none items-center justify-center" aria-hidden>
              <span className="h-[5px] w-9 rounded-full bg-strong" />
            </div>
            <Drawer.Content className="flex min-h-0 flex-col overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
              {open ? children : previous}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
