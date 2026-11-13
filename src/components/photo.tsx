import Image from "next/image";
import type { CSSProperties } from "react";
import manifeste from "../../public/photos/photos.json";
import { PHOTOS, type PhotoId } from "@/content/photos";
import { typo } from "@/lib/format";

type Entree = { largeur: number; hauteur: number; variantes: number[] };
const DIMENSIONS = manifeste as Record<string, Entree>;

type Props = {
  id: PhotoId;
  /**
   * Largeur dessinée de l'image, pour le choix de la variante (obligatoire,
   * toujours juste). Avec object-fit: cover ou un zoom, c'est la largeur de
   * l'image recadrée, pas celle du cadre.
   */
  sizes: string;
  className?: string;
  /**
   * Cadrage (object-position). Par défaut, celui de content/photos.ts.
   * null : aucun cadrage en ligne, pour un cadrage par classes qui change selon la largeur.
   */
  position?: string | null;
  /** Vignette à côté d'un titre de lien : alt vide. */
  decorative?: boolean;
  /** Remplace le texte alternatif par défaut. */
  alt?: string;
  /** Remplit son parent (qui doit être positionné). */
  fill?: boolean;
  /** Préchargée dans <head> : l'image de l'ouverture seulement. */
  preload?: boolean;
  style?: CSSProperties;
};

/**
 * Photo du client, servie en WebP par le chargeur maison (src/lib/image-loader.ts).
 * Chargement différé natif, sauf `preload`.
 */
export function Photo({ id, sizes, className, position, decorative, alt, fill, preload, style }: Props) {
  const fiche = PHOTOS[id];
  const dims = DIMENSIONS[id];
  const cadrage = position === null ? undefined : (position ?? fiche.position);
  // Typographie française dans le texte alternatif aussi (espace insécable avant « : »).
  const texteAlt = decorative ? "" : typo(alt ?? fiche.alt);
  const commun = {
    src: `/photos/${id}`,
    sizes,
    className,
    preload,
    style: cadrage ? { objectPosition: cadrage, ...style } : style,
  };
  if (fill) return <Image {...commun} alt={texteAlt} fill />;
  return <Image {...commun} alt={texteAlt} width={dims.largeur} height={dims.hauteur} />;
}
