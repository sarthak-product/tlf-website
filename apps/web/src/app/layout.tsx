import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { arimo, quicksand } from "@/lib/fonts";
import "@/styles/tokens.css";
import "@/styles/base.css";

// Light is the default theme. Dark applies when <html> carries data-theme="dark".
// Nothing sets it yet: there is no toggle and no automatic switch from the visitor's
// system setting. See design.md, Theme.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${arimo.variable} ${quicksand.variable}`}>
      <body>
        <SiteHeader />
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
