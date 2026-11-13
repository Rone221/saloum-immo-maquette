// Programmes en vente, offre datée et autres sites publiés (contenu-maquette §5).
// Les mêmes données alimentent l'accueil, la page Terrains et les fiches.
// Chaque bloc vit sur une seule page (allegement.md, 2.2) : la fiche porte le
// détail, Terrains une rangée par programme, l'accueil une carte.
//
// Règles : aucun prix sauf celui de l'offre AIBD, toujours avec avril 2025.
// Ailleurs « Prix sur demande ». Ce qui vient de l'oral reste daté (Lac Town,
// vidéo du 21 mai 2026). Ne pas afficher Kounoune 2 (peut-être Sakina City) ni son
// prix de 2024. Statut foncier en mots, toujours les mêmes (allegement.md, 2.5).

import { MESSAGES } from "./messages";
import type { PhotoId } from "./photos";
import { f, fv, type Fait } from "./types";
import type { CleVideo } from "./videos";

export type LibelleFiche =
  | "Statut foncier"
  | "Parcelles"
  | "Surfaces"
  | "Déjà fait"
  | "Réseaux"
  | "Équipements"
  | "Quartier"
  | "Calendrier"
  | "Prix";

/** Une ligne du tableau de faits d'une fiche. Six au plus. */
export type LigneFiche = { libelle: LibelleFiche; valeur: Fait };

export type ProgrammeSlug = "sakina-city" | "sicap-keur-massar" | "lac-town";

export type Programme = {
  slug: ProgrammeSlug;
  nom: string;
  href: string;
  /** Statut foncier en mots, sans clé : « Titres fonciers individuels. » */
  statut: Fait;
  /**
   * Statut en tête de la fiche, plus précis quand il le faut (titre mère, « pour
   * chaque lot »). Le tableau de la fiche ne le redit pas.
   */
  statutFiche?: Fait;
  /** Lieu en une ligne, sans clé (carte de l'accueil, rangée de Terrains). */
  lieu: Fait;
  /** Troisième ligne de la carte de l'accueil. */
  resume: Fait;
  /** Rangée de la page Terrains : surfaces et travaux déjà faits. */
  surfaces: Fait;
  dejaFait: Fait;
  /** Chapeau de la fiche. */
  chapeau: Fait;
  fiche: LigneFiche[];
  /** Note sous le tableau de la fiche (ce qui vient de l'oral, daté). */
  noteFiche?: Fait;
  /** Sicap Keur Massar : les lots publiés, en liste. */
  lots?: { titre: string; lignes: Fait[]; avertissement: Fait };
  message: string;
  photo: PhotoId;
  /** Photo secondaire de la fiche (Sakina City : la voirie, 600 px au plus). */
  photoFiche?: PhotoId;
  /** Photo de la rangée de la page Terrains, quand ce n'est pas `photo`. */
  photoRangee?: PhotoId;
  /** Deux vidéos au plus, en liens. */
  videos: CleVideo[];
};

const PRIX = f("Sur demande.", "contenu-maquette §5 (prix non publié)");

export const SAKINA_CITY: Programme = {
  slug: "sakina-city",
  nom: "Sakina City",
  href: "/terrains/sakina-city/",
  statut: f("Titres fonciers individuels.", "contenu-maquette §5"),
  statutFiche: f("Titres fonciers individuels. Titre mère TF 15026/R.", "contenu-maquette §5"),
  lieu: f("Kounoune, à 3 km de la sortie du péage.", "contenu-maquette §5"),
  resume: f("78 parcelles de 150 m², viabilisées.", "contenu-maquette §5"),
  surfaces: f("78 parcelles de 150 m².", "contenu-maquette §5"),
  dejaFait: f("Terrains viabilisés. Voies en latérite avec bordures béton.", "contenu-maquette §5"),
  chapeau: f(
    "À Kounoune, à 3 km de la sortie du péage, près de la Marine française. Commercialisé avec Khadija Fassé Gestion Immobilière.",
    "contenu-maquette §5",
  ),
  fiche: [
    { libelle: "Parcelles", valeur: f("78 parcelles de 150 m².", "contenu-maquette §5") },
    { libelle: "Déjà fait", valeur: f("Terrains viabilisés. Voies en latérite avec bordures béton.", "contenu-maquette §5") },
    { libelle: "Réseaux", valeur: f("Accès à l’eau et à l’électricité.", "contenu-maquette §5") },
    { libelle: "Quartier", valeur: f("Zone déjà habitée.", "contenu-maquette §5") },
    { libelle: "Prix", valeur: PRIX },
  ],
  message: MESSAGES.sakinaCity.texte,
  // Le panneau 2534 ne s'affiche jamais à plus de 440 px de large (content/photos.ts) :
  // la rangée de la page Terrains, plus large, prend la voirie.
  photo: "2534",
  photoFiche: "2413-droite",
  photoRangee: "2413-droite",
  videos: ["visiteSakina"],
};

export const SICAP_KEUR_MASSAR: Programme = {
  slug: "sicap-keur-massar",
  nom: "Sicap Keur Massar",
  href: "/terrains/sicap-keur-massar/",
  statut: f("Titre foncier individuel.", "contenu-maquette §5"),
  statutFiche: f("Titre foncier individuel pour chaque lot.", "contenu-maquette §5"),
  lieu: f("À 10 min de la sortie 10, 7 min du Lac Rose.", "contenu-maquette §5"),
  resume: f("Lots publiés en 2026 : 150, 175 et 237 m².", "contenu-maquette §5", { date: "2026" }),
  surfaces: f("Lots publiés en 2026 : 150, 175 et 237 m².", "contenu-maquette §5", { date: "2026" }),
  dejaFait: f("Terrains terrassés et viabilisés.", "contenu-maquette §5"),
  // Paradise City n'apparaît qu'ici, en second (allegement.md, partie 3).
  chapeau: fv(
    "À 10 min de la sortie 10, 7 min du Lac Rose. Les lots présentés en vidéo sous le nom Paradise City.",
    "contenu-maquette §5",
  ),
  fiche: [
    { libelle: "Déjà fait", valeur: f("Terrains terrassés et viabilisés.", "contenu-maquette §5") },
    { libelle: "Réseaux", valeur: f("Eau et électricité disponibles.", "contenu-maquette §5") },
    { libelle: "Prix", valeur: PRIX },
  ],
  lots: {
    titre: "Lots publiés en 2026",
    lignes: [
      f("Lots 10, 15, 18, 258 et 260 : 150 m².", "contenu-maquette §5", { date: "2026" }),
      f("Lot 259 : 237 m².", "contenu-maquette §5", { date: "2026" }),
      f("Lot 2175 : 175 m², angle, double façade, non inondable.", "contenu-maquette §5", { date: "2026" }),
    ],
    avertissement: fv("Certains lots ont pu partir depuis. Demandez ceux qui restent.", "contenu-maquette §5"),
  },
  message: MESSAGES.sicapKeurMassar.texte,
  photo: "2616",
  videos: ["lotsSKM", "reelLotsSKM"],
};

export const LAC_TOWN: Programme = {
  slug: "lac-town",
  nom: "Lac Town",
  href: "/terrains/lac-town/",
  statut: f("Statut foncier à demander.", "contenu-maquette §5 (statut juridique inconnu)"),
  lieu: f("Près du Lac Rose, à quelques minutes de la sortie 10.", "contenu-maquette §5"),
  resume: f("Terrassement, viabilisation, voies ouvertes.", "contenu-maquette §5"),
  surfaces: fv("150 à 450 m², d’après notre vidéo du 21 mai 2026.", "YouTube Wq8pwLDb4L0, à l’oral", { date: "2026-05-21" }),
  dejaFait: f("Terrassement, viabilisation, ouverture des voies.", "contenu-maquette §5"),
  chapeau: f(
    "Près du Lac Rose, à quelques minutes de la sortie 10 de l’autoroute à péage. Notre programme le plus récent.",
    "contenu-maquette §5",
  ),
  fiche: [
    { libelle: "Déjà fait", valeur: f("Terrassement, viabilisation, ouverture des voies.", "contenu-maquette §5") },
    {
      libelle: "Calendrier",
      valeur: f(
        "Lancé le 30 mars 2026, entièrement réalisé par Saloum Immo. En vente depuis mai 2026. Travaux en phase finale en mai 2026.",
        "contenu-maquette §5 ; YouTube qtAHrgDQd4U et Wq8pwLDb4L0",
        { date: "2026-03-30" },
      ),
    },
    {
      libelle: "Surfaces",
      valeur: fv("150 à 450 m² pour l’habitation, et des terrains en bordure de route.", "YouTube Wq8pwLDb4L0, à l’oral", {
        date: "2026-05-21",
      }),
    },
    {
      libelle: "Équipements",
      valeur: fv(
        "Adduction d’eau, électricité accessible, lampadaires avec caméras de surveillance.",
        "YouTube Wq8pwLDb4L0, à l’oral",
        { date: "2026-05-21" },
      ),
    },
    { libelle: "Prix", valeur: PRIX },
  ],
  noteFiche: f("Surfaces et équipements : d’après notre vidéo du 21 mai 2026.", "YouTube Wq8pwLDb4L0", {
    date: "2026-05-21",
  }),
  message: MESSAGES.lacTown.texte,
  photo: "2580",
  videos: ["lancementLacTown", "visiteLacTown"],
};

/**
 * Les trois programmes en vente, dans l'ordre du site : l'acheteur prudent voit
 * d'abord les titres fonciers (allegement.md, 2.13).
 */
export const PROGRAMMES: Programme[] = [SAKINA_CITY, SICAP_KEUR_MASSAR, LAC_TOWN];

// ------------------------------------------------------------ Offre datée

export const RECASEMENT_AIBD = {
  slug: "recasement-aibd",
  nom: "Recasement AIBD",
  href: "/terrains/recasement-aibd/",
  /** Ligne de l'accueil, sous les cartes. Elle commence par le nom, qui mène à la fiche. */
  accueil: f(
    "Recasement AIBD, Diamniadio : offre d’avril 2025, en bail, plus de 200 m², 6 à 10 millions FCFA selon la position. Demandez si elle est encore disponible.",
    "contenu-maquette §5 (offre d’avril 2025)",
    { date: "2025-04" },
  ),
  /** Page Terrains : l'offre en clair. */
  terrains: f(
    "Offre d’avril 2025 : parcelles en bail de plus de 200 m², à Diamniadio, près de l’aéroport AIBD. 6 à 10 millions FCFA selon la position. Disponibilité à demander.",
    "contenu-maquette §5 (offre d’avril 2025)",
    { date: "2025-04" },
  ),
  /** En-tête de sa fiche. La date n'y apparaît qu'une fois, collée au prix. */
  fiche: f(
    "Parcelles en bail de plus de 200 m², à Diamniadio, près de l’aéroport AIBD. 6 à 10 millions FCFA selon la position, au prix d’avril 2025. Disponibilité à demander.",
    "contenu-maquette §5 (offre d’avril 2025)",
    { date: "2025-04" },
  ),
  message: MESSAGES.recasementAibd.texte,
};

/** Autres sites publiés (page Terrains seulement, jamais l'accueil). */
export const AUTRES_SITES = [
  {
    nom: "Bayakh",
    texte: f("Bayakh : site de 29 hectares. Statut foncier à demander.", "contenu-maquette §5 et §7"),
    message: MESSAGES.bayakh.texte,
  },
  {
    nom: "Niague",
    texte: f("Niague, route du Lac Rose : projet en aménagement, présenté en vidéo en juin 2025.", "contenu-maquette §5", {
      date: "2025-06",
    }),
    message: MESSAGES.niague.texte,
  },
];
