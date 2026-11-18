// À propos, direction v4 « Du plan au terrain » (recherche/revue-4/direction-v4.md,
// section 6). Qui vend et qui aménage : un homme, une société, une équipe, un ouvrage.
// Cinq pièces, chacune dans la forme que son métier demande, et les fonds alternent
// (jamais deux sombres de suite, du clair entre la planche au bleu et le pied) :
// 01. L'ouverture, sur le sable à croisillons : le titre et son mot coté (le nom du
//     fondateur), le chapeau, l'interview en lien. En face, le buste tiré de cette
//     interview.
// 02. Le parcours, sur le calque : un registre. Le moment en marge, dans la voix des
//     mesures. Sans cote : sous un mot qui n'est pas une mesure, elle ne mesurait rien.
// 03. L'entreprise, sur le sable : la phrase de l'équipe en titre, la photo des gilets,
//     et le cartouche de la société, comme au bas d'un plan. La raison sociale en grand.
// 04. Millennium City, sur la planche au bleu : la photo en grand, puis la phrase
//     d'attribution de registre.ts, entière. Jamais « notre programme ».
// 05. L'appel final. Le pied suit, dans le layout.
//
// Photos : ig-DZUeyGKPdj_-buste (aussi sur l'accueil : deux pages, pas une de plus),
// 2499 (seule de son groupe), 2537. Le buste fait 540 × 405 : cadre 4:5 de 324 px au
// plus dès 761 px (dessiné à 540 px) ; dessous, un cadre carré qui prend la colonne,
// 405 px au plus (dessiné à 540 px au plus). 2499 fait 810 px de large : cadre de
// 340 px au plus dès 761 px, la colonne dessous.

import type { Metadata } from "next";
import { AppelFinal } from "@/components/appel-final";
import { BoutonWhatsApp } from "@/components/boutons";
import { LienVideo } from "@/components/carte-video";
import { CaseCartouche, Cartouche } from "@/components/cartouche";
import { EnTeteSection } from "@/components/en-tete-section";
import { TitreCote } from "@/components/mot-cote";
import { CadrePhoto, LegendePhoto, Photo, sizesRecadree } from "@/components/photo";
import { PhraseMesuree } from "@/components/phrase-mesuree";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { LIBELLES, MESSAGES } from "@/content/messages";
import { APPEL, CARTOUCHE, EQUIPE, MILLENNIUM, OUVERTURE, PARCOURS, PARCOURS_SECTION, SOURCE_PARCOURS } from "@/content/pages/a-propos";
import { type PhotoId } from "@/content/photos";
import { MILLENNIUM_CITY } from "@/content/registre";
import { FONDATEUR } from "@/content/site";
import { VIDEOS } from "@/content/videos";
import { cx } from "@/lib/base";
import { CHAPEAU, NOTE, SOUS_BORNE, T1, T2 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { metaPage } from "@/lib/meta";

export const metadata: Metadata = metaPage(
  "À propos",
  "Babacar Ndiaye, fondateur et directeur général de Saloum Immo : son parcours, l’entreprise, son équipe, et la canalisation de Millennium City.",
);

/** Le buste, recadré dans l'interview : 540 × 405, jamais agrandi. */
const BUSTE: PhotoId = "ig-DZUeyGKPdj_-buste";
/** L'équipe en gilets : 810 px de large, un cadre de 340 px au plus. */
const EQUIPE_PHOTO: PhotoId = "2499";

/** Un titre ne porte pas de point final : la phrase du contenu perd le sien. */
const sansPoint = (texte: string) => texte.replace(/\.$/, "");

/**
 * Le buste : un cadre carré sous 761 px, qui prend la largeur de la colonne (405 px au
 * plus, dessiné à 540), puis le 4:5 de 324 px. Le carré n'agrandit jamais le fichier.
 */
const SIZES_BUSTE = `${sizesRecadree(BUSTE, 4 / 5, "(min-width: 761px) 324px")}, ${sizesRecadree(BUSTE, 1, "90vw")}`;

export default function APropos() {
  const interview = VIDEOS.interviewDG;
  return (
    <>
      {/* 01. L'ouverture. Le titre à gauche, le buste en face, dans sa largeur : 324 px,
          la colonne de droite ne tombe pas sur les douze colonnes de la page. Sur
          mobile, le buste vient après le texte. */}
      <Section labelledBy="t-page" rythme="ouverture" croisillons>
        <EnTeteSection numero="01" nom={OUVERTURE.nom} arrivee />
        <div
          className={cx(
            "grid gap-y-10 desk:grid-cols-[minmax(0,1fr)_20.25rem] desk:gap-x-[clamp(4rem,8vw,8.5rem)]",
            SOUS_BORNE,
          )}
        >
          <div>
            <h1 id="t-page" className={cx(T1, "max-w-[54rem]")}>
              <TitreCote texte={OUVERTURE.titre.texte} mot={OUVERTURE.mot} basse arrivee />
            </h1>
            {/* La cote du nom passe sous ses jambages : un peu plus d'air avant le chapeau. */}
            <p className={cx(CHAPEAU, "mt-8 max-w-[36rem] desk:mt-10")}>{typo(FONDATEUR.enVideo.texte)}</p>
            {/* La vidéo dont parle le chapeau. */}
            <LienVideo cle="interviewDG" className="mt-4 desk:mt-5" />
          </div>

          <figure className="m-0 max-w-[25.3125rem] tab:max-w-[20.25rem]">
            <span className="relative block aspect-square overflow-hidden bg-attente tab:aspect-[4/5]">
              <Photo id={BUSTE} fill preload sizes={SIZES_BUSTE} className="object-cover" />
              {/* Le buste se clique aussi, à la souris : le lien de l'interview est à
                  côté, en texte. Celui-ci le double, sans rien ajouter au clavier ni à un
                  lecteur d'écran. */}
              <a href={interview.href} tabIndex={-1} aria-hidden="true" className="absolute inset-0" />
            </span>
            <LegendePhoto id={BUSTE} className="text-balance" />
          </figure>
        </div>
      </Section>

      {/* 02. Le parcours, en registre. Une liste de définitions : le moment, puis ce
          qu'il y fait. Au bureau, le moment tient quatre colonnes, la phrase sept. */}
      <Section surface="calque" labelledBy="t-parcours">
        <EnTeteSection numero="02" nom={PARCOURS_SECTION.nom} quantite={`${PARCOURS.length} étapes`} />
        <h2 id="t-parcours" className={cx(T2, SOUS_BORNE)}>
          <TitreCote texte={PARCOURS_SECTION.titre.texte} mot={PARCOURS_SECTION.mot} />
        </h2>
        <dl className="m-0 mt-10 border-t border-fort desk:mt-14">
          {PARCOURS.map((l, i) => (
            <div
              key={l.quand}
              className={cx(
                "apparait grid gap-y-4 border-b border-ligne py-7 desk:grid-cols-12 desk:items-baseline desk:gap-x-6 desk:py-9",
                i % 2 === 1 && "[--rang:1]",
              )}
            >
              <dt className="mesure text-[1.625rem] leading-none whitespace-nowrap text-fort desk:col-span-4 desk:text-[2rem]">
                {typo(l.quand)}
              </dt>
              <dd className="m-0 max-w-[40rem] text-chapeau desk:col-span-8">{typo(l.texte.texte)}</dd>
            </div>
          ))}
        </dl>
        {/* Au bas du registre, comme au bas d'un plan : la source. */}
        <p className={cx(NOTE, "mt-4")}>{typo(SOURCE_PARCOURS.texte)}</p>
      </Section>

      {/* 03. L'entreprise. La phrase de l'équipe en titre ; la photo des gilets à gauche,
          sur les deux rangées ; le cartouche de la société au pied de la photo, comme
          au bas d'un plan. Sur mobile : le titre, la photo, le cartouche. */}
      <Section labelledBy="t-entreprise" croisillons>
        <EnTeteSection numero="03" nom={EQUIPE.nom} />
        <div
          className={cx(
            "grid gap-y-8 desk:grid-cols-[21.25rem_minmax(0,1fr)] desk:grid-rows-[auto_1fr] desk:gap-x-[clamp(4rem,8vw,8.5rem)] desk:gap-y-10",
            SOUS_BORNE,
          )}
        >
          <h2 id="t-entreprise" className={cx(T2, "max-w-[15em] desk:col-start-2 desk:row-start-1")}>
            <TitreCote texte={sansPoint(EQUIPE.texte.texte)} mot={EQUIPE.mot} basse />
          </h2>

          {/* Portrait 3:4, comme le fichier : rien n'est recadré. La légende dit l'objet ;
              « sur un de nos chantiers », la nature de la photo le dit à droite. */}
          <CadrePhoto
            id={EQUIPE_PHOTO}
            ratio="aspect-[3/4]"
            sizes="(min-width: 761px) 340px, 90vw"
            texteLegende={EQUIPE.legendeCourte}
            className="apparait tab:max-w-[21.25rem] [&_figcaption]:text-balance desk:col-start-1 desk:row-span-2 desk:row-start-1"
          />

          {/* Au bureau, le pied du cartouche est celui de la photo : la marge du bas vaut la
              hauteur de la légende (son air, puis ses deux lignes). */}
          {/* Deux colonnes, puis trois dès 1 281 px : le titre du film tient alors sur une
              ligne dans sa case. */}
          <Cartouche
            aria-label="Saloum Immo"
            className="apparait self-end [--rang:1] tab:grid-cols-2 wide:grid-cols-[max-content_minmax(0,1fr)_minmax(0,1.3fr)] desk:col-start-2 desk:row-start-2 desk:mb-[2.6875rem]"
          >
            {CARTOUCHE.map((l) =>
              l.reference ? (
                // La référence de la société, en grand, sur toute la largeur du cartouche.
                // Elle ne se coupe pas : sa taille suit la largeur de l'écran.
                <CaseCartouche key={l.cle} cle={l.cle} className="tab:col-span-2 wide:col-span-3">
                  <span className="mesure block text-[clamp(1.0625rem,4.6vw,1.75rem)] leading-[1.15] text-fort desk:text-[clamp(1.5rem,2.55vw,2.25rem)]">
                    {typo(l.valeur.texte)}
                  </span>
                </CaseCartouche>
              ) : (
                <CaseCartouche key={l.cle} cle={l.cle}>
                  {typo(l.valeur.texte)}
                </CaseCartouche>
              ),
            )}
            {/* Le film où l'entreprise se présente : un lien et sa durée, sans couverture.
                L'image tirée de ce film sert déjà sur l'accueil : une photo hors programme
                vit sur deux pages au plus. */}
            <CaseCartouche cle={EQUIPE.cleFilm} className="tab:col-span-2 wide:col-span-1">
              <LienVideo cle="presentation" />
            </CaseCartouche>
          </Cartouche>
        </div>
      </Section>

      {/* 04. Millennium City, sur la planche au bleu : la photo en grand, puis la phrase
          d'attribution, entière. Le rond-point et son nom au centre du cadre. Sur mobile,
          le cadre 4:3 est moins large que la photo (3:2) : elle y est dessinée par sa
          hauteur, à 113 % de l'écran. */}
      <Section surface="plan" labelledBy="t-millennium" croisillons>
        {/* Pas de quantité : compter un ouvrage ne dit rien, et les dates de la phrase
            sont celles du projet, pas de la pose. La limite va au bord. */}
        <EnTeteSection numero="04" nom={MILLENNIUM.nom} />
        <h2 id="t-millennium" className={cx(T2, SOUS_BORNE, "max-w-[14em]")}>
          <TitreCote texte={MILLENNIUM.titre} mot={MILLENNIUM.mot} />
        </h2>
        <CadrePhoto
          id={MILLENNIUM_CITY.photo}
          bascule
          bord
          ratio="aspect-[4/3] tab:aspect-[16/9] desk:aspect-[2/1]"
          position="50% 56%"
          sizes="(min-width: 1440px) 1360px, (min-width: 761px) 100vw, 113vw"
          texteLegende={MILLENNIUM.legende}
          className="apparait mt-10 desk:mt-14"
        />
        <div className="mt-10 grid gap-y-5 desk:mt-12 desk:grid-cols-12 desk:items-end desk:gap-x-6">
          <p className={cx(CHAPEAU, "max-w-[44rem] desk:col-span-8")}>
            <PhraseMesuree texte={MILLENNIUM_CITY.texte.texte} />
          </p>
          <TextLink href="/amenager/#travaux" className="desk:col-span-4 desk:justify-self-end">
            {MILLENNIUM.suite}
          </TextLink>
        </div>
      </Section>

      {/* 05. L'appel final. */}
      <AppelFinal
        numero="05"
        nom={APPEL.nom}
        phrase={APPEL.phrase}
        mot={APPEL.mot}
        bouton={<BoutonWhatsApp label={LIBELLES.question} message={MESSAGES.question.texte} />}
      />
    </>
  );
}
