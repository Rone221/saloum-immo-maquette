// Programmes en vente, offre datée et autres sites publiés (contenu-maquette §5).
// Les mêmes données alimentent l'accueil, la page Terrains et les fiches.
// Chaque bloc vit sur une seule page (allegement.md, 2.2) : la fiche porte le
// détail, Terrains une rangée par programme, l'accueil une composition.
//
// Règles : aucun prix sauf celui de l'offre AIBD, toujours avec avril 2025.
// Ailleurs « Prix sur demande ». Ce qui vient de l'oral reste daté (Lac Town,
// vidéo du 21 mai 2026). Ne pas afficher Kounoune 2 (peut-être Sakina City) ni son
// prix de 2024. Statut foncier en mots, toujours les mêmes (allegement.md, 2.5).
//
// Revue 3 (recherche/revue-3/direction-releve-v3.md, « Fiches ») : chaque fiche
// s'ouvre sur un cartouche de plan. Les champs `cotes`, `presentation`,
// `references`, `libelleWhatsApp`, `lots.liste` et `calendrier` le nourrissent. Les
// références gardent la phrase entière et sa source dans `fait` ; `mesure`, `avant`
// et `suite` en sont la découpe affichée, comme le registre des travaux.
//
// Direction v4 (recherche/revue-4/direction-v4.md, section 6) : le cartouche s'ouvre
// sur le papier. Chaque référence peut porter le trait du plan qui dit son niveau
// (`trait`) : plein entre deux bornes pour un titre foncier, tirets pour un bail,
// pointillé sans valeur pour un statut à demander, cote pour une date.

import { LIBELLES, MESSAGES } from "./messages";
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

/** Une ligne du tableau de faits d'une fiche (revue 2). Six au plus. */
export type LigneFiche = { libelle: LibelleFiche; valeur: Fait };

/** Une distance publiée, dessinée en cote de plan (components/cote.tsx). */
export type CotePubliee = {
  /** Le lieu du programme, à gauche de la cote. Absent : le programme, sous-entendu. */
  de?: string;
  mesure: string;
  vers: string;
  /** false : distance publiée sans chiffre (« quelques minutes »), en pointillés. */
  chiffree?: boolean;
  fait: Fait;
};

/**
 * Une référence du cartouche d'une fiche : la clé à gauche, en petit ; la valeur
 * dans la voix des mesures (voix large, chiffres tabulaires) quand c'est une mesure
 * ou une référence, en mots sinon.
 */
export type Reference = {
  cle: string;
  /** En voix large : « TF 15026/R », « 78 », « 150 m² ». */
  mesure?: string;
  /** Avant la mesure, en voix normale : « Plus de ». */
  avant?: string;
  /** Juste après la mesure, sur la même ligne : « par parcelle ». */
  apres?: string;
  /** Sous la mesure, ou toute la valeur quand elle est en mots. */
  suite?: string;
  /** La référence principale, en tête du cartouche, en grand : une par fiche au plus. */
  principale?: boolean;
  /**
   * Le trait du plan sous la valeur (direction v4, « Traits »). `plein` : entre deux
   * bornes, ce qui est borné, acquis (un titre foncier). `tirets` : ce qui est en cours
   * (un bail). `pointille` : ce qu'on ne sait pas, une cote sans valeur, avant les mots
   * (un statut à demander). `cote` : ce qui se mesure ou se date.
   */
  trait?: "plein" | "tirets" | "pointille" | "cote";
  /** Une demi-case : deux par rangée du cartouche. Pour une valeur courte. */
  demi?: boolean;
  fait: Fait;
};

/** Un lot publié : son numéro, sa surface, ce qu'on en a dit. */
export type Lot = { numero: string; surface: string; note?: string; fait: Fait };

/** Une ligne du calendrier d'un programme : la date, le fait, la vidéo qui le montre. */
export type Jalon = {
  /** AAAA-MM-JJ, affichée en lettres. */
  date: string;
  texte: Fait;
  video?: CleVideo;
};

export type ProgrammeSlug = "sakina-city" | "sicap-keur-massar" | "lac-town";

export type Programme = {
  slug: ProgrammeSlug;
  nom: string;
  href: string;
  /** Statut foncier en mots, sans clé : « Titres fonciers individuels. » */
  statut: Fait;
  /**
   * Statut en tête de la fiche, plus précis quand il le faut (titre mère, « pour
   * chaque lot »).
   */
  statutFiche?: Fait;
  /** Lieu en une ligne, sans clé (rangée de Terrains, liste des autres terrains). */
  lieu: Fait;
  /** Troisième ligne de la carte de l'accueil (revue 2). */
  resume: Fait;
  /** Rangée de la page Terrains : surfaces et travaux déjà faits. */
  surfaces: Fait;
  dejaFait: Fait;
  /** Chapeau de la fiche (revue 2) ; la description de la page en reste faite. */
  chapeau: Fait;
  /** Tableau de faits de la fiche (revue 2). */
  fiche: LigneFiche[];
  /** Note sous les références de la fiche (ce qui vient de l'oral, daté). */
  noteFiche?: Fait;
  /** Sicap Keur Massar : les lots publiés. `liste` : un lot par ligne (fiche). */
  lots?: { titre: string; lignes: Fait[]; liste: Lot[]; avertissement: Fait };
  message: string;
  /** Libellé du bouton WhatsApp de la fiche : le même que sur l'accueil. */
  libelleWhatsApp: string;
  photo: PhotoId;
  /** Photo de la fiche, quand ce n'est pas `photo`. */
  photoFiche?: PhotoId;
  /** Photo de la rangée de la page Terrains, quand ce n'est pas `photo`. */
  photoRangee?: PhotoId;
  /** Deux vidéos au plus, en liens. */
  videos: CleVideo[];
  /**
   * Nature du statut, pour le badge de la carte (revue 2) : « titre » quand le
   * programme est vendu avec titre foncier, « a-demander » sinon. Le texte du badge
   * reste celui de `statut`.
   */
  foncier: "titre" | "a-demander";
  /** Repères de la carte, en puces (revue 2) : trois au plus, tirés des faits de la fiche. */
  reperes: string[];

  // Cartouche de la fiche (revue 3).
  /** Le lieu en mots, au-dessus des cotes, quand la cote ne le nomme pas. */
  situation?: Fait;
  /** Les distances publiées, en cotes. */
  cotes: CotePubliee[];
  /** Cellule du nom : ce qu'il faut savoir du lieu et des travaux, en une ou deux phrases. */
  presentation: Fait;
  /** Le nom donné au programme dans les vidéos, quand il diffère (Paradise City), en note. */
  autreNom?: Fait;
  /** Les cases du cartouche, dans l'ordre : le papier d'abord, puis ce qui se mesure. */
  references: Reference[];
  /** Lac Town : le calendrier, chaque date avec la vidéo qui la montre. */
  calendrier?: { titre: Fait; jalons: Jalon[] };
};

const PRIX = f("Sur demande.", "contenu-maquette §5 (prix non publié)");

const SAKINA = "contenu-maquette §5";

export const SAKINA_CITY: Programme = {
  slug: "sakina-city",
  nom: "Sakina City",
  href: "/terrains/sakina-city/",
  statut: f("Titres fonciers individuels.", SAKINA),
  statutFiche: f("Titres fonciers individuels. Titre mère TF 15026/R.", SAKINA),
  lieu: f("Kounoune, à 3 km de la sortie du péage.", SAKINA),
  resume: f("78 parcelles de 150 m², viabilisées.", SAKINA),
  surfaces: f("78 parcelles de 150 m².", SAKINA),
  dejaFait: f("Terrains viabilisés. Voies en latérite avec bordures béton.", SAKINA),
  chapeau: f(
    "À Kounoune, à 3 km de la sortie du péage, près de la Marine française. Commercialisé avec Khadija Fassé Gestion Immobilière.",
    SAKINA,
  ),
  fiche: [
    { libelle: "Parcelles", valeur: f("78 parcelles de 150 m².", SAKINA) },
    { libelle: "Déjà fait", valeur: f("Terrains viabilisés. Voies en latérite avec bordures béton.", SAKINA) },
    { libelle: "Réseaux", valeur: f("Accès à l’eau et à l’électricité.", SAKINA) },
    { libelle: "Quartier", valeur: f("Zone déjà habitée.", SAKINA) },
    { libelle: "Prix", valeur: PRIX },
  ],
  message: MESSAGES.sakinaCity.texte,
  libelleWhatsApp: "Demander le prix sur WhatsApp",
  // Revue 3 : plus de panneau publicitaire 2534. La voirie 2413-droite (600 px au plus,
  // content/photos.ts) partout où Sakina City a une photo.
  photo: "2413-droite",
  photoRangee: "2413-droite",
  videos: ["visiteSakina"],
  foncier: "titre",
  // contenu-maquette §5 : 78 parcelles de 150 m², viabilisées.
  reperes: ["78 parcelles", "150 m²", "Viabilisé"],

  cotes: [{ de: "Kounoune", mesure: "3 km", vers: "sortie du péage", fait: f("À 3 km de la sortie du péage.", SAKINA) }],
  // La voie en latérite et ses bordures sont dites par la légende de la photo, pas ici.
  presentation: f(
    "Près de la Marine française, dans une zone déjà habitée. Terrains viabilisés, avec accès à l’eau et à l’électricité.",
    SAKINA,
  ),
  references: [
    { cle: "Titre mère", mesure: "TF 15026/R", principale: true, trait: "plein", fait: f("Titre mère TF 15026/R.", SAKINA) },
    { cle: "Parcelles", mesure: "78", demi: true, fait: f("78 parcelles de 150 m².", SAKINA) },
    { cle: "Surface", mesure: "150 m²", apres: "par parcelle", demi: true, fait: f("78 parcelles de 150 m².", SAKINA) },
    { cle: "Statut foncier", suite: "Titres fonciers individuels", fait: f("Titres fonciers individuels.", SAKINA) },
    {
      cle: "Commercialisation",
      suite: "Avec Khadija Fassé Gestion Immobilière",
      fait: f("Commercialisé avec Khadija Fassé Gestion Immobilière.", "contenu-maquette §5 (visuel co-signé)"),
    },
  ],
};

/** Un lot de Sicap Keur Massar, publié en 2026 (contenu-maquette §5). */
function lot(numero: string, surface: string, note?: string): Lot {
  const texte = `Lot ${numero} : ${surface}${note ? `, ${note.toLowerCase().replace(/\.$/, "")}` : ""}.`;
  return { numero, surface, note, fait: f(texte, "contenu-maquette §5 (disponibilité actuelle à valider)", { date: "2026" }) };
}

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
  // Paradise City n'apparaît que sur la fiche, en second (allegement.md, partie 3).
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
    // Dans l'ordre des numéros, un lot par ligne : sept lignes, comme sur un plan.
    liste: [
      lot("10", "150 m²"),
      lot("15", "150 m²"),
      lot("18", "150 m²"),
      lot("258", "150 m²"),
      lot("259", "237 m²"),
      lot("260", "150 m²"),
      lot("2175", "175 m²", "Angle, double façade, non inondable."),
    ],
    avertissement: fv("Certains lots ont pu partir depuis. Demandez ceux qui restent.", "contenu-maquette §5"),
  },
  message: MESSAGES.sicapKeurMassar.texte,
  libelleWhatsApp: "Lots libres sur WhatsApp",
  photo: "2616",
  videos: ["lotsSKM", "reelLotsSKM"],
  foncier: "titre",
  // contenu-maquette §5 : lots publiés en 2026 de 150, 175 et 237 m², terrassés et viabilisés.
  // La date reste dans le repère : certains lots ont pu partir depuis.
  reperes: ["Lots de 150 à 237 m², publiés en 2026", "Terrassé", "Viabilisé"],

  cotes: [
    { mesure: "10 min", vers: "sortie 10", fait: f("À 10 minutes de la sortie 10 de l’autoroute à péage.", "contenu-maquette §5") },
    { mesure: "7 min", vers: "Lac Rose", fait: f("À 7 minutes du Lac Rose.", "contenu-maquette §5") },
  ],
  presentation: f("Terrains déjà terrassés et viabilisés. L’eau et l’électricité sont disponibles.", "contenu-maquette §5"),
  // Titrer « Sicap Keur Massar », citer « Paradise City » en second (contenu-maquette §5).
  autreNom: fv("Lots présentés en vidéo sous le nom Paradise City.", "contenu-maquette §5 (nom à valider)"),
  // Le papier d'abord, puis l'écart des surfaces publiées (150, 175 et 237 m²). Entre
  // les deux, la fiche pose les numéros des lots, sur leurs plaques : ils viennent de
  // `lots.liste`, pas d'ici.
  references: [
    {
      cle: "Statut foncier",
      suite: "Titre foncier individuel pour chaque lot",
      principale: true,
      trait: "plein",
      fait: f("Titre foncier individuel pour chaque lot.", "contenu-maquette §5"),
    },
    {
      cle: "Surfaces",
      mesure: "150 à 237 m²",
      fait: f("Lots publiés en 2026 : 150, 175 et 237 m².", "contenu-maquette §5", { date: "2026" }),
    },
  ],
};

const ORAL_LAC_TOWN = "YouTube Wq8pwLDb4L0, à l’oral";

export const LAC_TOWN: Programme = {
  slug: "lac-town",
  nom: "Lac Town",
  href: "/terrains/lac-town/",
  statut: f("Statut foncier à demander.", "contenu-maquette §5 (statut juridique inconnu)"),
  lieu: f("Près du Lac Rose, à quelques minutes de la sortie 10.", "contenu-maquette §5"),
  resume: f("Terrassement, viabilisation, voies ouvertes.", "contenu-maquette §5"),
  surfaces: fv("150 à 450 m², d’après notre vidéo du 21 mai 2026.", ORAL_LAC_TOWN, { date: "2026-05-21" }),
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
      valeur: fv("150 à 450 m² pour l’habitation, et des terrains en bordure de route.", ORAL_LAC_TOWN, {
        date: "2026-05-21",
      }),
    },
    {
      libelle: "Équipements",
      valeur: fv("Adduction d’eau, électricité accessible, lampadaires avec caméras de surveillance.", ORAL_LAC_TOWN, {
        date: "2026-05-21",
      }),
    },
    { libelle: "Prix", valeur: PRIX },
  ],
  noteFiche: f("Surfaces et équipements : d’après notre vidéo du 21 mai 2026.", "YouTube Wq8pwLDb4L0", {
    date: "2026-05-21",
  }),
  message: MESSAGES.lacTown.texte,
  libelleWhatsApp: "Demander les prix sur WhatsApp",
  photo: "2580",
  videos: ["lancementLacTown", "visiteLacTown"],
  foncier: "a-demander",
  // contenu-maquette §5 (voies ouvertes, viabilisation) ; YouTube qtAHrgDQd4U (lancement le 30 mars 2026).
  reperes: ["Voies ouvertes", "Viabilisé", "Lancé en mars 2026"],

  situation: f("Près du Lac Rose.", "contenu-maquette §5"),
  cotes: [
    {
      mesure: "quelques minutes",
      vers: "sortie 10",
      chiffree: false,
      fait: f("À quelques minutes de la sortie 10 de l’autoroute à péage.", "contenu-maquette §5"),
    },
  ],
  presentation: f("Notre programme le plus récent.", "contenu-maquette §5"),
  // Le statut est inconnu, et il se montre (direction v4, règle 2) : une cote en
  // pointillés, sans valeur, puis le conseil, en mots. Ce qui est déjà fait se lit sous
  // la vue au drone, qui le montre (`dejaFait`).
  references: [
    {
      cle: "Statut foncier",
      suite: "À demander avant de payer",
      principale: true,
      trait: "pointille",
      fait: f("Statut foncier à demander.", "contenu-maquette §5 (statut juridique inconnu)"),
    },
    {
      cle: "Surfaces",
      mesure: "150 à 450 m²",
      suite: "pour l’habitation, et des terrains en bordure de route",
      fait: fv("150 à 450 m² pour l’habitation, et des terrains en bordure de route.", ORAL_LAC_TOWN, { date: "2026-05-21" }),
    },
    {
      cle: "Équipements",
      suite: "Adduction d’eau, électricité accessible, lampadaires avec caméras de surveillance",
      fait: fv("Adduction d’eau, électricité accessible, lampadaires avec caméras de surveillance.", ORAL_LAC_TOWN, {
        date: "2026-05-21",
      }),
    },
  ],
  // Le fait le plus fort de Lac Town tient le titre du calendrier (analyse.md, point 48).
  // Le 21 mai 2026 : « les travaux touchent à leur fin et la commercialisation commence
  // officiellement » (inventaire.md 3.4). Le 24 juin 2026 : Lac Town est l'un des
  // programmes de la vidéo des réalisations 2026 (contenu-maquette §9).
  calendrier: {
    titre: f("Entièrement réalisé par Saloum Immo", "contenu-maquette §5 ; YouTube qtAHrgDQd4U", { date: "2026-03-30" }),
    jalons: [
      {
        date: "2026-03-30",
        texte: f("Nous lançons le programme.", "contenu-maquette §5 ; YouTube qtAHrgDQd4U", { date: "2026-03-30" }),
        video: "lancementLacTown",
      },
      {
        date: "2026-05-21",
        texte: f("Les travaux arrivent en phase finale. Nous ouvrons la vente.", "contenu-maquette §5 ; YouTube Wq8pwLDb4L0", {
          date: "2026-05-21",
        }),
        video: "visiteLacTown",
      },
      {
        date: "2026-06-24",
        texte: f("Nous le présentons parmi nos réalisations 2026.", "contenu-maquette §9 ; YouTube oj5Z_z2O1_k", {
          date: "2026-06-24",
        }),
        video: "realisations2026",
      },
    ],
  },
};

/**
 * Les trois programmes en vente, dans l'ordre du site : l'acheteur prudent voit
 * d'abord les titres fonciers (allegement.md, 2.13).
 */
export const PROGRAMMES: Programme[] = [SAKINA_CITY, SICAP_KEUR_MASSAR, LAC_TOWN];

// ------------------------------------------------------------ Offre datée

const OFFRE_AIBD = "contenu-maquette §5 (offre d’avril 2025)";

export const RECASEMENT_AIBD = {
  slug: "recasement-aibd",
  nom: "Recasement AIBD",
  href: "/terrains/recasement-aibd/",
  /** Ligne de l'accueil, sous les cartes. Elle commence par le nom, qui mène à la fiche. */
  accueil: f(
    "Recasement AIBD, Diamniadio : offre d’avril 2025, en bail, plus de 200 m², 6 à 10 millions FCFA selon la position. Demandez si elle est encore disponible.",
    OFFRE_AIBD,
    { date: "2025-04" },
  ),
  /** Page Terrains : l'offre en clair. */
  terrains: f(
    "Offre d’avril 2025 : parcelles en bail de plus de 200 m², à Diamniadio, près de l’aéroport AIBD. 6 à 10 millions FCFA selon la position. Disponibilité à demander.",
    OFFRE_AIBD,
    { date: "2025-04" },
  ),
  /** Description de sa fiche (métadonnées). */
  fiche: f(
    "Parcelles en bail de plus de 200 m², à Diamniadio, près de l’aéroport AIBD. 6 à 10 millions FCFA selon la position, au prix d’avril 2025. Disponibilité à demander.",
    OFFRE_AIBD,
    { date: "2025-04" },
  ),
  /**
   * Carte de l'accueil et de Terrains : le prix porte sa date dans sa phrase,
   * l'étiquette la redit au-dessus. « Disponibilité à demander » : contenu-maquette §5.
   */
  etiquette: "Offre d’avril 2025",
  carte: f(
    "Parcelles en bail de plus de 200 m², à Diamniadio, près de l’aéroport AIBD. 6 à 10 millions FCFA selon la position, au prix d’avril 2025. Disponibilité à demander.",
    OFFRE_AIBD,
    { date: "2025-04" },
  ),
  message: MESSAGES.recasementAibd.texte,
  libelleWhatsApp: LIBELLES.recasementAibd,

  // Cartouche de la fiche (revue 3) : la date de l'offre en grand, puis le papier, la
  // surface et le prix, qui ne valent que pour cette date.
  situation: f("Diamniadio, près de l’aéroport AIBD.", "contenu-maquette §5"),
  references: [
    {
      cle: "Offre",
      mesure: "Avril 2025",
      principale: true,
      trait: "cote",
      fait: f("Offre d’avril 2025.", OFFRE_AIBD, { date: "2025-04" }),
    },
    { cle: "Statut foncier", suite: "Bail", trait: "tirets", demi: true, fait: f("Parcelles en bail.", OFFRE_AIBD, { date: "2025-04" }) },
    {
      cle: "Surface",
      avant: "Plus de",
      mesure: "200 m²",
      demi: true,
      fait: f("Parcelles de plus de 200 m².", OFFRE_AIBD, { date: "2025-04" }),
    },
    {
      cle: "Prix",
      mesure: "6 à 10 millions FCFA",
      // Le prix ne se lit jamais sans sa date, même seul (règle en tête de fichier).
      suite: "selon la position, au prix d’avril 2025",
      fait: f("6 à 10 millions FCFA selon la position, au prix d’avril 2025.", OFFRE_AIBD, { date: "2025-04" }),
    },
  ] satisfies Reference[],
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
