import "./fiches.css";
import { EnTeteSection } from "@/components/en-tete-section";
import { PhraseMesuree } from "@/components/phrase-mesuree";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { DOCUMENTS, SOURCE_DEFINITIONS, type Document } from "@/content/foncier";
import { CLES_PAPIER, LIEN_FONCIER, SECTIONS } from "@/content/pages/fiches";
import { cx } from "@/lib/base";
import { CHAPEAU, NOTE, SOUS_BORNE, T3 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { Trait } from "./ouverture";

/** Les deux papiers qu'une fiche vend : le titre foncier, le bail. */
type ClePapier = Extract<Document["cle"], "tf" | "bail">;

/**
 * Le trait de la ligne de base, celui de l'échelle des papiers : plein entre deux
 * bornes sous le titre foncier, tirets sous le bail.
 */
const TRAITS: Record<ClePapier, "plein" | "tirets"> = { tf: "plein", bail: "tirets" };

/**
 * Sous une planche qui cite les définitions publiées : d'où elles viennent, et le lien
 * vers la page qui explique les trois documents.
 */
export function SourcePapier({ className }: { className?: string }) {
  return (
    <div className={cx("flex flex-col gap-y-1 desk:flex-row desk:items-baseline desk:justify-between desk:gap-x-6", className)}>
      <p className={NOTE}>
        <PhraseMesuree texte={SOURCE_DEFINITIONS.texte} />
      </p>
      <TextLink href={LIEN_FONCIER.href} className="flex-none">
        {LIEN_FONCIER.libelle}
      </TextLink>
    </div>
  );
}

/**
 * Le papier qu'on achète (direction v4, section 6), sur une planche au bleu bornée.
 * Sakina City : le titre foncier. L'offre AIBD : le bail.
 *
 * Le titre de la section est la pièce. Son amorce en petit (« Ce que vous achetez : un »),
 * puis le nom du document, au corps qu'il a dans l'échelle des papiers et sur le même
 * trait : plein entre deux bornes pour le titre foncier, tirets pour le bail. Le corps
 * et le trait disent le niveau, comme sur l'accueil et sur la page Foncier.
 *
 * En regard, la définition publiée par Saloum Immo ; au pied du cadre, le niveau de
 * sécurité, ce qu'il faut savoir, et où on trouve ce papier chez eux (content/foncier.ts,
 * mot pour mot). Sous la planche, la source et le lien vers la page Foncier.
 */
export function Papier({
  cle,
  titre,
  numero,
  repere,
}: {
  cle: ClePapier;
  /** « Ce que vous achetez : un titre foncier » : il finit par le nom du document. */
  titre: string;
  /** La borne de la section, à la suite de celles de la fiche. */
  numero: string;
  /** À droite de l'en-tête : la référence de cette fiche (le titre mère, l'offre). */
  repere?: string;
}) {
  const d = DOCUMENTS.find((x) => x.cle === cle);
  if (!d) return null;
  // Le titre se coupe devant le nom du document. S'il ne le contient pas, il sort entier.
  const coupe = titre.toLowerCase().lastIndexOf(d.nom.toLowerCase());
  const amorce = coupe > 0 ? titre.slice(0, coupe).trim() : "";
  const nom = coupe > 0 ? titre.slice(coupe) : titre;
  return (
    <Section surface="plan" labelledBy="t-papier" croisillons>
      <EnTeteSection numero={numero} nom={SECTIONS.papier} quantite={repere} />
      <div className={cx("fiche-planche apparait", SOUS_BORNE)}>
        <div className="fiche-papier-haut">
          <div className="fiche-papier-bloc">
            <h2 id="t-papier">
              {amorce ? <span className={cx(T3, "block text-doux")}>{typo(amorce)}</span> : null}{" "}
              <span data-papier={cle} className="fiche-papier-nom titre">
                {typo(nom)}
              </span>
            </h2>
            <Trait nature={TRAITS[cle]} className="mt-3 desk:mt-4" />
          </div>
          <p className={cx(CHAPEAU, "max-w-[34rem] text-fort")}>{typo(d.definition.texte)}</p>
        </div>
        <dl data-sens="rang" className="fiche-cases">
          <div className="fiche-case">
            <dt className="etiquette text-doux">{typo(CLES_PAPIER.niveau)}</dt>
            <dd className="font-semibold text-fort">{typo(d.niveau.texte)}</dd>
          </div>
          <div className="fiche-case">
            <dt className="etiquette text-doux">{typo(CLES_PAPIER.aSavoir)}</dt>
            <dd>{typo(d.aSavoir.texte)}</dd>
          </div>
          <div className="fiche-case">
            <dt className="etiquette text-doux">{typo(CLES_PAPIER.chezNous)}</dt>
            <dd>
              <PhraseMesuree texte={d.chezNous.texte} />
            </dd>
          </div>
        </dl>
      </div>
      <SourcePapier className="mt-5 desk:mt-6" />
    </Section>
  );
}
