// Textes propres à la page Comprendre le foncier (direction v4,
// recherche/revue-4/direction-v4.md, section 6, « Foncier »). Aucun fait nouveau : la page
// met en forme ceux de content/foncier.ts (définitions, avertissement, liste, notaire),
// de content/videos.ts et de content/photos.ts. Les mots sans fait (titre, noms de
// section, clés du cartouche, lien, appel final) n'ont pas de source.

import { TITRE_FONCIER } from "../foncier";

export const FONCIER = {
  /** Le h1 : le même nom que dans le menu (analyse.md, point 55). */
  titre: "Comprendre le foncier",
  /** Son mot coté. Sans jambage : la cote passe juste sous la ligne de base. */
  mot: "foncier",
  /** « Le bon papier avant le bon prix » en chapeau, tel que publié sur le site depuis la revue 1. */
  chapeau: `${TITRE_FONCIER}.`,
  description:
    "Délibération, bail ou titre foncier : ce que dit chaque document et son niveau de sécurité, publiés par Saloum Immo. Ce que vous pouvez vérifier avec nous avant de payer.",

  /**
   * Chaque section : son nom, en étiquette, à côté de sa borne ; puis l'unité de sa
   * quantité. Le nombre se compte dans le contenu (content/foncier.ts), il ne s'écrit
   * pas ici : trois documents, donc trois réponses possibles à la question du statut
   * (l'avertissement les nomme), et les points de la liste.
   * La page se lit dans cet ordre : les papiers, ce qu'il faut demander, ce qu'il faut
   * vérifier.
   */
  sections: {
    papiers: { nom: "Les papiers", unite: "documents" },
    statut: { nom: "À demander", unite: "réponses" },
    verifier: { nom: "À vérifier", unite: "points" },
  },

  /**
   * Clés du cartouche, en bas de la planche des papiers, comme sur un plan : d'où
   * viennent les définitions, et qui les explique. `nom` : ce que le cartouche est, pour
   * un lecteur d'écran.
   */
  cartouche: { nom: "Sources de la planche", source: "Source", video: "En vidéo" },

  /**
   * À côté de l'avertissement, qui parle de « tout autre terrain » : le lien vers les
   * nôtres. Le tableau de la page Terrains dit le papier de chacun.
   */
  lienTerrains: { href: "/terrains/", libelle: "Le papier de chaque terrain en vente" },

  /** Le mot coté du titre de la liste (content/foncier.ts, AVANT_D_ACHETER.titre). */
  motVerifier: "vérifiez",
  /** Le mot coté de la phrase du notaire (content/foncier.ts, NOTAIRE). */
  motNotaire: "notaire",

  /**
   * La légende du document, à gauche : celle de sa fiche (content/photos.ts, « Le
   * document montré dans notre vidéo sur le NICAD »), en plus court, pour tenir sur
   * deux lignes sous une image de 276 à 449 px. Le titre de la vidéo, juste dessous,
   * nomme le NICAD. À droite, la nature de l'image vient de la fiche.
   */
  legendeDocument: "Le document de la vidéo",

  /**
   * L'appel final, avant le pied (direction v4, pièce 15) : la question que cette page
   * sert à lever, puis le bouton WhatsApp « question » de messages.ts. Aucune promesse.
   * Pas de « conseil gratuit » ici : sous une page qui dit « vérifiez avec nous », il se
   * lirait « la vérification est gratuite », ce que rien ne publie (pages/diaspora.ts).
   * Une seule phrase, sans capitale accentuée au début de la seconde ligne : sous un
   * mot coté, l'accent d'un « É » touchait la cote (mesuré avec « … ? Écrivez-nous. »).
   */
  appel: {
    nom: "Nous écrire",
    phrase: "Au moindre doute, écrivez-nous.",
    mot: "doute",
  },
};
