"use client";

import { Drawer } from "@base-ui/react/drawer";
import { useState, type ReactNode } from "react";

const snapPoints = [0.53, 0.82];

export function Sheet({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: ReactNode }) {
  const [previous, setPrevious] = useState(children);
  if (open && children !== previous) setPrevious(children);
  const [snap, setSnap] = useState<Drawer.Root.SnapPoint | null>(snapPoints[1]);

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(next) => { if (!next) onClose(); }}
      onOpenChangeComplete={(next) => { if (!next) setSnap(snapPoints[1]); }}
      snapPoints={snapPoints}
      snapPoint={snap}
      onSnapPointChange={setSnap}
    >
      <Drawer.Portal>
        <Drawer.Backdrop className="sheet-backdrop fixed inset-0 z-40 bg-[#0b0d1466]" />
        <Drawer.Viewport className="fixed inset-0 z-50 flex items-end px-2">
          <Drawer.Popup className="sheet-popup glass-thick flex h-[82dvh] w-full flex-col rounded-t-[28px]">
            <Drawer.Title className="sr-only">{label}</Drawer.Title>
            <div className="flex h-7 shrink-0 touch-none items-center justify-center" aria-hidden>
              <span className="h-[5px] w-9 rounded-full bg-strong" />
            </div>
            <Drawer.Content className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
              {open ? children : previous}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
