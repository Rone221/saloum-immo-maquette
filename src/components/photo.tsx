import type { CSSProperties } from "react";
import manifeste from "../../public/photos/photos.json";
import { NATURES, PHOTOS, type PhotoId } from "@/content/photos";
import { asset, cx } from "@/lib/base";
import { typo } from "@/lib/format";

type Entree = { largeur: number; hauteur: number; variantes: number[] };
const DIMENSIONS = manifeste as Record<string, Entree>;

/**
 * srcset fait des seules variantes produites par scripts/photos.mjs, chacune avec
 * sa vraie largeur : jamais de candidat qui se dit plus large que son fichier.
 */
function sources(id: PhotoId) {
  const { variantes } = DIMENSIONS[id];
  const url = (l: number) => asset(`/photos/${id}-${l}.webp`);
  return {
    srcSet: variantes.map((l) => `${url(l)} ${l}w`).join(", "),
    // Repli sans srcset : la variante de 800 px, ou la plus grande.
    src: url(variantes.find((l) => l >= 800) ?? variantes[variantes.length - 1]),
  };
}

type Props = {
  id: PhotoId;
  /**
   * Largeur dessinée de l'image, pour le choix de la variante (obligatoire,
   * toujours juste). Avec object-fit: cover, c'est la largeur de l'image
   * recadrée, pas celle du cadre.
   */
  sizes: string;
  className?: string;
  /** Cadrage (object-position). Par défaut, celui de content/photos.ts. */
  position?: string;
  /** Photo doublée par un lien texte voisin (carte) : alt vide. */
  decorative?: boolean;
  /** Remplit son parent (qui doit être positionné). */
  fill?: boolean;
  /**
   * Chargée tout de suite, en priorité haute : l'image de l'ouverture seulement.
   * Sans indice de préchargement (voir Photo) : chaque page téléchargeait sinon les
   * photos d'ouverture des pages vers lesquelles elle a un lien.
   */
  preload?: boolean;
  style?: CSSProperties;
};

/**
 * Photo du client, en WebP (variantes de public/photos/). Chargement différé
 * natif, sauf `preload`.
 *
 * Pas de preload() de react-dom, et une image chargée tout de suite est posée dans
 * un <picture> sans boîte (display: contents). React écrit en effet un indice « HL »
 * dans la charge RSC de la page pour toute <img> non différée, sauf dans un
 * <picture>. next/link précharge cette charge depuis les autres pages, et l'indice
 * s'y applique : la photo partait sur la page en cours. Dans la page elle-même,
 * l'<img> en priorité haute est trouvée tout de suite par le navigateur.
 */
export function Photo({ id, sizes, className, position, decorative, fill, preload, style }: Props) {
  const fiche = PHOTOS[id];
  const dims = DIMENSIONS[id];
  const { src, srcSet } = sources(id);
  const cadrage = position ?? fiche.position;
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      // Typographie française dans le texte alternatif aussi (espace insécable avant « : »).
      alt={decorative ? "" : typo(fiche.alt)}
      width={dims.largeur}
      height={dims.hauteur}
      loading={preload ? "eager" : "lazy"}
      fetchPriority={preload ? "high" : undefined}
      decoding="async"
      className={cx(fill && "absolute inset-0 size-full", className)}
      style={cadrage ? { objectPosition: cadrage, ...style } : style}
    />
  );
  return preload ? <picture className="contents">{img}</picture> : img;
}

/** Plafond de largeur d'une photo (content/photos.ts), en style de cadre. */
export function plafond(id: PhotoId): CSSProperties | undefined {
  const max = PHOTOS[id].largeurMax;
  return max ? { maxWidth: `${max}px` } : undefined;
}

/** Ratio du fichier (largeur sur hauteur), d'après public/photos/photos.json. */
export function ratio(id: PhotoId): number {
  const { largeur, hauteur } = DIMENSIONS[id];
  return largeur / hauteur;
}

/**
 * Cadre au ratio du fichier, plafond compris : la photo y est dessinée à la largeur
 * du cadre, jamais plus (2413-droite sur la page Terrains).
 */
export function cadreNaturel(id: PhotoId): CSSProperties {
  const { largeur, hauteur } = DIMENSIONS[id];
  return { ...plafond(id), aspectRatio: `${largeur} / ${hauteur}` };
}

/**
 * `sizes` d'une photo recadrée (object-fit: cover) dans un cadre de ratio
 * `ratioCadre`, à partir des largeurs du cadre. Une photo plus large que son cadre
 * est dessinée par sa hauteur, donc plus large que lui : chaque largeur est
 * multipliée d'autant (2580 dans un cadre 4:3 : 1,34). Jamais plus que le plafond
 * de la photo, pour les largeurs en px.
 */
export function sizesRecadree(id: PhotoId, ratioCadre: number, sizesCadre: string): string {
  const k = Math.max(1, ratio(id) / ratioCadre);
  const max = PHOTOS[id].largeurMax;
  if (k === 1 && !max) return sizesCadre;
  return sizesCadre
    .split(",")
    .map((s) =>
      s.replace(/(\d+(?:\.\d+)?)(px|vw)\s*$/, (_, n: string, unite: string) => {
        const l = Math.ceil(Number(n) * k);
        return `${unite === "px" && max ? Math.min(l, max) : l}${unite}`;
      }),
    )
    .join(",");
}

/**
 * La légende d'une photo (direction v4, pièce 14) : deux colonnes en étiquette. À
 * gauche, ce qu'on voit (la légende de content/photos.ts, sans son point final, ou
 * `texte`) ; à droite, la nature de l'image (« Photo de chantier », « Vue au drone »,
 * « Image tirée d'une vidéo », « Photo sur place »), lue dans la fiche de la photo :
 * elle ne s'écrit pas à la main. À poser dans la <figure> de la photo.
 * Jamais un nom de lieu ou de programme que la fiche de la photo ne permet pas.
 */
export function LegendePhoto({ id, texte, className }: { id: PhotoId; texte?: string; className?: string }) {
  // Une étiquette n'est pas une phrase : sans point final.
  const gauche = (texte ?? PHOTOS[id].legende)?.replace(/\.$/, "");
  return (
    <figcaption className={cx("etiquette mt-3 flex items-baseline justify-between gap-x-6 text-doux", className)}>
      <span className="min-w-0 flex-1">{gauche ? typo(gauche) : null}</span>
      {/* Sous une photo étroite, la nature passe sur deux lignes plutôt que de pousser la légende. */}
      <span className="max-w-[42%] text-right">{typo(NATURES[PHOTOS[id].nature])}</span>
    </figcaption>
  );
}

/**
 * Le cadre de photo v4 : angles vifs, fond `attente` tant que l'image n'est pas là,
 * la photo recadrée (object-fit: cover) au ratio donné, et dessous sa légende à deux
 * colonnes. Pas de texte posé sur une photo, sauf l'ouverture d'accueil.
 * `bascule` : une grande photo penche de 2° au pointeur fin, pas plus
 * (components/gestes.tsx) ; une par page au plus.
 * Sur mobile, `bord` pose la photo bord à bord (la légende garde la gouttière).
 */
export function CadrePhoto({
  id,
  sizes,
  ratio = "aspect-[4/3]",
  legende = true,
  texteLegende,
  bord = false,
  bascule = false,
  preload,
  position,
  className,
}: {
  id: PhotoId;
  /** Largeur dessinée de l'image (voir Photo). */
  sizes: string;
  /** Classes du cadre : ratio, hauteur, selon la largeur. */
  ratio?: string;
  /** La légende à deux colonnes (par défaut). */
  legende?: boolean;
  /** Ce qu'on voit, si ce n'est pas la légende de la fiche. */
  texteLegende?: string;
  bord?: boolean;
  bascule?: boolean;
  preload?: boolean;
  position?: string;
  className?: string;
}) {
  return (
    <figure
      className={cx("m-0", bord && "-mx-gutter tab:mx-0 [&_figcaption]:px-gutter tab:[&_figcaption]:px-0", className)}
      style={plafond(id)}
    >
      <span
        data-bascule={bascule ? "" : undefined}
        className={cx("relative block overflow-hidden bg-attente", bascule && "bascule", ratio)}
      >
        <Photo id={id} fill sizes={sizes} preload={preload} position={position} className="object-cover" />
      </span>
      {legende ? <LegendePhoto id={id} texte={texteLegende} /> : null}
    </figure>
  );
}
