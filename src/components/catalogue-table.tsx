import Link from "next/link";
import { PROGRAMMES, RECASEMENT_AIBD, type Programme } from "@/content/programmes";
import type { Fait, StatutFoncier } from "@/content/types";
import { cx } from "@/lib/base";
import { StatutEnLigne } from "./dessins/swatch";
import { Said, TexteFait } from "./texte";

export type LigneCatalogue = {
  nom: string;
  href: string;
  statut: StatutFoncier;
  /** Mot à côté de l'échantillon. */
  statutTexte: string;
  colonnes: Programme["catalogue"];
};

/** Les quatre offres de la page Terrains (7.2), dans l'ordre. */
export function lignesCatalogue(): LigneCatalogue[] {
  const programmes = PROGRAMMES.map((p) => ({
    nom: p.nom,
    href: p.href,
    statut: p.statut,
    statutTexte: p.statut === "non-publie" ? "À demander" : p.statutTexte.texte,
    colonnes: p.catalogue,
  }));
  const aibd = RECASEMENT_AIBD;
  return [
    ...programmes,
    { nom: aibd.nom, href: aibd.href!, statut: aibd.statut, statutTexte: "Bail", colonnes: aibd.catalogue! },
  ];
}

// Sous 1 101 px, chaque ligne devient un bloc à libellés : sur une colonne
// jusqu'à 760 px, sur deux de 761 à 1 100 px. Écart volontaire à 3.8 (blocs sous
// 761 px seulement) : à 761 px, six colonnes de texte ne laissaient qu'un mot par
// ligne (« Près du / Lac Rose, / à quelques… », un prix sur cinq lignes).
const CELLULE = "border-b border-rule py-3 align-top desk:py-5 desk:pr-5";
const BLOC = "max-desk:block";
const LIBELLE =
  "font-mono text-1 leading-label font-medium text-ink-2 max-desk:mb-1 max-desk:block desk:hidden";

function Valeur({ fait }: { fait: Fait | null }) {
  if (!fait)
    return (
      <span className="inline-block w-18 text-ink-2">
        <span className="dots-x block" aria-hidden="true" />
        <span className="sr-only">Non publié</span>
      </span>
    );
  return (
    <>
      <TexteFait fait={fait} />
      <Said fait={fait} />
    </>
  );
}

/**
 * Tableau du catalogue (3.8), page Terrains seulement : une ligne par offre.
 * Mobile : chaque ligne devient un bloc à libellés.
 */
export function CatalogueTable({
  lignes = lignesCatalogue(),
  titreId,
  className,
}: {
  lignes?: LigneCatalogue[];
  titreId?: string;
  className?: string;
}) {
  const entetes = ["Programme", "Lieu", "Statut foncier", "Surfaces publiées", "Déjà fait", "Prix"];
  return (
    <table aria-labelledby={titreId} className={cx("w-full border-collapse text-3 leading-body max-desk:block", className)}>
      <thead className="max-desk:sr-only">
        <tr>
          {entetes.map((e) => (
            <th
              key={e}
              scope="col"
              className="border-t-[1.5px] border-b border-ink py-3 pr-5 text-left font-mono text-1 leading-label font-medium text-ink-2"
            >
              {e}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="max-desk:block">
        {lignes.map((l) => (
          <tr
            key={l.href}
            className="max-desk:block max-desk:border-t-[1.5px] max-desk:border-ink max-desk:py-2 tab:max-desk:grid tab:max-desk:grid-cols-2 tab:max-desk:gap-x-6"
          >
            <th scope="row" className={cx(CELLULE, "text-left max-desk:block max-desk:border-0 tab:max-desk:col-span-full")}>
              <Link
                href={l.href}
                className="inline-flex min-h-11 items-center text-4 leading-snug font-bold text-trait underline decoration-1 underline-offset-5 stretch-sub hover:decoration-2"
              >
                {l.nom}
              </Link>
            </th>
            <td className={cx(CELLULE, BLOC)}>
              <span className={LIBELLE}>Lieu</span>
              <Valeur fait={l.colonnes.lieu} />
            </td>
            <td className={cx(CELLULE, BLOC)}>
              <span className={LIBELLE}>Statut foncier</span>
              <StatutEnLigne statut={l.statut} texte={l.statutTexte} />
            </td>
            <td className={cx(CELLULE, BLOC)}>
              <span className={LIBELLE}>Surfaces publiées</span>
              <Valeur fait={l.colonnes.surfaces} />
            </td>
            <td className={cx(CELLULE, BLOC)}>
              <span className={LIBELLE}>Déjà fait</span>
              <Valeur fait={l.colonnes.dejaFait} />
            </td>
            <td className={cx(CELLULE, "font-bold max-desk:block max-desk:border-0 desk:pr-0")}>
              <span className={LIBELLE}>Prix</span>
              <Valeur fait={l.colonnes.prix} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
