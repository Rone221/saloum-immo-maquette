import type { PhotoId } from "@/content/photos";
import { PHOTOS } from "@/content/photos";
import { VIDEOS, type CleVideo } from "@/content/videos";
import { cx } from "@/lib/base";
import { dateMono, typo } from "@/lib/format";
import { VideoFigure } from "./video-link";
import { WhatsAppButton } from "./whatsapp-button";

/** « Vidéo Instagram · 27.10.2026 » */
function etiquetteVideo(cle: CleVideo): string {
  const v = VIDEOS[cle];
  const date = "date" in v && v.date ? ` · ${dateMono(v.date)}` : "";
  return `Vidéo ${v.plateforme}${date}`;
}

/** Largeur dessinée de la vignette : celle du cadre, multipliée par le zoom. */
function sizesOuverture(k: number): string {
  const fois = (l: string) => (k === 1 ? l : `calc(${l.replace(/^calc/, "")} * ${k})`);
  return [
    `(min-width: 1440px) ${fois("553px")}`,
    `(min-width: 1101px) ${fois("calc(41.67vw - 47px)")}`,
    `(min-width: 761px) ${fois("calc(100vw - 56px)")}`,
    fois("calc(100vw - 40px)"),
  ].join(", ");
}

/**
 * Ouverture « appel et vidéo » (3.4) : filet 2 px, numéro, titre, chapeau et
 * bouton WhatsApp à gauche (col. 1 à 6), vignette de la vidéo à droite (col. 8 à 12).
 * Section 04 de l'accueil (H2) et page Diaspora (H1, image préchargée).
 */
export function OuvertureAppel({
  numero,
  titre,
  titreId,
  chapeau,
  bouton,
  message,
  video,
  photo,
  niveau = 2,
  preload = false,
  zoom,
  className,
}: {
  numero: string;
  titre: string;
  titreId: string;
  chapeau: string;
  bouton: string;
  message: string;
  video: CleVideo;
  photo: PhotoId;
  /** 1 : la page s'ouvre sur ce bloc (titre en text-7). */
  niveau?: 1 | 2;
  /** true quand la vignette est l'image d'ouverture de la page (4.2). */
  preload?: boolean;
  /** Agrandissement de la vignette, pour sortir du cadre un logo incrusté. */
  zoom?: { echelle: number; origine: string };
  className?: string;
}) {
  const Titre = niveau === 1 ? "h1" : "h2";
  return (
    <div
      className={cx(
        "grid items-start gap-y-6 border-t-2 border-ink pt-4 tab:grid-cols-12 tab:gap-x-6 tab:gap-y-10 tab:pt-5",
        className,
      )}
    >
      <div className="tab:col-span-full desk:col-[1/span_6]">
        <span className="mt-2.5 mb-4 block font-mono text-1 leading-tight font-medium tab:mt-3.5 tab:mb-5.5">{numero}</span>
        <Titre
          id={titreId}
          className={cx(
            "font-bold stretch-title",
            niveau === 1 ? "text-7 leading-title tracking-title" : "text-6 leading-title tracking-tight",
          )}
        >
          {typo(titre)}
        </Titre>
        <p className="mt-4.5 max-w-[30em] text-4 leading-caption text-ink-2">{typo(chapeau)}</p>
        <WhatsAppButton label={bouton} message={message} className="mt-5.5 tab:mt-7" />
      </div>
      {/* sizes : col. 8 à 12 dès 1 101 px (553 px dans 1 360), pleine largeur dessous,
          multipliée par le zoom (1,2 pour le reel : 664 px au bureau). */}
      <VideoFigure
        video={video}
        photo={photo}
        etiquette={etiquetteVideo(video)}
        legende={PHOTOS[photo].legende}
        sizes={sizesOuverture(zoom?.echelle ?? 1)}
        preload={preload}
        zoom={zoom}
        className="tab:col-span-full desk:col-[8/span_5]"
      />
    </div>
  );
}
