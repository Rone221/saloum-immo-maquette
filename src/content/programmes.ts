// Programmes en vente, offre datée et autres sites publiés (contenu-maquette §5).
// Les mêmes données alimentent l'accueil, la page Terrains et les fiches.
//
// Règles : aucun prix sauf celui de l'offre AIBD, toujours avec sa date.
// Ailleurs « Sur demande ». Un chiffre dit à l'oral porte `oral: true` et sa date.
// Ne pas afficher Kounoune 2 (peut-être Sakina City) ni son prix de 2024.
//
// À valider avec le client :
// - Lac Town : surfaces 150 à 450 m² et équipements (dits à l'oral le 21.05.2026),
//   rattachement de la photo 2580 ;
// - Sicap Keur Massar : nom « Paradise City », disponibilité actuelle des lots 2026 ;
// - Recasement AIBD : disponibilité en 2026 ;
// - Bayakh et Niague : statut, disponibilité, et les messages proposés.

import { f, fv, type Fait, type StatutFoncier } from "./types";
import type { PhotoId } from "./photos";
import type { CleVideo } from "./videos";
import { MESSAGES } from "./messages";

export type LibelleFiche =
  | "Titre"
  | "Statut foncier"
  | "Parcelles"
  | "Surfaces"
  | "Déjà fait"
  | "Réseaux"
  | "Équipements"
  | "Quartier"
  | "Calendrier"
  | "Lieu"
  | "Prix"
  | "Disponibilité";

export type LigneFiche = {
  libelle: LibelleFiche;
  valeur: Fait;
  /** Ligne présente sur la fiche du programme, pas sur l'accueil. */
  ficheSeulement?: boolean;
};

/** Une ligne de cote, depuis l'origine du groupe. */
export type LigneCote = {
  vers: string;
  /** La destination est dessinée en plaque routière (« Sortie 10 »). */
  plaque?: boolean;
  /** Valeur publiée (« 3 km »), ou null pour une cote ouverte, non chiffrée. */
  valeur: Fait | null;
  /**
   * Valeur numérique de la cote, dans l'unité de sa valeur (km, min). Sa longueur
   * vaut mesure × --u, une unité par km ou par min (2.4, 3.5 ; components/dessins/cote.tsx).
   * Cote ouverte : longueur arbitraire de 8 unités, hors échelle.
   */
  mesure?: number;
  /** Texte de la cote ouverte (« quelques min »). */
  libelleOuvert?: string;
};

/**
 * Cotes depuis la même origine. Toutes les lignes d'un groupe sont à la même
 * échelle (3.5). Deux groupes ne se comparent pas : leurs unités diffèrent.
 */
export type GroupeCotes = {
  origine: string;
  /** Phrase complète lue par les lecteurs d'écran. */
  ariaLabel: string;
  lignes: LigneCote[];
};

export type Lot = { numero: string; surface: number; note?: string };

export type ProgrammeSlug = "lac-town" | "sakina-city" | "sicap-keur-massar";

export type Programme = {
  slug: ProgrammeSlug;
  nom: string;
  href: string;
  /** Second nom, cité sous le titre, jamais en titre (Sicap Keur Massar). */
  aussi?: Fait;
  chapeau: Fait;
  statut: StatutFoncier;
  /** Statut en mots, à côté de l'échantillon. */
  statutTexte: Fait;
  /** Colonnes du tableau du catalogue. */
  catalogue: { lieu: Fait; surfaces: Fait; dejaFait: Fait | null; prix: Fait };
  cotes: GroupeCotes;
  fiche: LigneFiche[];
  bouton: string;
  message: string;
  photo: PhotoId;
  videos: CleVideo[];
  /** Lien vidéo montré dans le bloc programme. */
  videoBloc?: CleVideo;
  /**
   * Photo du client qui sert de vignette à videoBloc (Lac Town : 2421, placée par
   * le client sur la visite commentée). Sans elle, la vidéo est un lien texte.
   */
  vignetteVideo?: PhotoId;
  /** Sakina City : la trame des parcelles. */
  trame?: { nombre: number; surface: number; legende: Fait };
  titreMere?: Fait;
  /** Sicap Keur Massar : les lots publiés, dessinés à leur surface. */
  lots?: Fait & { liste: Lot[] };
  /** Phrase d'honnêteté sur la disponibilité. */
  avertissement?: string;
  /** Photos secondaires de la fiche. */
  photosFiche?: PhotoId[];
};

const PRIX_SUR_DEMANDE = f("Sur demande", "contenu-maquette §5 (prix non publié)");

export const LAC_TOWN: Programme = {
  slug: "lac-town",
  nom: "Lac Town",
  href: "/terrains/lac-town/",
  chapeau: f(
    "Notre programme le plus récent, près du Lac Rose. Entièrement réalisé par Saloum Immo.",
    "contenu-maquette §5 ; YouTube qtAHrgDQd4U",
    { date: "2026-03-30" },
  ),
  statut: "non-publie",
  statutTexte: f("Statut foncier : à demander", "contenu-maquette §5 (statut juridique inconnu)"),
  catalogue: {
    lieu: f("Près du Lac Rose, à quelques minutes de la sortie 10", "contenu-maquette §5"),
    surfaces: fv("150 à 450 m²", "YouTube Wq8pwLDb4L0, à l’oral", { date: "2026-05-21", oral: true }),
    dejaFait: f("Terrassement, viabilisation, ouverture des voies", "contenu-maquette §5"),
    prix: PRIX_SUR_DEMANDE,
  },
  cotes: {
    origine: "Lac Town",
    ariaLabel: "Lac Town est à quelques minutes de la sortie 10 de l’autoroute à péage. Distance non précisée.",
    lignes: [{ vers: "Sortie 10", plaque: true, valeur: null, mesure: 8, libelleOuvert: "quelques min" }],
  },
  fiche: [
    { libelle: "Déjà fait", valeur: f("Terrassement, viabilisation, ouverture des voies.", "contenu-maquette §5") },
    {
      libelle: "Calendrier",
      // « Travaux en phase finale » date du 21.05.2026 (visite commentée) : au présent
      // et sans date, la phrase se lirait comme l'état du chantier aujourd'hui.
      valeur: f(
        "Lancé le 30 mars 2026. En vente depuis mai 2026. Travaux annoncés en phase finale le 21 mai 2026.",
        "contenu-maquette §5 ; YouTube qtAHrgDQd4U et Wq8pwLDb4L0",
        { date: "2026-03-30" },
      ),
    },
    {
      libelle: "Surfaces",
      valeur: fv(
        "150 à 450 m² pour l’habitation, et des terrains en bordure de route.",
        "YouTube Wq8pwLDb4L0, à l’oral",
        { date: "2026-05-21", oral: true },
      ),
    },
    {
      libelle: "Équipements",
      valeur: fv(
        "Adduction d’eau, électricité accessible, lampadaires avec caméras de surveillance.",
        "YouTube Wq8pwLDb4L0, à l’oral",
        { date: "2026-05-21", oral: true },
      ),
    },
    { libelle: "Statut foncier", valeur: f("À demander.", "contenu-maquette §5 (statut juridique inconnu)") },
    { libelle: "Prix", valeur: PRIX_SUR_DEMANDE },
  ],
  bouton: "Demander les lots sur WhatsApp",
  message: MESSAGES.lacTown.texte,
  photo: "2580",
  videos: ["lancementLacTown", "visiteLacTown"],
  videoBloc: "visiteLacTown",
  vignetteVideo: "2421",
};

export const SAKINA_CITY: Programme = {
  slug: "sakina-city",
  nom: "Sakina City",
  href: "/terrains/sakina-city/",
  chapeau: f(
    "À Kounoune, près de la Marine française. Commercialisé avec Khadija Fassé Gestion Immobilière.",
    "contenu-maquette §5",
  ),
  statut: "tf",
  statutTexte: f("Titre foncier individuel", "contenu-maquette §5"),
  catalogue: {
    lieu: f("Kounoune, à 3 km de la sortie du péage", "contenu-maquette §5"),
    surfaces: f("78 parcelles de 150 m²", "contenu-maquette §5"),
    dejaFait: f("Viabilisés, voies en latérite avec bordures béton", "contenu-maquette §5"),
    prix: PRIX_SUR_DEMANDE,
  },
  cotes: {
    origine: "Sakina City",
    ariaLabel: "Sakina City est à 3 kilomètres de la sortie du péage",
    lignes: [{ vers: "Sortie du péage", valeur: f("3 km", "contenu-maquette §5"), mesure: 3 }],
  },
  fiche: [
    {
      libelle: "Titre",
      valeur: f("Titres fonciers individuels. Titre mère `TF 15026/R`.", "contenu-maquette §5"),
    },
    { libelle: "Parcelles", valeur: f("78 parcelles de 150 m².", "contenu-maquette §5") },
    { libelle: "Déjà fait", valeur: f("Terrains viabilisés. Voies en latérite avec bordures béton.", "contenu-maquette §5") },
    { libelle: "Réseaux", valeur: f("Accès à l’eau et à l’électricité.", "contenu-maquette §5") },
    { libelle: "Quartier", valeur: f("Zone déjà habitée.", "contenu-maquette §5") },
    { libelle: "Prix", valeur: PRIX_SUR_DEMANDE },
  ],
  bouton: "Demander le prix sur WhatsApp",
  message: MESSAGES.sakinaCity.texte,
  photo: "2534",
  videos: ["visiteSakina"],
  videoBloc: "visiteSakina",
  trame: {
    nombre: 78,
    surface: 150,
    legende: f("78 × 150 m²", "contenu-maquette §5"),
  },
  titreMere: f("TF 15026/R", "contenu-maquette §5"),
  photosFiche: ["2413-droite"],
};

export const SICAP_KEUR_MASSAR: Programme = {
  slug: "sicap-keur-massar",
  nom: "Sicap Keur Massar",
  href: "/terrains/sicap-keur-massar/",
  aussi: fv("Les lots présentés en vidéo sous le nom Paradise City.", "contenu-maquette §5 (nom à valider)"),
  chapeau: f("Un titre foncier individuel pour chaque lot.", "contenu-maquette §5"),
  statut: "tf",
  statutTexte: f("Titre foncier individuel", "contenu-maquette §5"),
  catalogue: {
    lieu: f("À 10 min de la sortie 10, 7 min du Lac Rose", "contenu-maquette §5"),
    surfaces: f("Lots publiés en 2026 : 150, 175 et 237 m²", "contenu-maquette §5", { date: "2026" }),
    dejaFait: f("Terrassés et viabilisés", "contenu-maquette §5"),
    prix: PRIX_SUR_DEMANDE,
  },
  cotes: {
    origine: "Sicap Keur Massar",
    ariaLabel:
      "Sicap Keur Massar est à 7 minutes du Lac Rose et à 10 minutes de la sortie 10 de l’autoroute à péage",
    lignes: [
      { vers: "Lac Rose", valeur: f("7 min", "contenu-maquette §5"), mesure: 7 },
      { vers: "Sortie 10", plaque: true, valeur: f("10 min", "contenu-maquette §5"), mesure: 10 },
    ],
  },
  fiche: [
    { libelle: "Titre", valeur: f("Titre foncier individuel.", "contenu-maquette §5") },
    { libelle: "Déjà fait", valeur: f("Terrains terrassés et viabilisés.", "contenu-maquette §5") },
    { libelle: "Réseaux", valeur: f("Eau et électricité disponibles.", "contenu-maquette §5") },
    { libelle: "Prix", valeur: PRIX_SUR_DEMANDE },
    {
      libelle: "Disponibilité",
      valeur: fv("Lots publiés en 2026. Demandez ceux qui restent.", "contenu-maquette §5 (disponibilité à valider)"),
      ficheSeulement: true,
    },
  ],
  bouton: "Demander les lots libres sur WhatsApp",
  message: MESSAGES.sicapKeurMassar.texte,
  photo: "2616",
  videos: ["lotsSKM"],
  videoBloc: "lotsSKM",
  lots: {
    ...fv("Lots publiés en 2026", "contenu-maquette §5 (disponibilité actuelle à valider)", { date: "2026" }),
    liste: [
      { numero: "10", surface: 150 },
      { numero: "15", surface: 150 },
      { numero: "18", surface: 150 },
      { numero: "258", surface: 150 },
      { numero: "259", surface: 237 },
      { numero: "260", surface: 150 },
      { numero: "2175", surface: 175, note: "Angle, double façade, non inondable" },
    ],
  },
  avertissement: "Certains lots ont pu partir depuis. Demandez ceux qui restent.",
  // Pas la vue drone du 11.11.2026 (ig-DfnIRfvPSRi) : même survol que la bande 2616.
  photosFiche: ["ig-DfAoxMkAbKR"],
};

/** Les trois programmes en vente, dans l'ordre du site. */
export const PROGRAMMES: Programme[] = [LAC_TOWN, SAKINA_CITY, SICAP_KEUR_MASSAR];

export function programme(slug: ProgrammeSlug): Programme {
  return PROGRAMMES.find((p) => p.slug === slug)!;
}

// ------------------------------------------------------------ Offre datée

export type OffreDatee = {
  slug: string;
  nom: string;
  href?: string;
  statut: StatutFoncier;
  /** Étiquette mono de la deuxième colonne. */
  etiquette: string;
  /** Titre en gras, puis le texte. */
  titre: string;
  texte: Fait;
  bouton: string;
  /** Nom accessible du bouton, quand une autre offre de la page a le même libellé. */
  boutonAria?: string;
  message: string;
  fiche?: LigneFiche[];
  catalogue?: Programme["catalogue"];
};

export const RECASEMENT_AIBD: OffreDatee = {
  slug: "recasement-aibd",
  nom: "Recasement AIBD",
  href: "/terrains/recasement-aibd/",
  statut: "bail",
  etiquette: "Offre d’avril 2025, en bail",
  titre: "Recasement AIBD, Diamniadio.",
  texte: f(
    "Parcelles en bail de plus de 200 m², près de l’aéroport. 6 à 10 millions FCFA selon la position, au prix de l’offre d’avril 2025.",
    "contenu-maquette §5 (offre d’avril 2025)",
    { date: "2025-04" },
  ),
  bouton: "Demander la disponibilité sur WhatsApp",
  message: MESSAGES.recasementAibd.texte,
  fiche: [
    { libelle: "Lieu", valeur: f("Diamniadio, près de l’aéroport AIBD.", "contenu-maquette §5") },
    { libelle: "Statut foncier", valeur: f("Bail.", "contenu-maquette §5") },
    { libelle: "Surfaces", valeur: f("Plus de 200 m².", "contenu-maquette §5") },
    {
      libelle: "Prix",
      valeur: f(
        "6 à 10 millions FCFA selon la position, au prix de l’offre d’avril 2025.",
        "contenu-maquette §5",
        { date: "2025-04" },
      ),
    },
    { libelle: "Disponibilité", valeur: fv("À demander.", "contenu-maquette §5 (disponibilité 2026 inconnue)") },
  ],
  catalogue: {
    lieu: f("Diamniadio, près de l’aéroport AIBD", "contenu-maquette §5"),
    surfaces: f("Plus de 200 m²", "contenu-maquette §5"),
    dejaFait: null,
    prix: f("6 à 10 millions FCFA selon la position, offre d’avril 2025", "contenu-maquette §5", { date: "2025-04" }),
  },
};

/** Autres sites publiés (page Terrains seulement, jamais l'accueil). */
export const AUTRES_SITES: OffreDatee[] = [
  {
    slug: "bayakh",
    nom: "Bayakh",
    statut: "non-publie",
    etiquette: "Statut non publié",
    titre: "Bayakh.",
    texte: f("Site de 29 hectares. Prix sur demande.", "contenu-maquette §5 et §7"),
    bouton: "Demander sur WhatsApp",
    boutonAria: "Demander sur WhatsApp, Bayakh",
    message: MESSAGES.bayakh.texte,
  },
  {
    slug: "niague",
    nom: "Niague",
    statut: "non-publie",
    etiquette: "Statut non publié",
    titre: "Niague, route du Lac Rose.",
    texte: f("Projet en aménagement, présenté en vidéo en juin 2025.", "contenu-maquette §5", { date: "2025-06" }),
    bouton: "Demander sur WhatsApp",
    boutonAria: "Demander sur WhatsApp, Niague",
    message: MESSAGES.niague.texte,
  },
];
