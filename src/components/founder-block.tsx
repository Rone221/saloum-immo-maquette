import type { ReactNode } from "react";
import { FONDATEUR } from "@/content/site";
import { VIDEOS } from "@/content/videos";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import { Chain } from "./dessins/chain";
import { Photo } from "./photo";
import { TextLink } from "./text-link";
import { VideoTag } from "./video-link";

/**
 * Bloc fondateur (3.17), ouverture « image d'abord » : l'image de l'interview à
 * gauche (col. 1 à 6), liée à la vidéo ; à droite (col. 8 à 12) le numéro, le
 * nom, le rôle, la biographie résumée, le lien vers l'interview, puis la frise
 * calée en bas. Ne nommer personne d'autre que Babacar Ndiaye.
 */
export function FounderBlock({
  numero = "05",
  titreId = "t-fondateur",
  niveau = 2,
  liens,
  preload = false,
  className,
}: {
  numero?: string;
  titreId?: string;
  /** 1 : la page À propos s'ouvre sur ce bloc. */
  niveau?: 1 | 2;
  /** Liens ajoutés sous celui de l'interview (« L'entreprise et ses réalisations »). */
  liens?: ReactNode;
  /** true quand l'image de l'interview ouvre la page (À propos) : préchargée (4.2). */
  preload?: boolean;
  className?: string;
}) {
  const Titre = niveau === 1 ? "h1" : "h2";
  const video = VIDEOS.interviewDG;
  return (
    <div className={cx("grid gap-y-7 tab:grid-cols-12 tab:gap-x-6 tab:gap-y-8", className)}>
      <figure className="m-0 flex flex-col tab:col-span-full desk:col-[1/span_6]">
        <a
          href={video.href}
          aria-label={`Voir l’interview de ${FONDATEUR.nom.texte} sur YouTube, ${video.duree.replace("min", "minutes")}`}
          className="group relative flex flex-col desk:flex-1"
        >
          {/* Image 16:9 dans un cadre 4:3 (ou plus haut au bureau) : sizes donne la
              largeur dessinée, 4/3 du cadre, environ 1 120 px au bureau. */}
          <span className="relative block aspect-[4/3] overflow-hidden bg-paper-2 desk:aspect-auto desk:min-h-90 desk:flex-1">
            <Photo
              id={FONDATEUR.interview.photo}
              fill
              preload={preload}
              position={null}
              sizes="(min-width: 1101px) 1120px, (min-width: 761px) calc(133vw - 75px), calc(133vw - 53px)"
              className="object-cover object-[100%_40%] desk:object-[74%_40%]"
            />
          </span>
          <VideoTag>Interview · {typo(video.duree)}</VideoTag>
        </a>
        <figcaption className="mt-2.5 text-2 leading-caption text-ink-2">{typo(FONDATEUR.interview.legende.texte)}</figcaption>
      </figure>
      <div className="flex flex-col tab:col-span-full desk:col-[8/span_5]">
        <span className="mb-4.5 block font-mono text-1 leading-tight font-medium">{numero}</span>
        <Titre
          id={titreId}
          className={cx(
            "font-bold stretch-title",
            niveau === 1 ? "text-7 leading-title tracking-title" : "text-6 leading-title tracking-tight",
          )}
        >
          {FONDATEUR.nom.texte}
        </Titre>
        <p className="mt-2.5 text-4 leading-snug font-semibold stretch-sub">{FONDATEUR.role.texte}</p>
        <p className="mt-5.5 mb-1 max-w-[32em] text-3 leading-[1.6]">{typo(FONDATEUR.biographie.texte)}</p>
        <div className="flex flex-col items-start">
          <TextLink href={video.href}>{`L’écouter expliquer le foncier, ${video.duree}`}</TextLink>
          {liens}
        </div>
        <Chain />
      </div>
    </div>
  );
}
