import type { CSSProperties } from "react";
import { NOMS_COUPE } from "@/content/services";
import { cx } from "@/lib/base";
import { NOTE } from "@/lib/classes";

/** Largeur et hauteur du dessin, en unités du SVG. */
const L = 1200;
const H = 520;

/**
 * Un nom posé sur le dessin. `x` : son axe ; `bas` : le bas du nom (en unités du
 * dessin) sur mobile puis dès 761 px ; `vers` : le point visé par le trait de rappel.
 */
const NOMS: { nom: string; x: number; basMob: number; basTab: number; vers: number }[] = [
  { nom: NOMS_COUPE.terrassement, x: 200, basMob: 236, basTab: 270, vers: 354 },
  { nom: NOMS_COUPE.borne, x: 444, basMob: 318, basTab: 270, vers: 348 },
  { nom: NOMS_COUPE.voie, x: 624, basMob: 156, basTab: 270, vers: 360 },
  { nom: NOMS_COUPE.eau, x: 846, basMob: 318, basTab: 270, vers: 446 },
  { nom: NOMS_COUPE.electricite, x: 1000, basMob: 78, basTab: 78, vers: 158 },
];

const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;

/**
 * Coupe de principe d'une voie aménagée, sans échelle : ce qui reste dans le sol
 * une fois les engins partis. Ni cadre ni numéros : terrassement, borne, voie en
 * latérite, eau, poteau et câble sont écrits sur le dessin (allegement.md, Aménager).
 * Latérite et orange en petites touches : la voie et les deux bornes.
 * Sur mobile, le dessin prend toute la largeur et les noms s'étagent.
 */
export function Coupe({ className }: { className?: string }) {
  const description = `Coupe de principe d’une voie aménagée : ${Object.values(NOMS_COUPE)
    .map((n) => n.toLowerCase())
    .join(", ")}.`;
  return (
    <figure className={cx("coupe m-0", className)}>
      <div className="relative -mx-gutter aspect-[1200/520] tab:mx-0">
        <svg viewBox={`0 0 ${L} ${H}`} role="img" aria-label={description} className="absolute inset-0 size-full">
          <defs>
            <pattern id="coupe-sol" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="6" r="1.4" className="sol-pt" />
              <circle cx="15" cy="16" r="1.4" className="sol-pt" />
            </pattern>
          </defs>
          <rect x="0" y="380" width="1200" height="140" fill="url(#coupe-sol)" />
          <path className="tn" d="M0 350 C60 334 110 372 170 356 S270 336 330 362 S400 378 432 380" />
          <path className="cable" d="M930 138 Q1040 190 1150 138 Q1176 150 1200 147" />
          <path className="ground" d="M0 380 H1200" />
          <rect className="obj" x="470" y="362" width="18" height="34" />
          <path className="road" d="M488 376 Q624 356 760 376 L760 402 L488 402 Z" />
          <rect className="obj" x="760" y="362" width="18" height="34" />
          <path className="trench" d="M818 380 L822 488 L870 488 L874 380" />
          <circle className="pipe" cx="846" cy="462" r="14" />
          <rect className="obj" x="923" y="118" width="14" height="282" />
          <path className="obj-line" d="M898 138 H962" />
          <rect className="obj" x="1143" y="118" width="14" height="282" />
          <path className="obj-line" d="M1118 138 H1182" />
          <rect className="borne" x="436" y="352" width="16" height="48" />
          <rect className="borne" x="1060" y="352" width="16" height="48" />
          {NOMS.map((n) => (
            <g key={n.nom}>
              <path className="lead lead-mob" d={`M${n.x} ${n.basMob + 10} V${n.vers}`} />
              <path className="lead lead-tab" d={`M${n.x} ${n.basTab + 10} V${n.vers}`} />
            </g>
          ))}
        </svg>
        {/* Les noms, en HTML : 14 px au moins à toutes les largeurs (le texte d'un SVG
            rapetisse avec lui). Lus par l'aria-label du dessin. */}
        {NOMS.map((n) => (
          <span
            key={n.nom}
            aria-hidden="true"
            style={
              {
                "--x": pct(n.x, L),
                "--bm": pct(n.basMob, H),
                "--bt": pct(n.basTab, H),
              } as CSSProperties
            }
            className="absolute top-(--bm) left-(--x) -translate-x-1/2 -translate-y-full text-small leading-none font-semibold whitespace-nowrap tab:top-(--bt) desk:text-body"
          >
            {n.nom}
          </span>
        ))}
      </div>
      <figcaption className={cx(NOTE, "mt-4")}>Coupe de principe d’une voie aménagée.</figcaption>
    </figure>
  );
}
