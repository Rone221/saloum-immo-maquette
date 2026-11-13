import { ListeProgrammes, type LienProgramme } from "@/components/liste-programmes";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { TITRE_COLONNE, Ticks } from "@/components/ticks";
import { VideoLink } from "@/components/video-link";
import { AVANT_D_ACHETER } from "@/content/foncier";
import { VIDEOS, type CleVideo } from "@/content/videos";
import { cx } from "@/lib/base";

/** Lien de retour, au-dessus de l'ouverture de chaque fiche (7.3, point 1). */
export const RETOUR = { href: "/terrains/", libelle: "Terrains" };

/**
 * Rythme de la section d'ouverture : le lien de retour (44 px plus 12 de marge)
 * se loge dans le haut de section. Sur tablette et bureau, le filet du titre tombe
 * ainsi à 112 px sous l'en-tête, comme sur les autres pages intérieures (2.4).
 */
export const RYTHME_OUVERTURE = "pt-6 pb-16 tab:pt-14 tab:pb-30";

/** Ligne du visuel et de la fiche : côte à côte sur bureau (1 à 7, 9 à 12), empilés dessous. */
export const LIGNE = "flex flex-col gap-6 tab:grid tab:grid-cols-12 tab:gap-x-6 tab:gap-y-9";
export const COL_VISUEL = "tab:col-span-full desk:col-[1/span_7]";
export const COL_FICHE = "tab:col-[1/span_9] desk:col-[9/span_4]";
export const LEGENDE = "mt-2.5 text-2 leading-caption text-ink-2";

/**
 * « Vidéos » (7.3, point 6) : un VideoLink par vidéo du programme, sans vignette.
 * Les photos du client qui servent de vignette sont posées plus haut, à côté de ce
 * qu'elles montrent : les reprendre ici ferait deux fois la même photo sur la page.
 */
function ListeVideos({ videos }: { videos: CleVideo[] }) {
  return (
    <div>
      <h2 id="t-videos" className={TITRE_COLONNE}>
        Vidéos
      </h2>
      <ul aria-labelledby="t-videos">
        {videos.map((cle) => (
          <li key={cle}>
            <VideoLink video={cle} className="min-h-13 border-b border-rule py-2.5 tab:py-3" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Bande du bas de fiche (7.3, points 5 à 7), sur paper-2 : « Avant d'acheter,
 * vérifiez avec nous » à gauche ; vidéos et autres programmes à droite.
 * La mise en colonnes reprend la section 03 de l'accueil (deux colonnes de Ticks).
 */
export function BandeAvantAchat({
  videos,
  autres,
  titreAutres = "Les autres programmes",
  lienFoncier = true,
}: {
  videos: CleVideo[];
  autres: LienProgramme[];
  titreAutres?: string;
  /** Lien vers /foncier/ sous la liste (absent quand la page le pose déjà ailleurs). */
  lienFoncier?: boolean;
}) {
  return (
    <Section labelledBy="t-avant-achat" surface="paper-2">
      <div className="grid gap-y-12 tab:grid-cols-12 tab:gap-x-6 tab:gap-y-16">
        <Ticks
          titre={AVANT_D_ACHETER.titre}
          titreId="t-avant-achat"
          lignes={AVANT_D_ACHETER.lignes}
          niveau={2}
          className="tab:col-span-full desk:col-[1/span_6]"
        >
          <div className="mt-1.5 flex flex-col items-start">
            <TextLink href={VIDEOS.nicad.href}>{`${VIDEOS.nicad.titre}, ${VIDEOS.nicad.duree}`}</TextLink>
            {lienFoncier ? <TextLink href="/foncier/">Délibération, bail, titre foncier : la différence</TextLink> : null}
          </div>
        </Ticks>
        <div
          className={cx(
            "flex flex-col gap-12 tab:col-span-full desk:col-[8/span_5]",
            videos.length > 0 && "tab:grid tab:grid-cols-2 tab:gap-x-6 desk:flex desk:gap-12",
          )}
        >
          {videos.length > 0 ? <ListeVideos videos={videos} /> : null}
          <ListeProgrammes titre={titreAutres} titreId="t-autres" liens={autres} variante="colonne" />
        </div>
      </div>
    </Section>
  );
}
