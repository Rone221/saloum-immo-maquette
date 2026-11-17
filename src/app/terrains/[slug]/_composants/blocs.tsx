import { CarteVideo } from "@/components/carte-video";
import { EnTeteSection } from "@/components/en-tete-section";
import { ListeTerrains } from "@/components/liste-terrains";
import { TitreCote } from "@/components/mot-cote";
import { LegendePhoto, Photo, cadreNaturel, plafond, sizesRecadree } from "@/components/photo";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { LIEN_TERRAINS, SECTIONS, VISITE, type TitreFiche } from "@/content/pages/fiches";
import type { PhotoId } from "@/content/photos";
import type { Programme } from "@/content/programmes";
import { VIDEOS, type CleVideo, type Video } from "@/content/videos";
import { cx } from "@/lib/base";
import { CHAPEAU, SOUS_BORNE, T2 } from "@/lib/classes";
import { typo } from "@/lib/format";

/**
 * Ce que compte une section de vidéos, à droite de son en-tête : leur nombre, et la
 * durée quand il n'y en a qu'une et qu'on la connaît (« 1 vidéo · 9 min 25 »).
 */
function quantiteVideos(cles: CleVideo[]): string {
  const nombre = `${cles.length} vidéo${cles.length > 1 ? "s" : ""}`;
  const seule: Video | undefined = cles.length === 1 ? VIDEOS[cles[0]] : undefined;
  return seule?.duree ? `${nombre} · ${seule.duree}` : nombre;
}

/**
 * Sakina City, la visite (direction v4, section 6), sur le calque. La vidéo passe devant :
 * le conseil en titre, la phrase de la visite, puis la visite virtuelle, écrite comme
 * partout (le titre en lien, la plateforme et la durée dessous). La voirie en photo vient
 * après, en petit tirage : à droite au bureau, sous la vidéo ailleurs.
 *
 * La photo 2413-droite est un petit fichier (846 px), plafonné à 600 px
 * (content/photos.ts). Son cadre prend le format du fichier : elle y est entière, dessinée
 * à la largeur du cadre, jamais plus. Et le cadre reste à 26 rem : la moitié du fichier,
 * nette aussi sur un écran qui double les points.
 */
export function Visite({
  numero,
  photo,
  titre,
  videos,
}: {
  /** La borne de la section, à la suite de celles de la fiche. */
  numero: string;
  photo: PhotoId;
  titre: TitreFiche;
  videos: CleVideo[];
}) {
  return (
    <Section surface="calque" labelledBy="t-visite">
      <EnTeteSection numero={numero} nom={SECTIONS.visite} quantite={quantiteVideos(videos)} />
      {/* Deux colonnes au bureau : le texte dans ce qui reste, la photo dans 26 rem. La
          colonne de la photo ne tombe pas sur les douze colonnes de la page : c'est la
          taille de la photo qui commande, comme pour le buste du fondateur sur l'accueil.
          L'écart suit la largeur de l'écran, de 64 à 136 px. */}
      <div
        className={cx(
          "grid gap-y-10 desk:grid-cols-[minmax(0,1fr)_26rem] desk:items-start desk:gap-x-[clamp(4rem,8vw,8.5rem)]",
          SOUS_BORNE,
        )}
      >
        <div>
          <h2 id="t-visite" className={cx(T2, "max-w-[12em]")}>
            {titre.mot ? <TitreCote texte={titre.texte} mot={titre.mot} /> : typo(titre.texte)}
          </h2>
          <p className={cx(CHAPEAU, "mt-5 max-w-[36rem] text-balance desk:mt-6")}>{typo(VISITE.texte)}</p>
          <ul className="m-0 mt-8 max-w-[36rem] list-none border-b border-ligne p-0 desk:mt-10">
            {videos.map((cle) => (
              <li key={cle}>
                <CarteVideo cle={cle} />
              </li>
            ))}
          </ul>
        </div>
        {/* Le plafond de la photo reste sur la figure : quelle que soit la taille des
            lettres du navigateur, 26 rem ne le dépassent pas. Au bureau, le haut de la
            photo tombe sur le haut des capitales du titre : 0,2 fois son corps, mesuré
            sur Besley. */}
        <figure className="apparait m-0 w-[min(100%,26rem)] desk:mt-[calc(var(--text-h2)*0.2)]" style={plafond(photo)}>
          <span className="relative block overflow-hidden bg-attente" style={{ aspectRatio: cadreNaturel(photo).aspectRatio }}>
            <Photo id={photo} fill sizes="(min-width: 456px) 416px, calc(100vw - 40px)" className="object-cover" />
          </span>
          <LegendePhoto id={photo} className="text-balance" />
        </figure>
      </div>
    </Section>
  );
}

/**
 * Sicap Keur Massar, les vidéos des lots (direction v4, section 6), sur le calque. À
 * gauche, le conseil en titre, la phrase de la visite, puis les vidéos en lignes, écrites
 * comme partout : le titre, la plateforme et la durée. À droite, une image tirée d'une
 * de ces vidéos, nue, sa légende à deux colonnes dessous : elle dit ce qu'on voit. Le
 * titre de la vidéo n'est écrit qu'une fois, dans la liste.
 *
 * L'image tient un cadre 4:3 de cinq colonnes au plus (553 px, 738 px dessinés : son
 * fichier en fait 899). Elle se clique aussi, à la souris : le lien de la vidéo est son
 * titre, dans la liste ; celui de l'image le double, sans rien ajouter au clavier ni à
 * un lecteur d'écran. Survoler l'image allume le titre de sa vidéo.
 */
export function Videos({
  numero,
  titre,
  videos,
  image,
}: {
  /** La borne de la section, à la suite de celles de la fiche. */
  numero: string;
  titre: TitreFiche;
  /** Les vidéos, dans l'ordre de la liste. */
  videos: CleVideo[];
  /** L'image, et la vidéo dont elle est tirée. */
  image?: { photo: PhotoId; cle: CleVideo };
}) {
  return (
    <Section surface="calque" labelledBy="t-videos">
      <EnTeteSection numero={numero} nom={SECTIONS.videos} quantite={quantiteVideos(videos)} />
      <div className={cx("group/videos grid gap-y-10 desk:grid-cols-12 desk:items-start desk:gap-x-6", SOUS_BORNE)}>
        <div className="desk:col-span-6">
          <h2 id="t-videos" className={cx(T2, "max-w-[12em]")}>
            {titre.mot ? <TitreCote texte={titre.texte} mot={titre.mot} /> : typo(titre.texte)}
          </h2>
          <p className={cx(CHAPEAU, "mt-5 max-w-[32rem] desk:mt-6")}>{typo(VISITE.texte)}</p>
          <ul className="m-0 mt-8 max-w-[34rem] list-none border-b border-ligne p-0 desk:mt-10">
            {videos.map((cle) => (
              <li key={cle}>
                <CarteVideo cle={cle} className={image?.cle === cle ? "group-has-[[data-image]:hover]/videos:text-accent" : undefined} />
              </li>
            ))}
          </ul>
        </div>
        {image ? (
          <figure className="apparait m-0 max-w-[34rem] desk:col-span-5 desk:col-start-8 desk:max-w-none">
            <span className="relative block aspect-[4/3] overflow-hidden bg-attente">
              <Photo
                id={image.photo}
                fill
                sizes={sizesRecadree(image.photo, 4 / 3, "(min-width: 1440px) 553px, (min-width: 1101px) 39vw, (min-width: 584px) 544px, 100vw")}
                className="object-cover"
              />
              <a href={VIDEOS[image.cle].href} tabIndex={-1} aria-hidden="true" data-image="" className="absolute inset-0" />
            </span>
            <LegendePhoto id={image.photo} className="text-balance" />
          </figure>
        ) : null}
      </div>
    </Section>
  );
}

/**
 * « Les autres terrains » (direction v4, section 6) : la liste des terrains en vente
 * (components/liste-terrains.tsx), sous un titre-conseil, puis le lien vers la page
 * Terrains. Sans l'offre AIBD : elle reste sur Terrains et sur sa page.
 */
export function AutresTerrains({
  numero,
  nom,
  titre,
  programmes,
}: {
  /** La borne de la section, à la suite de celles de la fiche. */
  numero: string;
  /** Le nom de la section, en étiquette. */
  nom: string;
  titre: TitreFiche;
  programmes: Programme[];
}) {
  return (
    <Section labelledBy="t-autres">
      <EnTeteSection numero={numero} nom={nom} quantite={`${programmes.length} programmes`} />
      <ListeTerrains titre={titre.texte} mot={titre.mot} programmes={programmes} className={SOUS_BORNE} />
      <TextLink href={LIEN_TERRAINS.href} className="mt-6 desk:mt-8">
        {LIEN_TERRAINS.libelle}
      </TextLink>
    </Section>
  );
}
