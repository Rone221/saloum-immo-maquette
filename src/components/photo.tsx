import type { CSSProperties } from "react";
import { preload as precharger } from "react-dom";
import manifeste from "../../public/photos/photos.json";
import { PHOTOS, type PhotoId } from "@/content/photos";
import { asset, cx } from "@/lib/base";
import { NOTE } from "@/lib/classes";
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
  /** Préchargée dans <head> : l'image de l'ouverture seulement. */
  preload?: boolean;
  style?: CSSProperties;
};

/**
 * Photo du client, en WebP (variantes de public/photos/). Chargement différé
 * natif, sauf `preload`.
 */
export function Photo({ id, sizes, className, position, decorative, fill, preload, style }: Props) {
  const fiche = PHOTOS[id];
  const dims = DIMENSIONS[id];
  const { src, srcSet } = sources(id);
  const cadrage = position ?? fiche.position;
  if (preload) precharger(src, { as: "image", imageSrcSet: srcSet, imageSizes: sizes, fetchPriority: "high" });
  return (
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
}

/** Plafond de largeur d'une photo (content/photos.ts), en style de cadre. */
export function plafond(id: PhotoId): CSSProperties | undefined {
  const max = PHOTOS[id].largeurMax;
  return max ? { maxWidth: `${max}px` } : undefined;
}

/**
 * Photo dans un cadre au ratio fixe, recadrée (object-fit: cover), avec sa
 * légende dessous si `legende`. La légende décrit la scène, sans lieu ni programme.
 * Sur mobile, `bord` pose la photo bord à bord (la légende garde la gouttière).
 */
export function Cadre({
  id,
  sizes,
  ratio = "aspect-[4/3]",
  legende = false,
  bord = false,
  preload,
  position,
  className,
}: {
  id: PhotoId;
  sizes: string;
  /** Classes du cadre : ratio, hauteur, selon la largeur. */
  ratio?: string;
  legende?: boolean;
  /** Bord à bord sous 761 px (toutes les photos seules : allegement.md, 2.8). */
  bord?: boolean;
  preload?: boolean;
  position?: string;
  className?: string;
}) {
  return (
    <figure
      className={cx("m-0", bord && "-mx-gutter tab:mx-0 [&_figcaption]:px-gutter tab:[&_figcaption]:px-0", className)}
      style={plafond(id)}
    >
      <span className={cx("relative block overflow-hidden bg-paper-2", ratio)}>
        <Photo id={id} fill sizes={sizes} preload={preload} position={position} className="object-cover" />
      </span>
      {legende && PHOTOS[id].legende ? (
        <figcaption className={cx(NOTE, "mt-3")}>{typo(PHOTOS[id].legende)}</figcaption>
      ) : null}
    </figure>
  );
}
