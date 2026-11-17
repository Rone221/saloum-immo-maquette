import type { ReactNode } from "react";
import { DOCUMENTS, type Document } from "@/content/foncier";
import { LIBELLES, MESSAGES } from "@/content/messages";
import {
  AUTRES_SITES_RELEVE,
  COLONNES_AUTRES,
  LEGENDE_AUTRES,
  OFFRE_AIBD,
  PAPIERS,
  RELEVE,
  type LigneAutre,
  type TraitPapier,
} from "@/content/pages/terrains";
import { PROGRAMMES, RECASEMENT_AIBD } from "@/content/programmes";
import { cx } from "@/lib/base";
import { T3 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { waHref } from "@/lib/whatsapp";
import { BoutonWhatsApp } from "./boutons";
import { Etat } from "./index-terrains";
import { NomFleche } from "./liste-terrains";
import { Lien, TextLink } from "./text-link";

// Les deux pièces de la page Terrains qui suivent le tableau complet (direction v4,
// section 6 ; components/index-terrains.tsx porte le tableau).
//
// RegistreAutres : ce qui n'est pas dans le tableau des programmes en vente. L'offre
// Recasement AIBD, datée, puis les sites publiés sans fiche, Bayakh et Niague. Un petit
// registre, comme celui des chantiers datés : le nom en Besley, un cran sous ceux du
// tableau ; la phrase publiée, ses mesures dans la voix large ; dessous, ce qui reste à
// demander, avec le carré en contour du tableau ; puis le lien WhatsApp de la ligne.
//
// PapiersTerrains : le papier des terrains de la page, rangés sous une seule ligne qui
// change de trait, comme la ligne de base de l'échelle des papiers. Plein entre deux
// bornes : titre foncier. Tirets : bail. Pointillé : ce qui reste à demander. Elle se
// pose sur la planche au bleu, en traits clairs.

/**
 * Le retard d'une apparition, par rang (globals.css, « apparait ») : un bloc se pose un
 * peu après celui d'avant. Écrit en classes entières, pour que Tailwind les trouve.
 */
const RANGS = ["", "[--rang:1]", "[--rang:2]", "[--rang:3]"];

// --------------------------------------------------- Le registre des autres terrains

/** Le libellé des sites sans fiche : le verbe, puis le mot WhatsApp (messages.ts). */
const DEMANDER = `${LIBELLES.autreSite} sur WhatsApp`;

function echapper(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** La phrase d'une ligne, ses mesures (200 m², 29 hectares, avril 2025) dans la voix large. */
function AvecMesures({ ligne }: { ligne: LigneAutre }) {
  const texte = typo(ligne.texte.texte);
  if (!ligne.mesures.length) return texte;
  const motif = new RegExp(`(${ligne.mesures.map((m) => echapper(typo(m))).join("|")})`);
  return texte.split(motif).map((morceau, i) =>
    i % 2 ? (
      <span key={i} className="mesure-phrase whitespace-nowrap text-fort">
        {morceau}
      </span>
    ) : (
      morceau
    ),
  );
}

/**
 * Un vrai tableau, dessiné en lignes : chaque rangée est une grille. Ses éléments ne sont
 * donc plus affichés en tableau ; leurs rôles sont redits à la main, pour qu'un lecteur
 * d'écran annonce toujours les colonnes (comme components/registre-travaux.tsx).
 *
 * Sous 761 px, tout s'empile : le nom, la phrase, ce qui reste à demander, le lien
 * WhatsApp. De 761 à 1 280 px, le nom à gauche, la phrase et son lien à droite. Dès
 * 1 281 px, trois colonnes sur la grille du site, sur la même ligne de base : avant, le
 * bouton de l'offre ne tient pas dans la sienne.
 */
const GRILLE = "tab:grid tab:grid-cols-12 tab:gap-x-6";
const CASE_NOM = "tab:col-span-5 desk:col-span-4 wide:col-span-3";
const CASE_TEXTE = "tab:col-span-7 desk:col-span-8 wide:col-span-5";
const CASE_ACTION = "tab:col-span-7 tab:col-start-6 desk:col-span-8 desk:col-start-5 wide:col-span-4 wide:col-start-9";
const TETE = "etiquette block p-0 text-left text-doux";

/**
 * Un nom qui peut être un lien : sa boîte fait 44 px de haut (la cible au doigt), le nom
 * posé en bas. Le blanc est au-dessus : ce qui suit (une date, une note) reste collé au
 * nom, et le contour du focus ne passe pas dessus. Tous les noms d'une liste la portent,
 * liens ou non : ils gardent le même pas.
 *
 * Un nom qui mène à une fiche s'écrit comme dans toutes les listes de terrains du site :
 * sans soulignement, avec sa flèche (NomFleche), la couleur d'accent au survol. Un nom
 * sans flèche n'a pas de fiche.
 */
const NOM_44 = "flex min-h-11 items-end";
const LIEN_NOM = "group inline-flex min-h-11 items-end transition-surface hover:text-accent";

/** Le nom d'un terrain qui a une fiche : le lien, le nom, sa flèche. */
function NomLien({ nom, href }: { nom: string; href: string }) {
  return (
    <Lien href={href} className={LIEN_NOM}>
      {/* Un seul bloc dans le lien : sur deux lignes, la flèche reste au dernier mot. */}
      <span>
        <NomFleche nom={nom} />
      </span>
    </Lien>
  );
}

function Rangee({
  nom,
  etiquette,
  ligne,
  action,
  rang,
}: {
  nom: ReactNode;
  /** Sous le nom, dans la couleur d'accent : la date d'une offre. */
  etiquette?: string;
  ligne: LigneAutre;
  /** Le bouton ou le lien WhatsApp de la ligne. */
  action: ReactNode;
  /** Le rang de la rangée : elle se pose un peu après celle d'avant. */
  rang: number;
}) {
  return (
    <tr
      role="row"
      className={cx(
        // La boîte du nom porte déjà son blanc du haut : moins de marge au-dessus qu'en dessous.
        "apparait block border-b border-ligne pt-2 pb-6 tab:gap-y-4 tab:items-baseline desk:pt-4 desk:pb-7",
        GRILLE,
        RANGS[rang],
      )}
    >
      <th role="rowheader" scope="row" className={cx("block p-0 text-left font-normal", CASE_NOM)}>
        <span className={cx(T3, NOM_44, "text-fort")}>{nom}</span>
        {etiquette ? <span className="etiquette mt-1.5 block text-accent">{typo(etiquette)}</span> : null}
      </th>
      <td role="cell" className={cx("mt-3 block max-w-[34rem] p-0 tab:mt-0", CASE_TEXTE)}>
        <p>
          <AvecMesures ligne={ligne} />
        </p>
        {/* Ce qui reste à demander : le carré en contour de la colonne État du tableau. */}
        {ligne.aDemander ? <Etat nature="a-demander" texte={ligne.aDemander.texte} className="mt-2.5" /> : null}
      </td>
      <td role="cell" className={cx("mt-5 block p-0 tab:mt-0 wide:justify-self-end", CASE_ACTION)}>
        {action}
      </td>
    </tr>
  );
}

/**
 * Ce qui est publié sans être au tableau, en registre : l'offre Recasement AIBD d'abord,
 * sa date sous son nom, qui mène à sa fiche ; puis les sites publiés sans fiche. Sous la
 * phrase, ce qui reste à demander porte le carré en contour du tableau : le même signe
 * au-dessus et ici.
 *
 * Un seul bouton, en contour, pour l'offre : elle a une fiche et un prix. Les sites sans
 * fiche ont un lien de texte. Trois boutons de suite feraient un mur sur téléphone,
 * juste après ceux du tableau ; l'action principale de la page est dans l'appel final.
 */
export function RegistreAutres({ className }: { className?: string }) {
  return (
    <table role="table" className={cx("block w-full text-left", className)}>
      <caption className="sr-only">{typo(LEGENDE_AUTRES)}</caption>
      <thead role="rowgroup" className="sr-only tab:not-sr-only tab:block">
        <tr role="row" className={cx("tab:pb-3", GRILLE)}>
          <th role="columnheader" scope="col" className={cx(TETE, CASE_NOM)}>
            {typo(COLONNES_AUTRES.terrain)}
          </th>
          <th role="columnheader" scope="col" className={cx(TETE, CASE_TEXTE)}>
            {typo(COLONNES_AUTRES.publie)}
          </th>
          {/* Le lien dit lui-même ce qu'il fait : son en-tête n'est que lu. */}
          <th role="columnheader" scope="col" className="sr-only">
            {typo(COLONNES_AUTRES.demande)}
          </th>
        </tr>
      </thead>
      <tbody role="rowgroup" className="block border-t border-fort">
        <Rangee
          rang={0}
          // La seule ligne qui a une fiche : son nom y mène.
          nom={<NomLien nom={RECASEMENT_AIBD.nom} href={RECASEMENT_AIBD.href} />}
          etiquette={RECASEMENT_AIBD.etiquette}
          ligne={OFFRE_AIBD}
          action={
            <BoutonWhatsApp
              variante="contour"
              taille="compact"
              label={RECASEMENT_AIBD.libelleWhatsApp}
              message={RECASEMENT_AIBD.message}
            />
          }
        />
        {AUTRES_SITES_RELEVE.map((s, i) => (
          <Rangee
            key={s.nom}
            rang={i + 1}
            nom={typo(s.nom)}
            ligne={s}
            action={
              // Le même lien WhatsApp qu'un bouton : le message de la ligne, déjà écrit.
              <TextLink href={waHref(typo(MESSAGES[s.message].texte))} aria-label={`${DEMANDER}, ${s.nom}`}>
                {DEMANDER}
              </TextLink>
            }
          />
        ))}
      </tbody>
    </table>
  );
}

// --------------------------------------------------------- Le papier de chaque terrain

/** Un terrain sous son trait : son nom, le lien vers sa fiche s'il en a une, une note. */
type Terrain = { nom: string; href?: string; note?: ReactNode };

type Groupe = { trait: TraitPapier; papier: string; terrains: Terrain[] };

/** Le nom d'un document, tel que la page Foncier l'écrit (content/foncier.ts). */
function nomDocument(cle: Document["cle"]): string {
  return DOCUMENTS.find((d) => d.cle === cle)?.nom ?? "";
}

/**
 * Le statut foncier d'un programme, en mots (programmes.ts), sa référence publiée dans
 * la voix des mesures : « Titre mère TF 15026/R ».
 */
function StatutAvecReference({ slug, texte }: { slug: string; texte: string }) {
  const reference = RELEVE.find((r) => r.slug === slug)?.reference?.valeur.texte;
  const phrase = typo(texte);
  if (!reference || !phrase.includes(typo(reference))) return phrase;
  const [avant, apres] = phrase.split(typo(reference));
  return (
    <>
      {avant}
      <span className="mesure whitespace-nowrap text-fort">{typo(reference)}</span>
      {apres}
    </>
  );
}

/**
 * Les trois groupes, dans l'ordre du tableau : les titres fonciers d'abord. Rien n'est
 * écrit ici : chaque terrain est rangé d'après son statut publié. Un site dont rien
 * n'est publié, ni sur son papier ni sur une vente, n'est rangé sous aucun trait.
 */
const GROUPES: Groupe[] = [
  {
    trait: "plein",
    papier: nomDocument("tf"),
    terrains: PROGRAMMES.filter((p) => p.foncier === "titre").map((p) => ({
      nom: p.nom,
      href: p.href,
      note: <StatutAvecReference slug={p.slug} texte={(p.statutFiche ?? p.statut).texte} />,
    })),
  },
  {
    trait: "tirets",
    papier: nomDocument("bail"),
    terrains: [{ nom: RECASEMENT_AIBD.nom, href: RECASEMENT_AIBD.href, note: typo(PAPIERS.noteOffre.texte) }],
  },
  {
    trait: "pointille",
    papier: PAPIERS.aDemander.texte,
    terrains: [
      ...PROGRAMMES.filter((p) => p.foncier === "a-demander").map((p) => ({ nom: p.nom, href: p.href })),
      // Les sites sans fiche dont le statut foncier est écrit « à demander ».
      ...AUTRES_SITES_RELEVE.filter((s) => s.foncier === "a-demander").map((s) => ({ nom: s.nom })),
    ],
  },
];

/**
 * Le nombre de terrains rangés sous la ligne : la quantité vraie de l'en-tête de
 * section. Elle se compte ici, sur ce que la figure montre.
 */
export const NOMBRE_TERRAINS = GROUPES.reduce((n, g) => n + g.terrains.length, 0);

/**
 * Dès 761 px, trois colonnes égales : un tiers de la ligne par trait. Chaque colonne
 * garde la place d'un nom entier (« Recasement AIBD ») et de l'étiquette la plus longue,
 * à toutes les largeurs.
 */
const GRILLE_PAPIERS = "tab:grid-cols-3 tab:gap-x-6";

/** Le trait lui-même (globals.css, « Traits »). */
const TRAITS: Record<TraitPapier, string> = {
  plein: "h-0.5 bg-current",
  tirets: "tirets h-[1.5px]",
  pointille: "pointille h-[1.5px]",
};

/** Une borne vue d'en haut, comme sous l'échelle des papiers : la face blanche. */
const BORNE = "size-[11px] flex-none border-[1.5px] border-encre bg-blanc";
/** Une butée de cote. */
const BUTEE = "h-full w-[1.5px] flex-none bg-current";

/**
 * Un tronçon de la ligne : son bout de départ, le trait, son bout d'arrivée. Le plein
 * part d'une borne et finit sur une borne : c'est ce qui est borné. Les autres vont
 * d'une butée à l'autre. `suite` : le tronçon repart du bout du précédent, sans butée
 * à lui (les tirets, dans la ligne d'un seul tenant).
 */
function Troncon({ trait, suite = false, className }: { trait: TraitPapier; suite?: boolean; className?: string }) {
  const bout = trait === "plein" ? BORNE : BUTEE;
  return (
    <span className={cx("flex h-[11px] items-center", className)}>
      {suite ? null : <span className={bout} />}
      <span className={cx("flex-1", TRAITS[trait])} />
      {suite ? null : <span className={bout} />}
    </span>
  );
}

/**
 * Le papier de chaque terrain (page Terrains, pièce 03). Une ligne qui change de trait,
 * puis trois groupes dessous : le nom du papier en étiquette, ses terrains en Besley,
 * chacun avec sa flèche et le lien vers sa fiche quand il en a une, et son statut en
 * mots quand il ajoute quelque chose (le titre mère, la date de l'offre).
 *
 * Dès 761 px, la ligne est d'un seul tenant et se tire une fois, de gauche à droite :
 * le plein entre ses deux bornes, les tirets qui repartent de la seconde, le pointillé
 * entre ses deux butées. Sous 761 px, les groupes s'empilent, chacun sous son tronçon.
 *
 * À poser dans une section `plan`, sous son titre : les noms des papiers sont des h3.
 */
export function PapiersTerrains({ className }: { className?: string }) {
  return (
    <div className={className}>
      {/* La ligne entière : un dessin, les mots sont dessous. */}
      <div aria-hidden="true" className={cx("se-tire hidden text-fort tab:grid", GRILLE_PAPIERS)}>
        {GROUPES.map((g, i) => (
          <Troncon
            key={g.trait}
            trait={g.trait}
            suite={g.trait === "tirets"}
            // Chaque tronçon court à travers la gouttière, jusqu'au suivant.
            className={i < GROUPES.length - 1 ? "-mr-6" : undefined}
          />
        ))}
      </div>
      <ol className={cx("m-0 grid list-none gap-y-10 p-0", GRILLE_PAPIERS)}>
        {GROUPES.map((g, i) => (
          <li key={g.trait}>
            <span aria-hidden="true" className="se-tire block text-fort tab:hidden">
              <Troncon trait={g.trait} />
            </span>
            <h3 className="etiquette mt-4 pr-4 text-fort desk:mt-5">{typo(g.papier)}</h3>
            {/* 6 px sous l'étiquette, 6 px entre deux terrains : le contour du focus d'un
                nom (5 px autour de sa boîte) ne touche ni l'une ni la note d'au-dessus. */}
            <ul className={cx("apparait m-0 mt-1.5 grid list-none gap-y-1.5 p-0 pr-4", RANGS[i])}>
              {g.terrains.map((t) => (
                <li key={t.nom}>
                  <p className={cx(T3, NOM_44, "text-fort")}>
                    {t.href ? <NomLien nom={t.nom} href={t.href} /> : typo(t.nom)}
                  </p>
                  {/* Sur deux lignes, la note se coupe entre ses deux phrases, pas au milieu de « Titre mère ». */}
                  {t.note ? <p className="mt-1.5 max-w-[26rem] text-small text-balance text-doux">{t.note}</p> : null}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
