// Textes de la page Terrains (direction v4 « Du plan au terrain »,
// recherche/revue-4/direction-v4.md, section 6). La page tient en quatre pièces :
// 01. l'ouverture et sa pièce, le tableau complet des trois programmes
//     (components/index-terrains.tsx, mode « complet ») ;
// 02. ce qui est publié sans être au tableau : l'offre Recasement AIBD, datée, puis
//     Bayakh et Niague, en registre (components/terrains-autres.tsx) ;
// 03. le papier de chaque terrain, sur la planche au bleu, et le renvoi vers la page
//     Comprendre le foncier ;
// 04. l'appel final.
//
// Les noms, les liens, les messages WhatsApp, le lieu et ses cotes, les travaux déjà
// faits viennent de programmes.ts : la fiche et ce tableau disent les mêmes distances.
// Ici, ce que la page compose à part : le statut foncier en mots, la référence du titre
// mère, la surface et sa précision (RELEVE, que l'index de l'accueil reprend), puis les
// textes des pièces 02 à 04. Chaque fait porte sa source.
//
// Jamais sur cette page : Kounoune 2 (peut-être Sakina City) ni son prix de 2024.

import type { ProgrammeSlug } from "../programmes";
import { f, fv, type Fait } from "../types";

// ------------------------------------------------------------------ 01. L'ouverture

export const TITRE = "Les terrains en vente";

/** Le mot coté du titre : un seul, tel qu'il y est écrit. */
export const MOT_TITRE = "terrains";

export const DESCRIPTION =
  "Sakina City à Kounoune, Sicap Keur Massar, Lac Town près du Lac Rose : statut foncier, surfaces publiées et travaux déjà faits. L’offre Recasement AIBD d’avril 2025, Bayakh, Niague. Prix sur demande, par WhatsApp.";

/**
 * Le chapeau : ce que le tableau dit de chaque terrain, dans l'ordre de ses colonnes
 * (lieu, papier, surfaces, déjà fait), puis la règle du prix. Aucun prix de programme
 * n'est publié : il se demande.
 */
export const CHAPEAU_PAGE = f(
  "Pour chacun : le lieu, le papier, les surfaces publiées, ce qui est déjà fait. Le prix se demande sur WhatsApp.",
  "contenu-maquette §5 (prix des programmes non publiés : « Prix sur demande » ou « Prix et disponibilités par WhatsApp »)",
);

export type LigneReleve = {
  slug: ProgrammeSlug;
  /** Le statut foncier en mots. */
  statut: Fait;
  /** Une référence publiée, composée dans la voix des mesures. */
  reference?: { cle: string; valeur: Fait };
  /** La surface en grand, puis sa précision : le nombre de parcelles, la date ou la source. */
  surface: { mesure: Fait; precision: Fait };
  /** Sous les travaux déjà faits (programmes.ts) : ce que nous y avons fait nous-mêmes. */
  realise?: Fait;
};

/** Une ligne par programme, dans l'ordre de PROGRAMMES : les titres fonciers d'abord. */
export const RELEVE: LigneReleve[] = [
  {
    slug: "sakina-city",
    statut: f("Titres fonciers individuels.", "contenu-maquette §5"),
    reference: { cle: "Titre mère", valeur: f("TF 15026/R", "contenu-maquette §5") },
    surface: {
      mesure: f("150 m²", "contenu-maquette §5"),
      precision: f("78 parcelles", "contenu-maquette §5"),
    },
  },
  {
    slug: "sicap-keur-massar",
    statut: f("Titre foncier individuel pour chaque lot.", "contenu-maquette §5"),
    // L'écart des lots publiés (150, 175 et 237 m²), comme le repère de programmes.ts :
    // le détail lot par lot est sur la fiche et sur l'accueil.
    surface: {
      mesure: f("150 à 237 m²", "contenu-maquette §5 (lots 10, 15, 18, 258 et 260 : 150 m² ; 2175 : 175 m² ; 259 : 237 m²)", {
        date: "2026",
      }),
      precision: f("Lots publiés en 2026", "contenu-maquette §5 (disponibilité actuelle à valider)", { date: "2026" }),
    },
  },
  {
    slug: "lac-town",
    statut: f("À demander avant de payer.", "contenu-maquette §5 (statut juridique inconnu)"),
    surface: {
      mesure: fv("150 à 450 m²", "YouTube Wq8pwLDb4L0, à l’oral", { date: "2026-05-21" }),
      precision: fv("D’après notre vidéo du 21 mai 2026", "YouTube Wq8pwLDb4L0", { date: "2026-05-21" }),
    },
    // « Entièrement réalisé » est l'attribution publiée au lancement, pas la fin des
    // travaux : en mai 2026, ils étaient en phase finale. La fiche date le lancement.
    realise: f(
      "Entièrement réalisé par Saloum Immo. Travaux en phase finale en mai 2026.",
      "contenu-maquette §5 ; YouTube qtAHrgDQd4U et Wq8pwLDb4L0",
      { date: "2026-05-21" },
    ),
  },
];

// --------------------------------------------------------------- 02. Aussi publiés

/**
 * L'en-tête de la pièce : son nom en étiquette, son titre et le mot coté. Le titre dit
 * ce qu'on y trouve, en comptant : le nombre de sites vient de AUTRES_SITES_RELEVE, en
 * lettres (« deux »). L'offre est une : il n'y en a qu'une de publiée.
 * Le chapeau est une invitation, pas un fait : l'offre a sa date, le projet de Niague
 * est en aménagement, le statut de Bayakh se demande. Aucun n'est dit « en vente ».
 * « Aussi publiés », pas « à demander » : ces mots sont ceux du statut de Lac Town, qui
 * est dans le tableau.
 */
export const AUTRES = {
  nom: "Aussi publiés",
  titre: (sites: string) => `Une offre datée, ${sites} autres sites`,
  mot: "datée",
  chapeau: "Demandez-nous où ils en sont.",
};

/** Les têtes de colonne du registre. La dernière n'est que lue : le bouton dit ce qu'il fait. */
export const COLONNES_AUTRES = {
  terrain: "Terrain",
  publie: "Publié",
  demande: "Demander",
} as const;

/** Légende du registre, lue par les lecteurs d'écran. */
export const LEGENDE_AUTRES =
  "L’offre Recasement AIBD et les autres sites publiés : ce qui est publié, et le lien WhatsApp pour demander.";

/**
 * Une ligne de la pièce : la phrase publiée. `mesures` : les morceaux du texte composés
 * dans la voix des mesures (une surface, un prix, une date). `aDemander` : ce qui reste
 * à demander, dit à part, sous la phrase, avec le carré en contour du tableau (le même
 * signe que dans sa colonne État). Absent : rien de tel n'est publié.
 */
export type LigneAutre = { texte: Fait; mesures: string[]; aDemander?: Fait };

/**
 * L'offre Recasement AIBD. Son nom, son lien, son message et l'étiquette qui la date
 * (« Offre d'avril 2025 ») : programmes.ts. Le prix garde sa date dans sa phrase ; la
 * disponibilité est dite à part. L'index de l'accueil reprend la phrase et la
 * disponibilité (pages/accueil-index.ts) : les deux pages disent les mêmes mots.
 */
export const OFFRE_AIBD = {
  texte: f(
    "Diamniadio, près de l’aéroport AIBD. Parcelles en bail de plus de 200 m², 6 à 10 millions FCFA selon la position, au prix d’avril 2025.",
    "contenu-maquette §5 (offre d’avril 2025)",
    { date: "2025-04" },
  ),
  mesures: ["200 m²", "6 à 10 millions FCFA", "avril 2025"],
  aDemander: f("Disponibilité à demander", "contenu-maquette §5 (disponibilité 2026 inconnue)", { date: "2025-04" }),
} satisfies LigneAutre;

/**
 * Les autres sites publiés, sans fiche : « Demander » sur WhatsApp (messages.ts).
 * `foncier` : le statut foncier du site est écrit « à demander ». La pièce 03 range
 * alors le site sous son trait en pointillés, comme un programme (programmes.ts,
 * `foncier`). Sans ce champ, rien n'est publié sur le papier du site, ni sur une vente :
 * il reste dans ce registre, la pièce 03 ne le range sous aucun papier (Niague).
 */
export const AUTRES_SITES_RELEVE: Array<
  LigneAutre & { nom: string; message: "bayakh" | "niague"; foncier?: "a-demander" }
> = [
  {
    nom: "Bayakh",
    texte: f("Site de 29 hectares.", "contenu-maquette §5 et §7"),
    mesures: ["29 hectares"],
    aDemander: f("Statut foncier à demander", "contenu-maquette §5 et §7"),
    foncier: "a-demander",
    message: "bayakh",
  },
  {
    nom: "Niague",
    texte: f("Route du Lac Rose. Projet en aménagement, présenté en vidéo en juin 2025.", "contenu-maquette §5", {
      date: "2025-06",
    }),
    mesures: ["juin 2025"],
    message: "niague",
  },
];

// ------------------------------------------------------------------- 03. Le papier

/**
 * Le trait qui dit le papier, avec les conventions du plan (direction v4, « Traits ») :
 * plein entre deux bornes sous le titre foncier, tirets sous le bail, pointillé sous ce
 * qui reste à demander. Les mêmes que sous l'échelle des papiers (accueil, Foncier).
 */
export type TraitPapier = "plein" | "tirets" | "pointille";

/**
 * Le papier de chaque terrain de la page, rangé par trait. Les noms des deux documents
 * viennent de foncier.ts (« Titre foncier », « Bail ») ; les terrains de chaque groupe et
 * leur statut en mots, de programmes.ts. Ici, le titre, le troisième groupe et la note
 * de l'offre : elle ne se lit jamais sans sa date.
 *
 * Le troisième groupe réunit les terrains dont le statut foncier est écrit « à demander » :
 * Lac Town (statut juridique inconnu) et Bayakh (« Statut foncier à demander »). La page
 * Foncier le dit pour tout terrain : demandez le statut exact avant de verser quoi que
 * ce soit (foncier.ts, AVERTISSEMENT_STATUT). Les mots sont ceux du tableau.
 *
 * Niague n'est sous aucun trait : rien n'est publié sur son papier, ni sur une vente.
 * « Avant de payer » y laisserait croire qu'on peut y acheter. Il reste dans le registre
 * de la pièce 02, avec sa phrase.
 */
export const PAPIERS = {
  nom: "Le papier",
  titre: "À chaque terrain son papier",
  mot: "papier",
  aDemander: f(
    "À demander avant de payer",
    "contenu-maquette §5 (statut juridique inconnu : Lac Town ; statut foncier à demander : Bayakh) ; foncier.ts, AVERTISSEMENT_STATUT",
  ),
  noteOffre: f("Offre d’avril 2025.", "contenu-maquette §5 (offre d’avril 2025)", { date: "2025-04" }),
};

/**
 * Sous la figure, le renvoi vers la page qui explique les papiers. Pas un « avant de
 * payer » de plus : la formule revenait jusqu'à quatre fois par page (revue 3, regard).
 */
export const RENVOI_FONCIER = {
  texte: "Ce que vaut chaque papier :",
  lien: "Comprendre le foncier",
  href: "/foncier/",
};

// --------------------------------------------------------------- 04. L'appel final

/**
 * L'appel final, avant le pied (direction v4, pièce 15) : ce qu'on vient chercher sur
 * cette page et qui ne s'y lit pas, un prix, un lot encore libre. Le bouton WhatsApp
 * « question » de messages.ts. Aucune promesse. Le mot coté est le lot : c'est lui qui
 * se mesure.
 */
export const APPEL = {
  nom: "Nous écrire",
  phrase: "Un prix, un lot ? Écrivez-nous.",
  mot: "Écrivez-nous",
};
