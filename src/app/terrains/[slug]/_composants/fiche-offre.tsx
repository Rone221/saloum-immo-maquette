// L'offre datée Recasement AIBD, direction v4 « Du plan au terrain »
// (recherche/revue-4/direction-v4.md, section 6) : la fiche tourne autour de sa date.
// 01. Le même cartouche de plan que les programmes : la date de l'offre en très grand,
//     sur sa cote, à la place d'un titre mère ; puis le bail, la surface, et le prix, qui
//     ne vaut que pour cette date. Une action : « Demander la disponibilité ».
// 02. Le papier qu'on achète, un bail, sur une planche au bleu : son nom au corps qu'il a
//     dans l'échelle des papiers, sur son trait en tirets, avec sa définition publiée.
// 03. Les terrains en vente, en liste : les trois programmes.
// 04. L'appel final. Le pied suit, dans le layout.
// Pas de photo : aucune n'est publiée pour ce site.

import { AppelFinal } from "@/components/appel-final";
import { BoutonWhatsApp } from "@/components/boutons";
import { APPELS, CHAPEAU_OFFRE, PAPIER, PLANCHES, REPERES_PAPIER, SECTIONS, TITRES_FICHE } from "@/content/pages/fiches";
import { PROGRAMMES, RECASEMENT_AIBD } from "@/content/programmes";
import { AutresTerrains } from "./blocs";
import { Action, CartouchePlan, OuvertureFiche } from "./ouverture";
import { Papier } from "./papier";

export function FicheOffre() {
  const o = RECASEMENT_AIBD;
  const planche = PLANCHES["recasement-aibd"];
  const appel = APPELS["recasement-aibd"];
  return (
    <>
      <OuvertureFiche
        nom={o.nom}
        planche={{ nom: planche.nom, quantite: planche.quantite?.texte }}
        situation={o.situation.texte}
        chapeau={CHAPEAU_OFFRE.texte}
        action={<Action label={o.libelleWhatsApp} message={o.message} nom={o.nom} />}
        cartouche={<CartouchePlan nom={o.nom} references={o.references} />}
      />

      <Papier cle="bail" titre={PAPIER.bail} numero="02" repere={REPERES_PAPIER["recasement-aibd"].texte} />

      <AutresTerrains numero="03" nom={SECTIONS.terrains} titre={TITRES_FICHE.autresDepuisOffre} programmes={PROGRAMMES} />

      <AppelFinal
        numero="04"
        nom={SECTIONS.appel}
        phrase={appel.texte}
        mot={appel.mot}
        bouton={<BoutonWhatsApp label={o.libelleWhatsApp} message={o.message} ariaLabel={`${o.libelleWhatsApp}, ${o.nom}`} />}
      />
    </>
  );
}
