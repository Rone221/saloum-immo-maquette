import { DOCUMENTS, SOURCE_DEFINITIONS, type Document } from "@/content/foncier";
import { cx } from "@/lib/base";
import { dateMono, typo } from "@/lib/format";
import { Gauge } from "./dessins/swatch";
import { TexteFait } from "./texte";

/**
 * Tableau des documents (3.15) : délibération, bail, titre foncier. Le niveau
 * de sécurité est l'échantillon agrandi avec le niveau publié en mots.
 * Mobile : un bloc par document, chaque cellule précédée de son libellé.
 * Page Comprendre le foncier (retiré de l'accueil).
 */
export function DocTable({
  documents = DOCUMENTS,
  titre = "Délibération, bail, titre foncier",
  titreId = "t-documents",
  niveau = 2,
  className,
}: {
  documents?: Document[];
  titre?: string;
  titreId?: string;
  niveau?: 2 | 3;
  className?: string;
}) {
  const Titre = niveau === 2 ? "h2" : "h3";
  // H2 : la combinaison du H2 (2.3), text-6. Le titre de bloc (text-5) avait le même
  // rendu que l'en-tête de ligne « Délibération » posé juste dessous sur mobile.
  return (
    <div className={className}>
      <Titre
        id={titreId}
        className={cx(
          "pb-3.5 font-bold",
          niveau === 2
            ? "text-6 leading-title tracking-tight stretch-title tab:pb-5"
            : "text-5 leading-snug stretch-sub",
        )}
      >
        {typo(titre)}
      </Titre>
      <table className="doc-table" aria-labelledby={titreId}>
        <thead>
          <tr>
            <th scope="col">Document</th>
            <th scope="col">Ce que c’est</th>
            <th scope="col">À savoir</th>
            <th scope="col">Niveau de sécurité</th>
            <th scope="col">Chez Saloum Immo</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((d) => (
            <tr key={d.statut}>
              <th scope="row">{d.nom}</th>
              <td data-l="Ce que c’est">
                <TexteFait fait={d.definition} />
              </td>
              <td data-l="À savoir">
                <TexteFait fait={d.aSavoir} />
              </td>
              <td data-l="Sécurité">
                <Gauge statut={d.statut} niveau={d.niveau.texte} />
              </td>
              <td data-l="Chez nous">
                <TexteFait fait={d.chezNous} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Rangée des trois niveaux de sécurité (accueil, section 03) : chaque document,
 * son échantillon et son niveau en mots, sous une étiquette datée. La ligne de
 * source complète (SOURCE_DEFINITIONS) va sous le DocTable, page Foncier.
 */
export function Niveaux({
  documents = DOCUMENTS,
  marge = "mt-12 tab:mt-18",
  className,
}: {
  documents?: Document[];
  /** Marge au-dessus (remplace celle par défaut). */
  marge?: string;
  className?: string;
}) {
  return (
    <div className={cx(marge, className)}>
      <p className="font-mono text-1 leading-label font-medium text-ink-2">
        Niveau de sécurité, publié le {dateMono(SOURCE_DEFINITIONS.date!)}
      </p>
      <ul className="mt-3 grid grid-cols-3 gap-x-4 border-t-[1.5px] border-ink pt-4 tab:gap-x-6 tab:pt-5">
        {documents.map((d) => (
          <li key={d.statut} className="flex flex-col gap-1.5 tab:gap-2.5">
            <span className="text-3 leading-snug font-650 stretch-sub tab:text-4">{d.nom}</span>
            <Gauge statut={d.statut} niveau={d.niveau.texte} empile className="text-2 tab:text-3" />
          </li>
        ))}
      </ul>
    </div>
  );
}
