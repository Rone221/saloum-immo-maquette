import { PHOTOS } from "@/content/photos";
import type { Programme } from "@/content/programmes";
import { VIDEOS } from "@/content/videos";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import { Cotes } from "./dessins/cote";
import { LotPlate } from "./dessins/lot-plate";
import { UnitGrid } from "./dessins/unit-grid";
import { Fiche } from "./fiche";
import { Photo } from "./photo";
import { TextLink } from "./text-link";
import { TexteFait } from "./texte";
import { VideoLink } from "./video-link";
import { WhatsAppButton } from "./whatsapp-button";

type Props = {
  programme: Programme;
  /** H3 sur l'accueil et le catalogue (sous un H2), H2 ailleurs. */
  niveau?: 2 | 3;
  /** Le premier bloc d'une liste n'a ni filet ni marge haute. */
  premier?: boolean;
  /** « Voir la fiche … » (absent sur la fiche elle-même). */
  lienFiche?: boolean;
  /**
   * false : le bloc Lac Town sans sa photo 2580 (accueil). Le plan 2538 de l'ouverture
   * montre le même lotissement : deux photos du même lieu sur une page, c'est non (4.4).
   * Restent la vignette 2421 de la visite commentée, le texte et la fiche.
   */
  photoPrincipale?: boolean;
  className?: string;
};

/** Nom, chapeau (avec le second nom quand il existe), cotes. */
function Tete({ p, niveau }: { p: Programme; niveau: 2 | 3 }) {
  const Titre = niveau === 2 ? "h2" : "h3";
  return (
    <>
      <Titre id={`t-${p.slug}`} className="mb-3 text-6 leading-tight font-bold stretch-title">
        {p.nom}
      </Titre>
      <p className="mb-5 max-w-[32em] text-3 leading-body text-ink-2 tab:mb-6.5">
        {p.aussi ? (
          <>
            <TexteFait fait={p.aussi} />{" "}
          </>
        ) : null}
        <TexteFait fait={p.chapeau} />
      </p>
      <Cotes groupe={p.cotes} />
    </>
  );
}

function Action({ p, marge = "mt-5.5 tab:mt-7" }: { p: Programme; marge?: string }) {
  return <WhatsAppButton label={p.bouton} message={p.message} className={marge} />;
}

function LienFiche({ p }: { p: Programme }) {
  return <TextLink href={p.href}>{`Voir la fiche ${p.nom}`}</TextLink>;
}

function LienVideo({ p }: { p: Programme }) {
  if (!p.videoBloc) return null;
  const v = VIDEOS[p.videoBloc];
  return <TextLink href={v.href}>{`${v.titre}, sur ${v.plateforme}`}</TextLink>;
}

const ARTICLE = "border-t border-rule py-11 tab:py-18";

/**
 * Bloc programme (3.8), en trois mises en page pour éviter la répétition de
 * cartes identiques. Les mêmes données alimentent l'accueil, le catalogue et
 * la fiche. Jamais de badge « Disponible » ou « Vendu ».
 *
 * lac : photo à gauche (col. 1 à 7) qui s'étire à la hauteur du texte, vignette
 *       de la visite commentée dessous ; texte col. 9 à 12. Sans photo (accueil) :
 *       texte en haut et vignette en bas col. 1 à 6, fiche et bouton col. 8 à 12.
 * sakina : texte col. 1 à 5 ; à droite, la trame des parcelles puis le panneau.
 * skm : texte et fiche, puis la bande drone que la planche des lots chevauche.
 */
export function ProgrammeBlock(props: Props) {
  if (props.programme.slug === "lac-town") return <BlocLac {...props} />;
  if (props.programme.slug === "sakina-city") return <BlocSakina {...props} />;
  return <BlocSkm {...props} />;
}

function BlocLac(props: Props) {
  if (props.photoPrincipale === false) return <BlocLacSansPhoto {...props} />;
  const { programme: p, niveau = 3, premier, lienFiche = true, className } = props;
  return (
    <article
      aria-labelledby={`t-${p.slug}`}
      className={cx(
        ARTICLE,
        "flex flex-col gap-6 tab:grid tab:grid-cols-12 tab:gap-x-6 tab:gap-y-9 desk:grid-rows-[1fr_auto] desk:gap-y-0",
        premier && "border-t-0 pt-0 tab:pt-0",
        className,
      )}
    >
      <figure className="m-0 flex flex-col tab:col-span-full desk:col-[1/span_7] desk:row-start-1">
        <div className="relative aspect-[4/3] overflow-hidden bg-paper-2 tab:aspect-video desk:aspect-auto desk:min-h-105 desk:flex-1">
          {/* sizes : largeur dessinée, après object-fit: cover et le zoom (1,2 ou 1,3).
              Bureau : 1 650 à 2 200 px, calée sur la hauteur de la colonne de texte. */}
          <Photo
            id={p.photo}
            fill
            sizes="(min-width: 1101px) 1650px, (min-width: 761px) calc(120vw - 67px), calc(160vw - 64px)"
            className="origin-[44%_100%] scale-120 object-cover desk:scale-130"
          />
        </div>
        <figcaption className="mt-2.5 text-2 leading-caption text-ink-2">{typo(PHOTOS[p.photo].legende ?? "")}</figcaption>
      </figure>
      <div className="tab:col-[1/span_9] desk:col-[9/span_4] desk:row-[1/span_2]">
        <Tete p={p} niveau={niveau} />
        <Fiche lignes={p.fiche.filter((l) => !l.ficheSeulement)} />
        <Action p={p} />
        {lienFiche ? (
          <div className="mt-3">
            <LienFiche p={p} />
          </div>
        ) : null}
      </div>
      {/* Filet haut sur bureau seulement, où il sépare la vignette de la légende de la
          photo. Dessous, la vignette suit « Voir la fiche » : avec un filet, elle se lisait
          comme un bloc à part, coincée entre lui et le filet du programme suivant. */}
      {p.videoBloc && p.vignetteVideo ? (
        <VideoLink
          video={p.videoBloc}
          photo={p.vignetteVideo}
          className="tab:col-[1/span_9] desk:col-[1/span_7] desk:row-start-2 desk:mt-6 desk:border-t desk:border-rule desk:pt-4.5"
        />
      ) : null}
    </article>
  );
}

/**
 * Lac Town sans la photo 2580 (accueil). Même schéma que Sicap Keur Massar : texte à
 * gauche (col. 1 à 6), fiche et bouton à droite (col. 8 à 12). La vignette de la visite
 * commentée suit directement les cotes. Calée en bas de colonne, elle laissait un
 * blanc de 300 px entre les cotes et elle, qui se lisait comme un trou.
 */
function BlocLacSansPhoto({ programme: p, niveau = 3, premier, lienFiche = true, className }: Props) {
  return (
    <article
      aria-labelledby={`t-${p.slug}`}
      className={cx(
        ARTICLE,
        "flex flex-col gap-6 tab:grid tab:grid-cols-12 tab:gap-x-6 tab:gap-y-9 desk:grid-rows-[auto_1fr] desk:gap-y-0",
        premier && "border-t-0 pt-0 tab:pt-0",
        className,
      )}
    >
      <div className="tab:col-span-full desk:col-[1/span_6] desk:row-start-1">
        <Tete p={p} niveau={niveau} />
      </div>
      {p.videoBloc && p.vignetteVideo ? (
        <VideoLink
          video={p.videoBloc}
          photo={p.vignetteVideo}
          className="tab:col-[1/span_9] desk:col-[1/span_6] desk:row-start-2 desk:mt-8 desk:self-start desk:border-t desk:border-rule desk:pt-4.5"
        />
      ) : null}
      <div className="tab:col-[1/span_9] desk:col-[8/span_5] desk:row-[1/span_2]">
        <Fiche lignes={p.fiche.filter((l) => !l.ficheSeulement)} marge="" />
        <Action p={p} />
        {lienFiche ? (
          <div className="mt-3">
            <LienFiche p={p} />
          </div>
        ) : null}
      </div>
    </article>
  );
}

function BlocSakina({ programme: p, niveau = 3, premier, lienFiche = true, className }: Props) {
  return (
    <article
      aria-labelledby={`t-${p.slug}`}
      className={cx(
        ARTICLE,
        "flex flex-col gap-6 tab:grid tab:grid-cols-12 tab:gap-x-6 tab:gap-y-9",
        premier && "border-t-0 pt-0 tab:pt-0",
        className,
      )}
    >
      <div className="tab:col-span-full desk:col-[1/span_5]">
        <Tete p={p} niveau={niveau} />
        <Fiche lignes={p.fiche.filter((l) => !l.ficheSeulement)} />
        <Action p={p} />
        <div className="mt-3 flex flex-col items-start tab:flex-row tab:flex-wrap tab:gap-x-6">
          <LienVideo p={p} />
          {lienFiche ? <LienFiche p={p} /> : null}
        </div>
      </div>
      <div className="flex flex-col gap-6 tab:col-span-full tab:gap-9 desk:col-[7/span_6]">
        {p.trame ? <UnitGrid nombre={p.trame.nombre} surface={p.trame.surface} legende={p.trame.legende} /> : null}
        <figure className="m-0 flex flex-col desk:flex-1">
          <div className="relative aspect-video overflow-hidden bg-paper-2 desk:aspect-auto desk:min-h-70 desk:flex-1">
            <Photo id={p.photo} fill sizes="(min-width: 1101px) 50vw, 100vw" className="object-cover" />
          </div>
          <figcaption className="mt-2.5 text-2 leading-caption text-ink-2">{typo(PHOTOS[p.photo].legende ?? "")}</figcaption>
        </figure>
      </div>
    </article>
  );
}

function BlocSkm({ programme: p, niveau = 3, premier, lienFiche = true, className }: Props) {
  return (
    <article
      aria-labelledby={`t-${p.slug}`}
      className={cx(
        ARTICLE,
        "flex flex-col gap-6 tab:grid tab:grid-cols-12 tab:gap-x-6 tab:gap-y-9",
        premier && "border-t-0 pt-0 tab:pt-0",
        className,
      )}
    >
      <div className="tab:col-span-full desk:col-[1/span_6]">
        <Tete p={p} niveau={niveau} />
      </div>
      <Fiche
        lignes={p.fiche.filter((l) => !l.ficheSeulement)}
        marge=""
        className="tab:col-span-full desk:col-[8/span_5] desk:self-start"
      />
      <figure className="relative m-0 tab:col-span-full tab:mt-3">
        <Photo
          id={p.photo}
          sizes="(min-width: 1101px) 1360px, 100vw"
          className="aspect-[16/10] w-full object-cover tab:aspect-[21/8]"
        />
        <figcaption className="absolute top-0 right-0 border-b border-l border-ink bg-paper px-2.5 py-1.5 text-2 leading-caption text-ink tab:px-3.5 tab:py-2">
          {typo(PHOTOS[p.photo].legende ?? "")}
        </figcaption>
      </figure>
      {p.lots ? (
        <LotPlate
          lots={p.lots.liste}
          titre={`${p.lots.texte}, à l’échelle`}
          avertissement={p.avertissement}
          className="relative z-1 mx-2.5 -mt-20 tab:col-span-full tab:mx-6 tab:-mt-30 desk:col-[2/-1] desk:mx-0 desk:-mt-58"
        />
      ) : null}
      <div className="tab:col-span-full tab:flex tab:flex-wrap tab:items-start tab:justify-between tab:gap-x-10 tab:gap-y-4 desk:col-[2/-1]">
        <Action p={p} marge="" />
        <div className="mt-3 flex flex-col items-start tab:mt-0 desk:items-end">
          <LienVideo p={p} />
          {lienFiche ? <LienFiche p={p} /> : null}
        </div>
      </div>
    </article>
  );
}
