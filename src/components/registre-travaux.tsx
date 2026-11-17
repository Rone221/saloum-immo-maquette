import { TITRES } from "@/content/pages/accueil";
import { TRAVAUX, type Source } from "@/content/registre";
import { cx } from "@/lib/base";
import { SOUS_BORNE, T2 } from "@/lib/classes";
import { moisEnLettres, typo } from "@/lib/format";
import { EnTeteSection } from "./en-tete-section";
import { TitreCote } from "./mot-cote";
import { PhraseMesuree } from "./phrase-mesuree";
import { Section } from "./section";
import { TextLink } from "./text-link";

/**
 * Les deux registres sont de vrais tableaux, dessinés en lignes : chaque rangée est
 * une grille (une seule colonne sous 1 101 px). Les éléments de tableau ne sont donc
 * plus affichés en tableau ; leurs rôles sont redits à la main, pour qu'un lecteur
 * d'écran annonce toujours les colonnes.
 *
 * Au bureau, la date tient la marge de toutes les lignes de cartouche du site : 11 rem
 * (components/ligne-cartouche.tsx). « Septembre 2024 » y tient sur une ligne dès
 * 1 101 px, ce que deux colonnes de la grille ne permettent pas avant 1 190 px.
 */
const TABLE = "block w-full text-left";
const COLONNES_JOURNAL = "desk:grid-cols-[11rem_minmax(0,4fr)_minmax(0,4fr)_minmax(0,2.4fr)] desk:gap-x-6";
const COLONNES_SOURCES = "desk:grid-cols-[11rem_minmax(0,6fr)_minmax(0,4fr)] desk:gap-x-6";
const RANGEE = "grid border-b border-ligne desk:items-baseline";
/** La rangée des têtes de colonne : au bureau seulement (lue partout). */
const TETES = "sr-only desk:not-sr-only desk:block";
const TETE = "etiquette block p-0 text-left text-doux";
const CASE = "block p-0";
/** La date d'une rangée : sa tête, dans la voix des mesures, sur une ligne. */
const DATE = "mesure block p-0 text-left whitespace-nowrap";

/**
 * Les sources d'un chantier, une par ligne, en texte simple : la source est une
 * référence entière, sa date ne s'en détache pas. En lien de 44 px de haut si `liens`.
 */
function Sources({ sources, liens }: { sources: Source[]; liens: boolean }) {
  return (
    <ul className="m-0 list-none p-0">
      {sources.map((s) => (
        <li key={s.libelle}>
          {liens && s.href ? (
            <a
              href={s.href}
              className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-4 transition-surface hover:text-accent hover:decoration-2"
            >
              {typo(s.libelle)}
            </a>
          ) : (
            // Sans adresse stable, ou sur l'accueil : citée sans lien (content/registre.ts).
            <span className={liens ? "inline-flex min-h-11 items-center" : undefined}>{typo(s.libelle)}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * Les sources des travaux datés (page Aménager, #travaux) : le relevé des pièces
 * justificatives, en tableau. Une rangée par chantier : le mois dans la voix des
 * mesures, la phrase entière avec ses mesures, puis ses sources en liens de 44 px de
 * haut. Ni grand chiffre ni latérite : l'accueil les a déjà.
 * Jamais une photo d'étape dans la même section (2355 et les 58 parcelles).
 */
export function SourcesTravaux({
  labelledBy,
  className,
}: {
  /** L'id du titre qui nomme le tableau. Sans lui, le tableau se nomme seul. */
  labelledBy?: string;
  className?: string;
}) {
  return (
    <table
      role="table"
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : typo("Chantiers datés et leurs sources")}
      className={cx(TABLE, className)}
    >
      <thead role="rowgroup" className={TETES}>
        <tr role="row" className={cx("desk:grid desk:pb-3", COLONNES_SOURCES)}>
          {["Date", "Chantier", "Sources"].map((tete) => (
            <th key={tete} role="columnheader" scope="col" className={TETE}>
              {typo(tete)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody role="rowgroup" className="block border-t border-fort">
        {TRAVAUX.map((t) => (
          <tr role="row" key={t.id} className={cx(RANGEE, COLONNES_SOURCES, "gap-y-1 py-5 desk:py-6")}>
            <th role="rowheader" scope="row" className={DATE}>
              {typo(moisEnLettres(t.mois))}
            </th>
            <td role="cell" className={cx(CASE, "text-chapeau")}>
              <PhraseMesuree texte={t.texte.texte} />
            </td>
            <td role="cell" className={CASE}>
              <Sources sources={t.sources} liens />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Une cote qui se tire sous une mesure : un trait de 1,5 px et ses deux butées, dans la
 * couleur d'accent de la surface (blanc sur la latérite). Elle prend la largeur de ce
 * qu'elle cote, et se tire une fois, de gauche à droite, pendant qu'elle entre à l'écran.
 */
function CoteTiree() {
  return (
    <span aria-hidden="true" className="se-tire mt-2.5 flex items-center text-accent desk:mt-3">
      <span className="h-[11px] w-[1.5px] flex-none bg-current" />
      <span className="h-[1.5px] flex-1 bg-current" />
      <span className="h-[11px] w-[1.5px] flex-none bg-current" />
    </span>
  );
}

/**
 * Le journal de chantier (direction v4, pièce 11) : une rangée par chantier daté. La
 * date dans la voix des mesures, la mesure en grand (chiffre et unité) sur sa cote, la
 * suite de la phrase, puis la source en petit. Des faits datés, jamais un cumul ni un
 * chiffre qui tourne : seule la cote se tire.
 *
 * Les couleurs suivent la surface : sur l'aplat de latérite (accueil), tout est blanc.
 * `liens` : les sources deviennent des liens ; l'accueil les cite sans lien sortant,
 * la page Aménager les donne (SourcesTravaux).
 */
export function RegistreTravaux({
  liens = false,
  labelledBy,
  className,
}: {
  liens?: boolean;
  /** L'id du titre qui nomme le tableau. Sans lui, le tableau se nomme seul. */
  labelledBy?: string;
  className?: string;
}) {
  return (
    <table
      role="table"
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : typo("Chantiers datés")}
      className={cx(TABLE, className)}
    >
      <thead role="rowgroup" className={TETES}>
        <tr role="row" className={cx("desk:grid desk:pb-3", COLONNES_JOURNAL)}>
          {["Date", "Mesure", "Travaux", "Source"].map((tete) => (
            <th key={tete} role="columnheader" scope="col" className={TETE}>
              {typo(tete)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody role="rowgroup" className="block border-t border-fort">
        {TRAVAUX.map((t) => (
          <tr role="row" key={t.id} className={cx(RANGEE, COLONNES_JOURNAL, "apparait gap-y-3 py-7 desk:py-9")}>
            <th role="rowheader" scope="row" className={DATE}>
              {typo(moisEnLettres(t.mois))}
            </th>
            <td role="cell" className={CASE}>
              {/* La cote prend la largeur de la mesure : le chiffre et son unité. En colonne
                  souple : la ligne de base de la case reste celle du chiffre, et la date,
                  la phrase et la source s'y alignent. */}
              <span className="inline-flex flex-col">
                <span className="whitespace-nowrap">
                  <span className="mesure text-mesure">{t.mesure.chiffre}</span>{" "}
                  <span className="mesure ml-1 text-chapeau">{typo(t.mesure.unite)}</span>
                </span>
                <CoteTiree />
              </span>
            </td>
            <td role="cell" className={cx(CASE, "text-chapeau")}>
              <PhraseMesuree texte={t.mesure.suite} />
            </td>
            <td role="cell" className={cx(CASE, "text-small text-doux")}>
              <Sources sources={t.sources} liens={liens} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Accueil, « Nos chantiers, datés » : le journal de chantier sur l'aplat de latérite,
 * la seule fois de la page. L'en-tête de section compte les chantiers ; le lien mène
 * aux sources, sur la page Aménager.
 */
export function AccueilTravaux({
  numero,
  className,
}: {
  /** La borne de la section, à la suite de celles de la page : « 05 ». */
  numero: string;
  className?: string;
}) {
  return (
    <Section id="travaux" labelledBy="t-travaux" surface="laterite" className={className}>
      <EnTeteSection numero={numero} nom="Le journal de chantier" quantite={`${TRAVAUX.length} chantiers datés`} />
      <h2 id="t-travaux" className={cx(T2, SOUS_BORNE)}>
        <TitreCote texte={TITRES.travaux} mot="datés" />
      </h2>
      <RegistreTravaux labelledBy="t-travaux" className="mt-10 desk:mt-14" />
      <TextLink href="/amenager/#travaux" className="mt-6 desk:mt-8">
        Les sources, sur la page Aménager
      </TextLink>
    </Section>
  );
}
