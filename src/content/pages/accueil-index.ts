// Textes propres à l'index des terrains (direction v4, pièce 8 :
// recherche/revue-4/direction-v4.md). L'index sert sur l'accueil, et en mode complet
// sur la page Terrains (components/index-terrains.tsx).
//
// Les noms, les liens, le lieu, ses cotes, les travaux déjà faits et les messages
// WhatsApp viennent de programmes.ts. Le statut foncier en mots, la référence du titre
// mère, la surface et sa précision viennent de pages/terrains.ts (RELEVE), comme la
// phrase de l'offre Recasement AIBD et sa disponibilité (OFFRE_AIBD) : l'accueil et la
// page Terrains disent les mêmes mots. Ici, seulement ce que l'index ajoute : les têtes
// de colonne, l'état de chaque programme, la photo de son aperçu, et la date de l'offre
// en tête de sa ligne. Chaque fait porte sa source.
//
// Règles : aucun prix sauf celui de l'offre AIBD, toujours avec avril 2025. Un statut
// inconnu se dit en mots (« À demander avant de payer »), jamais par un chiffre.

import type { PhotoId } from "../photos";
import type { ProgrammeSlug } from "../programmes";
import { f, fv, type Fait } from "../types";
import { OFFRE_AIBD } from "./terrains";

/**
 * Les têtes de colonne, dans l'ordre. Le titre de la section demande « où acheter, et
 * avec quel papier » : les colonnes Lieu et Papier y répondent, mot pour mot.
 * `dejaFait` et `prix` : le mode complet seulement. `photo` n'est que lue.
 */
export const COLONNES_INDEX = {
  programme: "Programme",
  lieu: "Lieu",
  papier: "Papier",
  surfaces: "Surfaces",
  dejaFait: "Déjà fait",
  etat: "État",
  prix: "Prix",
  photo: "Photo",
} as const;

/** Légende du tableau, lue par les lecteurs d'écran. */
export const LEGENDE_INDEX = {
  index: "Les programmes en vente : lieu, papier, surfaces et état. Le nom de chaque programme mène à sa fiche.",
  complet:
    "Les programmes en vente : lieu, papier, surfaces, travaux déjà faits, état et prix. Le nom de chaque programme mène à sa fiche.",
};

/**
 * L'état d'une ligne, avec son carré : plein pour ce qui est en vente, en contour pour
 * ce qui reste à demander. Deux états et pas un de plus.
 */
export type EtatIndex = "en-vente" | "a-demander";

export type LigneIndex = {
  slug: ProgrammeSlug;
  etat: { nature: EtatIndex; fait: Fait };
  /**
   * La photo de l'aperçu : la vignette dans la ligne, le tirage qui suit le pointeur.
   * `legende` : ce qu'on voit, quand la fiche de la photo n'a pas de légende.
   * `position` : le cadrage (object-position) dans la vignette et dans le tirage.
   */
  apercu: { photo: PhotoId; legende?: string; position?: string };
};

/** Une ligne par programme, dans l'ordre de PROGRAMMES : les titres fonciers d'abord. */
export const INDEX: LigneIndex[] = [
  {
    slug: "sakina-city",
    etat: {
      nature: "en-vente",
      fait: f("En vente", "contenu-maquette §5 (commercialisé avec Khadija Fassé Gestion Immobilière)"),
    },
    // La voirie de Sakina City, 600 px au plus (content/photos.ts) : la voie et sa bordure.
    apercu: { photo: "2413-droite", position: "38% 50%" },
  },
  {
    slug: "sicap-keur-massar",
    etat: {
      nature: "en-vente",
      fait: fv("En vente", "contenu-maquette §5 (lots publiés en 2026 ; disponibilité actuelle à valider)", { date: "2026" }),
    },
    // 2616 sans son ciel. Sa fiche n'a pas de légende : celle-ci reprend les mots de son
    // texte alternatif (content/photos.ts), sans nom de lieu.
    apercu: { photo: "2616-bas", legende: "Maisons neuves et pistes en latérite", position: "45% 50%" },
  },
  {
    slug: "lac-town",
    etat: {
      nature: "en-vente",
      fait: f("En vente", "contenu-maquette §5 (commercialisation ouverte depuis mai 2026) ; YouTube Wq8pwLDb4L0", {
        date: "2026-05",
      }),
    },
    // Vue oblique : ni repères de cadrage ni plan dessus (content/photos.ts).
    apercu: { photo: "2580", position: "50% 50%" },
  },
];

/**
 * L'offre Recasement AIBD, sous le tableau, en une ligne datée : la date en tête, la
 * phrase de l'offre, puis la disponibilité à part, avec son carré en contour. La phrase
 * et la disponibilité sont celles du registre de la page Terrains (pages/terrains.ts,
 * OFFRE_AIBD), reprises telles quelles : le prix garde sa date dans sa phrase. Le nom,
 * le lien, le message et le libellé WhatsApp : programmes.ts. `mesures` : les morceaux
 * de la phrase composés dans la voix des mesures. La date est déjà en tête de la ligne :
 * elle n'est pas redite en voix large.
 */
export const OFFRE_INDEX = {
  date: f("Offre d’avril 2025", "contenu-maquette §5 (offre d’avril 2025)", { date: "2025-04" }),
  texte: OFFRE_AIBD.texte,
  mesures: ["200 m²", "6 à 10 millions FCFA"],
  etat: { nature: "a-demander" as EtatIndex, fait: OFFRE_AIBD.aDemander },
};
