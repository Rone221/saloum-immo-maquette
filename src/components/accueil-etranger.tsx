import { LIBELLES } from "@/content/messages";
import { ETRANGER, TITRES } from "@/content/pages/accueil";
import { type PhotoId } from "@/content/photos";
import { DIASPORA, PARCOURS_DIASPORA } from "@/content/services";
import { VIDEOS, type CleVideo } from "@/content/videos";
import { cx } from "@/lib/base";
import { CHAPEAU, SOUS_BORNE, T2, T3 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { BoutonWhatsApp } from "./boutons";
import { CarteVideo } from "./carte-video";
import { EnTeteSection } from "./en-tete-section";
import { TitreCote } from "./mot-cote";
import { CadrePhoto, LegendePhoto, Photo, cadreNaturel, plafond } from "./photo";
import { Section, type Surface } from "./section";

/**
 * Les trois vidéos de la section, dans cet ordre : le NICAD d'abord, avec son
 * document ; puis la présentation et une visite. L'en-tête de section les compte.
 */
const VIDEOS_ETRANGER: CleVideo[] = ["nicad", "presentation", "visiteSakina"];

/** Le document montré dans la vidéo du NICAD : 449 px de large, jamais agrandi. */
const DOCUMENT: PhotoId = "ig-DexPGrbBztC-20s";

/**
 * La légende du document, à gauche : celle de sa fiche (« Le document montré dans notre
 * vidéo sur le NICAD »), en plus court, pour tenir sur deux lignes sous l'image.
 */
const LEGENDE_DOCUMENT = "Le document de notre vidéo sur le NICAD";

/**
 * Ce qu'on voit sur 2333. Sa fiche n'a pas de légende (content/photos.ts) : la légende
 * à deux colonnes de la v4 en demande une, courte, sans lieu ni nom.
 */
const LEGENDE_VISITE = "Visite d’un terrain";

/**
 * Accueil, « De loin, faites tout vérifier avant de payer » : la diaspora. Deux temps.
 * 1. Ce que nous vérifions, puis les quatre étapes en lignes, de l'écran au terrain,
 *    et le bouton WhatsApp de la diaspora (sous le chapeau au bureau, après les étapes
 *    sur mobile).
 * 2. À regarder avant d'appeler : le document de la vidéo du NICAD, les trois vidéos en
 *    lignes (le titre, puis la plateforme et la durée), et la visite d'un terrain.
 *
 * Photos : l'image du document, à sa taille (449 px au plus), et 2333, en petit : elle
 * montre des visages.
 */
export function AccueilEtranger({
  numero,
  surface = "calque",
  className,
}: {
  /** La borne de la section, à la suite de celles de la page : « 06 ». */
  numero: string;
  surface?: Extract<Surface, "sable" | "calque">;
  className?: string;
}) {
  return (
    <Section id="etranger" labelledBy="t-etranger" surface={surface} className={className}>
      <EnTeteSection
        numero={numero}
        nom="De loin"
        quantite={`${PARCOURS_DIASPORA.length} étapes · ${VIDEOS_ETRANGER.length} vidéos`}
      />

      {/* 1. Le titre et le chapeau à gauche, les étapes en regard. Le bouton est écrit
          après les étapes (l'ordre de lecture sur mobile) et posé sous le chapeau au
          bureau : la seconde rangée de la grille prend la hauteur qui reste. */}
      <div className={cx("grid gap-y-10 desk:grid-cols-12 desk:grid-rows-[auto_1fr] desk:gap-x-6", SOUS_BORNE)}>
        <div className="desk:col-span-6">
          <h2 id="t-etranger" className={T2}>
            <TitreCote texte={TITRES.etranger} mot="vérifier" />
          </h2>
          <p className={cx(CHAPEAU, "mt-5 max-w-[36rem] desk:mt-7")}>{typo(ETRANGER.chapeau.texte)}</p>
        </div>
        <ol className="apparait m-0 list-none border-t border-fort p-0 desk:col-span-5 desk:col-start-8 desk:row-span-2 desk:row-start-1">
          {PARCOURS_DIASPORA.map((s) => (
            <li key={s.titre} className="border-b border-ligne py-5 desk:py-6">
              <h3 className={T3}>{typo(s.titre)}</h3>
              <p className="mt-1.5">{typo(s.court)}</p>
            </li>
          ))}
        </ol>
        <div className="desk:col-span-6 desk:row-start-2">
          <BoutonWhatsApp label={LIBELLES.diaspora} message={DIASPORA.message} />
        </div>
      </div>

      {/* 2. Les pièces. `group/pieces` : survoler le document allume le titre de sa vidéo. */}
      <div className="group/pieces mt-16 border-t border-fort pt-6 desk:mt-24 desk:pt-8">
        <h3 className={T3}>{typo("À regarder avant d’appeler")}</h3>
        <div className="mt-6 grid gap-y-10 tab:grid-cols-12 tab:gap-x-6 desk:mt-8">
          <figure className="apparait m-0 tab:col-span-6 desk:col-span-4" style={plafond(DOCUMENT)}>
            <span className="relative block overflow-hidden bg-attente" style={{ aspectRatio: cadreNaturel(DOCUMENT).aspectRatio }}>
              <Photo
                id={DOCUMENT}
                fill
                sizes="(min-width: 1440px) 437px, (min-width: 1101px) 31vw, (min-width: 761px) 46vw, 100vw"
                className="object-cover"
              />
              {/* L'image se clique aussi, à la souris : le lien de la vidéo est son titre,
                  dans la liste. Celui-ci le double sans rien ajouter au clavier ni à
                  un lecteur d'écran. */}
              <a href={VIDEOS.nicad.href} tabIndex={-1} aria-hidden="true" data-document="" className="absolute inset-0" />
            </span>
            <LegendePhoto id={DOCUMENT} texte={LEGENDE_DOCUMENT} className="text-balance" />
          </figure>
          <ul className="apparait m-0 list-none self-start border-b border-ligne p-0 [--rang:1] tab:col-span-6 desk:col-span-4">
            {VIDEOS_ETRANGER.map((cle) => (
              <li key={cle}>
                <CarteVideo
                  cle={cle}
                  className={cle === "nicad" ? "group-has-[[data-document]:hover]/pieces:text-accent" : undefined}
                />
              </li>
            ))}
          </ul>
          {/* 2333 montre des visages : jamais en grand. Sur mobile, la largeur de la
              colonne (350 px à 390), comme les deux pièces du dessus : un cadre plus
              étroit, calé à gauche, laissait un vide qu'on lisait comme un oubli. */}
          <CadrePhoto
            id="2333"
            texteLegende={LEGENDE_VISITE}
            sizes="(min-width: 1440px) 318px, (min-width: 1101px) 23vw, (min-width: 761px) 46vw, calc(100vw - 40px)"
            className="apparait [--rang:2] [&_figcaption]:text-balance tab:col-span-6 desk:col-span-3 desk:col-start-10"
          />
        </div>
      </div>
    </Section>
  );
}
