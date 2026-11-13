import { A_REGARDER, VIDEOS, type CleVideo } from "@/content/videos";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";

/**
 * « À regarder avant d'appeler » (3.16) : titre à gauche (col. 1 à 3), liste en
 * deux colonnes. Liens de 52 px (48 sur mobile), plateforme en mono à droite.
 * Pas de vignettes YouTube (contenu non vérifié). Page Diaspora, ancre #videos.
 */
export function WatchList({
  videos = A_REGARDER,
  titre = "À regarder avant d’appeler",
  id = "videos",
  titreId = "t-videos",
  niveau = 2,
  marge = "mt-9 tab:mt-16",
  className,
}: {
  videos?: CleVideo[];
  titre?: string;
  id?: string;
  titreId?: string;
  niveau?: 2 | 3;
  /** Marge au-dessus (remplace celle par défaut). */
  marge?: string;
  className?: string;
}) {
  const Titre = niveau === 2 ? "h2" : "h3";
  return (
    <div
      id={id}
      className={cx(marge, "border-t border-ink pt-4.5 desk:grid desk:grid-cols-12 desk:gap-x-6", className)}
    >
      {/* Titre de bloc (2.3, text-5) : sur la page Diaspora, c'est un H2 qui suit des
          titres de colonne en text-5, il ne peut pas être plus petit qu'eux. */}
      <Titre id={titreId} className="text-5 leading-snug font-bold stretch-sub desk:col-span-3">
        {typo(titre)}
      </Titre>
      <ul aria-labelledby={titreId} className="mt-3 grid tab:grid-cols-2 tab:gap-x-6 desk:col-[4/-1] desk:mt-0">
        {videos.map((cle) => {
          const v = VIDEOS[cle];
          return (
            <li key={cle}>
              <a
                href={v.href}
                className="group flex min-h-12 items-center justify-between gap-4 border-b border-rule py-2 font-semibold text-trait tab:min-h-13"
              >
                <span className="underline decoration-1 underline-offset-5 group-hover:decoration-2">
                  {typo("titreListe" in v ? v.titreListe : v.titre)}
                </span>
                <span className="font-mono text-1 leading-tight font-medium text-ink-2">{v.plateforme}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
