// Terrains, direction v4 « Du plan au terrain » (recherche/revue-4/direction-v4.md,
// section 6). La page range ce qui se vend, puis ce qui se demande, puis le papier de
// chacun. Quatre pièces, et le rythme des fonds (du clair entre le bleu de la planche et
// celui du pied) :
// 01. L'ouverture, sur le sable à croisillons, et sa pièce : le tableau complet des trois
//     programmes. Le lieu en cotes, le papier, les surfaces, ce qui est déjà fait, l'état,
//     le bouton WhatsApp. Le titre de la page est celui du tableau : pas de second titre.
// 02. Aussi publiés, sur le calque : l'offre Recasement AIBD, datée, puis Bayakh et
//     Niague, en registre. Sous chaque phrase, ce qui reste à demander, avec le carré en
//     contour du tableau ; un bouton WhatsApp pour l'offre, un lien pour les deux sites.
// 03. Le papier, sur la planche au bleu : les terrains dont le papier est écrit, rangés
//     sous leur trait (plein, tirets, pointillé), puis le renvoi vers Comprendre le
//     foncier. Niague n'y est pas : rien n'est publié sur son papier.
// 04. L'appel final. Le pied suit, dans le layout.
//
// Photos : celles du tableau seulement, en vignette (2413-droite, 2616-bas, 2580). Pas
// de tirage qui suit le pointeur : c'est la pièce de l'accueil. Pas de grande photo : la
// direction en permet zéro, et les vues d'en haut sont prises ailleurs (2538 à
// l'accueil, 2540 à Aménager, 2616 et 2580 sur leurs fiches).
//
// Jamais sur cette page : Kounoune 2 (peut-être Sakina City) ni son prix de 2024.

import type { Metadata } from "next";
import { AppelFinal } from "@/components/appel-final";
import { BoutonWhatsApp } from "@/components/boutons";
import { EnTeteSection } from "@/components/en-tete-section";
import { IndexTerrains } from "@/components/index-terrains";
import { TitreCote } from "@/components/mot-cote";
import { Section } from "@/components/section";
import { NOMBRE_TERRAINS, PapiersTerrains, RegistreAutres } from "@/components/terrains-autres";
import { TextLink } from "@/components/text-link";
import { LIBELLES, MESSAGES } from "@/content/messages";
import {
  APPEL,
  AUTRES,
  AUTRES_SITES_RELEVE,
  CHAPEAU_PAGE,
  DESCRIPTION,
  MOT_TITRE,
  PAPIERS,
  RENVOI_FONCIER,
  TITRE,
} from "@/content/pages/terrains";
import { PROGRAMMES } from "@/content/programmes";
import { cx } from "@/lib/base";
import { CHAPEAU, SOUS_BORNE, T1, T2 } from "@/lib/classes";
import { enLettres, typo } from "@/lib/format";
import { metaPage } from "@/lib/meta";

export const metadata: Metadata = metaPage(TITRE, DESCRIPTION);

export default function Terrains() {
  const sites = AUTRES_SITES_RELEVE.length;
  return (
    <>
      {/* 01. L'ouverture et le tableau. Le titre à gauche, le chapeau en regard : le
          tableau monte dans le premier écran. */}
      <Section labelledBy="t-page" rythme="ouverture" croisillons>
        <header>
          <EnTeteSection numero="01" nom="Terrains" quantite={`${PROGRAMMES.length} programmes`} arrivee />
          <div className={cx("grid gap-y-5 desk:grid-cols-12 desk:items-end desk:gap-x-6", SOUS_BORNE)}>
            <h1 id="t-page" className={cx(T1, "desk:col-span-7")}>
              <TitreCote texte={TITRE} mot={MOT_TITRE} arrivee />
            </h1>
            <p className={cx(CHAPEAU, "max-w-[36rem] desk:col-span-5 desk:col-start-8")}>{typo(CHAPEAU_PAGE.texte)}</p>
          </div>
        </header>
        {/* Sans l'offre datée : elle n'est pas « en vente », elle ouvre la pièce suivante. */}
        <IndexTerrains mode="complet" offre={false} className="mt-10 desk:mt-14" />
      </Section>

      {/* 02. Aussi publiés : l'offre datée, puis les autres sites. Le titre se coupe
          après sa virgule : sa largeur est comptée pour. */}
      <Section id="autres" surface="calque" labelledBy="t-autres">
        <EnTeteSection numero="02" nom={AUTRES.nom} quantite={`1 offre datée · ${sites} sites`} />
        <div className={cx("grid gap-y-5 desk:grid-cols-12 desk:items-end desk:gap-x-6", SOUS_BORNE)}>
          <h2 id="t-autres" className={cx(T2, "max-w-[9.5em] desk:col-span-7")}>
            <TitreCote texte={AUTRES.titre(enLettres(sites).toLowerCase())} mot={AUTRES.mot} />
          </h2>
          <p className={cx(CHAPEAU, "max-w-[36rem] desk:col-span-4 desk:col-start-9")}>{typo(AUTRES.chapeau)}</p>
        </div>
        <RegistreAutres className="mt-10 desk:mt-14" />
      </Section>

      {/* 03. Le papier de chaque terrain, sur la planche au bleu. La quantité compte les
          terrains rangés sous la ligne. */}
      <Section id="papiers" surface="plan" labelledBy="t-papiers" croisillons>
        <EnTeteSection numero="03" nom={PAPIERS.nom} quantite={`${NOMBRE_TERRAINS} terrains`} />
        <h2 id="t-papiers" className={cx(T2, SOUS_BORNE, "max-w-[12em]")}>
          <TitreCote texte={PAPIERS.titre} mot={PAPIERS.mot} basse />
        </h2>
        <PapiersTerrains className="mt-12 desk:mt-16" />
        <p className="mt-12 flex flex-wrap items-baseline gap-x-3 border-t border-ligne pt-3 desk:mt-16">
          <span>{typo(RENVOI_FONCIER.texte)}</span>
          <TextLink href={RENVOI_FONCIER.href} className="text-fort">
            {RENVOI_FONCIER.lien}
          </TextLink>
        </p>
      </Section>

      {/* 04. L'appel final. */}
      <AppelFinal
        numero="04"
        nom={APPEL.nom}
        phrase={APPEL.phrase}
        mot={APPEL.mot}
        bouton={<BoutonWhatsApp label={LIBELLES.question} message={MESSAGES.question.texte} />}
      />
    </>
  );
}
