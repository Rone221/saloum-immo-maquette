import { DOCUMENTS, SOURCE_DEFINITIONS, type Document } from "@/content/foncier";
import { PAPIERS, TITRES } from "@/content/pages/accueil";
import { cx } from "@/lib/base";
import { CHAPEAU, NOTE, SOUS_BORNE, T2 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { EnTeteSection } from "./en-tete-section";
import { TitreCote } from "./mot-cote";
import { PhraseMesuree } from "./phrase-mesuree";
import { Section, type Surface } from "./section";
import { TextLink } from "./text-link";

/**
 * Corps du nom de chaque document : il dit l'ordre, du moins au plus protégé. Ce ne
 * sont pas des corps de titre (lib/classes.ts) : l'échelle est une figure, ses trois
 * tailles sont sa mesure. Sur mobile, les documents s'empilent ; dès 1 101 px, ils
 * tiennent sur une ligne et le titre foncier remplit sa moitié de page.
 */
const TAILLE: Record<Document["cle"], string> = {
  delib: "[--t:1.75rem] desk:[--t:clamp(1.75rem,2.2vw,2rem)]",
  bail: "[--t:2.75rem] desk:[--t:clamp(3.25rem,4.7vw,4.25rem)]",
  tf: "[--t:var(--t-tf)]",
};

/** Colonnes au bureau : le titre foncier prend la moitié de la largeur. */
const COLONNES: Record<Document["cle"], string> = {
  delib: "desk:col-span-3",
  bail: "desk:col-span-3",
  tf: "desk:col-span-6",
};

/**
 * Le trait de la ligne de base, avec les conventions du plan (globals.css, « Traits »).
 * Pointillé : ce qui n'est pas sûr. Tirets : ce qui est en cours. Plein, 2 px, entre
 * deux bornes : ce qui est borné, acquis.
 */
const TRAIT: Record<Document["cle"], string> = {
  delib: "pointille h-[1.5px]",
  bail: "tirets h-[1.5px]",
  tf: "h-0.5 bg-current",
};

/** Une borne vue d'en haut : la face blanche, le filet d'encre. */
const BORNE = "size-[11px] flex-none border-[1.5px] border-encre bg-blanc";

/**
 * La ligne de base d'un document. Au bureau, elle court jusqu'au document suivant, à
 * travers la gouttière : une seule ligne pour les trois, qui change de trait. Elle part
 * d'une butée ; celle du titre foncier part d'une borne et finit sur une borne.
 *
 * La page Foncier a l'échelle dans son premier écran : elle trace ces lignes à
 * l'arrivée, l'une après l'autre, depuis app/foncier/foncier.css, qui vise
 * « .foncier-echelle > li > .se-tire ». Si cette structure change, cette feuille suit.
 */
function LigneDeBase({ cle, dernier }: { cle: Document["cle"]; dernier: boolean }) {
  const borne = cle === "tf";
  return (
    <div aria-hidden="true" className={cx("se-tire mt-2 flex h-[11px] items-center text-fort", !dernier && "desk:-mr-6")}>
      <span className={borne ? BORNE : "h-full w-[1.5px] flex-none bg-current"} />
      <span className={cx("flex-1", TRAIT[cle])} />
      {borne ? <span className={BORNE} /> : null}
    </div>
  );
}

/**
 * L'échelle des papiers (direction v4, pièce 10) : délibération, bail, titre foncier,
 * en corps croissants, posés sur une même ligne de base (empilés sous 1 101 px). La
 * ligne dit le niveau publié : pointillé sous la délibération, tirets sous le bail,
 * trait plein entre deux bornes sous le titre foncier. Les niveaux restent écrits
 * dessous, avec la définition et ce qu'on trouve chez Saloum Immo. Les textes viennent
 * de content/foncier.ts, mot pour mot. `complet` (page Foncier) ajoute « à savoir ».
 *
 * Les trois mots partagent leur ligne de base, pas seulement leur pied : dans une boîte
 * d'un cadratin (line-height: 1), le Besley pose sa ligne de base à 0,91 em du haut
 * (globals.css, « Le mot coté »), donc à 0,09 em du bas. Un petit corps remonte de la
 * différence : 0,09 fois l'écart avec le corps du titre foncier.
 */
export function EchellePapiers({
  complet = false,
  niveau = 3,
  className,
}: {
  complet?: boolean;
  /** Le rang du nom de chaque document : h3 sous un h2 (défaut), h2 sous un h1. */
  niveau?: 2 | 3;
  className?: string;
}) {
  const Nom = niveau === 2 ? "h2" : "h3";
  return (
    <ol
      className={cx(
        "grid gap-y-12 [--t-tf:clamp(2.75rem,14.4vw,3.75rem)] desk:grid-cols-12 desk:gap-x-6 desk:gap-y-0 desk:[--t-tf:clamp(5rem,7.4vw,6.75rem)]",
        className,
      )}
    >
      {DOCUMENTS.map((d, i) => (
        <li key={d.cle} className={cx("flex flex-col", TAILLE[d.cle], COLONNES[d.cle])}>
          <div className="desk:flex desk:h-(--t-tf) desk:items-end">
            <Nom className="titre text-(length:--t) leading-none desk:mb-[calc((var(--t-tf)-var(--t))*0.09)]">{typo(d.nom)}</Nom>
          </div>
          <LigneDeBase cle={d.cle} dernier={i === DOCUMENTS.length - 1} />
          <dl className="m-0 mt-4 desk:mt-5">
            <dt className="etiquette text-doux">{typo("Niveau de sécurité")}</dt>
            <dd className="m-0 mt-1 font-semibold text-fort">{typo(d.niveau.texte)}</dd>
          </dl>
          <p className="mt-4 max-w-[26rem]">{typo(d.definition.texte)}</p>
          {complet ? <p className="mt-3 max-w-[26rem]">{typo(d.aSavoir.texte)}</p> : null}
          <p className="mt-4 max-w-[26rem] text-small">
            <span className="font-semibold">{typo("Chez Saloum Immo :")}</span> <PhraseMesuree texte={d.chezNous.texte} />
          </p>
        </li>
      ))}
    </ol>
  );
}

/**
 * Accueil, « Le bon papier avant le bon prix » : l'en-tête de section et sa quantité
 * (les documents, comptés), le titre et son mot coté, le chapeau en regard, l'échelle,
 * puis en bas de planche la source des définitions et le lien vers la page Foncier.
 * Sur le sable à croisillons : l'échelle est une figure.
 */
export function AccueilPapiers({
  numero,
  surface = "sable",
  croisillons = true,
  className,
}: {
  /** La borne de la section, à la suite de celles de la page : « 04 ». */
  numero: string;
  surface?: Extract<Surface, "sable" | "calque">;
  croisillons?: boolean;
  className?: string;
}) {
  return (
    <Section id="foncier" labelledBy="t-foncier" surface={surface} croisillons={croisillons} className={className}>
      <EnTeteSection numero={numero} nom="Les papiers" quantite={`${DOCUMENTS.length} documents`} />
      <div className={cx("grid gap-y-5 desk:grid-cols-12 desk:items-end desk:gap-x-6", SOUS_BORNE)}>
        <h2 id="t-foncier" className={cx(T2, "max-w-[14em] desk:col-span-7")}>
          <TitreCote texte={TITRES.papiers} mot="papier" />
        </h2>
        <p className={cx(CHAPEAU, "max-w-[36rem] desk:col-span-4 desk:col-start-9")}>{typo(PAPIERS.chapeau)}</p>
      </div>
      <EchellePapiers className="apparait mt-12 desk:mt-16" />
      <div className="mt-12 flex flex-col gap-y-1 border-t border-ligne pt-4 desk:mt-16 desk:flex-row desk:items-baseline desk:justify-between desk:gap-x-6">
        <p className={NOTE}>
          <PhraseMesuree texte={SOURCE_DEFINITIONS.texte} />
        </p>
        <TextLink href="/foncier/" className="flex-none">
          Comprendre le foncier
        </TextLink>
      </div>
    </Section>
  );
}
