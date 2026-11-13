import type { Metadata } from "next";
import { Geist, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileActionBar } from "@/components/mobile-action-bar";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const display = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Saloum Immo | Terrains sécurisés au Sénégal",
    template: "%s | Saloum Immo",
  },
  description:
    "Parcelles bornées et viabilisées en titre foncier ou en bail, à Kounoune, Diass, Niague et Bayakh. Visite sur place ou en vidéo, accompagnement jusqu'à la construction.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${geist.variable} ${display.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col bg-bg font-sans text-ink">
        <a
          href="#contenu"
          className="sr-only z-50 rounded-full bg-accent px-4 py-2 text-accent-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Aller au contenu
        </a>
        <p className="bg-panel px-4 py-1.5 text-center text-xs text-panel-muted">
          <span className="sm:hidden">Maquette : contenus indicatifs.</span>
          <span className="hidden sm:inline">Maquette de présentation. Prix, disponibilités et photos sont indicatifs.</span>
        </p>
        <SiteHeader />
        <main id="contenu" className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
        <SiteFooter />
        <MobileActionBar />
      </body>
    </html>
  );
}
