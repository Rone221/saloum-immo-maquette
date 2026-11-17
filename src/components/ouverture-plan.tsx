import "./ouverture-plan.css";
import type { CSSProperties } from "react";
import manifeste from "../../public/photos/photos.json";
import { OUVERTURE } from "@/content/pages/accueil";
import { CARTOUCHE, CLE_NUMERO, LUNETTE, MESURES_CHAPEAU, PLANCHE } from "@/content/pages/accueil-ouverture";
import { MOBILE } from "@/content/site";
import { asset, cx } from "@/lib/base";
import { CHAPEAU, TITRE_ACCUEIL } from "@/lib/classes";
import { typo } from "@/lib/format";
import { Bouton } from "./boutons";
import { CaseCartouche, Cartouche } from "./cartouche";
import { EnTeteSection } from "./en-tete-section";
import { Lunette, type Troncon, type Zone } from "./lunette";
import { MotCote } from "./mot-cote";
import { Photo } from "./photo";

/** La photo de l'ouverture : une vue d'en haut, lieu non publié (content/photos.ts). */
const PHOTO = "2538";

/** Dimensions de l'original de 2538 : les axes et les voies sont relevés dans ce repère. */
const L = 2560;
const H = 1707;

/**
 * Axes des quatre voies en latérite de 2538, relevés sur l'original (px), dans
 * l'ordre où ils se tracent : la voie qui traverse, puis les trois voies transversales.
 * Ce sont les voies visibles sur la photo, rien d'autre : pas de lot ni de cote inventés.
 */
const AXES = [
  { id: "nord-sud", d: "M1341 205 V1512", delai: 0.35 },
  { id: "haute", d: "M480 349 H1341", delai: 0.9 },
  { id: "milieu", d: "M624 698 H1699", delai: 1.15 },
  { id: "basse", d: "M637 1088 H2093", delai: 1.4 },
];

/** Ce qui se trace va à vitesse constante : tant de pixels de l'original par seconde. */
const VITESSE = 1200;

/** Longueur d'un axe (un trait droit : « M x y V y2 » ou « M x y H x2 »), en px de l'original. */
function longueur(d: string): number {
  const m = d.match(/^M(\d+) (\d+) ([VH])(\d+)$/);
  if (!m) return VITESSE;
  return Math.abs(Number(m[4]) - Number(m[3] === "V" ? m[2] : m[1]));
}

/**
 * Les voies, pour la lunette : la chaussée de part et d'autre de chaque axe, mesurée sur
 * l'original. Les bordures y sont des lignes de pierres peintes en blanc, de 3 à 4 px :
 * on a relevé leur écart à l'axe tous les 24 px et ajusté une droite (écart au plus de
 * 2 px). Les axes ne sont pas tout à fait au milieu des voies, et les voies ne sont pas
 * tout à fait droites : d'où deux écarts par côté, au départ et à l'arrivée du tronçon.
 * `gauche` et `droite` : à main gauche et à main droite, dans le sens du tronçon.
 * Les tronçons `nu` n'ont pas de bordure : la pointe nord, contre le mur ; l'aire de
 * retournement, au sud ; les deux fins de voie coupées en biais par le mur d'enceinte.
 * Hors de ces tronçons, la lunette ne nomme rien : ni le bout d'axe au nord du mur, ni
 * l'entrée de la voie haute, côté rue.
 */
const TRONCONS: Troncon[] = [
  // La voie qui traverse, du nord au sud : à gauche l'est, à droite l'ouest.
  { de: [1341, 275], a: [1341, 322], gauche: [5, 17], droite: [38, 38], nu: true },
  { de: [1341, 322], a: [1341, 1417], gauche: [17.1, 33.3], droite: [40.7, 33.5] },
  { de: [1341, 1417], a: [1341, 1512], gauche: [45, 45], droite: [45, 45], nu: true },
  // La voie haute, d'ouest en est : à gauche le nord, à droite le sud.
  { de: [668, 349], a: [1341, 349], gauche: [25.9, 27.2], droite: [23.7, 16.9] },
  // La voie du milieu.
  { de: [630, 698], a: [1341, 698], gauche: [30.7, 33.5], droite: [26.2, 25.4] },
  { de: [1341, 698], a: [1655, 698], gauche: [34.2, 36.2], droite: [23.1, 22.7] },
  { de: [1655, 698], a: [1697, 698], gauche: [36, 0], droite: [22.7, 22.7], nu: true },
  // La voie basse.
  { de: [640, 1088], a: [1341, 1088], gauche: [34.3, 35.3], droite: [31, 29.8] },
  { de: [1341, 1088], a: [1900, 1088], gauche: [34.8, 35.7], droite: [31, 29.8] },
  { de: [1900, 1088], a: [1995, 1088], gauche: [35.7, 36.5], droite: [29.8, 26.6] },
  { de: [1995, 1088], a: [2072, 1088], gauche: [36.5, 27], droite: [26.6, 24] },
  { de: [2072, 1088], a: [2093, 1088], gauche: [27, 24], droite: [24, 23], nu: true },
];

/**
 * Quatre véhicules sont garés sur les voies (trois sur la voie basse, un sur l'aire de
 * retournement) : la lunette n'y nomme rien, elle ne dit pas « voie » en visant un toit.
 */
const VEHICULES: Zone[] = [
  [1200, 1076, 1256, 1112],
  [1840, 1076, 1915, 1116],
  [1976, 1072, 2044, 1104],
  [1312, 1436, 1368, 1505],
];

/**
 * Largeur dessinée de la photo (elle déborde du cadre quand il est plus haut qu'elle) :
 * la largeur de l'écran dès qu'elle suffit à couvrir, sinon la largeur que lui donne la
 * feuille de style (ouverture-plan.css, « La feuille »). 631 px sur mobile : la voie
 * du milieu, 44 px sous le haut de la fenêtre. 1 344 px au bureau : le cadre de 896 px
 * de haut, couvert par une photo au ratio 3:2.
 */
const SIZES = "(min-width: 1345px) 100vw, (min-width: 1101px) 1344px, (min-width: 632px) 100vw, 631px";

/** Le mot coté du titre, tel qu'il est écrit dans OUVERTURE.titre. */
const MOT_COTE = "viabilisées";

/**
 * Le titre et son mot coté. Au bureau, deux lignes, coupées après la virgule : la
 * hauteur du titre ne dépend pas de la largeur de l'écran.
 */
function Titre() {
  const texte = OUVERTURE.titre.texte;
  const debut = texte.indexOf(MOT_COTE);
  if (debut < 0) return <>{typo(texte)}</>;
  const suite = texte.slice(debut + MOT_COTE.length);
  // La virgule reste collée au mot.
  const colle = suite.match(/^ ?[,.;:!?»…]+/)?.[0] ?? "";
  return (
    <>
      {typo(texte.slice(0, debut))}
      <span className="whitespace-nowrap">
        <MotCote arrivee>{MOT_COTE}</MotCote>
        {typo(colle)}
      </span>
      <br className="hidden desk:block" />
      {typo(suite.slice(colle.length))}
    </>
  );
}

/** Une mesure dans le fil du chapeau : la voix large, en blanc plein. */
const MESURE = "mesure-phrase whitespace-nowrap text-fort";

function echapper(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Une phrase du chapeau, ses mesures (78, 150 m², 30 mars 2026) composées dans la voix large. */
function avecMesures(texte: string) {
  const motif = new RegExp(`(?<!\\d)(${MESURES_CHAPEAU.map((m) => echapper(typo(m))).join("|")})(?!\\d)`);
  return typo(texte)
    .split(motif)
    .map((morceau, i) =>
      i % 2 ? (
        <span key={i} className={MESURE}>
          {morceau}
        </span>
      ) : (
        morceau
      ),
    );
}

/**
 * L'ouverture de l'accueil (direction v4, pièce 3) : la vue d'en haut d'un lotissement
 * aménagé, bord à bord, et le plan posé dessus. Du fond vers l'avant : la photo ; un
 * voile de plan ; les croisillons clairs, à droite ; les axes des quatre voies, en trait
 * mixte, qui se tracent une fois à l'arrivée ; quatre repères de cadrage ; l'en-tête de
 * planche ; le titre, le chapeau et le bouton ; le cartouche de la photo ; la lunette.
 *
 * C'est le premier bloc de la page : il porte data-ouverture="sombre", l'en-tête du site
 * passe en surimpression (notice des fondations, partie 8).
 *
 * Les axes ne se tracent que dans la fenêtre, entre l'en-tête de planche et le titre :
 * aucun ne passe en travers d'une ligne de texte. Sans mouvement, ils sont là d'emblée.
 * La photo n'a ni nom de lieu ni nom de programme : le sien n'est pas publié.
 */
export function OuverturePlan() {
  const variantes = (manifeste as Record<string, { variantes: number[] }>)[PHOTO].variantes;
  return (
    <section data-ouverture="sombre" aria-labelledby="t-hero" className="ouv sur-plan">
      <div className="ouv-cadre">
        <div className="ouv-fond">
          <Photo id={PHOTO} preload sizes={SIZES} className="ouv-feuille" />
          <span aria-hidden="true" className="ouv-voile" />
          <span aria-hidden="true" className="ouv-croisillons croisillons-clairs" />
        </div>

        <div className="wrap ouv-haut">
          <div data-sans-lunette="ligne" className="ouv-planche">
            <EnTeteSection numero="01" nom={PLANCHE.nom.texte} quantite={PLANCHE.nature.texte} arrivee />
          </div>

          {/* La fenêtre : la photo y est claire, le tracé s'y pose. Rien à lire dedans. */}
          <div aria-hidden="true" className="ouv-fenetre">
            <div className="ouv-fond ouv-fond-trace">
              <svg viewBox={`0 0 ${L} ${H}`} preserveAspectRatio="xMidYMid slice" className="ouv-feuille">
                <defs>
                  {AXES.map((a) => (
                    <mask key={a.id} id={`ouv-axe-${a.id}`} maskUnits="userSpaceOnUse" x="0" y="0" width={L} height={H}>
                      <path
                        d={a.d}
                        pathLength={1}
                        className="ouv-axe-masque"
                        style={{ "--d": `${a.delai}s`, "--t": `${(longueur(a.d) / VITESSE).toFixed(2)}s` } as CSSProperties}
                      />
                    </mask>
                  ))}
                </defs>
                {AXES.map((a) => (
                  <path key={a.id} d={a.d} mask={`url(#ouv-axe-${a.id})`} className="ouv-axe" />
                ))}
              </svg>
            </div>
          </div>

          <h1 id="t-hero" data-sans-lunette="" className={cx(TITRE_ACCUEIL, "w-fit")}>
            <Titre />
          </h1>
        </div>
      </div>

      <div className="wrap ouv-bas">
        <div data-sans-lunette="">
          <p className={CHAPEAU}>
            {avecMesures(OUVERTURE.sakina.texte)} <span className={MESURE}>{typo(OUVERTURE.titreMere.texte)}</span>
            {". "}
            {avecMesures(OUVERTURE.lacTown.texte)}
          </p>
          <div className="ouv-actions">
            <Bouton href="/terrains/">{OUVERTURE.bouton}</Bouton>
            <p className="flex flex-col">
              <span className="etiquette text-doux">{typo(CLE_NUMERO)}</span>
              <a href={MOBILE.href} className="mesure text-chapeau text-fort transition-surface hover:text-accent">
                {typo(MOBILE.long)}
              </a>
            </p>
          </div>
        </div>

        <div data-sans-lunette="" className="ouv-cartouche">
          <Cartouche sur="photo" aria-label={CARTOUCHE.nom}>
            {CARTOUCHE.cases.map((c) => (
              <CaseCartouche key={c.cle} enLigne cle={c.cle}>
                {typo(c.valeur.texte)}
              </CaseCartouche>
            ))}
          </Cartouche>
        </div>
      </div>

      {(["hg", "hd", "bg", "bd"] as const).map((angle) => (
        <span key={angle} aria-hidden="true" className={`ouv-repere ouv-repere-${angle}`} />
      ))}

      <Lunette
        grande={asset(`/photos/${PHOTO}-${variantes[variantes.length - 1]}.webp`)}
        largeur={L}
        hauteur={H}
        axes={AXES.map((a) => a.d)}
        troncons={TRONCONS}
        muets={VEHICULES}
        noms={{ axe: typo(LUNETTE.axe.texte), voie: typo(LUNETTE.voie.texte), bordure: typo(LUNETTE.bordure.texte) }}
      />
    </section>
  );
}
