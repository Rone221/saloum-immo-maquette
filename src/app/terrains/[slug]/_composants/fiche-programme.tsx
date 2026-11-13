import { ContactBand } from "@/components/contact-band";
import { Cotes } from "@/components/dessins/cote";
import { LotPlate } from "@/components/dessins/lot-plate";
import { StatusKey } from "@/components/dessins/status-key";
import { StatutEnLigne } from "@/components/dessins/swatch";
import { TfTile } from "@/components/dessins/tf-tile";
import { UnitGrid } from "@/components/dessins/unit-grid";
import { Fiche } from "@/components/fiche";
import { versLien } from "@/components/liste-programmes";
import { PageHead } from "@/components/page-head";
import { Photo } from "@/components/photo";
import { Registre } from "@/components/registre";
import { Section } from "@/components/section";
import { TexteFait } from "@/components/texte";
import { VideoLink } from "@/components/video-link";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { PHOTOS } from "@/content/photos";
import { PROGRAMMES, type Programme } from "@/content/programmes";
import { lignesDuProgramme } from "@/content/registre";
import { cx } from "@/lib/base";
import { typo } from "@/lib/format";
import {
  BandeAvantAchat,
  COL_FICHE,
  COL_VISUEL,
  LEGENDE,
  LIGNE,
  RETOUR,
  RYTHME_OUVERTURE,
} from "./communs";

/** Le chapeau, les cotes, puis l'échantillon du statut et son mot (7.3, point 1). Le second nom va sous le H1. */
function Intro({ p }: { p: Programme }) {
  return (
    <>
      <p className="max-w-[32em] text-3 leading-body text-ink-2">
        <TexteFait fait={p.chapeau} />
      </p>
      <Cotes groupe={p.cotes} className="mt-5 tab:mt-6" />
      <p className="mt-4 tab:mt-5">
        <StatutEnLigne statut={p.statut} texte={p.statutTexte.texte} className="text-2 leading-snug font-semibold" />
      </p>
    </>
  );
}

/** La fiche complète (lignes « fiche seulement » comprises) et le bloc d'action dessous (7.3, point 2). */
function FicheEtAction({ p, className }: { p: Programme; className?: string }) {
  return (
    <div className={cx(COL_FICHE, className)}>
      <Fiche lignes={p.fiche} marge="" />
      <WhatsAppButton label={p.bouton} message={p.message} className="mt-5.5 tab:mt-7" />
    </div>
  );
}

function Legende({ p }: { p: Programme }) {
  return <figcaption className={LEGENDE}>{typo(PHOTOS[p.photo].legende ?? "")}</figcaption>;
}

// Le visuel principal de chaque fiche est son image d'ouverture : préchargé (4.2).

// ------------------------------------------------------------- Lac Town

/**
 * Photo 2580 (légendée sans le nom du lieu) et, sous elle, la vignette 2421 de
 * la visite commentée : le bloc propre de Lac Town, à sa place de l'accueil.
 * Sur bureau, la photo s'étire à la hauteur de la fiche.
 */
function HautLac({ p }: { p: Programme }) {
  return (
    <div className={cx(LIGNE, "desk:grid-rows-[1fr_auto] desk:gap-y-0")}>
      <figure className={cx("m-0 flex flex-col desk:row-start-1", COL_VISUEL)}>
        <div className="relative aspect-[4/3] overflow-hidden bg-paper-2 tab:aspect-video desk:aspect-auto desk:min-h-105 desk:flex-1">
          {/* sizes : largeur dessinée après object-fit: cover et le zoom (1,2 puis 1,3 sur bureau). */}
          <Photo
            id={p.photo}
            fill
            preload
            sizes="(min-width: 1101px) 1400px, (min-width: 761px) calc(120vw - 67px), calc(161vw - 64px)"
            className="origin-[44%_100%] scale-120 object-cover desk:scale-130"
          />
        </div>
        <Legende p={p} />
      </figure>
      <FicheEtAction p={p} className="desk:row-[1/span_2]" />
      {p.videoBloc && p.vignetteVideo ? (
        <VideoLink
          video={p.videoBloc}
          photo={p.vignetteVideo}
          className="border-t border-rule pt-4.5 tab:col-[1/span_9] desk:col-[1/span_7] desk:row-start-2 desk:mt-6"
        />
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------- Sakina City

/** Le panneau 2534, calé sur la hauteur de la fiche sur bureau, en 16:9 dessous. */
function HautSakina({ p }: { p: Programme }) {
  return (
    <div className={LIGNE}>
      <figure className={cx("m-0 flex flex-col", COL_VISUEL)}>
        <div className="relative aspect-video overflow-hidden bg-paper-2 desk:aspect-auto desk:min-h-105 desk:flex-1">
          <Photo id={p.photo} fill preload sizes="(min-width: 1440px) 783px, (min-width: 1101px) 54vw, 100vw" className="object-cover" />
        </div>
        <Legende p={p} />
      </figure>
      <FicheEtAction p={p} />
    </div>
  );
}

/** Trame des 78 parcelles, tuile du titre mère, voirie recadrée de 2413 (7.3, Sakina City). */
function PropreSakina({ p }: { p: Programme }) {
  if (!p.trame) return null;
  const voirie = p.photosFiche?.[0];
  return (
    <div className="mt-14 grid gap-y-9 tab:mt-24 tab:grid-cols-12 tab:gap-x-6">
      {/* La clé des hachures est la légende de la trame : elle reste avec elle. */}
      <div className="tab:col-span-full desk:col-[1/span_7]">
        <StatusKey marge="mt-0" className="mb-7 tab:mb-10" />
        <UnitGrid nombre={p.trame.nombre} surface={p.trame.surface} legende={p.trame.legende} />
      </div>
      <div className="flex flex-col gap-9 tab:col-span-full tab:grid tab:grid-cols-2 tab:gap-6 desk:col-[9/span_4] desk:flex desk:gap-9">
          {p.titreMere ? <TfTile titre="Titre mère" reference={p.titreMere.texte} /> : null}
          {voirie ? (
            <figure className="m-0">
              <Photo
                id={voirie}
                sizes="(min-width: 1440px) 437px, (min-width: 1101px) 30vw, (min-width: 761px) 50vw, 100vw"
                className="h-auto w-full max-w-150"
              />
              <figcaption className={LEGENDE}>{typo(PHOTOS[voirie].legende ?? "")}</figcaption>
            </figure>
          ) : null}
      </div>
    </div>
  );
}

// ---------------------------------------------------- Sicap Keur Massar

/**
 * La vue drone 2616, en bande 21:8 sur tablette (16:10 sur mobile), calée sur la
 * hauteur de la fiche sur bureau. Seule étiquette blanche permise : la légende.
 */
function HautSkm({ p }: { p: Programme }) {
  return (
    <div className={LIGNE}>
      <figure className={cx("relative m-0 flex flex-col", COL_VISUEL)}>
        <div className="relative aspect-[16/10] overflow-hidden bg-paper-2 tab:aspect-[21/8] desk:aspect-auto desk:min-h-90 desk:flex-1">
          <Photo id={p.photo} fill preload sizes="(min-width: 1440px) 800px, (min-width: 1101px) 56vw, 100vw" className="object-cover" />
        </div>
        <figcaption className="absolute top-0 right-0 border-b border-l border-ink bg-paper px-2.5 py-1.5 text-2 leading-caption text-ink tab:px-3.5 tab:py-2">
          {typo(PHOTOS[p.photo].legende ?? "")}
        </figcaption>
      </figure>
      <FicheEtAction p={p} />
    </div>
  );
}

/**
 * Planche des lots publiés, à l'échelle ; puis le reel du 27.10.2026 en vignette
 * (152 px : la collaboratrice reste petite, droit à l'image à valider) et la vue
 * drone du 11.11.2026 en lien texte, sans vignette : son image vient du même survol
 * que la bande 2616 en tête de page, et 4.4 interdit deux photos du même instant
 * sur une page (7.3 demande la vignette : 4.4 l'emporte).
 */
function PropreSkm({ p }: { p: Programme }) {
  if (!p.lots) return null;
  return (
    <div className="mt-14 tab:mt-24">
      <StatusKey marge="mt-0" className="mb-7 tab:mb-10" />
      <LotPlate lots={p.lots.liste} titre={`${p.lots.texte}, à l’échelle`} avertissement={p.avertissement} />
      <div className="mt-9 grid gap-y-6 tab:mt-12 tab:grid-cols-12 tab:gap-x-6">
        <VideoLink
          video="reelLotsSKM"
          photo="ig-DfAoxMkAbKR"
          className="border-t border-rule pt-4.5 tab:col-span-6"
        />
        <VideoLink video="reelDroneSKM" className="self-start border-t border-rule pt-4.5 tab:col-span-6" />
      </div>
    </div>
  );
}

// ------------------------------------------------------------ La fiche

/**
 * Fiche programme (7.3), gabarit commun : ouverture au nom du programme, visuel et
 * fiche, bloc propre, « Ce qui a été fait ici » (s'il y a des lignes au registre),
 * bande « Avant d'acheter », vidéos et autres programmes, bande de contact.
 */
export function FicheProgramme({ programme: p }: { programme: Programme }) {
  const autres = PROGRAMMES.filter((x) => x.slug !== p.slug).map((x) => versLien(x));
  // La vidéo du bloc qui a sa vignette en haut de page (Lac Town, visite commentée) ne
  // revient pas dans la liste « Vidéos » : un seul lien vers elle sur la page.
  const videos = p.videos.filter((v) => !(p.vignetteVideo && v === p.videoBloc));
  return (
    <>
      <Section labelledBy="t-page" rythme="aucun" className={RYTHME_OUVERTURE}>
        <PageHead
          retour={RETOUR}
          numero="01"
          titre={p.nom}
          titreId="t-page"
          sousTitre={p.aussi ? <TexteFait fait={p.aussi} /> : undefined}
          intro={<Intro p={p} />}
        />
        {p.slug === "lac-town" ? <HautLac p={p} /> : null}
        {p.slug === "sakina-city" ? (
          <>
            <HautSakina p={p} />
            <PropreSakina p={p} />
          </>
        ) : null}
        {p.slug === "sicap-keur-massar" ? (
          <>
            <HautSkm p={p} />
            <PropreSkm p={p} />
          </>
        ) : null}
      </Section>

      {/* Ne rend rien quand aucune ligne du registre n'est rattachée au programme. */}
      <Registre
        lignes={lignesDuProgramme(p.slug)}
        id="fait-ici"
        titre="Ce qui a été fait ici"
        titreId="t-fait-ici"
        intro="Chaque ligne renvoie à sa publication d’origine."
      />

      <BandeAvantAchat videos={videos} autres={autres} />

      {/* Même message que le bouton de la fiche : même libellé. */}
      <ContactBand message={p.message} bouton={p.bouton} />
    </>
  );
}
