// Textes propres à l'accueil (revue 3, recherche/revue-3/analyse.md). Chaque fait
// porte sa source ; les phrases sans fait (titres de section) n'en ont pas besoin.

import { f } from "../types";

/**
 * Ouverture : un titre de lieux, pas de promesse ; un chapeau de preuves, des faits
 * que seul Saloum Immo peut écrire (point 7 de l'analyse). Les références sont
 * composées dans la voix des mesures, à part, pour garder leur forme exacte.
 */
export const OUVERTURE = {
  titre: f("Des parcelles viabilisées, de Kounoune au Lac Rose.", "contenu-maquette §5 (Sakina City à Kounoune ; Lac Town et Sicap Keur Massar près du Lac Rose ; terrains viabilisés)"),
  sakina: f("Sakina City : 78 parcelles de 150 m², titre mère", "contenu-maquette §5"),
  titreMere: f("TF 15026/R", "contenu-maquette §5"),
  lacTown: f("Lac Town, lancé le 30 mars 2026 : nous l’avons entièrement réalisé.", "contenu-maquette §5 ; YouTube qtAHrgDQd4U", {
    date: "2026-03-30",
  }),
  bouton: "Voir les terrains en vente",
};

/** Titres de section : un fait ou un conseil, pas une étiquette de rubrique (point 49). */
export const TITRES = {
  methode: "Du débroussaillage au titre foncier",
  papiers: "Le bon papier avant le bon prix",
  terrains: "Où acheter, et avec quel papier",
  travaux: "Nos chantiers, datés",
  etranger: "De loin, faites tout vérifier avant de payer",
};

export const METHODE = {
  chapeau: "Sur les terrains que nous vendons, et sur ceux des propriétaires.",
  fin: f(
    "Et pour finir, le papier : obtention de titres fonciers et régularisation administrative.",
    "contenu-maquette §4, service 1, verbatim",
  ),
  proprietaires: {
    titre: "Vous avez un terrain ou des hectares ?",
    texte: f(
      "Nous aménageons aussi les terrains des propriétaires. Dites-nous où se trouve le vôtre, et sa surface.",
      "contenu-maquette §4 (offre publiée le 18 mai 2026)",
      { date: "2026-05-18" },
    ),
  },
};

// Pas d'« avant de payer » ici : la formule revenait quatre fois sur la page (revue 3).
export const PAPIERS = {
  chapeau: "Demandez lequel de ces trois documents vous achetez.",
};

/**
 * Lac Town, autour de son calendrier : deux dates, ce qui est fait, le statut. Le
 * calendrier complet, avec ses vidéos, est sur la fiche (programmes.ts).
 */
export const LAC_TOWN_ACCUEIL = {
  situation: f("Près du Lac Rose.", "contenu-maquette §5"),
  jalons: [
    {
      date: "2026-03-30",
      texte: f("Lancement. Entièrement réalisé par Saloum Immo.", "contenu-maquette §5 ; YouTube qtAHrgDQd4U", { date: "2026-03-30" }),
    },
    {
      date: "2026-05",
      texte: f("En vente. Travaux en phase finale.", "contenu-maquette §5 ; YouTube Wq8pwLDb4L0", { date: "2026-05-21" }),
    },
  ],
  statut: f("À demander avant de payer.", "contenu-maquette §5 (statut juridique inconnu)"),
};

/**
 * L'appel final, avant le pied (direction v4, pièce 15) : une question simple, le
 * bouton WhatsApp « question » de messages.ts. Aucune promesse.
 */
export const APPEL = {
  nom: "Nous écrire",
  phrase: "Une question sur un terrain ? Écrivez-nous.",
  mot: "Écrivez-nous",
};

/**
 * Les risques que Saloum Immo vérifie, nommés (point 53). Sans « Avant de payer » : le
 * titre de la section le dit juste au-dessus.
 */
export const ETRANGER = {
  chapeau: f(
    "Nous vérifions avec vous le véritable propriétaire, la situation juridique et le NICAD de la parcelle, et qu’il n’y a pas de vente multiple. Un notaire agréé accompagne chaque étape de l’achat.",
    "Légende de l’interview du DG, Instagram, 08.06.2026 ; YouTube Rrfi4zPWsbY ; TikTok, 15.10.2025 ; contenu-maquette §6",
  ),
};
