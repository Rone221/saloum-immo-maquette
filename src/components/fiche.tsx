import type { Fait } from "@/content/types";
import { cx } from "@/lib/base";
import { Said, TexteFait } from "./texte";

/** Une ligne de fiche : libellé mono, valeur. */
export type LigneDeFiche = { libelle: string; valeur: Fait };

/**
 * Fiche parcellaire (3.6) : liste de définitions, filet haut 1,5 px encre.
 * Libellés sur 104 px sous 761 px (3.6 dit 96) : « Disponibilité », libellé permis
 * par 3.6, fait 101 px en mono text-1 et débordait sur la valeur. Écart de 16 px.
 * La ligne Prix est en gras. Une valeur dite à l'oral porte sa mention datée.
 * Une valeur inconnue s'écrit « À demander. » dans les données : jamais de case vide.
 *
 * Les programmes passent les libellés de 3.6 (LibelleFiche, content/programmes.ts) ;
 * la fiche de l'entreprise, page À propos, les siens (7.7).
 */
export function Fiche({
  lignes,
  marge = "mt-5 tab:mt-6",
  className,
}: {
  lignes: LigneDeFiche[];
  /** Marge au-dessus (remplace celle par défaut). */
  marge?: string;
  className?: string;
}) {
  return (
    <dl className={cx("border-t-[1.5px] border-ink", marge, className)}>
      {lignes.map((l) => (
        <div
          key={l.libelle}
          className="grid grid-cols-[104px_minmax(0,1fr)] gap-4 border-b border-rule py-2.5 tab:grid-cols-[112px_minmax(0,1fr)] tab:py-3"
        >
          <dt className="pt-0.75 font-mono text-1 leading-label font-medium text-ink-2">{l.libelle}</dt>
          <dd className={cx("text-3 leading-body", l.libelle === "Prix" && "font-bold")}>
            <TexteFait fait={l.valeur} />
            <Said fait={l.valeur} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
