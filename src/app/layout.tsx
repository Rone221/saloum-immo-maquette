import type { Metadata, Viewport } from "next";
import "./globals.css";
import { archivo, besley } from "./fonts";
import { Gestes } from "@/components/gestes";
import { Pied } from "@/components/pied";
import { SiteHeader } from "@/components/site-header";
import { Traits } from "@/components/traits";
import { VoieLecture } from "@/components/voie-lecture";
import { asset } from "@/lib/base";
import { typo } from "@/lib/format";
import { IMAGE_PARTAGE, ORIGINE } from "@/lib/meta";

const DESCRIPTION = typo(
  "Saloum Immo vend des terrains et les aménage : terrassement, voies en latérite, eau avec SEN’EAU, électricité, bornage. Sakina City, Sicap Keur Massar, Lac Town.",
);

export const metadata: Metadata = {
  // Adresses absolues des cartes de partage (og:image).
  metadataBase: new URL(ORIGINE),
  title: {
    default: "Saloum Immo · Terrains et aménagement, région de Dakar",
    template: "%s · Saloum Immo",
  },
  description: DESCRIPTION,
  // Maquette de présentation : on ne l'indexe pas.
  robots: { index: false, follow: false },
  // Icônes : le logo officiel au centre d'un carré blanc (scripts/photos.mjs).
  icons: {
    icon: [{ url: asset("/2269-icone-32.png"), sizes: "32x32", type: "image/png" }],
    apple: [{ url: asset("/2269-icone-180.png"), sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Saloum Immo · Terrains et aménagement, région de Dakar",
    description: DESCRIPTION,
    locale: "fr_SN",
    type: "website",
    images: [IMAGE_PARTAGE],
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  // La barre du navigateur prend la couleur de l'en-tête posé : le calque.
  themeColor: "#FBF9F4",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-scroll-behavior : Next 16 ne neutralise plus le défilement doux pendant un
    // changement de page sans cet attribut. Sans lui, un lien interne cliqué en haut
    // d'une page arrivait loin sous le H1 de la suivante (les scrollIntoView de Next
    // s'enchaînaient en défilement doux). Le défilement doux reste pour les ancres (5).
    <html lang="fr" data-scroll-behavior="smooth" className={`${archivo.variable} ${besley.variable}`}>
      <body>
        <a href="#contenu" className="skip">
          Aller au contenu
        </a>
        <SiteHeader />
        {/* La voie de lecture : sous l'en-tête sur mobile, dans la gouttière gauche dès
            1 101 px. Elle se retire seule de l'espace client (/admin/). */}
        <VoieLecture />
        <main id="contenu">{children}</main>
        <Pied />
        {/* Les traits qui se tirent une fois en entrant à l'écran. */}
        <Traits />
        {/* Les deux gestes liés au pointeur fin : l'aimant du bouton principal et la
            bascule des grandes photos. Un seul écouteur pour tout le site. */}
        <Gestes />
      </body>
    </html>
  );
}
