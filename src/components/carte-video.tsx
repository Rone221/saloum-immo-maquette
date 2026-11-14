import { VIDEOS, type CleVideo } from "@/content/videos";
import { PHOTOS, type PhotoId } from "@/content/photos";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import { Photo, sizesRecadree } from "./photo";

/**
 * Couverture d'une carte vidéo : une de nos photos, jamais une vignette tirée de la
 * plateforme. Sans couverture, un relevé : le quadrillage d'un plan et une parcelle
 * bornée (PlanParcelle). Pas de titre écrit dessus, il est juste dessous.
 */
export type Couverture = { photo: PhotoId; position?: string };

/**
 * Quatre parcelles de plan, dessinées pour un cadre 4:3 (viewBox 400 × 300). Le bouton
 * lecture tombe au centre, dans la parcelle. Décor seulement : aucun lieu, aucune cote.
 */
const PARCELLES: { contour: [number, number][]; division?: [number, number][]; voie?: [number, number][] }[] = [
  { contour: [[78, 62], [302, 44], [336, 226], [96, 252]] },
  { contour: [[64, 58], [336, 58], [336, 242], [64, 242]], division: [[200, 58], [200, 242]] },
  { contour: [[86, 92], [226, 42], [338, 116], [302, 250], [104, 236]] },
  { contour: [[52, 88], [348, 70], [348, 206], [52, 226]], voie: [[30, 262], [370, 240]] },
];

/**
 * La parcelle de chaque vidéo. Deux vidéos voisines sur une page n'ont jamais la même :
 * Diaspora (présentation, interview, lots), accueil (reel, interview, NICAD), Foncier
 * (interview, NICAD), fiche Lac Town (lancement, visite).
 */
const PLAN_PAR_VIDEO: Record<CleVideo, number> = {
  presentation: 0,
  interviewDG: 1,
  lotsSKM: 2,
  reelLotsSKM: 2,
  nicad: 3,
  visiteSakina: 3,
  lancementLacTown: 0,
  visiteLacTown: 3,
  terrassementKounoune: 1,
  realisations2026: 2,
};

function PlanParcelle({ cle }: { cle: CleVideo }) {
  const { contour, division, voie } = PARCELLES[PLAN_PAR_VIDEO[cle] % PARCELLES.length];
  const points = (l: [number, number][]) => l.map(([x, y]) => `${x},${y}`).join(" ");
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
      {voie ? (
        <polyline points={points(voie)} className="fill-none stroke-sol" strokeWidth="2" strokeDasharray="10 8" vectorEffect="non-scaling-stroke" />
      ) : null}
      <polygon points={points(contour)} className="fill-trait/6 stroke-trait" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      {division ? (
        <polyline points={points(division)} className="fill-none stroke-trait" strokeWidth="1.5" strokeDasharray="6 6" vectorEffect="non-scaling-stroke" />
      ) : null}
      {/* Les bornes aux sommets, en carrés orange, comme partout sur le site. */}
      {contour.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x - 5} y={y - 5} width="10" height="10" className="fill-borne" />
      ))}
    </svg>
  );
}

/**
 * Carte vidéo (revue 2) : la couverture, le bouton lecture, le titre, la plateforme
 * et la durée quand elle est connue. Toute la carte est le lien ; la vidéo s'ouvre
 * sur sa plateforme, dans le même onglet. Survol et focus clavier : la couverture
 * grossit, le bouton passe au bleu.
 *
 * Plafonds : le cadre ne dépasse pas 324 px de haut, soit 598 px de large pour
 * 2413-droite (600 px au plus), et une photo plafonnée ne grossit pas.
 * `sizes` : les largeurs du cadre ; celles de la photo, recadrée en 4:3, en sont déduites.
 */
export function CarteVideo({
  cle,
  couverture,
  sizes = "(min-width: 1101px) 437px, 416px",
  className,
}: {
  cle: CleVideo;
  couverture?: Couverture;
  sizes?: string;
  className?: string;
}) {
  const v = VIDEOS[cle];
  const meta = [v.plateforme, "duree" in v ? v.duree : null].filter(Boolean).join(" · ");
  const zoom = couverture ? !PHOTOS[couverture.photo].largeurMax : false;
  return (
    <a href={v.href} className={cx("group flex w-full flex-col", className)}>
      <span className="relative block aspect-[4/3] max-h-[324px] overflow-hidden border border-rule bg-paper-2 transition-colors duration-300 group-hover:border-trait group-focus-visible:border-trait">
        {couverture ? (
          <Photo
            id={couverture.photo}
            fill
            decorative
            position={couverture.position}
            sizes={sizesRecadree(couverture.photo, 4 / 3, sizes)}
            className={cx(
              "object-cover",
              zoom && "transition-transform duration-700 ease-out group-hover:scale-[1.05] group-focus-visible:scale-[1.05]",
            )}
          />
        ) : (
          <span
            aria-hidden="true"
            className="quadrillage absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
          >
            <PlanParcelle cle={cle} />
          </span>
        )}
        {/* Bouton lecture, au centre : un carré, un triangle en bordures CSS. */}
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 z-[1] inline-flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-ink transition-colors duration-300 group-hover:bg-trait group-focus-visible:bg-trait"
        >
          <span className="ml-1 border-y-[9px] border-l-[15px] border-y-transparent border-l-white" />
        </span>
      </span>
      <span className="mt-4 block font-semibold leading-snug transition-colors group-hover:text-trait group-focus-visible:text-trait">
        {typo(v.titre)}
      </span>
      <span className="mt-1 block text-small text-ink-2">{typo(meta)}</span>
    </a>
  );
}
