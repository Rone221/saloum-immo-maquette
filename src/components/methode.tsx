import type { ReactNode } from "react";
import { METHODE, TITRES } from "@/content/pages/accueil";
import { NATURES, PHOTOS, type PhotoId } from "@/content/photos";
import { ETAPE_TITRE, GESTES } from "@/content/services";
import { cx } from "@/lib/base";
import { CHAPEAU, SOUS_BORNE, T2, T3 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { Coupe } from "./coupe";
import { EnTeteSection } from "./en-tete-section";
import { MethodeEtapes } from "./methode-etapes";
import { TitreCote } from "./mot-cote";
import { Photo, sizesRecadree } from "./photo";
import { Section } from "./section";
import { TextLink } from "./text-link";
import "./methode.css";

/** Une étape de la méthode : son nom, ce que fait l'équipe, la photo du geste. */
export type EtapeMethode = {
  nom: string;
  /** La phrase de l'équipe : « nous », au présent. Reprise du contenu, au mot. */
  texte: string;
  /** La photo du geste. Absente : l'étape n'a pas d'image (le papier). */
  photo?: PhotoId;
  /** Cadrage (object-position), quand celui de la fiche ne convient pas au cadre 4:5. */
  position?: string;
};

/**
 * Les étapes de l'accueil : les cinq gestes du chantier, dans l'ordre de la coupe,
 * puis le papier, sans photo (content/services.ts).
 */
const ETAPES_ACCUEIL: EtapeMethode[] = [...GESTES, ETAPE_TITRE];

/** Le cadre d'une photo de geste : 4:5, comme les photos du chantier, prises en hauteur. */
const RATIO_CADRE = 4 / 5;
/** Sa largeur dessinée, au plus : 200 px au bureau, 160 sur tablette, 104 sur téléphone. */
const LARGEURS_CADRE = "(min-width: 1101px) 200px, (min-width: 761px) 160px, 104px";

/**
 * La méthode (direction v4, pièce 9) : une planche au bleu encadrée. À gauche, les
 * étapes, chacune avec son nom en Besley, la phrase de l'équipe et une petite photo du
 * geste. À droite, la coupe d'une voie, collée, qui se construit avec l'étape lue. En
 * bas de la coupe, son cartouche : « Coupe de principe · sans échelle », puis le nom
 * de l'étape en cours.
 *
 * Sous 1 101 px, une colonne : la coupe se colle sous l'en-tête (38 % de l'écran) et
 * les étapes défilent dessous. Sous 761 px, la planche va d'un bord de l'écran à
 * l'autre : elle se pose dans un `wrap`, dont elle annule la gouttière.
 *
 * Les étapes suivent l'ordre de la coupe : la première pose le terrassement, la
 * cinquième l'électricité. Une étape de plus (le papier) ne dessine rien : la coupe est
 * entière. Aucun numéro : l'ordre de la liste est celui du chantier.
 *
 * À poser dans une <Section surface="plan"> (les couleurs suivent la surface), sous son
 * en-tête de section et son titre :
 *
 *   <Section surface="plan" labelledBy="t-methode" croisillons>
 *     <EnTeteSection numero="03" nom="La méthode" quantite={`${GESTES.length} gestes`} />
 *     <h2 id="t-methode" className={`${T2} ${SOUS_BORNE}`}>…</h2>
 *     <Methode className="mt-10 desk:mt-14" />
 *   </Section>
 *
 * Sans script ou en mouvement réduit : la coupe entière, toutes les étapes lisibles
 * (components/methode-etapes.tsx fait l'écoute, methode.css et coupe.css le mouvement).
 *
 * La page Aménager a sa propre planche (components/amenager-etapes.tsx : plusieurs
 * photos par étape, en grand). Elle s'appuie sur les classes de methode.css (.methode,
 * .methode-figure, .methode-etapes, .methode-nom, .methode-mot, .methode-lue-nom,
 * .coupe-cartouche) et sur les attributs lus par methode-etapes.tsx
 * (data-methode-etape, data-nom, data-methode-nom) : en changer un, c'est la changer.
 */
export function Methode({
  etapes = ETAPES_ACCUEIL,
  suite = <TextLink href="/amenager/">Les étapes en détail</TextLink>,
  className,
}: {
  /** Les étapes, dans l'ordre de la coupe. Par défaut : les cinq gestes de l'accueil, puis le papier. */
  etapes?: EtapeMethode[];
  /** Sous la dernière étape : le lien vers la suite. `null` pour ne rien mettre. */
  suite?: ReactNode;
  className?: string;
}) {
  return (
    <MethodeEtapes className={cx("methode", className)}>
      {/* La coupe d'abord : en une colonne, elle est au-dessus des étapes. */}
      <Coupe className="methode-figure">
        <p className="coupe-case methode-lue">
          <span className="etiquette">{typo("Étape")}</span>
          {/* Le nom de l'étape lue, écrit par le script. Au repos : la coupe les montre toutes. */}
          <span data-methode-nom="" className="methode-lue-nom">
            {typo("Toutes")}
          </span>
        </p>
      </Coupe>
      <ol className="methode-etapes">
        {etapes.map((e, i) => {
          const derniere = i === etapes.length - 1;
          return (
            <li
              key={e.nom}
              data-methode-etape=""
              data-nom={typo(e.nom)}
              className={cx("methode-etape", !e.photo && "methode-etape-nue")}
            >
              <h3 className={cx(T3, "methode-nom")}>
                <span className="methode-mot">{typo(e.nom)}</span>
              </h3>
              <p className="methode-phrase">{typo(e.texte)}</p>
              {e.photo ? (
                // Sans boîte : la photo et sa nature se rangent dans la grille de l'étape.
                <figure className="contents">
                  <span className="methode-cadre">
                    <Photo
                      id={e.photo}
                      fill
                      position={e.position}
                      sizes={sizesRecadree(e.photo, RATIO_CADRE, LARGEURS_CADRE)}
                      className="object-cover"
                    />
                  </span>
                  {/* Ce qu'est l'image. Ce qu'elle montre, la phrase de l'étape le dit. */}
                  <figcaption className="methode-nature etiquette">{typo(NATURES[PHOTOS[e.photo].nature])}</figcaption>
                </figure>
              ) : null}
              {derniere && suite ? <div className="methode-suite">{suite}</div> : null}
            </li>
          );
        })}
      </ol>
    </MethodeEtapes>
  );
}

/**
 * Accueil, la section de la méthode : « Du débroussaillage au titre foncier ». Sur le
 * bleu de plan et ses croisillons : l'en-tête de section (la quantité vraie : les
 * gestes du chantier, comptés dans le contenu), le titre et son mot coté, le chapeau,
 * puis la planche.
 *
 * Entre deux bleus, toujours du clair : la section d'avant et celle d'après sont sur le
 * sable ou le calque (le bloc des propriétaires la suit, sur le calque).
 */
export function AccueilMethode({
  numero,
  className,
}: {
  /** La borne de la section, à la suite de celles de la page : « 03 ». */
  numero: string;
  className?: string;
}) {
  return (
    <Section id="methode" surface="plan" labelledBy="t-methode" croisillons className={className}>
      <EnTeteSection numero={numero} nom="La méthode" quantite={`${GESTES.length} gestes`} />
      <div className={cx("grid gap-y-5 desk:grid-cols-12 desk:items-end desk:gap-x-6", SOUS_BORNE)}>
        <h2 id="t-methode" className={cx(T2, "max-w-[14em] desk:col-span-7")}>
          <TitreCote texte={TITRES.methode} mot="titre" />
        </h2>
        <p className={cx(CHAPEAU, "max-w-[36rem] desk:col-span-4 desk:col-start-9")}>{typo(METHODE.chapeau)}</p>
      </div>
      <Methode className="mt-10 desk:mt-14" />
    </Section>
  );
}
