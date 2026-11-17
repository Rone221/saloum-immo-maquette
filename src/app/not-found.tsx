// Page introuvable, direction v4 (recherche/revue-4/direction-v4.md, section 6) : « Cette
// page n'est pas sur le plan. », un cadre en pointillé vide, puis les trois terrains.
// Un lien cassé arrive souvent d'un vieux partage WhatsApp vers un lot vendu (constats.md
// R19) : le visiteur cherchait un terrain. Une seule section, donc : le titre, et tout
// de suite les trois terrains en vente, dans le premier écran. Le nom de chaque
// programme mène à sa fiche.
// Pas de bouton : le pied, juste dessous, porte le WhatsApp. Pas de plan du site :
// l'en-tête et le pied l'ont déjà.
//
// Le cadre vide : sur un plan, le pointillé dit ce qui n'est pas sûr. Ici, un cadre
// sans rien dedans, posé sur les croisillons du sable. Le plan est là, la page non.
//
// Next envoie ce fichier avec chaque page du site : composants serveur seulement,
// rien d'interactif, aucune photo, pas de feuille de style à lui. C'est pourquoi les
// terrains sont dans la liste commune aux fiches (components/liste-terrains.tsx), et
// pas dans l'index de l'accueil : l'index a sa feuille de style, que toutes les pages
// du site iraient chercher pour rien.

import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { EnTeteSection } from "@/components/en-tete-section";
import { ListeTerrains } from "@/components/liste-terrains";
import { TitreCote } from "@/components/mot-cote";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { PROGRAMMES } from "@/content/programmes";
import { cx } from "@/lib/base";
import { CHAPEAU, SOUS_BORNE, T1 } from "@/lib/classes";
import { typo } from "@/lib/format";
import { metaPage } from "@/lib/meta";

// robots: null : Next pose déjà sa propre balise « noindex » sur la page 404.
// Celle du layout (« noindex, nofollow ») en ferait une seconde.
export const metadata: Metadata = metaPage(
  "Page introuvable",
  "Cette page n’existe pas. Les terrains en vente : Sakina City, Sicap Keur Massar et Lac Town.",
  { robots: null },
);

/** Les textes de la page : de l'interface, aucun fait. */
const TEXTES = {
  nom: "Page introuvable",
  /** À droite de l'en-tête de section : la référence de l'erreur, pour qui la connaît. */
  reference: "Erreur 404",
  /** La phrase de la direction v4, avec son point : c'est une phrase, pas une rubrique. */
  titre: "Cette page n’est pas sur le plan.",
  mot: "plan",
  chapeau: "Les terrains en vente sont ici.",
  /** Sous le cadre vide, en clair : ce que le titre dit en image. */
  legende: "Aucune page à cette adresse",
  suite: "Tous les terrains, et les autres sites",
};

/**
 * Le cadre vide : quatre traits en pointillé, ceux du site (2 px, puis 4 px de vide ;
 * globals.css, « Traits »). Un dégradé s'écrit en style, pas en classe.
 */
const TRAIT_H = "repeating-linear-gradient(90deg, var(--r-fort) 0 2px, transparent 2px 6px)";
const TRAIT_V = "repeating-linear-gradient(180deg, var(--r-fort) 0 2px, transparent 2px 6px)";
const CADRE_VIDE: CSSProperties = {
  background: [
    `${TRAIT_H} 0 0 / 100% 1.5px no-repeat`,
    `${TRAIT_H} 0 100% / 100% 1.5px no-repeat`,
    `${TRAIT_V} 0 0 / 1.5px 100% no-repeat`,
    `${TRAIT_V} 100% 0 / 1.5px 100% no-repeat`,
  ].join(", "),
};

export default function Introuvable() {
  return (
    <Section labelledBy="t-page" rythme="ouverture" croisillons>
      <EnTeteSection numero="01" nom={TEXTES.nom} quantite={TEXTES.reference} arrivee />
      <div className={cx("grid gap-y-8 desk:grid-cols-12 desk:items-start desk:gap-x-6", SOUS_BORNE)}>
        <div className="desk:col-span-7">
          <h1 id="t-page" className={T1}>
            <TitreCote texte={TEXTES.titre} mot={TEXTES.mot} basse arrivee />
          </h1>
          {/* La cote passe sous les jambages de « plan » : un peu plus d'air avant le chapeau. */}
          <p className={cx(CHAPEAU, "mt-8 desk:mt-10")}>{typo(TEXTES.chapeau)}</p>
        </div>
        <div className="desk:col-span-4 desk:col-start-9">
          <span aria-hidden="true" style={CADRE_VIDE} className="block aspect-[5/2] desk:aspect-[2/1]" />
          <p className="etiquette mt-3 text-doux">{typo(TEXTES.legende)}</p>
        </div>
      </div>

      {/* Sans titre : la page en porte déjà un. Les lignes de la liste apparaissent seules. */}
      <ListeTerrains programmes={PROGRAMMES} className="mt-12 desk:mt-16" />
      <TextLink href="/terrains/" className="mt-6 desk:mt-8">
        {TEXTES.suite}
      </TextLink>
    </Section>
  );
}
