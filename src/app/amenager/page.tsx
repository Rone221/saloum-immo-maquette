// Aménager votre terrain, direction v4 « Du plan au terrain »
// (recherche/revue-4/direction-v4.md, section 6) : la page des propriétaires, et des
// acheteurs qui veulent savoir ce qu'il y a dans le sol. Chaque section prend la forme
// de la pièce qu'elle montre, et la page tient le rythme des fonds (jamais deux sombres
// de suite, du clair entre le bleu de plan et la latérite) :
// 01. L'ouverture, sur le sable à croisillons : le titre et son mot coté, le fait que
//     porte la page, un bouton vers la phrase à trous, et le cartouche de la page (ses
//     travaux, son papier, ses chantiers datés).
// 02. Les étapes, sur la planche au bleu : la méthode en grand. À gauche le terrain,
//     chaque étape avec ses photos ; à droite le plan, la coupe d'une voie, collée, qui
//     se construit avec l'étape lue. Le titre foncier ferme la liste.
// 03. La vue d'ensemble, sur le calque : 2540, un lotissement aménagé vu d'en haut,
//     entre ses quatre repères de cadrage. Sans titre : une planche. Dans le conteneur,
//     comme les autres grandes photos ; bord à bord sur téléphone.
// 04. Les sources des chantiers datés, en tableau (#travaux : l'accueil et À propos y
//     renvoient). Le journal en grands chiffres reste à l'accueil.
// 05. Les propriétaires, sur la latérite, la seule fois de la page : la question, puis
//     la phrase à trous. Deux champs sur une cote, et le bouton ouvre WhatsApp avec la
//     phrase remplie.
// 06. La suite : les services que les étapes ne disent pas, en deux phrases.
// 07. L'appel final, pour qui cherche un terrain déjà aménagé. Le pied suit, dans le
//     layout.
//
// Les bornes des en-têtes de section se suivent de 01 à 07.
// Photos : 2495, 2502, 2528, 2542, 2355, 2517, 2519 (étapes), 2540 (vue d'ensemble). 2528,
// 2542 et 2355 sont aussi sur l'accueil, cadrées autrement : deux pages chacune, pas plus.
// 2540 est du même lotissement que 2538 (accueil seulement) : jamais de nom de lieu.
// Aucune photo d'étape dans la section des sources : 2355 n'y côtoie pas les 58 parcelles.

import type { Metadata } from "next";
import { PlancheEtapes } from "@/components/amenager-etapes";
import { AppelFinal } from "@/components/appel-final";
import { Bouton, BoutonWhatsApp } from "@/components/boutons";
import { CaseCartouche, Cartouche } from "@/components/cartouche";
import { EnTeteSection } from "@/components/en-tete-section";
import { TitreCote } from "@/components/mot-cote";
import { LegendePhoto, Photo } from "@/components/photo";
import { PhraseATrous } from "@/components/phrase-a-trous";
import { PhraseMesuree } from "@/components/phrase-mesuree";
import { SourcesTravaux } from "@/components/registre-travaux";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { LIBELLES, MESSAGES } from "@/content/messages";
import {
  APPEL,
  CARTOUCHE,
  MOTS,
  OUVERTURE,
  PROPRIETAIRES,
  SECTIONS,
  SOURCES,
  SUITE_MAISON,
  TITRES,
  VUE,
} from "@/content/pages/amenager";
import { QUESTION_PROPRIETAIRES } from "@/content/services";
import { cx } from "@/lib/base";
import { CHAPEAU, NOTE, SOUS_BORNE, T1, T2 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { metaPage } from "@/lib/meta";
import "./amenager.css";

export const metadata: Metadata = metaPage(
  OUVERTURE.titre,
  "Saloum Immo aménage les terrains qu’il vend et ceux des propriétaires : terrassement, bornage, voies en latérite, eau avec SEN’EAU, électricité. Les étapes en photos, les chantiers datés avec leurs sources.",
);

/** L'ancre du bloc des propriétaires : le bouton de l'ouverture y mène. */
const ANCRE_PROPRIETAIRES = "proprietaires";

/** Les quatre repères de cadrage de la vue d'ensemble, un par angle. */
const ANGLES = ["hg", "hd", "bg", "bd"] as const;

/**
 * Largeur dessinée de la vue d'ensemble (amenager.css, « La vue d'ensemble »). Sur
 * téléphone, le cadre 4:5 est plus haut que la photo n'est large : elle est dessinée par
 * sa hauteur, 1,88 fois la largeur de l'écran. Dès 761 px, elle prend la largeur du
 * conteneur.
 */
const SIZES_VUE =
  "(min-width: 1440px) 1360px, (min-width: 1101px) calc(100vw - 80px), (min-width: 761px) calc(100vw - 56px), 188vw";

/** Le bouton WhatsApp des propriétaires, avec son message prêt : celui de toutes les pages. */
function BoutonProprietaire({ className }: { className?: string }) {
  return <BoutonWhatsApp className={className} label={LIBELLES.proprietaire} message={MESSAGES.proprietaire.texte} />;
}

export default function Amenager() {
  const phrase = PROPRIETAIRES.phrase;
  return (
    <>
      {/* 01. L'ouverture : les pièces de toute ouverture de page (components/en-tete.tsx),
          posées sur deux colonnes au bureau. À gauche, le titre, le chapeau et le
          bouton ; à droite, calé sur le pied du bouton, le cartouche de la page. Le
          bouton ne sort pas de la page : il descend à la phrase à trous, pour qui vient
          décrire son terrain sans lire toute la méthode. */}
      <Section labelledBy="t-page" rythme="ouverture" croisillons>
        <EnTeteSection numero="01" nom={OUVERTURE.nom} quantite={OUVERTURE.quantite} arrivee />
        <div className={cx("grid gap-y-10 desk:grid-cols-12 desk:items-end desk:gap-x-6", SOUS_BORNE)}>
          <header className="desk:col-span-7">
            <h1 id="t-page" className={T1}>
              <TitreCote texte={OUVERTURE.titre} mot={OUVERTURE.mot} arrivee />
            </h1>
            <p className={cx(CHAPEAU, "mt-5 max-w-[36rem] desk:mt-7")}>{typo(OUVERTURE.chapeau.texte)}</p>
            <div className="mt-8 desk:mt-10">
              <Bouton href={`#${ANCRE_PROPRIETAIRES}`}>{OUVERTURE.bouton}</Bouton>
            </div>
          </header>
          <Cartouche aria-label={typo(CARTOUCHE.nom)} className="tab:max-w-[36rem] desk:col-span-5 desk:max-w-none">
            {CARTOUCHE.cases.map((c) => (
              <CaseCartouche key={c.cle} enLigne cle={c.cle}>
                <PhraseMesuree texte={c.valeur.texte} />
              </CaseCartouche>
            ))}
          </Cartouche>
        </div>
      </Section>

      {/* 02. Les étapes : la méthode en grand, sur la planche au bleu. */}
      <Section id="etapes" surface="plan" labelledBy="t-etapes" croisillons>
        <EnTeteSection numero="02" nom={SECTIONS.etapes.nom} quantite={SECTIONS.etapes.quantite} />
        <h2 id="t-etapes" className={cx(T2, SOUS_BORNE, "max-w-[14em]")}>
          <TitreCote texte={TITRES.etapes} mot={MOTS.etapes} />
        </h2>
        <PlancheEtapes className="mt-10 desk:mt-14" />
      </Section>

      {/* 03. La vue d'ensemble : une planche, sans titre. Son en-tête de section la
          nomme (c'est lui qui nomme la section), sa légende dit ce qu'on y voit. Rien
          n'est écrit sur la photo, et rien ne la couvre : elle ne porte que ses quatre
          repères. Sur téléphone, elle va d'un bord de l'écran à l'autre et sa légende
          garde la gouttière. Dès 761 px, elle tient dans le conteneur : au bureau, la
          voie de lecture court à côté d'elle, sur le calque. */}
      <Section surface="calque" labelledBy="borne-03">
        <EnTeteSection numero="03" nom={SECTIONS.vue.nom} quantite={SECTIONS.vue.nature.texte} />
        <figure className={cx("-mx-gutter mb-0 tab:mx-0", SOUS_BORNE)}>
          <div className="amg-vue-cadre">
            <Photo id={VUE.photo} fill position={VUE.position} sizes={SIZES_VUE} className="object-cover" />
            {ANGLES.map((angle) => (
              <span key={angle} aria-hidden="true" className={`amg-repere amg-repere-${angle}`} />
            ))}
          </div>
          <LegendePhoto id={VUE.photo} className="px-gutter tab:px-0" />
        </figure>
      </Section>

      {/* 04. Les sources des chantiers datés, en tableau. Sur le sable à croisillons. */}
      <Section id="travaux" labelledBy="t-travaux" croisillons>
        <EnTeteSection numero="04" nom={SECTIONS.travaux.nom} quantite={SECTIONS.travaux.quantite} />
        <h2 id="t-travaux" className={cx(T2, SOUS_BORNE, "max-w-[14em]")}>
          <TitreCote texte={TITRES.travaux} mot={MOTS.travaux} />
        </h2>
        <SourcesTravaux labelledBy="t-travaux" className="apparait mt-10 desk:mt-14" />
        <p className={cx(NOTE, "mt-4")}>
          <PhraseMesuree texte={SOURCES.note.texte} />
        </p>
      </Section>

      {/* 05. Les propriétaires, sur l'aplat de latérite : la question, ce qu'il faut nous
          dire, puis la phrase à trous. Le titre n'a pas de mot coté : les cotes de
          l'écran sont celles des deux champs. */}
      <Section id={ANCRE_PROPRIETAIRES} surface="laterite" labelledBy="t-proprietaires">
        <EnTeteSection numero="05" nom={SECTIONS.proprietaires.nom} quantite={SECTIONS.proprietaires.quantite} />
        <div className={cx("grid gap-y-5 desk:grid-cols-12 desk:items-end desk:gap-x-6", SOUS_BORNE)}>
          <h2 id="t-proprietaires" className={cx(T2, "max-w-[12em] desk:col-span-6")}>
            {typo(QUESTION_PROPRIETAIRES)}
          </h2>
          <p className={cx(CHAPEAU, "max-w-[36rem] desk:col-span-5 desk:col-start-8")}>{typo(PROPRIETAIRES.texte.texte)}</p>
        </div>
        {phrase ? (
          <PhraseATrous
            phrase={phrase}
            nom={PROPRIETAIRES.nomFormulaire}
            className="apparait mt-10 border-t border-fort pt-8 desk:mt-14 desk:pt-10"
          >
            <BoutonProprietaire />
          </PhraseATrous>
        ) : (
          <BoutonProprietaire className="mt-8 desk:mt-10" />
        )}
      </Section>

      {/* 06. La suite : deux phrases, sans liste. */}
      <Section labelledBy="t-services">
        <EnTeteSection numero="06" nom={SECTIONS.services.nom} quantite={SECTIONS.services.quantite} />
        <div className={cx("grid gap-y-5 desk:grid-cols-12 desk:items-baseline desk:gap-x-6", SOUS_BORNE)}>
          <h2 id="t-services" className={cx(T2, "desk:col-span-5")}>
            <TitreCote texte={TITRES.services} mot={MOTS.services} />
          </h2>
          <p className={cx(CHAPEAU, "apparait max-w-[40rem] desk:col-span-6 desk:col-start-7")}>{typo(SUITE_MAISON.texte)}</p>
        </div>
      </Section>

      {/* 07. L'appel final : à qui cherche un terrain plutôt qu'à qui en a un. */}
      <AppelFinal
        numero="07"
        nom={APPEL.nom}
        phrase={APPEL.phrase}
        mot={APPEL.mot}
        bouton={
          <div className="flex flex-col gap-x-8 gap-y-3 tab:flex-row tab:items-center">
            <BoutonWhatsApp label={LIBELLES.question} message={MESSAGES.question.texte} />
            <TextLink href={APPEL.lien.href}>{APPEL.lien.libelle}</TextLink>
          </div>
        }
      />
    </>
  );
}
