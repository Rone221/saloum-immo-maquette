import Link from "next/link";
import { MOBILE } from "@/content/site";
import { asset } from "@/lib/base";
import { typo } from "@/lib/format";
import { waHref } from "@/lib/whatsapp";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";

/**
 * En-tête : collant, fond papier, filet fin dessous. Logo horizontal, six
 * rubriques en ligne dès 1 101 px, bouton WhatsApp fixe (le numéro apparaît dès
 * 1 281 px), bouton Menu sous 1 101 px. Le bouton WhatsApp ne compte pas dans le
 * plafond des boutons de la page (allegement.md, 2.9).
 * Sous 360 px, logo, écarts et marges du bouton WhatsApp se resserrent : à 320 px,
 * les trois éléments tiennent sans défilement horizontal, menu ouvert ou fermé.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper">
      <div className="wrap flex h-header items-center gap-3 max-[359px]:gap-2 desk:gap-8 wide:gap-10">
        <Link href="/" aria-label="Saloum Immo, accueil" className="flex min-h-11 flex-none items-center">
          {/* Logo horizontal fait à partir du logo officiel : jamais recoloré ni étiré.
              Fichier réduit à 420 px de large (136 px affichés au plus, densité 3). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/2269-logo-horizontal-420.png")}
            width={420}
            height={160}
            alt=""
            className="h-10 w-auto max-[359px]:h-8 tab:h-11 desk:h-12"
          />
        </Link>

        <nav aria-label="Navigation principale" className="ml-auto hidden desk:block">
          <NavLinks />
        </nav>

        <a
          href={waHref()}
          aria-label={`WhatsApp, ${MOBILE.long}`}
          className="ml-auto inline-flex h-11 flex-none items-center gap-3 rounded-1 bg-trait px-4 font-semibold text-white transition-surface hover:bg-ink max-[359px]:px-3 tab:h-12 tab:px-5 desk:ml-0"
        >
          WhatsApp
          <span className="hidden border-l border-white/50 pl-3 font-medium wide:inline">{typo(MOBILE.court)}</span>
        </a>

        <MobileMenu />
      </div>
    </header>
  );
}
