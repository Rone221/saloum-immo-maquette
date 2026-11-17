import type { CSSProperties, ReactNode } from "react";
import { NOMS_COUPE } from "@/content/services";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";

/** Largeur et hauteur du dessin, en unités du SVG. */
const L = 760;
const H = 464;
/** Le trait de terrain : la plateforme, une fois le sol terrassé. */
const SOL = 300;
/**
 * De combien le sol, le terrain naturel et la ligne électrique dépassent du dessin, de
 * chaque côté : quand la figure est plus large que lui (coupe seule sur une page, coupe
 * collée sur une tablette), le terrain va quand même d'un bord à l'autre.
 */
const DEBORD = 1000;
/** Hauteur de la bande de hachures, sous le trait de terrain. */
const BANDE = 32;

/**
 * La ligne électrique : l'axe du poteau du dessin, la portée entre deux poteaux, la
 * hauteur où le câble s'attache, et de combien il pend au milieu d'une portée.
 */
const POTEAU = 630;
const PORTEE = 756;
const ATTACHE = 88;
const FLECHE = 50;
/** Les autres poteaux de la ligne : hors du dessin, une ou deux portées plus loin. */
const AUTRES_POTEAUX = [-2, -1, 1].map((rang) => POTEAU + rang * PORTEE);
/** Les alvéoles du poteau béton, du haut vers le pied (photo 2516). */
const ALVEOLES = [100, 136, 172, 208, 244];

/**
 * Le trait de terrain traverse le dessin en 0,75 s. Sa durée compte aussi ce qui
 * dépasse ; son retard, négatif, saute la part de gauche : le trait part du bord du
 * dessin, pas de plus loin.
 */
const TIRE_SOL = 0.75;
const DUREE_SOL = (TIRE_SOL * (L + 2 * DEBORD)) / L;
const RETARD_SOL = (-TIRE_SOL * DEBORD) / L;

/** Où s'écrit un nom, en unités du dessin. */
type Place = {
  /** L'axe du nom et de son trait de rappel. */
  x: number;
  /** Le bas du nom. */
  bas: number;
  /** Le point que vise le trait de rappel. */
  vers: number;
  /** Le nom part de là, au lieu d'être centré sur son axe (près d'un bord du dessin). */
  depuis?: number;
};

type Nom = {
  /** L'étape qui pose cet objet : 1, le terrassement ; 5, l'électricité. */
  couche: number;
  nom: string;
  /** Dessin large : les noms sur un rang, chacun au-dessus de ce qu'il nomme. */
  large: Place;
  /** Dessin étroit (téléphone) : sur deux rangs, pour tenir en 12 px sans se toucher. */
  etroit: Place;
  /** Le trait de rappel est l'axe de la voie, en trait mixte : il traverse la chaussée. */
  axe?: boolean;
  /** Le nom arrive après son objet, quand la coupe se construit. */
  delai: number;
};

/** Dans l'ordre du chantier, qui est aussi l'ordre de lecture du dessin : de gauche à droite. */
const NOMS: Nom[] = [
  {
    couche: 1,
    nom: NOMS_COUPE.terrassement,
    large: { x: 96, bas: 214, vers: SOL - 3 },
    etroit: { x: 56, bas: 202, vers: SOL - 3, depuis: 10 },
    delai: 0.9,
  },
  { couche: 2, nom: NOMS_COUPE.borne, large: { x: 196, bas: 214, vers: 266 }, etroit: { x: 196, bas: 254, vers: 266 }, delai: 0.5 },
  {
    couche: 3,
    nom: NOMS_COUPE.voie,
    large: { x: 376, bas: 214, vers: SOL + 50 },
    etroit: { x: 376, bas: 202, vers: SOL + 50 },
    axe: true,
    delai: 0.7,
  },
  { couche: 4, nom: NOMS_COUPE.eau, large: { x: 573, bas: 214, vers: 376 }, etroit: { x: 573, bas: 254, vers: 376 }, delai: 0.5 },
  {
    couche: 5,
    nom: NOMS_COUPE.electricite,
    large: { x: POTEAU, bas: 58, vers: 72 },
    etroit: { x: POTEAU, bas: 60, vers: 72 },
    delai: 1.2,
  },
];

const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;

/** Le retard d'une pièce dans son étape, et sa durée si elle n'est pas celle de sa famille. */
const tempo = (delai: number, duree?: number) =>
  ({ "--delai": `${+delai.toFixed(2)}s`, ...(duree ? { "--duree": `${+duree.toFixed(2)}s` } : {}) }) as CSSProperties;

/**
 * Les hachures du sol : un trait à 45° tous les `pas`, tiré du trait de terrain vers le
 * bas. Un seul chemin, sans motif : il prend la couleur de la surface où la coupe est
 * posée, et deux coupes sur une page ne se partagent rien.
 */
function hachures(pas: number) {
  let d = "";
  for (let x = -DEBORD; x <= L + DEBORD + BANDE; x += pas) d += `M${x} ${SOL + 1}l${-BANDE} ${BANDE}`;
  return d;
}

/** Un poteau béton, vu de face : il s'affine vers le haut, son pied est dans le sol. */
const poteau = (x: number) => `M${x - 9.5} ${SOL + 34}L${x - 5.5} 74H${x + 5.5}L${x + 9.5} ${SOL + 34}Z`;

/** Le câble, de poteau en poteau depuis celui du dessin : il pend, puis remonte. */
function cable(sens: 1 | -1, portees: number) {
  let d = `M${POTEAU} ${ATTACHE}`;
  for (let i = 1; i <= portees; i += 1) {
    d += `Q${POTEAU + sens * PORTEE * (i - 0.5)} ${ATTACHE + 2 * FLECHE} ${POTEAU + sens * PORTEE * i} ${ATTACHE}`;
  }
  return d;
}

/** Une borne à tête taillée, à demi dans le sol, et sa marque peinte (photo 2528). */
function Borne({ x, delai = 0 }: { x: number; delai?: number }) {
  return (
    <g data-couche="2" className="c-pose" style={tempo(delai)}>
      <path className="c-borne" d={`M${x - 11} ${SOL + 30}V${SOL - 20}L${x - 6} ${SOL - 30}H${x + 6}L${x + 11} ${SOL - 20}V${SOL + 30}Z`} />
      <rect className="c-marque" x={x - 5} y={SOL - 16} width="10" height="6" />
    </g>
  );
}

/**
 * Coupe de principe d'une voie aménagée, sans échelle : ce qui reste dans le sol une
 * fois les engins partis (direction v4, pièce 9). De gauche à droite, dans l'ordre du
 * chantier : le sol terrassé sous le terrain naturel, la borne, la voie en latérite
 * entre ses bordures, la tranchée et sa canalisation, le poteau et son câble.
 *
 * Un dessin de plan : le terrain naturel en tirets, l'axe de la voie en trait mixte,
 * le sol en hachures, la tranchée en tirets. Aucune cote ni niveau : on n'en publie pas.
 * Les objets sont ceux des photos du client : la borne blanche à tête taillée, marquée
 * à la peinture (2528), les bordures en trapèze (2501), le poteau béton à alvéoles (2516).
 *
 * Les couleurs suivent la surface, rien à passer : traits clairs et latérite vive sur
 * le plan, encre et latérite sur le sable ou le calque. L'eau reste en bleu « eau »,
 * la face des bornes en blanc.
 *
 * Les noms sont écrits sur le dessin, en HTML : 12 px au moins à toutes les largeurs
 * (le texte d'un SVG rapetisse avec lui). Sur un dessin étroit, ils passent sur deux
 * rangs et les traits s'épaississent (coupe.css, requête de conteneur).
 *
 * Seule, la coupe est entière : 800 px de large au plus, calée à gauche, le terrain
 * filant jusqu'au bord de la figure. Dans la méthode (components/methode.tsx), un
 * script pose data-vivante sur la figure et data-posee sur chaque pièce marquée
 * data-couche : la coupe se construit alors avec l'étape lue. Sans script, rien ne manque.
 *
 * `children` : des cases en plus dans le cartouche, sous le dessin (l'étape lue).
 */
export function Coupe({ className, children }: { className?: string; children?: ReactNode }) {
  const description = typo(
    `Coupe de principe d’une voie aménagée, sans échelle : ${Object.values(NOMS_COUPE)
      .map((n) => n.toLowerCase())
      .join(", ")}.`,
  );
  return (
    <figure className={cx("coupe m-0", className)}>
      <div className="coupe-dessin">
        <svg viewBox={`0 0 ${L} ${H}`} role="img" aria-label={description}>
          {/* 1. Terrassement. Les hachures descendent du trait de terrain, une fois qu'il est tiré. */}
          <path data-couche="1" className="c-hachures coupe-etroit" d={hachures(16)} style={tempo(0.5)} />
          <path data-couche="1" className="c-hachures coupe-large" d={hachures(8)} style={tempo(0.5)} />
          {/* Le terrain naturel, avant les travaux : en tirets, de part et d'autre de
              l'emprise. Il est là dès le départ, c'est par lui que le dessin commence. */}
          <path
            className="c-tn"
            d={`M${-DEBORD} 281H-22C-12 281-6 280 0 279C18 274 36 268 56 270S90 285 108 283S140 270 154 276S170 ${SOL} 182 ${SOL}`}
          />
          <path className="c-tn" d={`M690 ${SOL}C702 ${SOL} 714 289 734 287S754 291 760 290S790 286 810 287H${L + DEBORD}`} />

          {/* 4. Eau : la tranchée, en tirets, et la canalisation posée au fond. */}
          <path data-couche="4" className="c-tranchee c-montre" d={`M548 ${SOL}L551 ${SOL + 118}H595L598 ${SOL}`} />
          <circle data-couche="4" className="c-tuyau c-pose" cx="573" cy={SOL + 92} r="16" style={tempo(0.3)} />

          {/* 1. Le trait de terrain : la plateforme. Il se tire de gauche à droite. */}
          <path
            data-couche="1"
            className="c-sol c-trace"
            pathLength={1}
            d={`M${-DEBORD} ${SOL}H${L + DEBORD}`}
            style={tempo(RETARD_SOL, DUREE_SOL)}
          />

          {/* 3. Voies et bordures : la chaussée bombée s'ouvre depuis son axe, puis les
              deux bordures se posent et la tiennent. */}
          <path data-couche="3" className="c-voie c-ouvre" d={`M247 ${SOL - 10}Q376 ${SOL - 44} 505 ${SOL - 10}L502 ${SOL + 26}H250Z`} />
          <path data-couche="3" className="c-beton c-pose" d={`M227 ${SOL + 26}L232 ${SOL - 22}H246L251 ${SOL + 26}Z`} style={tempo(0.35)} />
          <path data-couche="3" className="c-beton c-pose" d={`M501 ${SOL + 26}L506 ${SOL - 22}H520L525 ${SOL + 26}Z`} style={tempo(0.45)} />

          {/* 2. Bornage : deux bornes, aux limites de l'emprise. */}
          <Borne x={196} />
          <Borne x={668} delai={0.15} />

          {/* 5. Électricité : le poteau béton se lève, puis le câble se tire jusqu'au
              poteau suivant, une portée plus loin : il pend, puis remonte. Les autres
              poteaux de la ligne sont hors du dessin ; on ne les voit que si la figure
              est plus large que lui. */}
          <g data-couche="5" className="c-leve">
            <path className="c-beton" d={poteau(POTEAU)} />
            {ALVEOLES.map((y) => (
              <rect key={y} className="c-alveole coupe-large" x={POTEAU - 2.4} y={y} width="4.8" height="18" />
            ))}
          </g>
          {AUTRES_POTEAUX.map((x) => (
            <path key={x} data-couche="5" className="c-beton c-leve" d={poteau(x)} style={tempo(0.2)} />
          ))}
          <path data-couche="5" className="c-cable c-trace" pathLength={1} d={cable(-1, 2)} style={tempo(0.55, 2.2)} />
          <path data-couche="5" className="c-cable c-trace" pathLength={1} d={cable(1, 1)} style={tempo(0.55, 1.5)} />
          <circle data-couche="5" className="c-attache c-montre" cx={POTEAU} cy={ATTACHE} r="3.6" style={tempo(0.5)} />

          {/* Les traits de rappel, du nom à ce qu'il nomme. Deux jeux : les noms ne sont
              pas à la même place sur un dessin large et sur un dessin étroit. */}
          {NOMS.map((n) =>
            (["large", "etroit"] as const).map((taille) => (
              <path
                key={`${n.nom}-${taille}`}
                data-couche={n.couche}
                className={cx(n.axe ? "c-axe" : "c-rappel", "c-montre", `coupe-${taille}`)}
                d={`M${n[taille].x} ${n[taille].bas + 8}V${n[taille].vers}`}
                style={tempo(n.delai)}
              />
            )),
          )}
        </svg>

        {/* Les noms. Lus par l'aria-label du dessin. */}
        {NOMS.map((n) => (
          <span
            key={n.nom}
            aria-hidden="true"
            data-couche={n.couche}
            data-cale={n.etroit.depuis === undefined ? undefined : "gauche"}
            className="coupe-nom"
            style={
              {
                "--x": pct(n.large.x, L),
                "--y": pct(n.large.bas, H),
                "--xe": pct(n.etroit.depuis ?? n.etroit.x, L),
                "--ye": pct(n.etroit.bas, H),
                "--delai": `${n.delai}s`,
              } as CSSProperties
            }
          >
            {typo(n.nom)}
          </span>
        ))}
      </div>
      {/* Le cartouche du dessin : ce qu'il est, et sa limite. */}
      <figcaption className="coupe-cartouche">
        <p className="coupe-case etiquette">{typo("Coupe de principe · sans échelle")}</p>
        {children}
      </figcaption>
    </figure>
  );
}
