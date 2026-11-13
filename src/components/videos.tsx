import { CHAINE_YOUTUBE, VIDEOS, titreVideo, type CleVideo } from "@/content/videos";
import { T2, T3 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { TextLink } from "./text-link";

/**
 * Bloc « Vidéos » (allegement.md, 2.9) : un seul par page, trois entrées au plus.
 * Le titre et la durée quand elle est connue ; ni plateforme ni date sous le lien.
 * La vidéo s'ouvre sur sa plateforme, dans le même onglet.
 */
export function Videos({
  cles,
  titre = "Vidéos",
  titreId = "t-videos",
  niveau = 2,
  tous = false,
  grand = false,
  className,
}: {
  cles: CleVideo[];
  titre?: string;
  titreId?: string;
  niveau?: 2 | 3;
  /** Ajoute « Toutes nos vidéos sur YouTube ». */
  tous?: boolean;
  /** Taille du titre : h3 par défaut, h2 quand le bloc est une section de la page. */
  grand?: boolean;
  className?: string;
}) {
  const Titre = niveau === 2 ? "h2" : "h3";
  return (
    <section aria-labelledby={titreId} className={className}>
      <Titre id={titreId} className={grand ? T2 : T3}>
        {typo(titre)}
      </Titre>
      <ul className={grand ? "mt-6 desk:mt-8" : "mt-3"}>
        {cles.slice(0, 3).map((cle) => (
          <li key={cle}>
            <TextLink href={VIDEOS[cle].href}>{titreVideo(cle)}</TextLink>
          </li>
        ))}
      </ul>
      {tous ? (
        <p className="mt-2">
          <TextLink href={CHAINE_YOUTUBE}>Toutes nos vidéos sur YouTube</TextLink>
        </p>
      ) : null}
    </section>
  );
}
