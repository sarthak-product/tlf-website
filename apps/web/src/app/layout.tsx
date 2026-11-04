import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { arimo, quicksand } from "@/lib/fonts";
import "@/styles/tokens.css";
import "@/styles/base.css";

// Stand-in title. Page titles and meta descriptions are not drafted yet (03-home-copy.md,
// Meta and footer), so there is no description until Sarthak supplies one.
export const metadata: Metadata = {
  title: "Lotus Feet Consultancy",
};

// Light is the default. Dark follows the visitor's system setting through
// prefers-color-scheme in tokens.css. There is no toggle.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${arimo.variable} ${quicksand.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" className="main">
          {children}
        </main>
      </body>
    </html>
  );
}
