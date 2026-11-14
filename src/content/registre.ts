// Travaux datés (allegement.md, partie 3) : une ligne par chantier, chacune avec
// sa source. L'accueil les donne sans source, la page Aménager avec (#travaux).
// Pas de compteur : des faits datés.
//
// Règles : pas de compteur cumulé, pas de ligne sans source, pas de photo posée
// sur une ligne. Le lieu n'est écrit que s'il est publié (Kounoune). L'article du
// 19 octobre 2024 n'a pas d'adresse stable : cité sans lien ni adresse d'archive.
// Corrections à ne jamais défaire : Kounoune, « terrassement lancé sur 3 hectares »
// (un lancement, pas un chantier fini) ; SEN'EAU a fait une « visite de contrôle ».

import { f, type Fait } from "./types";
import { TIKTOK, VIDEOS } from "./videos";

export type Source = {
  /** « Vidéo YouTube du 7 septembre 2024 » */
  libelle: string;
  /** Absent : source sans adresse stable, citée sans lien. */
  href?: string;
};

export type Travail = {
  id: string;
  /** AAAA-MM, affiché en lettres : « Septembre 2024 ». */
  mois: string;
  texte: Fait;
  sources: Source[];
};

export const TRAVAUX: Travail[] = [
  {
    id: "kounoune-terrassement",
    mois: "2024-09",
    texte: f("Terrassement lancé sur 3 hectares à Kounoune.", "YouTube Hi1DiDoX_zA ; contenu-maquette §5 et §7", {
      date: "2024-09-07",
    }),
    sources: [{ libelle: "Vidéo YouTube du 7 septembre 2024", href: VIDEOS.terrassementKounoune.href }],
  },
  {
    id: "trace-9-hectares",
    mois: "2024-10",
    texte: f("342 parcelles tracées sur un terrain de 9 hectares.", "Article publié par Saloum Immo, 19.10.2024 ; contenu-maquette §5 et §7", {
      date: "2024-10-19",
    }),
    sources: [{ libelle: "Article publié par Saloum Immo, 19 octobre 2024" }],
  },
  {
    id: "electrification-53",
    mois: "2025-10",
    texte: f("Électrification d’un projet de 53 parcelles, 17 poteaux.", "TikTok, 02.10.2025 ; contenu-maquette §5 et §7", {
      date: "2025-10-02",
      lien: TIKTOK.electrification,
    }),
    sources: [{ libelle: "TikTok du 2 octobre 2025", href: TIKTOK.electrification }],
  },
  {
    id: "adduction-58",
    mois: "2025-11",
    texte: f(
      "Adduction d’eau pour 58 parcelles. Visite de contrôle de SEN’EAU le 20 novembre 2025.",
      "TikTok, 18.11.2025 et 20.11.2025 ; contenu-maquette §5 et §7",
      { date: "2025-11-18", lien: TIKTOK.adductionEau },
    ),
    sources: [
      { libelle: "TikTok du 18 novembre 2025", href: TIKTOK.adductionEau },
      { libelle: "TikTok du 20 novembre 2025", href: TIKTOK.controleSenEau },
    ],
  },
];

/**
 * Millennium City (page À propos, avec la photo 2537). Seul le réseau de
 * canalisation est attribué à Saloum Immo, jamais l'aire de jeux, jamais « notre
 * programme ». Les dates sont celles du projet, pas de la pose. Le nom est dans le
 * texte, pas dans la légende de la photo : l'attribution ne tient pas à une légende.
 */
export const MILLENNIUM_CITY = {
  texte: f(
    "Millennium City : réseau de canalisation conçu et posé par Saloum Immo, sur un projet mené de mars 2022 à décembre 2023. Le lotissement est commercialisé par Senegindia.",
    "contenu-maquette §5 (réalisations)",
    { date: "2022-03" },
  ),
  photo: "2537" as const,
};
