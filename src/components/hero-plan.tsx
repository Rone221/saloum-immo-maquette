import { PHOTOS } from "@/content/photos";
import { Photo } from "./photo";

/**
 * Plan de l'ouverture (3.20) : la vue zénithale 2538, recadrée sur la zone
 * x 360 à 1 740, y 90 à 1 330 (fichier 2538-plan), avec par-dessus les axes de
 * voies en traits mixtes et deux étiquettes qui décrivent ce qu'on voit.
 *
 * La photo est un <img> (srcset, préchargement) sous un SVG au même viewBox :
 * object-fit: cover centré équivaut à preserveAspectRatio="xMidYMid slice".
 * Les tracés gardent les coordonnées de l'original, décalées par translate(-360 -90).
 * Mobile : bandeau de 148 px, sans étiquettes, axes épaissis. Tablette : 300 px,
 * sans légende. Bureau : moitié droite de l'ouverture, légende en bas à gauche.
 */
export function HeroPlan() {
  const axes = (
    <>
      <path d="M1039 175 L1048 1180" />
      <path d="M430 269 L1040 269" />
      <path d="M492 542 L1318 542" />
      <path d="M492 849 L1628 849" />
    </>
  );
  return (
    <figure className="relative order-first m-0 h-37 overflow-hidden border-b border-ink bg-sable tab:h-75 desk:order-none desk:h-auto desk:min-h-140 desk:border-b-0 desk:border-l">
      {/* Bureau : le cadre est plus haut que large, l'image est dessinée sur 906 px. */}
      <Photo id="2538-plan" fill preload sizes="(min-width: 1101px) 906px, 100vw" className="object-cover" />
      <svg
        className="plan-svg absolute inset-0 block size-full"
        viewBox="0 0 1380 1240"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g transform="translate(-360 -90)">
          <g className="axes-case" fill="none">
            {axes}
          </g>
          <g className="axes" fill="none">
            {axes}
          </g>
          <g className="lbl">
            <path className="lead" d="M1048 700 H1176" />
            <rect x="1176" y="672" width="306" height="56" />
            <text x="1196" y="710">
              Voie en latérite
            </text>
            <rect x="596" y="378" width="262" height="56" />
            <text x="616" y="416">
              Îlot terrassé
            </text>
          </g>
        </g>
      </svg>
      <figcaption className="absolute bottom-0 left-0 hidden flex-col gap-1.5 border-t border-r border-ink bg-paper px-5 py-3.5 text-2 leading-caption desk:flex">
        <span>{PHOTOS["2538-plan"].legende}</span>
        <span className="inline-flex items-center gap-2.5 font-mono text-1 leading-label font-medium text-ink-2">
          <span aria-hidden="true" className="lg-axe" />
          Axe de voie
        </span>
      </figcaption>
    </figure>
  );
}
