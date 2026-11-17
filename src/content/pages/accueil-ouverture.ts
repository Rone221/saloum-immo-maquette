// Textes propres à l'ouverture de l'accueil (direction v4, pièce 3) : l'en-tête de
// planche, le cartouche de la photo, les noms que donne la lunette. Le titre, le chapeau
// et le bouton restent dans accueil.ts (OUVERTURE) ; le numéro, dans site.ts.
//
// La photo 2538 est une vue d'en haut d'un site dont le lieu n'est pas publié
// (content/photos.ts) : ni nom de lieu ni nom de programme ici, ni date, ni chiffre. Ces
// textes ne disent que ce qu'on voit sur l'image, avec les mots de sa légende. Ceux qui
// décrivent les travaux portent le statut de la fiche de la photo : à valider.

import { f, fv } from "../types";

const FICHE = "content/photos.ts, fiche de la photo 2538";

/**
 * L'en-tête de planche : il nomme la vue, puis la nature de l'image. « Photo au
 * drone », et non « Vue au drone » comme sous les autres photos : le nom dit déjà « vue ».
 */
export const PLANCHE = {
  nom: f("Vue d’en haut", `${FICHE} (vue verticale)`),
  nature: f("Photo au drone", `${FICHE} (nature : drone)`),
};

/** Le cartouche posé sur la photo : trois cases, clé puis valeur. */
export const CARTOUCHE = {
  /** Nom du tableau, lu par les lecteurs d'écran. */
  nom: "La photo",
  cases: [
    { cle: "Vue", valeur: f("Vue d’en haut, au drone", `${FICHE} (nature et texte alternatif)`) },
    {
      cle: "Travaux",
      valeur: fv("Voies en latérite, bordures béton, parcelles terrassées", `${FICHE} (légende)`),
    },
    {
      cle: "Tracé",
      valeur: f("Axes des voies, relevés sur la photo", "components/ouverture-plan.tsx : les axes sont relevés sur l’original"),
    },
  ],
};

/**
 * Ce que nomme la lunette, selon ce qu'elle vise. Trois noms et pas un de plus : hors
 * des voies, elle ne dit rien.
 */
export const LUNETTE = {
  axe: f("Axe de voie", "components/ouverture-plan.tsx : axe relevé sur l’original"),
  voie: fv("Voie en latérite", `${FICHE} (légende)`),
  bordure: fv("Bordure béton", `${FICHE} (légende)`),
};

/** Au-dessus du numéro, à côté du bouton : ce numéro sert aux deux. */
export const CLE_NUMERO = "WhatsApp et appel";

/**
 * Les mesures du chapeau, composées dans la voix large. Le chapeau lui-même est dans
 * accueil.ts (OUVERTURE) : on n'en recopie ici que les morceaux à mettre en valeur.
 */
export const MESURES_CHAPEAU = ["78", "150 m²", "30 mars 2026"];
