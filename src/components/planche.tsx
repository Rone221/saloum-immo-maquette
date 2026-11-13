import manifeste from "../../public/photos/photos.json";
import { PHOTOS, type PhotoId } from "@/content/photos";
import { ETAPES, type Etape } from "@/content/services";
import { cx } from "@/lib/base";
import { enLettres, typo } from "@/lib/format";
import { BandeDefilante } from "./bande-defilante";
import { TfTile } from "./dessins/tf-tile";
import { Photo } from "./photo";
import { TexteFait } from "./texte";

const DIMENSIONS = manifeste as Record<string, { largeur: number; hauteur: number }>;

/** Largeur du cadre 4:3 d'une étape, selon la largeur de l'écran. */
const CADRE = [
  ["(min-width: 1440px)", "437px"],
  ["(min-width: 1101px)", "(33.33vw - 43px)"],
  ["(min-width: 761px)", "(50vw - 40px)"],
  ["", "(74vw - 30px)"],
] as const;

/**
 * sizes d'une photo d'étape : la largeur dessinée. Une photo plus large que 4:3
 * (2327-haut, 1 280 × 700) remplit le cadre par la hauteur : elle est dessinée
 * plus large que lui, d'autant que son format dépasse 4:3 (× 1,37 pour 2327-haut).
 */
function sizesEtape(id: PhotoId): string {
  const d = DIMENSIONS[id];
  const k = d ? Math.max(1, d.largeur / d.hauteur / (4 / 3)) : 1;
  return CADRE.map(([media, largeur]) => {
    const valeur = k === 1 ? (largeur.startsWith("(") ? `calc${largeur}` : largeur) : `calc(${largeur} * ${k.toFixed(2)})`;
    return media ? `${media} ${valeur}` : valeur;
  }).join(", ");
}

/**
 * Planche des étapes de l'aménagement (3.12), dans l'ordre de la coupe.
 * Bureau : 3 colonnes. Tablette : 2. Mobile : bande à faire glisser au doigt
 * (colonnes de 74 %, aimantation), jamais de défilement automatique.
 *
 * courte (accueil) : une photo par étape, sa légende ; sous la tuile du titre, son
 * texte puis le service publié (ligneDatee), verbatim.
 * longue (page Aménager) : deux photos au plus par étape, et sous l'étape un
 * fait publié, précédé de son origine en étiquette mono (« Au registre »).
 * Cette ligne n'est pas une légende : la photo et la ligne ne parlent pas
 * forcément du même chantier. Une ligne qui nommerait le chantier d'une photo de
 * lieu non publié n'est pas posée sous elle : l'étape 4 n'a pas de ligne.
 */
export function Planche({
  etapes = ETAPES,
  version = "courte",
  niveau = 3,
  label = "Les travaux en photos, dans l’ordre de la coupe",
  marge = "mt-7 tab:mt-14",
  className,
}: {
  etapes?: Etape[];
  version?: "courte" | "longue";
  niveau?: 2 | 3;
  label?: string;
  /** Marge au-dessus (remplace celle par défaut). */
  marge?: string;
  className?: string;
}) {
  const Titre = niveau === 2 ? "h2" : "h3";
  const longue = version === "longue";
  return (
    <div className={cx(marge, className)}>
      <p aria-hidden="true" className="mb-3 font-mono text-1 leading-label font-medium text-ink-2 tab:hidden">
        {`${enLettres(etapes.length)} étapes, faites glisser`}
      </p>
      {/* Arrêt de tabulation tant que la bande défile (mobile) : elle se fait défiler au
          clavier, sans compter sur les navigateurs qui rendent d'eux-mêmes un conteneur
          défilant focalisable. Plus d'arrêt dès qu'elle devient une grille (761 px). */}
      <BandeDefilante
        label={label}
        className="-mx-gutter grid focus-visible:-outline-offset-2 snap-x snap-mandatory auto-cols-[74%] grid-flow-col gap-3.5 overflow-x-auto overscroll-x-contain scroll-px-gutter px-gutter pb-1.5 tab:mx-0 tab:auto-cols-auto tab:grid-flow-row tab:grid-cols-2 tab:gap-x-6 tab:gap-y-12 tab:overflow-visible tab:px-0 tab:pb-0 desk:grid-cols-3"
      >
        {etapes.map((e) => {
          const photos = longue ? (e.photosLongue ?? []) : e.photo ? [e.photo] : [];
          return (
            <li key={e.numero} id={longue ? e.id : undefined} className="flex snap-start flex-col">
              <div className="flex items-center gap-3 border-b-[1.5px] border-ink pb-3">
                <span
                  aria-hidden="true"
                  className="inline-grid size-8 flex-none place-items-center bg-ink font-mono text-2 leading-tight font-semibold text-white"
                >
                  {e.numero}
                </span>
                <Titre className="text-3 leading-snug font-650 stretch-sub tab:text-4">{typo(e.titre)}</Titre>
              </div>
              {e.tuile ? (
                <>
                  <TfTile className="mt-2.5 tab:mt-3.5" titre={e.tuile.titre} reference={e.tuile.reference.texte} />
                  <p className="mt-2.5 text-2 leading-caption">
                    <TexteFait fait={e.tuile.texte} />
                    {longue || !e.ligneDatee ? null : (
                      <>
                        {" "}
                        <TexteFait fait={e.ligneDatee} />
                      </>
                    )}
                  </p>
                </>
              ) : (
                photos.map((id) => (
                  <figure key={id} className="m-0 mt-2.5 tab:mt-3.5">
                    <Photo id={id} sizes={sizesEtape(id)} className="aspect-[4/3] w-full object-cover" />
                    <figcaption className="mt-2.5 text-2 leading-caption text-ink">
                      {typo(PHOTOS[id].legende ?? "")}
                    </figcaption>
                  </figure>
                ))
              )}
              {longue && e.ligneDatee ? (
                <div className="mt-3 border-t border-rule pt-2.5">
                  <p className="font-mono text-1 leading-label font-medium text-ink-2">{e.origine}</p>
                  <p className="mt-1 text-2 leading-caption text-ink">
                    <TexteFait fait={e.ligneDatee} />
                  </p>
                </div>
              ) : null}
            </li>
          );
        })}
      </BandeDefilante>
    </div>
  );
}
