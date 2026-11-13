import Link from "next/link";
import { MOBILE } from "@/content/site";
import { asset } from "@/lib/base";
import { typo } from "@/lib/format";
import { waHref } from "@/lib/whatsapp";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";

/**
 * En-tête (3.1) : collant, fond papier, filet bas encre. Logo horizontal, six
 * rubriques en ligne dès 1 101 px, bouton WhatsApp (le numéro apparaît dès
 * 1 281 px), bouton Menu sous 1 101 px. Pas de fond translucide, pas de rétraction.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink bg-paper">
      <div className="wrap flex h-header items-center gap-2 tab:gap-3 desk:gap-5.5 wide:gap-8">
        <Link href="/" aria-label="Saloum Immo, accueil" className="flex min-h-11 flex-none items-center">
          {/* Logo horizontal fait à partir du logo officiel : jamais recoloré ni étiré.
              Fichier réduit à 420 px de large (136 px affichés au plus, densité 3). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/2269-logo-horizontal-420.png")}
            width={420}
            height={160}
            alt=""
            className="h-10 w-auto tab:h-11 desk:h-13"
          />
        </Link>

        <nav aria-label="Navigation principale" className="ml-auto hidden desk:block">
          <NavLinks />
        </nav>

        <a
          href={waHref()}
          aria-label={`WhatsApp, ${MOBILE.long}`}
          className="ml-auto inline-flex h-11 flex-none items-center gap-3 rounded-1 bg-trait px-3.5 text-2 font-semibold text-white transition-surface hover:bg-ink active:bg-ink tab:h-12 tab:px-4.5 desk:ml-0"
        >
          WhatsApp
          <span className="hidden border-l border-white/50 pl-3 font-mono font-medium wide:inline">
            {typo(MOBILE.court)}
          </span>
        </a>

        <MobileMenu />
      </div>
    </header>
  );
}
