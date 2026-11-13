import type { ReactNode } from "react";
import { MENTIONS_PUBLIEES } from "@/content/pages/mentions-legales";
import { ANNEE, MOBILE, RAISON_SOCIALE, SIEGE, SLOGAN } from "@/content/site";
import { asset, cx } from "@/lib/base";
import { typo } from "@/lib/format";
import { LienMentions, LiensRubriques, PageCourante } from "./nav-links";
import { Mail, Tel } from "./text-link";

function Case({ k, children, className, as: Balise = "div", label }: {
  k: string;
  children: ReactNode;
  className?: string;
  as?: "div" | "nav";
  label?: string;
}) {
  return (
    <Balise aria-label={label} className={cx("flex flex-col gap-0.5 bg-paper px-3.5 py-2.5 tab:gap-1 tab:px-4.5 tab:py-4", className)}>
      <span className="font-mono text-1 leading-label font-medium text-ink-2">{k}</span>
      {children}
    </Balise>
  );
}

// Sans couleur : le texte du pied est en encre, la page courante passe en trait.
const LIEN = "inline-flex min-h-11 items-center underline underline-offset-3 hover:decoration-2";

/**
 * Pied de page en cartouche de plan (3.19). Cadre 1,5 px, cellules séparées par
 * des filets de 1 px. Logo officiel complet, sans recoloriage.
 */
export function Cartouche() {
  return (
    <footer id="pied" className="bg-paper pt-7 pb-9 text-ink tab:pt-12 tab:pb-14">
      <div className="wrap">
        <div className="grid grid-cols-2 gap-px border-[1.5px] border-ink bg-ink tab:grid-cols-[200px_repeat(2,minmax(0,1fr))] desk:grid-cols-[260px_repeat(3,minmax(0,1fr))]">
          <div className="col-span-full flex items-center justify-center bg-paper p-4.5 tab:col-span-1 tab:row-span-3 tab:p-6 desk:row-span-2">
            {/* Variantes réduites par scripts/photos.mjs (176 px affichés au plus).
                Le fichier complet, 2269-logo.png, reste pour le partage. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/2269-logo-352.png")}
              srcSet={`${asset("/2269-logo-176.png")} 176w, ${asset("/2269-logo-352.png")} 352w, ${asset("/2269-logo-528.png")} 528w`}
              sizes="(min-width: 761px) 176px, 140px"
              width={528}
              height={399}
              loading="lazy"
              alt="Saloum Immo"
              className="h-auto w-35 tab:w-44"
            />
          </div>
          <Case k="Raison sociale">
            <span className="text-2 leading-caption">{RAISON_SOCIALE.texte}</span>
          </Case>
          <Case k="Siège">
            <span className="text-2 leading-caption">{typo(SIEGE.texte)}</span>
          </Case>
          <Case k="Contact" className="col-span-full tab:col-span-1">
            <span className="flex flex-wrap gap-x-4 text-2 leading-caption tab:flex-col">
              <Tel numero={MOBILE} format="long" className={LIEN} />
              <Mail className={LIEN} />
            </span>
          </Case>
          <Case k="Devise" className="col-span-full tab:col-span-1">
            <span className="text-4 leading-snug font-semibold stretch-sub">{typo(SLOGAN.texte)}</span>
          </Case>
          <Case k="Rubriques" as="nav" label="Plan du site" className="col-span-full tab:col-span-1">
            <span className="flex flex-wrap gap-x-3.5 text-2 leading-caption">
              <LiensRubriques className={LIEN} />
            </span>
          </Case>
          <Case k="Page" className="col-span-full tab:col-span-1">
            <span className="text-2 leading-caption">
              <PageCourante /> · {ANNEE}
              {/* Pas de lien tant que la page n'est pas publiée (7.9). */}
              {MENTIONS_PUBLIEES ? <LienMentions className={LIEN} /> : null}
            </span>
          </Case>
        </div>
      </div>
    </footer>
  );
}
