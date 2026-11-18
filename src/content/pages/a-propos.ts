// Textes propres à la page À propos (direction v4, recherche/revue-4/direction-v4.md,
// section 6 : Babacar Ndiaye, l'entreprise en cartouche, l'équipe, Millennium City en
// grand). Aucun fait neuf : ceux de contenu-maquette.md §1, §2, §4, §5 et §8, mis en
// forme pour cette page, chacun avec sa source. Les titres et les étiquettes de la v4
// (ouverture, noms de section, mots cotés, légendes) sont écrits ici.
//
// Personne n'est nommé, sauf Babacar Ndiaye. Le parcours est résumé, jamais recopié
// (contenu-maquette §2) : « plusieurs années » de change, sans durée chiffrée
// (inventaire §2.1). Le cartouche n'a pas de ligne « Valeurs »
// (analyse.md, point 54). Millennium City garde la phrase de registre.ts, entière : la
// page ne la recoupe pas.

import { CREATION, FONDATEUR, RAISON_SOCIALE, SIEGE } from "../site";
import { f, type Fait } from "../types";

/**
 * L'ouverture : la borne 01, le titre et son mot coté. Le titre dit les deux rôles de
 * Babacar Ndiaye (fondateur, directeur général) avec deux verbes. Son nom porte la
 * cote : c'est lui que la page présente d'abord. Le chapeau est dans site.ts
 * (FONDATEUR.enVideo), et la vidéo dont il parle suit, en lien.
 */
export const OUVERTURE = {
  nom: "À propos",
  titre: f("Saloum Immo, fondée et dirigée par Babacar Ndiaye", "contenu-maquette §2 (fondateur et directeur général : Babacar Ndiaye)"),
  mot: "Babacar Ndiaye",
};

/** Une ligne du registre : le moment en marge, une phrase. */
export type LigneParcours = { quand: string; texte: Fait };

/**
 * Le parcours publié par Babacar Ndiaye sur son site, une phrase par étape : la liste
 * de site.ts, la même que sur l'accueil. Les années de la source en marge ; « Au
 * départ » et « Ensuite » quand elle n'en donne pas.
 */
export const PARCOURS: LigneParcours[] = FONDATEUR.parcours;

/**
 * La section du parcours. Le titre le résume par ses deux bouts : l'aéroport où il
 * commence, le foncier où il arrive. Comme « Du débroussaillage au titre foncier ».
 */
export const PARCOURS_SECTION = {
  nom: "Le parcours",
  titre: f("De l’aéroport au foncier", "contenu-maquette §2 (aéroport Léopold Sédar Senghor, puis Saloum Immo)"),
  mot: "foncier",
};

/** Sous le registre, en note : d'où vient le parcours. */
export const SOURCE_PARCOURS = f(
  "D’après le parcours qu’il a publié sur son site.",
  "contenu-maquette §2 (« publié par lui sur son site »)",
);

/** Le cartouche de l'entreprise : une clé, une valeur. Pas de ligne « Valeurs ». */
export type LigneCartouche = {
  cle: string;
  valeur: Fait;
  /** Une référence ou une date : dans la voix des mesures. */
  reference?: boolean;
};

export const CARTOUCHE: LigneCartouche[] = [
  { cle: "Raison sociale", valeur: RAISON_SOCIALE, reference: true },
  // La forme prévue par contenu-maquette §2 tant que l'année n'est pas validée.
  { cle: "En activité", valeur: CREATION },
  { cle: "Siège", valeur: SIEGE },
];

/**
 * L'entreprise et son équipe (photo 2499) : le gilet siglé dit qui travaille, sans
 * nommer personne (contenu-maquette §2 et §8). La phrase de l'équipe tient le titre de
 * la section, sans son point. La légende dit l'objet, pas « l'équipe sur un chantier ».
 */
export const EQUIPE = {
  nom: "L’entreprise",
  /** Ce que la société fait elle-même : contenu-maquette §4, « lecture utile ». */
  texte: f("Nous aménageons les terrains avec notre propre équipe.", "contenu-maquette §4 (« Ils aménagent la terre eux-mêmes »)"),
  mot: "équipe",
  legende: f("Le gilet « SALOUM IMMO BAT », sur un de nos chantiers.", "contenu-maquette §8 (2499 : gilets « SALOUM IMMO BAT »)"),
  /**
   * La même, sous la photo, dans la légende à deux colonnes : l'objet à gauche. « Sur un
   * de nos chantiers » n'y est plus : la colonne de droite dit « photo de chantier ».
   */
  legendeCourte: "Le gilet « SALOUM IMMO BAT »",
  /** La case du film de présentation, dans le cartouche. */
  cleFilm: "En vidéo",
};

/**
 * Millennium City : un titre qui dit l'ouvrage, la photo 2537 en grand, puis la phrase
 * d'attribution de registre.ts, entière. Jamais « notre programme », jamais l'aire de
 * jeux. Le nom de la section est celui que contenu-maquette §5 demande : « travaux
 * réalisés ». L'en-tête n'a pas de quantité : compter un ouvrage ne dit rien, et les
 * dates de la phrase sont celles du projet, pas de la pose.
 */
export const MILLENNIUM = {
  nom: "Travaux réalisés",
  titre: "La canalisation de Millennium City",
  mot: "canalisation",
  /**
   * Sous la photo, à gauche : ce qu'on voit. Sa fiche n'a pas de légende, et le nom du
   * projet reste dans le texte : l'attribution ne tient pas à une légende (registre.ts).
   */
  legende: "Le rond-point du lotissement",
  /** Vers le registre des travaux, sur la page Aménager. */
  suite: "Nos chantiers suivants, datés et sourcés",
};

/**
 * L'appel final, avant le pied (direction v4, pièce 15) : après avoir lu qui nous
 * sommes, ce qu'il reste à faire. Un conseil, comme les titres du site (« avant de
 * payer »). Le bouton WhatsApp « question » de messages.ts. Aucune promesse.
 */
export const APPEL = {
  nom: "Nous écrire",
  phrase: "Avant d’acheter, écrivez-nous.",
  mot: "acheter",
};
