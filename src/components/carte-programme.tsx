import Link from "next/link";
import { LIBELLES } from "@/content/messages";
import { PHOTOS, type PhotoId } from "@/content/photos";
import { RECASEMENT_AIBD, type Programme } from "@/content/programmes";
import { cx } from "@/lib/base";
import { T3 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { waHref } from "@/lib/whatsapp";
import { BoutonWhatsApp } from "./boutons";
import { Photo, sizesRecadree } from "./photo";
import { BadgeStatut, Borne, Fleche, Puces } from "./reperes";

/**
 * Survol commun aux cartes (revue 2) : la bordure passe au bleu, un trait bleu se
 * trace en haut de la carte, la photo grossit à peine, la flèche avance. Au clavier,
 * le focus produit le même effet (focus-within).
 */
export const CARTE =
  "group @container relative flex w-full flex-col border border-rule bg-paper transition-colors duration-300 hover:border-trait focus-within:border-trait";

/** Le trait qui se trace en haut d'une carte au survol. */
export function TraitCarte() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -inset-x-px -top-px z-10 h-[3px] origin-left scale-x-0 bg-trait transition-transform duration-500 ease-out group-focus-within:scale-x-100 group-hover:scale-x-100"
    />
  );
}

/** Photo d'une carte : recadrée, elle grossit au survol. */
export const PHOTO_CARTE = "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]";

/**
 * Classes de la photo d'une carte. Une photo plafonnée (largeurMax : 2534, 2413-droite)
 * ne grossit pas au survol : le zoom la dessinerait au-delà de son plafond.
 */
export function classePhotoCarte(id: PhotoId): string {
  return PHOTOS[id].largeurMax ? "object-cover" : PHOTO_CARTE;
}

/**
 * Carte d'un programme (accueil) : photo avec le statut foncier en badge, lieu, nom,
 * repères en puces. Toute la carte mène à la fiche (le lien du nom s'étend dessus) ;
 * WhatsApp reste un lien à part, au-dessus. Largeur : 437 px au plus au bureau, 416
 * dans un carrousel, sous le plafond de 2534 (440 px), sans zoom pour 2534.
 */
export function CarteProgramme({ programme: p }: { programme: Programme }) {
  const titreId = `t-${p.slug}`;
  return (
    <article aria-labelledby={titreId} className={CARTE}>
      <TraitCarte />
      <div className="relative aspect-[4/3] overflow-hidden bg-paper-2">
        <Photo
          id={p.photo}
          fill
          decorative
          sizes={sizesRecadree(p.photo, 4 / 3, "(min-width: 1440px) 437px, (min-width: 1101px) 31vw, 416px")}
          className={classePhotoCarte(p.photo)}
        />
        <BadgeStatut foncier={p.foncier} texte={p.statut.texte} className="absolute top-3 left-3" />
      </div>
      <div className="flex grow flex-col p-5 tab:p-6">
        <p className="flex items-center gap-2 text-small text-ink-2">
          <Borne />
          {typo(p.lieu.texte.replace(/\.$/, ""))}
        </p>
        <h3 id={titreId} className={cx(T3, "mt-2")}>
          {/* Le lien s'étend sur toute la carte (after:). */}
          <Link
            href={p.href}
            className="transition-colors duration-200 after:absolute after:inset-0 after:z-[1] group-hover:text-trait"
          >
            {p.nom}
          </Link>
        </h3>
        <Puces items={p.reperes} className="mt-4 mb-6" />
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-rule pt-3">
          <a
            href={waHref(typo(p.message))}
            aria-label={`${LIBELLES.programmeCourt}, ${p.nom}`}
            className="relative z-[2] inline-flex min-h-11 items-center font-semibold whitespace-nowrap text-trait underline decoration-1 underline-offset-4 hover:decoration-2"
          >
            {LIBELLES.programmeCourt}
          </a>
          {/* Décoratif : toute la carte mène déjà à la fiche. Le libellé si la place le permet. */}
          <span aria-hidden="true" className="inline-flex items-center gap-2 font-semibold whitespace-nowrap transition-colors group-hover:text-trait">
            <span className="hidden @[23rem]:inline">Voir la fiche</span>
            <Fleche />
          </span>
        </div>
      </div>
    </article>
  );
}

/**
 * L'offre datée Recasement AIBD : un ticket en pointillés, visiblement autre chose
 * qu'un programme. Le prix porte sa date dans sa phrase ; l'étiquette la redit
 * au-dessus. `whatsapp` (page Terrains) : le bouton « Demander la disponibilité »,
 * au-dessus du lien étendu de la carte.
 */
export function CarteOffre({ whatsapp = false, className }: { whatsapp?: boolean; className?: string }) {
  return (
    <article
      aria-labelledby="t-offre-aibd"
      className={cx(
        "group relative grid gap-4 border-[1.5px] border-dashed border-sol bg-paper p-5 transition-colors duration-300 hover:border-trait focus-within:border-trait tab:gap-x-10 tab:p-7",
        // Avec le bouton, l'action passe à droite au bureau seulement : en tablette, la
        // colonne du texte serait trop étroite.
        whatsapp
          ? "desk:grid-cols-[minmax(0,1fr)_auto] desk:items-center"
          : "tab:grid-cols-[minmax(0,1fr)_auto] tab:items-center",
        className,
      )}
    >
      <div>
        <p className="inline-flex items-center gap-2 bg-ink px-2.5 py-1.5 text-small leading-none font-semibold text-white">
          {typo(RECASEMENT_AIBD.etiquette)}
        </p>
        <h3 id="t-offre-aibd" className={cx(T3, "mt-3")}>
          <Link
            href={RECASEMENT_AIBD.href}
            className="transition-colors after:absolute after:inset-0 after:z-[1] group-hover:text-trait"
          >
            {RECASEMENT_AIBD.nom}
          </Link>
        </h3>
        <p className="mt-1 max-w-[44rem] text-ink-2">{typo(RECASEMENT_AIBD.carte.texte)}</p>
      </div>
      <div className="flex flex-col items-start gap-3 tab:flex-row tab:items-center tab:gap-6">
        {whatsapp ? (
          <BoutonWhatsApp
            label={LIBELLES.recasementAibd}
            message={RECASEMENT_AIBD.message}
            variante="contour"
            bloc={false}
            className="relative z-[2]"
          />
        ) : null}
        <span aria-hidden="true" className="inline-flex items-center gap-2 font-semibold transition-colors group-hover:text-trait">
          Voir l’offre <Fleche />
        </span>
      </div>
    </article>
  );
}
