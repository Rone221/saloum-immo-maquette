import { VIDEOS, metaVideo, type CleVideo } from "@/content/videos";
import { type PhotoId } from "@/content/photos";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import { LegendePhoto, Photo, cadreNaturel, sizesRecadree } from "./photo";
import { Fleche } from "./text-link";

/**
 * Couverture d'une carte vidéo : une image tirée de la vidéo elle-même, ou une de nos
 * photos, jamais une vignette de la plateforme. `naturel` : le cadre prend le format du
 * fichier et son plafond de largeur (l'image n'est ni recadrée ni agrandie) ; sinon,
 * un cadre 4:3.
 */
export type Couverture = { photo: PhotoId; position?: string; naturel?: boolean };

/** Le titre d'une vidéo : un lien de texte, souligné ; le trait s'épaissit au survol de la carte. */
const TITRE = "font-semibold leading-snug underline decoration-1 underline-offset-4 group-hover:decoration-2";

/**
 * Vidéo du client, dans ses habits v4. Elle s'écrit partout de la même façon : le
 * titre, souligné, puis la plateforme et la durée en étiquette (« YouTube · 1 min 58 »).
 * Elle s'ouvre sur sa plateforme, dans le même onglet.
 *
 * Sans couverture : une ligne entre deux filets, avec sa flèche. Avec une couverture :
 * l'image nue dans son cadre (rien posé dessus, pas de bouton lecture), sa légende à
 * deux colonnes si `legende`, puis le titre et l'étiquette. Toute la carte se clique :
 * le lien est le titre, étendu à la carte. L'image garde son texte alternatif.
 * Au survol, le titre prend la couleur d'accent, avec sa flèche ; rien d'autre ne bouge.
 */
export function CarteVideo({
  cle,
  couverture,
  sizes = "(min-width: 1101px) 437px, 416px",
  legende = false,
  className,
}: {
  cle: CleVideo;
  couverture?: Couverture;
  /** Largeur du cadre de la couverture (voir Photo). */
  sizes?: string;
  /** La légende à deux colonnes sous la couverture : ce qu'on voit, la nature de l'image. */
  legende?: boolean;
  className?: string;
}) {
  const v = VIDEOS[cle];
  const meta = <span className="etiquette mt-1.5 block text-doux">{typo(metaVideo(cle))}</span>;

  if (!couverture) {
    return (
      // Au survol, le titre et la flèche prennent la couleur d'accent ; l'étiquette garde la sienne.
      // Le titre est au ton fort de la surface : sur le plan, un titre ne reste pas au
      // blanc adouci du texte courant.
      <a
        href={v.href}
        className={cx(
          "group flex items-start justify-between gap-x-4 border-t border-ligne py-3.5 text-fort transition-surface hover:text-accent",
          className,
        )}
      >
        <span className="min-w-0">
          <span className={cx(TITRE, "block")}>{typo(v.titre)}</span>
          {/* Lue d'un trait par un lecteur d'écran : « titre, plateforme · durée ». */}
          <span className="sr-only">, </span>
          {meta}
        </span>
        <Fleche className="mt-1" />
      </a>
    );
  }

  const { photo, position, naturel } = couverture;
  return (
    <div className={cx("group relative flex w-full flex-col", className)} style={naturel ? { maxWidth: cadreNaturel(photo).maxWidth } : undefined}>
      <figure className="m-0">
        <span
          className={cx("relative block overflow-hidden bg-attente", !naturel && "aspect-[4/3] max-h-[324px]")}
          style={naturel ? cadreNaturel(photo) : undefined}
        >
          <Photo
            id={photo}
            fill
            position={position}
            sizes={naturel ? sizes : sizesRecadree(photo, 4 / 3, sizes)}
            className="object-cover"
          />
        </span>
        {legende ? <LegendePhoto id={photo} /> : null}
      </figure>
      {/* Le lien couvre la carte (::after) : l'image et sa légende se cliquent aussi. */}
      <a href={v.href} className={cx(TITRE, "mt-4 block text-fort transition-surface group-hover:text-accent after:absolute after:inset-0")}>
        {typo(v.titre)}
      </a>
      {meta}
    </div>
  );
}

/**
 * Une vidéo en lien nu, sans filet ni carte : dans une case de cartouche, sous un
 * chapeau, au pied d'une date. Écrite comme partout : le titre, souligné, puis la
 * plateforme et la durée en étiquette. Un seul lien pour les deux lignes : le contour
 * du focus les entoure toutes les deux, il ne passe pas entre elles. 44 px de haut au
 * moins. La flèche ne quitte pas le dernier mot du titre : quand le titre passe à la
 * ligne, elle ne reste pas seule sur la sienne. Au survol, le titre et sa flèche
 * prennent la couleur d'accent ; l'étiquette garde la sienne.
 */
export function LienVideo({ cle, className }: { cle: CleVideo; className?: string }) {
  const titre = typo(VIDEOS[cle].titre);
  const coupe = titre.lastIndexOf(" ");
  return (
    <a
      href={VIDEOS[cle].href}
      className={cx("group flex min-h-11 w-fit flex-col justify-center text-fort transition-surface hover:text-accent", className)}
    >
      <span className="leading-snug font-semibold underline decoration-1 underline-offset-4 group-hover:decoration-2">
        {titre.slice(0, coupe + 1)}
        <span className="whitespace-nowrap">
          {titre.slice(coupe + 1)}
          <Fleche className="ml-2 inline-block align-[-0.2em]" />
        </span>
      </span>
      {/* Lue d'un trait par un lecteur d'écran : « titre, plateforme · durée ». */}
      <span className="sr-only">, </span>
      <span className="etiquette mt-1.5 block text-doux">{typo(metaVideo(cle))}</span>
    </a>
  );
}
