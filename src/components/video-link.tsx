import type { ReactNode } from "react";
import type { PhotoId } from "@/content/photos";
import { VIDEOS, type CleVideo } from "@/content/videos";
import { cx } from "@/lib/base";
import { dateMono, typo } from "@/lib/format";
import { Photo } from "./photo";

/** « YouTube · 21.05.2026 », ou la durée quand la date n'est pas connue. */
export function metaVideo(cle: CleVideo): string {
  const v = VIDEOS[cle];
  const date = "date" in v ? v.date : undefined;
  const duree = "duree" in v ? v.duree : undefined;
  // typo : espace insécable dans la durée (« 7 min 26 »).
  return typo([v.plateforme, date ? dateMono(date) : duree].filter(Boolean).join(" · "));
}

/** Vignette : 152 px de large dès 761 px, 120 px dessous (3.16). */
const VIGNETTE = { tab: 152, mobile: 120 };

/**
 * Vignette et titre (3.16). La vignette est une photo du client, décorative
 * (alt vide) : jamais de vignette tirée de YouTube. La vidéo s'ouvre sur sa plateforme.
 *
 * Sans `photo` : le titre et sa ligne mono seuls, pour une liste de vidéos dont
 * aucune photo du client ne peut servir de vignette sans doublon sur la page.
 */
export function VideoLink({
  video,
  photo,
  titre,
  position,
  zoom,
  className,
}: {
  video: CleVideo;
  photo?: PhotoId;
  /** Par défaut, le titre de la vidéo. */
  titre?: string;
  /** Cadrage de la vignette (object-position). */
  position?: string;
  /**
   * Agrandissement de la vignette, pour sortir du cadre un logo incrusté quand
   * l'image a déjà le ratio du cadre (16:9) et que object-position n'y peut rien.
   * `origine` : point fixe du zoom (transform-origin), « 100% 30% ».
   */
  zoom?: { echelle: number; origine: string };
  className?: string;
}) {
  const v = VIDEOS[video];
  const texte = (
    <span className="flex flex-col gap-0.5">
      <span className="self-start font-semibold text-trait underline decoration-1 underline-offset-5 group-hover:decoration-2">
        {typo(titre ?? v.titre)}
      </span>
      <span className="font-mono text-1 leading-label font-medium text-ink-2">{metaVideo(video)}</span>
    </span>
  );
  if (!photo) {
    return (
      <a href={v.href} className={cx("group flex min-h-11 flex-col justify-center", className)}>
        {texte}
      </a>
    );
  }
  // sizes : largeur dessinée de l'image, cadre multiplié par le zoom.
  const e = zoom?.echelle ?? 1;
  const sizes = `(min-width: 761px) ${Math.ceil(VIGNETTE.tab * e)}px, ${Math.ceil(VIGNETTE.mobile * e)}px`;
  return (
    <a
      href={v.href}
      className={cx("group grid grid-cols-[120px_minmax(0,1fr)] items-center gap-3 tab:grid-cols-[152px_minmax(0,1fr)] tab:gap-4", className)}
    >
      <span className="relative block aspect-video overflow-hidden bg-paper-2">
        <Photo
          id={photo}
          decorative
          fill
          sizes={sizes}
          position={position}
          className="object-cover"
          style={zoom ? { transform: `scale(${zoom.echelle})`, transformOrigin: zoom.origine } : undefined}
        />
      </span>
      {texte}
    </a>
  );
}

/**
 * Étiquette posée sur une image cliquable (3.16), coin bas gauche.
 * Le lien parent porte la classe `group` : au survol, fond encre, texte blanc.
 */
export function VideoTag({ children }: { children: ReactNode }) {
  return (
    <span className="absolute bottom-0 left-0 border-t border-r border-ink bg-paper px-3 py-2 font-mono text-1 leading-label font-medium text-ink transition-surface group-hover:bg-ink group-hover:text-white">
      {children}
    </span>
  );
}

/**
 * Image cliquable vers une vidéo, avec son étiquette et sa légende
 * (vignette du reel, image de l'interview).
 */
export function VideoFigure({
  video,
  photo,
  etiquette,
  legende,
  ariaLabel,
  sizes,
  preload = false,
  className,
  cadre = "aspect-video",
  zoom,
}: {
  video: CleVideo;
  photo: PhotoId;
  /** « Vidéo Instagram · 27.10.2026 » */
  etiquette: string;
  legende?: string;
  ariaLabel?: string;
  sizes: string;
  /** true quand la figure est l'image d'ouverture de la page (4.2) : préchargée. */
  preload?: boolean;
  className?: string;
  /** Classes du cadre de l'image (ratio, hauteur). */
  cadre?: string;
  /**
   * Agrandissement de l'image dans son cadre, pour sortir un logo incrusté (vignette
   * du reel du 27.10.2026). `sizes` donne alors la largeur dessinée, zoom compris.
   */
  zoom?: { echelle: number; origine: string };
}) {
  const v = VIDEOS[video];
  return (
    <figure className={cx("m-0 flex flex-col", className)}>
      <a href={v.href} aria-label={ariaLabel} className="group relative flex flex-1 flex-col">
        <span className={cx("relative block overflow-hidden bg-paper-2", cadre)}>
          <Photo
            id={photo}
            fill
            sizes={sizes}
            preload={preload}
            className="object-cover"
            style={zoom ? { transform: `scale(${zoom.echelle})`, transformOrigin: zoom.origine } : undefined}
          />
        </span>
        <VideoTag>{etiquette}</VideoTag>
      </a>
      {legende ? <figcaption className="mt-2.5 text-2 leading-caption text-ink-2">{typo(legende)}</figcaption> : null}
    </figure>
  );
}
