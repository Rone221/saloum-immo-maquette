import Link from "next/link";
import { LIBELLES } from "@/content/messages";
import { MOBILE } from "@/content/site";
import { asset } from "@/lib/base";
import { typo } from "@/lib/format";
import { waHref } from "@/lib/whatsapp";
import { Bouton } from "./boutons";
import { MobileMenu } from "./mobile-menu";
import { CadreEntete, NavLinks } from "./nav-links";

/**
 * En-tête du site (direction v4, pièce 2). Logo, six rubriques en ligne dès 1 101 px,
 * le numéro en voix large dès 1 281 px, un bouton « WhatsApp », le bouton Menu sous
 * 1 101 px. 64 px de haut, 68 dès 761 px, 76 dès 1 101 px.
 *
 * Deux états (globals.css, « En-tête du site ») :
 * posé : collant, calque à 92 % avec un flou, filet dessous. Toutes les pages.
 * en surimpression : sans fond, texte blanc, bouton en latérite vive, logo sur sa
 *   plaque de calque. Seulement en haut d'une page dont le premier bloc porte
 *   data-ouverture="sombre" (l'accueil), jusqu'à 40 px de défilement.
 * Rien à passer ici : la page le dit elle-même, par cet attribut.
 *
 * Le bouton WhatsApp ne compte pas dans le plafond des boutons de la page.
 * Sous 360 px, logo, écarts et marges se resserrent : à 320 px, les trois éléments
 * tiennent sans défilement horizontal, menu ouvert ou fermé.
 */
export function SiteHeader() {
  return (
    <CadreEntete>
      <div className="wrap flex h-header items-center gap-3 max-[359px]:gap-2 desk:gap-6 wide:gap-8">
        {/* La plaque dépasse de 10 px dans la gouttière : le logo reste au bord du contenu. */}
        <Link
          href="/"
          aria-label="Saloum Immo, accueil"
          className="entete-plaque -ml-2.5 flex min-h-11 flex-none items-center rounded-1 px-2.5 py-1.5"
        >
          {/* Logo horizontal fait à partir du logo officiel : jamais recoloré ni étiré.
              Fichier réduit à 420 px de large (116 px affichés au plus, densité 3). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/2269-logo-horizontal-420.png")}
            width={420}
            height={160}
            alt=""
            className="h-10 w-auto max-[359px]:h-8 desk:h-11"
          />
        </Link>

        <nav aria-label="Navigation principale" className="ml-auto hidden desk:block">
          <NavLinks />
        </nav>

        <a
          href={MOBILE.href}
          aria-label={typo(`${LIBELLES.appel}, ${MOBILE.long}`)}
          className="mesure hidden min-h-11 flex-none items-center text-menu whitespace-nowrap transition-surface hover:text-accent wide:inline-flex"
        >
          {typo(MOBILE.long)}
        </a>

        <Bouton
          href={waHref()}
          taille="compact"
          bloc={false}
          fleche={false}
          ariaLabel={typo(`WhatsApp, ${MOBILE.long}`)}
          className="ml-auto flex-none max-[359px]:px-3 desk:ml-0"
        >
          WhatsApp
        </Bouton>

        <MobileMenu libelles={{ whatsapp: "WhatsApp", appel: LIBELLES.appel }} />
      </div>
    </CadreEntete>
  );
}
