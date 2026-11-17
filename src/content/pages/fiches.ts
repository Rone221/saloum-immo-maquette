// Textes propres aux fiches (direction v4, recherche/revue-4/direction-v4.md, section 6 :
// Sakina City, Sicap Keur Massar, Lac Town et l'offre datée Recasement AIBD). Les faits
// des programmes et de l'offre sont dans programmes.ts ; ici, ce que la fiche ajoute :
// l'en-tête de chaque planche, les noms et les titres des sections, les clés des
// tableaux, les légendes, les noms que donne la lunette, la phrase de l'appel final.
// Un titre dit un fait ou un conseil, en sept mots au plus, jamais une étiquette de
// rubrique. Chaque fait porte sa source.

import type { ProgrammeSlug } from "../programmes";
import { f, fv, type Fait } from "../types";

/** Les quatre fiches : les trois programmes, et l'offre datée. */
export type CleFiche = ProgrammeSlug | "recasement-aibd";

/** Un titre de section, et son mot coté : un mot du titre, tel qu'il y est écrit. */
export type TitreFiche = { texte: string; mot?: string };

/** Le prix, au-dessus du bouton WhatsApp d'un programme. Dit une fois. */
export const PRIX_SUR_DEMANDE = f("Prix sur demande.", "contenu-maquette §5 (prix non publié)");

/** La rubrique parente, au-dessus du nom. */
export const ARIANE = { href: "/terrains/", libelle: "Terrains" } as const;

/**
 * L'en-tête de planche de chaque fiche (borne 01) : ce qu'est la pièce, puis à droite ce
 * qui se compte ou se date. Pour Sicap Keur Massar, la quantité se compte dans la liste
 * des lots (programmes.ts) : elle ne s'écrit pas ici. « Lots en vente », et non
 * « programme » : Sicap Keur Massar n'est jamais présenté comme un programme de Saloum
 * Immo (inventaire.md, partie 3).
 */
export const PLANCHES: Record<CleFiche, { nom: string; quantite?: Fait }> = {
  "sakina-city": { nom: "Programme", quantite: f("78 parcelles", "contenu-maquette §5") },
  "sicap-keur-massar": { nom: "Lots en vente" },
  "lac-town": {
    nom: "Programme",
    quantite: f("Lancé le 30 mars 2026", "contenu-maquette §5 ; YouTube qtAHrgDQd4U", { date: "2026-03-30" }),
  },
  "recasement-aibd": {
    nom: "Offre datée",
    quantite: f("Disponibilité à demander", "contenu-maquette §5 (disponibilité 2026 inconnue)", { date: "2025-04" }),
  },
};

/** Les noms des sections, en étiquette, dans l'en-tête de chacune. Deux ou trois mots. */
export const SECTIONS = {
  visite: "La visite",
  papier: "Le papier",
  lots: "Les lots",
  vue: "La vue au drone",
  calendrier: "Le calendrier",
  videos: "En vidéo",
  autres: "Les autres terrains",
  terrains: "Les terrains",
  appel: "Nous écrire",
} as const;

/**
 * Les titres des sections. « Les terrains en vente », comme le titre de la page
 * Terrains, jamais « nos programmes » (voir PLANCHES).
 */
export const TITRES_FICHE = {
  /** Les autres terrains, en liste : chacun dit son papier. */
  autres: { texte: "Comparez avec les autres terrains en vente", mot: "terrains" },
  /** Même liste, sous l'offre AIBD : les trois programmes. */
  autresDepuisOffre: { texte: "Comparez avec les terrains en vente", mot: "terrains" },
  /** Sicap Keur Massar : les deux vidéos des lots. */
  videosSicap: { texte: "Regardez les lots avant la visite", mot: "lots" },
  /** Sakina City : la voirie en photo, et la visite virtuelle. */
  visiteSakina: { texte: "Regardez les voies avant la visite", mot: "voies" },
  /** Sicap Keur Massar : le statut publié (« titre foncier individuel pour chaque lot »), en titre. */
  lots: { texte: "Un titre foncier pour chaque lot", mot: "titre" },
  /** Lac Town : ce que montre la vue (programmes.ts, `dejaFait` ; légende de la photo 2580). */
  vue: { texte: "Les voies sont ouvertes et bordées", mot: "voies" },
} satisfies Record<string, TitreFiche>;

/**
 * Le papier d'une fiche, avec la définition publiée par Saloum Immo (foncier.ts) :
 * Sakina City (titres fonciers individuels) et l'offre AIBD (bail). La fin du titre est
 * le nom du document : la planche l'écrit au corps qu'il a dans l'échelle des papiers.
 */
export const PAPIER = {
  tf: "Ce que vous achetez : un titre foncier",
  bail: "Ce que vous achetez : un bail",
} as const;

/** Les clés de la planche du papier : celles de l'échelle des papiers, mot pour mot. */
export const CLES_PAPIER = {
  niveau: "Niveau de sécurité",
  aSavoir: "À savoir",
  chezNous: "Chez Saloum Immo",
  disponibilite: "Disponibilité",
} as const;

/** À droite de l'en-tête « Le papier » : la référence de cette fiche. */
export const REPERES_PAPIER = {
  "sakina-city": f("Titre mère TF 15026/R", "contenu-maquette §5"),
  "recasement-aibd": f("Parcelles en bail", "contenu-maquette §5 (offre d’avril 2025)", { date: "2025-04" }),
} satisfies Partial<Record<CleFiche, Fait>>;

/** Le lien sous la planche du papier, vers la page qui explique les trois documents. */
export const LIEN_FONCIER = { href: "/foncier/", libelle: "Comprendre le foncier" } as const;

/**
 * Sous « Regardez … avant la visite » : la visite se fait avec l'équipe. La phrase de la
 * page Foncier (content/foncier.ts, « Avant d'acheter »), mot pour mot.
 */
export const VISITE = f("Vous visitez le terrain avec notre équipe, sur rendez-vous.", "contenu-maquette §6 (visites accompagnées)");

/** Le chapeau de l'offre AIBD : pourquoi elle est datée. Les mots de sa ligne d'accueil (programmes.ts). */
export const CHAPEAU_OFFRE = f(
  "Une offre d’avril 2025. Demandez si elle est encore disponible.",
  "contenu-maquette §5 (offre d’avril 2025 ; disponibilité 2026 inconnue)",
  { date: "2025-04" },
);

// ------------------------------------------------------------ Sicap Keur Massar

/** À droite de l'en-tête de la fiche, après le nombre de lots, compté dans la liste (programmes.ts). */
export const QUANTITE_LOTS = "lots publiés";

/**
 * Le tableau des lots : ses têtes de colonne, et ce qui le date, à droite de l'en-tête.
 * « Lot » est aussi le mot écrit devant chaque plaque : un numéro seul ne dit pas ce
 * qu'il compte.
 */
export const TABLEAU_LOTS = {
  colonnes: { lot: "Lot", surface: "Surface", note: "À savoir" },
  quantite: f("Publiés en 2026", "contenu-maquette §5", { date: "2026" }),
} as const;

/**
 * Ce qu'on voit sur 2616. Sa fiche n'a pas de légende (content/photos.ts) : la légende à
 * deux colonnes de la v4 en demande une. Les mots de son texte alternatif, les mêmes que
 * sous son aperçu dans l'index de l'accueil, sans nom de lieu.
 */
export const LEGENDE_QUARTIER = "Maisons neuves et pistes en latérite";

// --------------------------------------------------------------------- Lac Town

/**
 * À droite de l'en-tête « La vue au drone », après le nombre d'axes, compté dans le
 * relevé (_composants/vue.tsx) : ce qui est dessiné sur la photo, dit une fois. La
 * légende de la photo ne le redit pas.
 */
export const QUANTITE_VUE = "axes relevés sur la photo";

/**
 * Ce que nomme la lunette sur 2580, selon ce qu'elle vise. Trois noms et pas un de plus :
 * hors des voies, elle ne dit rien. « Bordure de voie », sans matériau : la fiche de la
 * photo dit seulement que les voies sont bordées.
 */
export const LUNETTE_VUE = {
  axe: f("Axe de voie", "_composants/vue.tsx : axe relevé sur l’original"),
  voie: fv("Voie en latérite", "content/photos.ts, fiche de la photo 2580 (texte alternatif)"),
  bordure: fv("Bordure de voie", "content/photos.ts, fiche de la photo 2580 (légende)"),
};

/** À droite de l'en-tête « Le calendrier », après le nombre de dates. */
export const QUANTITE_CALENDRIER = "dates";

/** Le mot coté du titre du calendrier (programmes.ts : « Entièrement réalisé par Saloum Immo »). */
export const MOT_CALENDRIER = "réalisé";

// ----------------------------------------------------------------- Autres terrains

/** Sous la liste des autres terrains : le même lien que sous l'index de l'accueil. */
export const LIEN_TERRAINS = { href: "/terrains/", libelle: "Tous les terrains, et les autres sites" } as const;

// ------------------------------------------------------------------- Appel final

/**
 * L'appel final de chaque fiche (direction v4, pièce 15) : une question simple, celle du
 * message WhatsApp du programme (messages.ts), puis son bouton. Aucune promesse. Le mot
 * coté n'a pas de jambage : sa cote reste sous la ligne de base.
 */
export const APPELS: Record<CleFiche, Required<TitreFiche>> = {
  "sakina-city": { texte: "Un titre foncier à Kounoune ? Demandez le prix.", mot: "titre" },
  "sicap-keur-massar": { texte: "Quels lots restent libres ? Écrivez-nous.", mot: "Écrivez-nous" },
  "lac-town": { texte: "Un terrain à Lac Town ? Demandez les prix.", mot: "Lac Town" },
  "recasement-aibd": { texte: "L’offre est-elle encore disponible ? Écrivez-nous.", mot: "Écrivez-nous" },
};
