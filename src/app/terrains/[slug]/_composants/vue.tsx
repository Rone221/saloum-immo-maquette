import "./fiches.css";
import type { CSSProperties } from "react";
import manifeste from "../../../../../public/photos/photos.json";
import { EnTeteSection } from "@/components/en-tete-section";
import { Lunette, type Point, type Troncon, type Zone } from "@/components/lunette";
import { TitreCote } from "@/components/mot-cote";
import { LegendePhoto, Photo } from "@/components/photo";
import { Section } from "@/components/section";
import { LUNETTE_VUE, QUANTITE_VUE, SECTIONS, TITRES_FICHE } from "@/content/pages/fiches";
import type { PhotoId } from "@/content/photos";
import { asset, cx } from "@/lib/base";
import { CHAPEAU, SOUS_BORNE, T2 } from "@/lib/classes";
import { typo } from "@/lib/format";

/** La vue au drone de Lac Town : une vue oblique. Ni repères de cadrage ni plan dessus. */
const PHOTO: PhotoId = "2580";

/** Dimensions de l'original de 2580 : les axes et les voies sont relevés dans ce repère. */
const L = 2560;
const H = 1430;

/** L'axe d'une voie : une ligne brisée, en pixels de l'original. */
type Axe = { id: string; points: Point[] };

/**
 * Les axes des quatre voies en latérite de Lac Town, relevés sur l'original de 2580, dans
 * l'ordre où ils entrent à l'écran : la voie d'entrée, qui descend depuis le portail, sur
 * la route goudronnée ; puis les trois voies transversales. Chaque axe est la médiane
 * entre les deux bordures de sa voie, mesurées tous les 8 px et ajustées en droites
 * (écart au plus de 2 px). Ce sont les voies visibles, rien d'autre : ni lot ni cote.
 *
 * Les deux moitiés d'une voie transversale ne sont pas tout à fait dans le prolongement
 * l'une de l'autre : la voie haute plie d'un pixel au carrefour, celle du milieu s'y
 * décale de 2,5 px. La voie basse part du pied de la voie d'entrée : elles se rejoignent.
 */
const AXES: Axe[] = [
  { id: "entree", points: [[1121.3, 840], [926.9, 1290.4]] },
  { id: "haute", points: [[592, 920.4], [1081, 933.1], [1662, 945.4]] },
  { id: "milieu", points: [[740, 1075], [1016, 1083], [1016, 1085.5], [1736, 1099.5]] },
  { id: "basse", points: [[926.9, 1290.4], [1820, 1323.3]] },
];

/** Le tracé SVG d'un axe. */
const trace = ({ points }: Axe) => `M${points.map((p) => p.join(" ")).join(" L")}`;

/**
 * Les voies, pour la lunette : la chaussée de part et d'autre de chaque axe, de bordure
 * à bordure, mesurée sur l'original. La vue est oblique : les voies du fond sont plus
 * étroites (20 px entre bordures pour la voie haute, 36 pour la voie basse), et la voie
 * d'entrée s'élargit en venant vers l'objectif. D'où deux écarts par côté, au départ puis
 * à l'arrivée du tronçon. `gauche` et `droite` : à main gauche et à main droite, dans le
 * sens du tronçon.
 * Les tronçons `nu` n'ont pas de bordure : les carrefours, où la chaussée de l'autre voie
 * passe devant, et le pied de la voie d'entrée, où elle tourne dans la voie basse.
 * Hors de ces tronçons, la lunette ne nomme rien.
 */
const TRONCONS: Troncon[] = [
  // La voie d'entrée, du portail vers la voie basse : à gauche l'est, à droite l'ouest.
  { de: [1120.5, 842], a: [1087.7, 918], gauche: [22.4, 24.7], droite: [22.4, 24.7] },
  { de: [1087.7, 918], a: [1074.7, 948], gauche: [24.7, 25.5], droite: [24.7, 25.5], nu: true },
  { de: [1074.7, 948], a: [1024.6, 1064], gauche: [25.5, 29], droite: [25.5, 29] },
  { de: [1024.6, 1064], a: [1006.9, 1105], gauche: [29, 30.2], droite: [29, 30.2], nu: true },
  { de: [1006.9, 1105], a: [944.3, 1250], gauche: [30.2, 34.5], droite: [30.2, 34.5] },
  { de: [944.3, 1250], a: [926.9, 1290.4], gauche: [34.5, 36], droite: [34.5, 36], nu: true },
  // La voie haute, d'ouest en est : à gauche le nord (la bordure peinte), à droite le sud.
  { de: [596, 920.5], a: [1052, 931.9], gauche: [10.4, 9.7], droite: [10.4, 9.7] },
  { de: [1052, 931.9], a: [1081, 933.1], gauche: [9.7, 9.7], droite: [9.7, 9.7], nu: true },
  { de: [1081, 933.1], a: [1110, 934.2], gauche: [9.8, 9.8], droite: [9.8, 9.8], nu: true },
  { de: [1110, 934.2], a: [1662, 945.4], gauche: [9.8, 10.4], droite: [9.8, 10.4] },
  // La voie du milieu. Son bout ouest s'arrondit : la bordure sud y est plus près de l'axe.
  { de: [742, 1075], a: [800, 1076.7], gauche: [14.5, 14.4], droite: [11.5, 15.6] },
  { de: [800, 1076.7], a: [982, 1082], gauche: [14.4, 13.8], droite: [15.6, 15] },
  { de: [982, 1082], a: [1016, 1083], gauche: [13.8, 13.8], droite: [15, 15], nu: true },
  { de: [1016, 1085.5], a: [1050, 1086.1], gauche: [13.9, 13.9], droite: [13.9, 13.9], nu: true },
  { de: [1050, 1086.1], a: [1736, 1099.5], gauche: [13.9, 13.7], droite: [13.9, 13.7] },
  // La voie basse. Vers l'est, sa bordure nord s'écarte de la chaussée.
  { de: [926.9, 1290.4], a: [985, 1292.5], gauche: [16, 16], droite: [16, 16], nu: true },
  { de: [985, 1292.5], a: [1366, 1306.6], gauche: [17.2, 17.6], droite: [17.5, 18] },
  { de: [1366, 1306.6], a: [1816, 1323.1], gauche: [17.6, 24.3], droite: [18, 17] },
];

/**
 * Ce qui est posé sur les voies ou sur leurs bordures : la lunette n'y nomme rien, elle
 * ne dit pas « voie » en visant un toit. Trois véhicules, un piéton, ce qui traîne sur
 * une bordure, et les poteaux plantés au bord des voies.
 */
const OBSTACLES: Zone[] = [
  [1110, 806, 1150, 872], // la voiture garée au portail, et un piéton
  [612, 892, 694, 930], // un pick-up et une moto, sur la voie haute
  [1150, 914, 1200, 940], // une voiture, sur la voie haute
  [846, 890, 864, 916], // contre la bordure de la voie haute
  [786, 1090, 852, 1118], // une bâche, sur la bordure de la voie du milieu
  [958, 1092, 978, 1114], // au coin de la voie du milieu
  [1245, 1298, 1263, 1322], // un fût, sur la voie basse
  [727, 904, 738, 942], // les poteaux de la voie haute
  [1383, 900, 1392, 958],
  [1647, 925, 1657, 964],
  [1043, 1026, 1053, 1104], // ceux de l'entrée et de la voie du milieu
  [1368, 1050, 1377, 1120],
  [1729, 1070, 1738, 1118],
  [1320, 1265, 1330, 1334], // ceux de la voie basse
  [951, 1226, 964, 1300],
];

/**
 * Largeur dessinée de la photo. Sous 761 px, la feuille déborde du cadre 4:3 : 1,88 fois
 * la largeur de l'écran (fiches.css, « La vue »). Au-delà, elle prend celle du conteneur.
 */
const SIZES = "(min-width: 1440px) 1360px, (min-width: 1101px) calc(100vw - 80px), (min-width: 761px) calc(100vw - 56px), 188vw";

/** Une part de la feuille, en pour cent. */
const part = (valeur: number, total: number) => `${((valeur / total) * 100).toFixed(3)}%`;

/**
 * Le dessin d'un axe, posé sur la boîte de son axe. Le trait est masqué par un trait
 * large à pathLength="1", qui le découvre d'un bout à l'autre (fiches.css, « La vue »).
 * Le masque déborde de la boîte : la largeur de son trait.
 *
 * `--portee` : sur quelle course de défilement l'axe se trace, une fois sa boîte entrée à
 * l'écran. C'est ce qui sépare le haut de la boîte du bas de la photo (en centièmes de la
 * largeur de la feuille : cqw), plus 48 px. Les quatre axes sont donc entiers au même
 * moment : quand la photo est entrée tout entière, et sa légende avec elle. Une course
 * fixe laissait les voies du bas à moitié tracées devant une photo déjà en place.
 */
function DessinAxe({ axe }: { axe: Axe }) {
  const xs = axe.points.map((p) => p[0]);
  const ys = axe.points.map((p) => p[1]);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  const l = Math.max(...xs) - x;
  const h = Math.max(...ys) - y;
  const d = trace(axe);
  return (
    <svg
      viewBox={`${x} ${y} ${l} ${h}`}
      preserveAspectRatio="none"
      className="fiche-vue-trace"
      style={
        {
          "--x": part(x, L),
          "--y": part(y, H),
          "--l": part(l, L),
          "--h": part(h, H),
          "--portee": `calc(${(((H - y) / L) * 100).toFixed(2)}cqw + 3rem)`,
        } as CSSProperties
      }
    >
      <defs>
        <mask id={`vue-axe-${axe.id}`} maskUnits="userSpaceOnUse" x={x - 60} y={y - 60} width={l + 120} height={h + 120}>
          <path d={d} pathLength={1} className="fiche-vue-axe-masque" />
        </mask>
      </defs>
      <path d={d} mask={`url(#vue-axe-${axe.id})`} className="fiche-vue-axe" />
    </svg>
  );
}

/**
 * Lac Town, la vue au drone (direction v4, section 6) : la pièce de cette fiche. La photo
 * 2580 en grand, et dessus les axes des voies que Saloum Immo a ouvertes, en trait mixte
 * blanc, comme l'axe d'une voie sur un plan : le geste de l'ouverture de l'accueil. Chaque
 * axe se trace quand il entre à l'écran ; sans mouvement, les axes sont là d'emblée.
 *
 * Au pointeur fin, la lunette de l'accueil (components/lunette.tsx) : elle grossit la
 * photo deux fois et nomme ce qu'on vise, « Axe de voie », « Voie en latérite »,
 * « Bordure de voie ». Hors des voies, rien. Aucun chiffre.
 *
 * Pas de texte sur la photo : sa légende est dessous, à deux colonnes (ce qu'on voit,
 * puis la nature de l'image) ; ce qui est tracé est dit dans l'en-tête de la section.
 * Sur mobile, la photo va bord à bord, cadrée plus serré sur le lotissement.
 *
 * Le cadre est une <section> : c'est le bloc que la lunette cherche autour d'elle. Sans
 * nom accessible, elle n'ajoute aucun repère de page. Le cadre ne porte pas `apparait` :
 * la lunette se cale sur lui.
 */
export function Vue({
  numero,
  dejaFait,
}: {
  /** La borne de la section, à la suite de celles de la fiche. */
  numero: string;
  /** Ce qui est déjà fait, et que la vue montre (programmes.ts). */
  dejaFait: string;
}) {
  const variantes = (manifeste as Record<string, { variantes: number[] }>)[PHOTO].variantes;
  return (
    <Section surface="calque" labelledBy="t-vue">
      <EnTeteSection numero={numero} nom={SECTIONS.vue} quantite={`${AXES.length} ${QUANTITE_VUE}`} />
      <div className={cx("grid gap-y-5 desk:grid-cols-12 desk:items-end desk:gap-x-6", SOUS_BORNE)}>
        <h2 id="t-vue" className={cx(T2, "max-w-[14em] desk:col-span-7")}>
          <TitreCote texte={TITRES_FICHE.vue.texte} mot={TITRES_FICHE.vue.mot} />
        </h2>
        <p className={cx(CHAPEAU, "max-w-[36rem] desk:col-span-4 desk:col-start-9")}>{typo(dejaFait)}</p>
      </div>
      <figure className="-mx-gutter mt-10 mb-0 tab:mx-0 desk:mt-14">
        <section className="fiche-vue-cadre">
          <Photo id={PHOTO} sizes={SIZES} className="fiche-vue-feuille" />
          <div aria-hidden="true" className="fiche-vue-feuille fiche-vue-dessin">
            {AXES.map((axe) => (
              <DessinAxe key={axe.id} axe={axe} />
            ))}
          </div>
          <Lunette
            grande={asset(`/photos/${PHOTO}-${variantes[variantes.length - 1]}.webp`)}
            largeur={L}
            hauteur={H}
            axes={AXES.map(trace)}
            troncons={TRONCONS}
            muets={OBSTACLES}
            noms={{ axe: typo(LUNETTE_VUE.axe.texte), voie: typo(LUNETTE_VUE.voie.texte), bordure: typo(LUNETTE_VUE.bordure.texte) }}
          />
        </section>
        <LegendePhoto id={PHOTO} className="px-gutter text-balance tab:px-0" />
      </figure>
    </Section>
  );
}
