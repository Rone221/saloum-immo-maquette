"use client";

import { useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import type { Jour } from "@/content/demo/trafic";
import { TABLEAU } from "@/content/demo/textes";
import { dateLongue, typo } from "@/lib/format";
import { jourMois, nombre } from "./outils";

/** L'épaisseur de la bande de hachures sous le trait, en part de la hauteur du dessin. */
const BANDE = 0.075;

/** Le haut de l'échelle : le premier palier rond au-dessus du sommet (100, 200, 300…). */
function plafond(sommet: number): { haut: number; pas: number } {
  const pas = sommet <= 120 ? 50 : 100;
  return { haut: Math.max(pas, Math.ceil(sommet / pas) * pas), pas };
}

/** Deux décimales au plus, sans zéro de trop : une coordonnée de dessin. */
const coord = (n: number) => String(Math.round(n * 100) / 100);

/** Les rangs des jours nommés sous l'axe : le premier, le dernier, et deux ou trois entre eux. */
function rangsNommes(n: number): number[] {
  if (n < 2) return [0];
  const parts = (n - 1) % 4 === 0 ? 4 : (n - 1) % 3 === 0 ? 3 : 4;
  return [...new Set(Array.from({ length: parts + 1 }, (_, k) => Math.round((k * (n - 1)) / parts)))];
}

/** Une place dans le dessin : deux variables sans unité, la feuille de style fait le calcul. */
const place = (x: number, y?: number) => ({ "--x": coord(x), ...(y === undefined ? {} : { "--y": coord(y) }) }) as CSSProperties;

/**
 * Les visites par jour, dessinées comme un profil en long : la pièce où le lotisseur
 * lit le terrain d'un bout à l'autre d'une voie. Le trait de terrain est en latérite,
 * une bande de hachures dessous (le sol, sur un plan), la moyenne en trait mixte (un
 * axe). Une petite borne marque le sommet. Rien d'autre : un seul trait, une seule
 * échelle.
 *
 * Lecture : au pointeur ou au doigt, une borne suit le jour le plus proche et dit sa
 * date et ses visites. Au clavier, le dessin est un curseur : les flèches passent d'un
 * jour à l'autre, un lecteur d'écran lit chaque jour. Dessous, les mêmes chiffres en
 * tableau, pour qui préfère les lire.
 *
 * Le dessin s'étire avec la largeur : le trait est un SVG sans proportion gardée
 * (épaisseur constante), tout le reste est du HTML placé en pour cent. Les chiffres
 * sont inventés : le tableau de bord le dit sous le bloc.
 */
export function Profil({ serie, moyenne, sommet }: { serie: Jour[]; moyenne: number; sommet: Jour }) {
  const t = TABLEAU.profil;
  const n = serie.length;
  const { haut, pas } = plafond(sommet.visites);
  const decoupe = `bande-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const plan = useRef<HTMLDivElement>(null);
  /** Le jour lu : son rang dans la série, ou rien. */
  const [lu, setLu] = useState<number | null>(null);
  /** Le dernier jour visé au doigt : le focus qui suit le toucher le garde. */
  const vise = useRef<number | null>(null);

  const x = (i: number) => (n > 1 ? i / (n - 1) : 0.5);
  const y = (visites: number) => 1 - visites / haut;

  const { trait, bande } = useMemo(() => {
    const points = serie.map((j, i) => [n > 1 ? i / (n - 1) : 0.5, 1 - j.visites / haut] as const);
    return {
      // Le trait : dans un dessin de 100 sur 100, étiré à la taille du plan.
      trait: points.map(([px, py]) => `${coord(px * 100)},${coord(py * 100)}`).join(" "),
      // La bande de sol : le trait, puis le même, plus bas, au retour. De 0 à 1 : la
      // découpe prend la taille du bloc qu'elle découpe.
      bande: [
        ...points.map(([px, py]) => `${coord(px)},${coord(py)}`),
        ...[...points].reverse().map(([px, py]) => `${coord(px)},${coord(Math.min(1, py + BANDE))}`),
      ].join(" "),
    };
  }, [serie, n, haut]);

  const paliers = Array.from({ length: haut / pas + 1 }, (_, k) => k * pas);
  const nommes = rangsNommes(n);
  const rangSommet = serie.findIndex((j) => j.date === sommet.date);
  const jourLu = lu === null ? null : serie[lu];

  /** Le jour le plus proche du pointeur. */
  const viser = (e: PointerEvent<HTMLDivElement>) => {
    const cadre = plan.current?.getBoundingClientRect();
    if (!cadre || cadre.width === 0) return;
    const part = Math.min(1, Math.max(0, (e.clientX - cadre.left) / cadre.width));
    const rang = Math.round(part * (n - 1));
    vise.current = rang;
    setLu(rang);
  };

  /**
   * Au clavier : gauche et droite passent d'un jour à l'autre, Début et Fin vont aux
   * bouts. Haut, bas et les touches de page restent au défilement de l'écran.
   */
  const auClavier = (e: KeyboardEvent<HTMLDivElement>) => {
    const ici = lu ?? n - 1;
    let rang: number;
    switch (e.key) {
      case "ArrowLeft":
        rang = ici - 1;
        break;
      case "ArrowRight":
        rang = ici + 1;
        break;
      case "Home":
        rang = 0;
        break;
      case "End":
        rang = n - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    setLu(Math.min(n - 1, Math.max(0, rang)));
  };

  const lecture = (j: Jour) => typo(`${dateLongue(j.date)} : ${nombre(j.visites)} ${t.unite}`);

  return (
    <figure className="profil">
      <figcaption className="profil-tete">
        <span className="etiquette text-fort">{typo(t.titre)}</span>
        <span className="etiquette text-doux">
          {typo(`${t.moyenne} ${nombre(moyenne)} · ${t.sommet} ${nombre(sommet.visites)}`)}
        </span>
      </figcaption>

      <div className="profil-cadre">
        {/* L'échelle, à gauche : les paliers ronds. Le tableau, plus bas, donne tout. */}
        <div aria-hidden="true" className="profil-echelle etiquette text-doux">
          {paliers.map((p) => (
            <span key={p} style={place(0, y(p))}>
              {nombre(p)}
            </span>
          ))}
        </div>

        <div
          ref={plan}
          className="profil-plan"
          data-lecture={lu === null ? undefined : ""}
          role="slider"
          tabIndex={0}
          aria-label={typo(t.lecture)}
          aria-describedby={`${decoupe}-aide`}
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={n - 1}
          aria-valuenow={lu ?? n - 1}
          aria-valuetext={lecture(serie[lu ?? n - 1])}
          onPointerMove={viser}
          onPointerDown={viser}
          onPointerLeave={(e) => {
            // Seule la souris qui sort efface la lecture. Au clavier elle reste ; au
            // doigt aussi, jusqu'à ce qu'on touche ailleurs (le dessin perd le focus).
            if (e.pointerType !== "mouse") return;
            vise.current = null;
            if (document.activeElement !== plan.current) setLu(null);
          }}
          onFocus={() => setLu((ici) => ici ?? vise.current ?? n - 1)}
          onBlur={() => {
            vise.current = null;
            setLu(null);
          }}
          onKeyDown={auClavier}
        >
          {paliers.map((p) => (
            <span key={p} aria-hidden="true" className="profil-palier" style={place(0, y(p))} />
          ))}

          {/* La moyenne : un axe, en trait mixte. */}
          <span aria-hidden="true" className="profil-moyenne trait-mixte" style={place(0, y(moyenne))} />

          {/* Le sol, sous le trait de terrain : les hachures à 45° du plan. */}
          <svg aria-hidden="true" focusable="false" width="0" height="0" className="absolute">
            <defs>
              <clipPath id={decoupe} clipPathUnits="objectBoundingBox">
                <polygon points={bande} />
              </clipPath>
            </defs>
          </svg>
          <span aria-hidden="true" className="profil-sol hachures" style={{ clipPath: `url(#${decoupe})` }} />

          <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100" preserveAspectRatio="none" className="profil-trait">
            <polyline points={trait} vectorEffect="non-scaling-stroke" />
          </svg>

          {/* Le sommet de la période : une borne, et sa valeur. */}
          {rangSommet >= 0 ? (
            <span
              aria-hidden="true"
              className="profil-sommet"
              data-bord={x(rangSommet) < 0.08 ? "debut" : x(rangSommet) > 0.92 ? "fin" : undefined}
              style={place(x(rangSommet), y(sommet.visites))}
            >
              <span className="profil-borne" />
              <span className="profil-valeur mesure">{nombre(sommet.visites)}</span>
            </span>
          ) : null}

          {/* La lecture : une ligne de rappel, une borne sur le trait, la plaque du jour. */}
          {jourLu && lu !== null ? (
            <span aria-hidden="true" className="profil-lecture" style={place(x(lu), y(jourLu.visites))}>
              <span className="profil-rappel" />
              <span className="profil-borne" />
              <span className="profil-plaque" data-cote={x(lu) > 0.6 ? "gauche" : "droite"}>
                <span className="mesure text-fort">{typo(`${nombre(jourLu.visites)} ${t.unite}`)}</span>
                <span className="etiquette text-doux">{typo(dateLongue(jourLu.date))}</span>
              </span>
            </span>
          ) : null}
        </div>

        {/* Sous l'axe : quelques jours nommés. Sur téléphone, le premier et le dernier. */}
        <div aria-hidden="true" className="profil-jours etiquette text-doux">
          {nommes.map((i, rang) => (
            <span
              key={i}
              data-bord={i === 0 ? "debut" : i === n - 1 ? "fin" : undefined}
              // De cinq jours nommés, le deuxième et le quatrième ne s'affichent qu'au bureau large.
              data-second={nommes.length > 4 && rang % 2 === 1 ? "" : undefined}
              style={place(x(i))}
            >
              {typo(jourMois(serie[i].date))}
            </span>
          ))}
        </div>
      </div>

      <p id={`${decoupe}-aide`} className="sr-only">
        {typo(t.aide)}
      </p>

      {/* Les mêmes chiffres, en tableau : rien n'est réservé à qui survole le dessin. */}
      <details className="profil-table">
        <summary>
          <span className="profil-table-titre">{typo(t.table)}</span>
        </summary>
        <div className="profil-table-cadre" tabIndex={0} role="group" aria-label={typo(t.table)}>
          <table>
            <thead>
              <tr>
                <th scope="col" className="etiquette text-doux">
                  {typo(t.colonnes.jour)}
                </th>
                <th scope="col" className="etiquette text-doux">
                  {typo(t.colonnes.visites)}
                </th>
              </tr>
            </thead>
            <tbody>
              {[...serie].reverse().map((j) => (
                <tr key={j.date}>
                  <th scope="row">{typo(dateLongue(j.date))}</th>
                  <td className="mesure">{nombre(j.visites)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
