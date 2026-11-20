import { ViewTransition } from "react";

/** Focus screens: no sidebar, floating bar on top, action bar at the bottom. */
export default function FocusLayout({ children }: LayoutProps<"/">) {
  return (
    <ViewTransition name="studium-content" default={{ "nav-back": "nav-back", default: "page" }}>
      <main id="obsah" className="flex min-h-dvh flex-col items-center px-4 pt-[calc(72px+var(--safe-t))] lg:px-6 lg:pt-[84px]">
        {children}
      </main>
    </ViewTransition>
  );
}
