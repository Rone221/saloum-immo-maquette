// Acheter depuis l'étranger, direction v4 « Du plan au terrain »
// (recherche/revue-4/direction-v4.md, section 6). La page suit l'acheteur, de son écran
// au terrain : quatre étapes, quatre sections, chacune dans la forme que sa pièce
// demande. Les fonds font le même chemin : le bleu de plan pour ce qu'on regarde de
// loin, la latérite pour la visite, quand on a les pieds sur le terrain.
// 01. L'ouverture, sur le sable à croisillons : le titre, le risque nommé avec les mots
//     de l'acheteur, puis le tracé des quatre étapes, quatre bornes sur un axe. Chaque
//     borne porte le numéro de sa section et y mène.
// 02. Écrire, sur le calque : le message prêt, écrit en grand, le bouton WhatsApp de la
//     diaspora qui l'envoie, puis le numéro au format international.
// 03. Regarder, sur la planche au bleu : la collaboratrice sur un lot, image tirée de sa
//     vidéo, puis ses deux vidéos en lignes.
// 04. Faire vérifier, sur le sable à croisillons : les trois papiers en corps croissants,
//     chacun sur son trait (pointillé, tirets, plein entre deux bornes), puis le NICAD.
// 05. Visiter, sur la latérite : trois photos de visites, en petit.
// 06. L'appel final. Le pied suit, dans le layout.
//
// Les bornes se suivent de 01 à 06 : jamais deux fonds sombres de suite, toujours du
// clair entre le bleu de plan et la latérite.
// Photos : ig-DfAoxMkAbKR (aussi sur la fiche Sicap Keur Massar : deux pages), 2388,
// 2491 et 2509 (ici seulement). Ni 2333 ni l'image du NICAD : l'accueil les montre
// déjà, et l'image du NICAD sert aussi sur Foncier.
// Trois vidéos : la collaboratrice (avec son image), la visite de Lac Town et le NICAD.

import type { Metadata } from "next";
import { AppelFinal } from "@/components/appel-final";
import { Borne } from "@/components/borne";
import { BoutonWhatsApp } from "@/components/boutons";
import { CarteVideo } from "@/components/carte-video";
import { EnTete } from "@/components/en-tete";
import { EnTeteSection } from "@/components/en-tete-section";
import { MessagePret } from "@/components/message-pret";
import { TitreCote } from "@/components/mot-cote";
import { LegendePhoto, Photo, cadreNaturel, ratio, sizesRecadree } from "@/components/photo";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { DOCUMENTS, type Document } from "@/content/foncier";
import { LIBELLES } from "@/content/messages";
import {
  APPEL,
  ARIA_ETAPES,
  ARIA_PAPIERS,
  CLE_NIVEAU,
  CLE_NUMERO,
  EN_TETE,
  ETAPES,
  LEGENDE_COLLABORATRICE,
  LEGENDE_VISITES,
  LIEUX,
  MESSAGES_PRETS,
  NOTE_PAPIERS,
  OUVERTURE,
  VIDEOS_DIASPORA,
  VISITES,
  type EtapeDiaspora,
} from "@/content/pages/diaspora";
import { DIASPORA } from "@/content/services";
import { MOBILE } from "@/content/site";
import { VIDEOS, type CleVideo } from "@/content/videos";
import { cx } from "@/lib/base";
import { CHAPEAU, SOUS_BORNE, T2 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { metaPage } from "@/lib/meta";

export const metadata: Metadata = metaPage(
  DIASPORA.titre,
  "Acheter un terrain au Sénégal depuis l’étranger : faites vérifier avec Saloum Immo le véritable propriétaire, le NICAD, et qu’il n’y a pas de vente multiple. Tout commence sur WhatsApp.",
);

const [ECRIRE, REGARDER, VERIFIER, VISITER] = ETAPES;

/**
 * Le message prêt de la page : écrit en grand dans l'étape Écrire, envoyé par ses deux
 * boutons WhatsApp. La même chaîne partout : ce qui se lit est ce qui part.
 */
const [MESSAGE] = MESSAGES_PRETS;

/**
 * Les vidéos de la page, rangées par étape. Les en-têtes de section les comptent ici :
 * celui de l'ouverture donne le total, celui de chaque étape sa part.
 */
const VIDEOS_REGARDER: CleVideo[] = [VIDEOS_DIASPORA.terrain.cle, VIDEOS_DIASPORA.visite];
const VIDEOS_VERIFIER: CleVideo[] = [VIDEOS_DIASPORA.nicad];
const NOMBRE_VIDEOS = VIDEOS_REGARDER.length + VIDEOS_VERIFIER.length;

/**
 * Au bureau, dans une section au rythme courant, une rangée de croix du fond tombe sur
 * la limite de l'en-tête de section (croix de 140 à 149 px du haut, limite à 142 px) :
 * la limite semble porter des crans. Section décale donc le motif de quatre modules
 * (32 px) vers le bas, pour toutes les pages : la limite passe entre deux rangées.
 * Regarder le décale vers le haut : vers le bas, une rangée touchait presque le haut de
 * l'image, puis le bas de la planche.
 * Sous 1 101 px et dans l'ouverture, les marges sont autres : rien ne se touche.
 */
const CROIX = {
  regarder: "desk:[background-position:50%_-32px]",
};

/** « 1 message prêt », « 2 vidéos » : une quantité d'en-tête, accordée. */
const compte = (n: number, un: string, plusieurs: string) => `${n} ${n > 1 ? plusieurs : un}`;

/**
 * La borne d'une étape. L'ouverture porte la borne 01 : la première étape ouvre la
 * section 02. Le tracé de l'ouverture et les en-têtes de section comptent pareil.
 */
const borne = (rang: number) => String(rang + 2).padStart(2, "0");

/** Le titre d'une étape, avec son mot coté. */
function TitreEtape({ etape, id, className }: { etape: EtapeDiaspora; id: string; className?: string }) {
  return (
    <h2 id={id} className={cx(T2, className)}>
      <TitreCote texte={etape.titre} mot={etape.mot} basse={etape.basse} />
    </h2>
  );
}

/** Les phrases d'une étape, à la suite : un fait par phrase (content/pages/diaspora.ts). */
const phrases = (etape: EtapeDiaspora) => typo(etape.texte.map((t) => t.texte).join(" "));

/**
 * Le tracé des étapes : quatre bornes sur un axe en trait mixte, du premier message à
 * la visite. C'est le sommaire de la page, dit avec les pièces du plan : chaque borne
 * porte le numéro de sa section, et y mène. L'axe se tire une fois, à l'arrivée ; il
 * finit sur une borne, comme la limite d'un en-tête de section. Rien d'autre n'est
 * tracé : l'axe et ses bornes suffisent.
 *
 * Sous 1 101 px, le même tracé descend : l'axe est vertical, les bornes s'empilent, et
 * chaque étape dit son lieu au bout de sa ligne (de loin, sur place). Au bureau, le lieu
 * reste lu dans chaque lien.
 */
function Trace() {
  return (
    <nav aria-label={typo(ARIA_ETAPES)} className="relative mt-12 desk:mt-16">
      <span aria-hidden="true" className="trait-mixte-v absolute top-6 bottom-6 left-[13.5px] w-px text-(--r-axe) desk:hidden" />
      <span
        aria-hidden="true"
        className="se-tire-arrivee trait-mixte absolute top-[13.5px] right-[7px] left-0 hidden h-px text-(--r-axe) [--delai:0.6s] desk:block"
      />
      <span aria-hidden="true" className="absolute top-[10.5px] right-0 hidden size-[7px] border border-encre bg-blanc desk:block" />
      {/* En colonne, 384 px au plus : le lieu reste près de son étape. */}
      <ol className="relative m-0 grid max-w-[24rem] list-none p-0 desk:max-w-none desk:grid-cols-4">
        {ETAPES.map((e, i) => (
          <li key={e.piece}>
            {/* Au bureau, le lien ne prend que sa borne et son nom : le contour du focus
                ne touche pas la borne suivante. Lu d'un trait : « 02 Écrire, De loin ». */}
            <a
              href={`#borne-${borne(i)}`}
              className="group flex min-h-12 items-center gap-x-3.5 desk:min-h-0 desk:w-fit desk:flex-col desk:items-start desk:gap-y-4"
            >
              <Borne numero={borne(i)} className="transition-surface group-hover:border-accent" />
              <span className="sr-only"> </span>
              <span className="titre text-h3 transition-surface group-hover:text-accent">{typo(e.nom)}</span>
              <span className="sr-only">, </span>
              <span className="etiquette ml-auto bg-fond pl-2 text-accent desk:sr-only">{typo(LIEUX[e.lieu])}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Corps du nom de chaque papier : il dit l'ordre, du moins au plus protégé. */
const TAILLE_PAPIER: Record<Document["cle"], string> = {
  delib: "[--t:1.75rem] desk:[--t:clamp(1.75rem,2.2vw,2rem)]",
  bail: "[--t:2.75rem] desk:[--t:clamp(3.25rem,4.7vw,4.25rem)]",
  tf: "[--t:var(--t-tf)]",
};

/** Colonnes au bureau : le titre foncier prend la moitié de la largeur. */
const COLONNES_PAPIER: Record<Document["cle"], string> = {
  delib: "desk:col-span-3",
  bail: "desk:col-span-3",
  tf: "desk:col-span-6",
};

/**
 * Le trait de chaque papier, avec les conventions du plan (globals.css, « Traits »).
 * Pointillé : ce qui n'est pas sûr. Tirets : ce qui est en cours. Plein, 2 px, entre
 * deux bornes : ce qui est borné, acquis.
 */
const TRAIT_PAPIER: Record<Document["cle"], string> = {
  delib: "pointille h-[1.5px]",
  bail: "tirets h-[1.5px]",
  tf: "h-0.5 bg-current",
};

/** Une borne vue d'en haut : la face blanche, le filet d'encre. */
const BORNE_VUE = "size-[11px] flex-none border-[1.5px] border-encre bg-blanc";

/**
 * Les trois papiers (l'échelle de l'accueil et de la page Foncier, sans ses
 * définitions) : délibération, bail, titre foncier, en corps croissants, sur une même
 * ligne de base au bureau, empilés dessous. La ligne change de trait d'un papier à
 * l'autre et dit le niveau publié ; le niveau reste écrit dessous. Les définitions sont
 * sur la page Foncier : ici, l'acheteur apprend seulement qu'il y a trois papiers, et
 * lequel protège le plus.
 *
 * Les trois mots partagent leur ligne de base : dans une boîte d'un cadratin, le Besley
 * pose la sienne à 0,09 em du bas (globals.css, « Le mot coté »). Un petit corps
 * remonte de 0,09 fois l'écart avec le corps du titre foncier.
 */
function Papiers({ className }: { className?: string }) {
  return (
    <ol
      aria-label={typo(ARIA_PAPIERS)}
      className={cx(
        "m-0 grid list-none gap-y-10 p-0 [--t-tf:clamp(2.75rem,14.4vw,3.75rem)] desk:grid-cols-12 desk:gap-x-6 desk:gap-y-0 desk:[--t-tf:clamp(5rem,7.4vw,6.75rem)]",
        className,
      )}
    >
      {DOCUMENTS.map((d, i) => {
        const bornee = d.cle === "tf";
        return (
          <li key={d.cle} className={cx("flex flex-col", TAILLE_PAPIER[d.cle], COLONNES_PAPIER[d.cle])}>
            <div className="desk:flex desk:h-(--t-tf) desk:items-end">
              <h3 className="titre text-(length:--t) leading-none desk:mb-[calc((var(--t-tf)-var(--t))*0.09)]">{typo(d.nom)}</h3>
            </div>
            {/* Au bureau, le trait court jusqu'au papier suivant, à travers la gouttière :
                une seule ligne pour les trois. */}
            <div
              aria-hidden="true"
              className={cx("se-tire mt-2 flex h-[11px] items-center text-fort", i < DOCUMENTS.length - 1 && "desk:-mr-6")}
            >
              <span className={bornee ? BORNE_VUE : "h-full w-[1.5px] flex-none bg-current"} />
              <span className={cx("flex-1", TRAIT_PAPIER[d.cle])} />
              {bornee ? <span className={BORNE_VUE} /> : null}
            </div>
            <dl className="m-0 mt-4 desk:mt-5">
              <dt className="etiquette text-doux">{typo(CLE_NIVEAU)}</dt>
              <dd className="m-0 mt-1 font-semibold text-fort">{typo(d.niveau.texte)}</dd>
            </dl>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Les trois photos de visites, chacune dans son format (deux portraits de 810 px, un
 * paysage de 1 000 px), jamais recadrées. En petit : ce sont des visages de visiteurs.
 * Dès 480 px, les trois sur une rangée, à la même hauteur : le paysage y fait 302 px de
 * large au plus. Dessous, les deux portraits côte à côte, puis le paysage, 440 px de
 * large au plus. Une seule légende pour les trois.
 */
function Visites({ className }: { className?: string }) {
  return (
    <figure className={cx("m-0 max-w-[42rem]", className)}>
      <div className="grid grid-cols-2 gap-3 min-[480px]:flex min-[480px]:items-start min-[480px]:gap-4">
        {VISITES.map((id) => {
          const r = ratio(id);
          const paysage = r > 1;
          return (
            <span
              key={id}
              className={cx("relative block overflow-hidden bg-attente", paysage && "col-span-2")}
              // Largeur proportionnelle au format, base nulle : même hauteur pour les trois.
              // flexGrow et flexBasis plutôt que le raccourci, que les garde-fous lisent
              // comme une promesse de frais nuls.
              style={{ ...cadreNaturel(id), flexGrow: r, flexBasis: 0 }}
            >
              <Photo
                id={id}
                fill
                sizes={
                  paysage
                    ? "(min-width: 761px) 302px, (min-width: 480px) 45vw, 92vw"
                    : "(min-width: 761px) 170px, (min-width: 480px) 26vw, 46vw"
                }
                className="object-cover"
              />
            </span>
          );
        })}
      </div>
      <LegendePhoto id={VISITES[0]} texte={LEGENDE_VISITES.texte} />
    </figure>
  );
}

export default function Diaspora() {
  const { cle: cleTerrain, couverture } = VIDEOS_DIASPORA.terrain;
  return (
    <>
      {/* 01. L'ouverture : le risque, puis le tracé des étapes. */}
      <Section labelledBy="t-page" rythme="ouverture" croisillons>
        <EnTete
          nom={EN_TETE.nom}
          quantite={`${compte(ETAPES.length, "étape", "étapes")} · ${compte(NOMBRE_VIDEOS, "vidéo", "vidéos")}`}
          titre={DIASPORA.titre}
          mot={EN_TETE.mot}
          basse
          chapeau={
            <>
              {typo(OUVERTURE.risque.texte)} {typo(OUVERTURE.verification.texte)}
            </>
          }
        />
        <Trace />
      </Section>

      {/* 02. Écrire : ce que la personne va envoyer, écrit en grand, sous un filet fort,
          puis le bouton qui l'envoie : le seul bouton plein avant l'appel. Dessous, le
          numéro, pour qui préfère appeler. */}
      <Section surface="calque" labelledBy="t-ecrire">
        <EnTeteSection
          numero={borne(0)}
          nom={ECRIRE.nom}
          quantite={compte(MESSAGES_PRETS.length, "message prêt", "messages prêts")}
        />
        <div className={cx("grid gap-y-8 desk:grid-cols-12 desk:gap-x-6", SOUS_BORNE)}>
          <div className="desk:col-span-5">
            <TitreEtape etape={ECRIRE} id="t-ecrire" />
            <p className={cx(CHAPEAU, "mt-5 max-w-[32rem] desk:mt-6")}>{phrases(ECRIRE)}</p>
          </div>
          <div className="apparait max-w-[36rem] border-t border-fort pt-6 desk:col-span-5 desk:col-start-8 desk:max-w-none desk:pt-7">
            <MessagePret message={MESSAGE} />
            <div className="mt-6 flex flex-col items-start gap-y-4 desk:mt-8">
              <BoutonWhatsApp label={LIBELLES.diaspora} message={MESSAGE.texte} />
              {/* Le lien prend la clé et le numéro : 44 px de haut au moins, et le contour
                  du focus entoure les deux. Lu d'un trait : « Depuis n'importe quel pays,
                  +221 77 400 75 75 ». */}
              <a href={MOBILE.href} className="group flex min-h-11 flex-col justify-center">
                <span className="etiquette text-doux">{typo(CLE_NUMERO.texte)}</span>
                <span className="sr-only">, </span>
                <span className="mesure text-chapeau whitespace-nowrap text-fort underline decoration-1 underline-offset-[0.2em] transition-surface group-hover:text-accent group-hover:decoration-2">
                  {typo(MOBILE.long)}
                </span>
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* 03. Regarder, sur la planche au bleu. `group/videos` : survoler l'image allume
          le titre de sa vidéo. Au bureau, la figure se défait (contents) : le cadre tient
          les deux premières rangées, les vidéos se calent sur son bord bas, la légende
          vient dessous. */}
      <Section surface="plan" labelledBy="t-regarder" croisillons className={CROIX.regarder}>
        <EnTeteSection numero={borne(1)} nom={REGARDER.nom} quantite={compte(VIDEOS_REGARDER.length, "vidéo", "vidéos")} />
        <div
          className={cx(
            "group/videos grid gap-y-8 desk:grid-cols-12 desk:grid-rows-[auto_1fr_auto] desk:gap-x-6 desk:gap-y-0",
            SOUS_BORNE,
          )}
        >
          <div className="desk:col-span-5 desk:col-start-8 desk:row-start-1">
            <TitreEtape etape={REGARDER} id="t-regarder" />
            <p className={cx(CHAPEAU, "mt-5 max-w-[32rem] desk:mt-6")}>{phrases(REGARDER)}</p>
          </div>
          {/* 899 px de large, 16:9. Dans un cadre 4:3 de 672 px au plus, l'image est
              dessinée par sa hauteur : 896 px, et son logo incrusté sort du cadre. Bord à
              bord tant que l'écran ne dépasse pas ces 672 px. */}
          <figure className="m-0 -mx-gutter max-w-[42rem] min-[673px]:mx-0 desk:contents">
            <span
              data-bascule=""
              className="apparait bascule relative block aspect-[4/3] overflow-hidden bg-attente desk:col-span-6 desk:col-start-1 desk:row-span-2 desk:row-start-1"
            >
              <Photo
                id={couverture}
                fill
                sizes={sizesRecadree(couverture, 4 / 3, "(min-width: 1440px) 668px, (min-width: 1101px) 46vw, (min-width: 673px) 672px, 100vw")}
                className="object-cover"
              />
              {/* L'image se clique aussi, à la souris : le lien de la vidéo est son titre,
                  dans la liste. Celui-ci le double sans rien ajouter au clavier ni à un
                  lecteur d'écran. */}
              <a href={VIDEOS[cleTerrain].href} tabIndex={-1} aria-hidden="true" data-couverture="" className="absolute inset-0" />
            </span>
            <LegendePhoto
              id={couverture}
              texte={LEGENDE_COLLABORATRICE.texte}
              className="px-gutter text-balance min-[673px]:px-0 desk:col-span-6 desk:col-start-1 desk:row-start-3"
            />
          </figure>
          <ul className="apparait m-0 max-w-[42rem] list-none self-end border-b border-ligne p-0 [--rang:1] desk:col-span-5 desk:col-start-8 desk:row-start-2 desk:max-w-none">
            {VIDEOS_REGARDER.map((cle) => (
              <li key={cle}>
                <CarteVideo
                  cle={cle}
                  className={cx("text-fort", cle === cleTerrain && "group-has-[[data-couverture]:hover]/videos:text-accent")}
                />
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 04. Faire vérifier : les trois papiers, puis le NICAD. */}
      <Section labelledBy="t-verifier" croisillons>
        <EnTeteSection
          numero={borne(2)}
          nom={VERIFIER.nom}
          quantite={`${compte(DOCUMENTS.length, "document", "documents")} · ${compte(VIDEOS_VERIFIER.length, "vidéo", "vidéos")}`}
        />
        <div className={cx("grid gap-y-5 desk:grid-cols-12 desk:items-end desk:gap-x-6", SOUS_BORNE)}>
          {/* Deux lignes, comme les autres titres d'étape : il se cale en haut du chapeau. */}
          <TitreEtape etape={VERIFIER} id="t-verifier" className="max-w-[10em] desk:col-span-7" />
          <p className={cx(CHAPEAU, "max-w-[36rem] desk:col-span-5 desk:col-start-8")}>{phrases(VERIFIER)}</p>
        </div>
        <Papiers className="apparait mt-12 desk:mt-16" />
        <div className="mt-10 grid gap-y-6 desk:mt-14 desk:grid-cols-12 desk:gap-x-6">
          {/* Au bureau, la première ligne de la note est à la hauteur du titre de la vidéo. */}
          <div className="desk:col-span-6 desk:pt-3.5">
            <p>{typo(NOTE_PAPIERS.texte)}</p>
            <TextLink href="/foncier/">Comprendre le foncier</TextLink>
          </div>
          <div className="max-w-[42rem] border-b border-ligne desk:col-span-5 desk:col-start-8 desk:max-w-none desk:self-start">
            {VIDEOS_VERIFIER.map((cle) => (
              <CarteVideo key={cle} cle={cle} />
            ))}
          </div>
        </div>
      </Section>

      {/* 05. Visiter, sur la latérite : on a les pieds sur le terrain. */}
      <Section surface="laterite" labelledBy="t-visiter">
        {/* Ce qui se compte, ce sont les photos : rien ne dit qu'il y a autant de visites. */}
        <EnTeteSection numero={borne(3)} nom={VISITER.nom} quantite={`${compte(VISITES.length, "photo", "photos")} de visites`} />
        <div className={cx("grid gap-y-8 desk:grid-cols-12 desk:gap-x-6", SOUS_BORNE)}>
          <div className="desk:col-span-5">
            <TitreEtape etape={VISITER} id="t-visiter" />
            <p className={cx(CHAPEAU, "mt-5 max-w-[30rem] desk:mt-6")}>{phrases(VISITER)}</p>
          </div>
          <Visites className="apparait desk:col-span-6 desk:col-start-7" />
        </div>
      </Section>

      {/* 06. L'appel final. */}
      <AppelFinal
        numero="06"
        nom={APPEL.nom}
        phrase={APPEL.phrase}
        mot={APPEL.mot}
        bouton={<BoutonWhatsApp label={LIBELLES.diaspora} message={MESSAGE.texte} />}
      />
    </>
  );
}
