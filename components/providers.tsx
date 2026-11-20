"use client";

import { MotionConfig } from "motion/react";
import { Drawer } from "@base-ui/react/drawer";
import { Toaster } from "sonner";
import { spring } from "@/lib/motion";
import { ThemeProvider, useTheme } from "next-themes";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { CommandMenu } from "@/components/command-menu";

type Ui = {
  openCommand: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
};

const UiContext = createContext<Ui | null>(null);

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used inside <Providers>");
  return ctx;
}

export function Providers({ children }: { children: ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false);
  // Opened from the keyboard: no animation.
  const [viaKeyboard, setViaKeyboard] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const openCommand = useCallback(() => {
    setViaKeyboard(false);
    setCommandOpen(true);
  }, []);

  // Global ⌘K / Ctrl+K.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setViaKeyboard(true);
        setCommandOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const { navigation } = window as Window & { navigation?: EventTarget & { currentEntry: { index: number } | null } };
    if (!navigation) return;
    const direction = (event: Event) => {
      const { navigationType, destination } = event as Event & { navigationType: string; destination: { index: number } };
      if (navigationType === "replace") return;
      document.documentElement.toggleAttribute(
        "data-nav-back",
        navigationType === "traverse" && destination.index < (navigation.currentEntry?.index ?? -1),
      );
    };
    navigation.addEventListener("navigate", direction);
    return () => navigation.removeEventListener("navigate", direction);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <UiContext.Provider value={{ openCommand, sidebarCollapsed, setSidebarCollapsed }}>
        <MotionConfig reducedMotion="user" transition={spring}>
          <Drawer.Provider>
            <Drawer.Indent className="drawer-page">{children}</Drawer.Indent>
          </Drawer.Provider>
          <AppToaster />
          <CommandMenu open={commandOpen} instant={viaKeyboard} onClose={() => setCommandOpen(false)} />
        </MotionConfig>
      </UiContext.Provider>
    </ThemeProvider>
  );
}

function AppToaster() {
  const { resolvedTheme } = useTheme();
  return <Toaster position="bottom-center" theme={resolvedTheme === "dark" ? "dark" : "light"} offset={32} mobileOffset={96} />;
}
