import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Studium", template: "%s · Studium" },
  description: "Příprava k maturitě s tutorem z ověřených podkladů, kvízy, kartičkami a mapou pojmů.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F7FA" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0B10" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="cs" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: 'try { if (sessionStorage.getItem("studium-today")) document.documentElement.dataset.seenToday = ""; } catch {}' }} />
      </head>
      <body>
        <a href="#obsah" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-panel focus:px-4 focus:py-2">
          Přeskočit na obsah
        </a>
        <div aria-hidden className="mesh-app fixed inset-0 -z-10" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
