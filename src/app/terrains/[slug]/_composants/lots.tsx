import "./fiches.css";
import type { ReactNode } from "react";
import { Plaque } from "@/components/borne";
import { EnTeteSection } from "@/components/en-tete-section";
import { TitreCote } from "@/components/mot-cote";
import { Section } from "@/components/section";
import { DOCUMENTS } from "@/content/foncier";
import { CLES_PAPIER, SECTIONS, TABLEAU_LOTS, TITRES_FICHE } from "@/content/pages/fiches";
import type { Lot, Programme } from "@/content/programmes";
import { cx } from "@/lib/base";
import { CHAPEAU, SOUS_BORNE, T2 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { SourcePapier } from "./papier";

/**
 * Les plaques des lots, en rang : le numéro seul, sous la clé « Lots publiés en 2026 »
 * du cartouche de la fiche. Le mot « Lot » est redit à chaque plaque pour les lecteurs
 * d'écran : un numéro seul ne dit pas ce qu'il compte.
 */
export function PlaquesLots({ liste }: { liste: Lot[] }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-2 p-0 pt-1">
      {liste.map((l) => (
        <li key={l.numero} className="flex">
          <span className="sr-only">{typo(TABLEAU_LOTS.colonnes.lot)} </span>
          <Plaque numero={l.numero} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Le tableau est un vrai tableau, dessiné en lignes : chaque rangée est une grille (deux
 * colonnes sous 1 101 px, la remarque sous la surface ; trois au-delà). Ses éléments ne
 * sont donc plus affichés en tableau : leurs rôles sont redits à la main, pour qu'un
 * lecteur d'écran annonce toujours les colonnes.
 */
const RANGEE =
  "grid grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)] gap-x-4 px-gutter tab:px-7 desk:grid-cols-[13rem_11rem_minmax(0,1fr)] desk:gap-x-6 desk:px-8";
const TETE = "etiquette block p-0 text-left text-doux";

/**
 * Les lots de Sicap Keur Massar (direction v4, pièce 12 et section 6), sur une planche
 * au bleu bornée : la pièce de cette fiche. À gauche, le tableau des lots publiés, un lot
 * par ligne, dans l'ordre des numéros : le mot « Lot », le numéro sur sa plaque de borne
 * (blanche, numéro en latérite, comme les bornes peintes sur le terrain), la surface dans
 * la voix des mesures, puis ce qu'on en a dit. Pas de lot dessiné : on n'a que les
 * surfaces publiées. À droite, ce que vaut le papier de chaque lot, avec les mots
 * publiés par Saloum Immo (content/foncier.ts), et au pied de la colonne l'avertissement :
 * certains lots ont pu partir depuis. C'est là qu'on demande ceux qui restent.
 */
export function Lots({
  numero,
  lots,
  action,
}: {
  /** La borne de la section, à la suite de celles de la fiche. */
  numero: string;
  lots: NonNullable<Programme["lots"]>;
  /** Sous l'avertissement : de quoi demander les lots qui restent (le WhatsApp du programme, en contour). */
  action?: ReactNode;
}) {
  const tf = DOCUMENTS.find((d) => d.cle === "tf");
  const { colonnes } = TABLEAU_LOTS;
  return (
    <Section surface="plan" labelledBy="t-lots" croisillons>
      <EnTeteSection numero={numero} nom={SECTIONS.lots} quantite={TABLEAU_LOTS.quantite.texte} />
      <div className={cx("grid gap-y-5 desk:grid-cols-12 desk:items-end desk:gap-x-6", SOUS_BORNE)}>
        <h2 id="t-lots" className={cx(T2, "max-w-[14em] desk:col-span-7")}>
          <TitreCote texte={TITRES_FICHE.lots.texte} mot={TITRES_FICHE.lots.mot} />
        </h2>
        {tf ? <p className={cx(CHAPEAU, "max-w-[36rem] desk:col-span-4 desk:col-start-9")}>{typo(tf.definition.texte)}</p> : null}
      </div>

      <div className="fiche-planche fiche-lots apparait mt-10 desk:mt-14">
        <table role="table" className="block w-full text-left">
          <caption className="sr-only">{typo(lots.titre)}</caption>
          <thead role="rowgroup" className="sr-only desk:not-sr-only desk:block">
            <tr role="row" className={cx(RANGEE, "desk:border-b desk:border-ligne desk:py-3.5")}>
              {[colonnes.lot, colonnes.surface, colonnes.note].map((tete) => (
                <th key={tete} role="columnheader" scope="col" className={TETE}>
                  {typo(tete)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody role="rowgroup" className="block">
            {lots.liste.map((l) => (
              <tr role="row" key={l.numero} className={cx(RANGEE, "items-center gap-y-1.5 border-b border-ligne py-3.5 last:border-b-0 desk:py-4")}>
                <th role="rowheader" scope="row" className="flex items-center gap-3 p-0 font-normal">
                  <span className="etiquette text-doux">{typo(colonnes.lot)}</span>
                  {/* La plaque en grand : `!` passe devant les mesures de Plaque (28 px de haut). */}
                  <Plaque numero={l.numero} className="h-9! min-w-12! px-2.5! text-[1.375rem]! desk:h-10! desk:min-w-14! desk:text-[1.625rem]!" />
                </th>
                <td role="cell" className="block p-0">
                  <span className="mesure text-[1.5rem] leading-none whitespace-nowrap text-fort desk:text-[1.75rem]">{typo(l.surface)}</span>
                </td>
                {/* La remarque : sous la surface tant que la rangée n'a que deux colonnes.
                    Vide, la case sort de la grille sans quitter le tableau : un lecteur
                    d'écran compte toujours trois colonnes. */}
                <td
                  role="cell"
                  className={cx("p-0 leading-snug", l.note ? "col-start-2 block desk:col-start-auto" : "sr-only desk:not-sr-only desk:block")}
                >
                  {l.note ? typo(l.note) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tf ? (
          <dl className="fiche-cases">
            <div className="fiche-case">
              <dt className="etiquette text-doux">{typo(CLES_PAPIER.niveau)}</dt>
              <dd className="font-semibold text-fort">{typo(tf.niveau.texte)}</dd>
            </div>
            <div className="fiche-case">
              <dt className="etiquette text-doux">{typo(CLES_PAPIER.aSavoir)}</dt>
              <dd>{typo(tf.aSavoir.texte)}</dd>
            </div>
            <div className="fiche-case">
              <dt className="etiquette text-doux">{typo(CLES_PAPIER.disponibilite)}</dt>
              <dd>
                {typo(lots.avertissement.texte)}
                {action ? <div className="mt-5">{action}</div> : null}
              </dd>
            </div>
          </dl>
        ) : null}
      </div>
      <SourcePapier className="mt-5 desk:mt-6" />
    </Section>
  );
}
