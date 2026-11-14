// Identité, coordonnées, réseaux et fondateur.

import { ADRESSE_EMAIL, NUMERO_FIXE, NUMERO_MOBILE } from "./coordonnees";
import type { PhotoId } from "./photos";
import { f, fv, type Fait } from "./types";

// Navigation et numéro WhatsApp : dans coordonnees.ts, sans `Fait`, parce que les
// composants client les importent (rien de ce fichier ne part au navigateur).
export { NAVIGATION, WHATSAPP, type Rubrique } from "./coordonnees";

export const RAISON_SOCIALE = f("SALOUM IMMO ELITE SUARL", "contenu-maquette §1");

export const SLOGAN = f("Transformer la terre, construire l’avenir.", "contenu-maquette §1 ; enseigne de l’agence, photo 2352");

export const VALEURS = f("la transparence, la qualité et l’engagement", "contenu-maquette §1 ; YouTube CSF130Y_hRc");

export const CREATION = fv("depuis 2022", "contenu-maquette §2", { date: "2022" });

export const SIEGE = fv("Sicap Keur Massar, Sangalkam, Dakar", "contenu-maquette §2 et §3");

export const AGENCE = fv("Sicap Keur Massar, Sangalkam, Dakar. Sur rendez-vous.", "contenu-maquette §3");

// ------------------------------------------------------------------ Contact

export type Telephone = {
  /** « 77 400 75 75 » */
  court: string;
  /** « +221 77 400 75 75 » */
  long: string;
  href: string;
  fait: Fait;
};

export const MOBILE: Telephone = { ...NUMERO_MOBILE, fait: f("+221 77 400 75 75", "contenu-maquette §3") };

export const FIXE: Telephone = {
  ...NUMERO_FIXE,
  fait: fv("33 805 87 18", "contenu-maquette §3"),
};

export const EMAIL = { ...ADRESSE_EMAIL, fait: f("info@saloumimmo.com", "contenu-maquette §3") };

// ------------------------------------------------------------------ Réseaux

/** Date du relevé des chiffres des réseaux : toujours affichée avec eux. */
export const RELEVE_RESEAUX = "2026-11-13";

export type Reseau = {
  nom: string;
  href: string;
  /** Chiffre relevé le 13 novembre 2026. Absent : rien à afficher, pas de case vide. */
  chiffre?: Fait;
};

/** Page Contact seulement (allegement.md, 2.2). */
export const RESEAUX: Reseau[] = [
  {
    nom: "Facebook",
    href: "https://www.facebook.com/61562304385126/",
    chiffre: f("46 000 abonnés", "contenu-maquette §3", { date: RELEVE_RESEAUX }),
  },
  {
    nom: "TikTok",
    href: "https://www.tiktok.com/@saloum_immo",
    chiffre: f("9 100 abonnés", "contenu-maquette §3", { date: RELEVE_RESEAUX }),
  },
  { nom: "YouTube", href: "https://www.youtube.com/@saloumimobat" },
  { nom: "Instagram", href: "https://www.instagram.com/saloum_immo/" },
  { nom: "LinkedIn", href: "https://www.linkedin.com/company/saloum-immo/" },
];

// ---------------------------------------------------------------- Fondateur

export const FONDATEUR = {
  nom: f("Babacar Ndiaye", "contenu-maquette §2"),
  role: f("Fondateur et directeur général de Saloum Immo", "contenu-maquette §2"),
  /** Version courte, pour l'accueil. */
  roleCourt: f("Fondateur et directeur général.", "contenu-maquette §2"),
  /** Accueil : une phrase, sans citer l'interview au-delà de son sujet. */
  enVideo: f(
    "Il explique lui-même en vidéo la délibération, le bail et le titre foncier.",
    "contenu-maquette §2 et §9 ; YouTube rpbEvdrm5AA",
  ),
  /**
   * Accueil : la dernière phrase du parcours seulement. La biographie complète vit sur
   * À propos. Date de création à valider (contenu-maquette §2).
   */
  creation: fv("En 2022, il crée Saloum Immo.", "contenu-maquette §2, parcours publié sur son site", { date: "2022" }),
  /** Résumée, jamais recopiée (contenu-maquette §2). */
  biographie: fv(
    "Il a commencé à l’aéroport Léopold Sédar Senghor, comme agent de nettoyage. Il y a appris seul le français et l’anglais. Ensuite Dakar Catering, le change, puis la vente et la location de véhicules. En 2022, il crée Saloum Immo.",
    "contenu-maquette §2, parcours publié sur son site, résumé",
  ),
  /** Capture de l'interview (899 px de large : jamais affichée plus grande). */
  photo: "ig-DZUeyGKPdj_" as PhotoId,
};
