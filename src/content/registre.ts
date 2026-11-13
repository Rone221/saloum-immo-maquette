// Registre des travaux (spécification 7.10) : une ligne par chantier daté,
// chacune avec sa source. Il remplace les compteurs de l'ancien site.
//
// Règles : pas de compteur cumulé, pas de ligne sans source, pas de photo
// accrochée à une ligne si le lieu de la photo n'est pas confirmé.
// Les deux articles de 2024 viennent de l'ancien site : cités sans lien.
// Millennium City : seul le réseau de canalisation est attribué à Saloum Immo,
// jamais l'aire de jeux.
//
// À valider avec le client :
// - Millennium City : présenté comme « travaux réalisés », jamais « notre programme »
//   (le lotissement est commercialisé par Senegindia) ;
// - lieux non publiés (tracé de 9 ha, électrification, adduction d'eau).

import { f, type Fait } from "./types";
import type { ProgrammeSlug } from "./programmes";
import { TIKTOK, VIDEOS } from "./videos";

export type SourceRegistre = {
  /** « YouTube, 07.09.2024 » */
  libelle: string;
  /** Absent : source sans adresse stable, affichée sans lien. */
  href?: string;
};

export type LigneRegistre = {
  id: string;
  /** Date en mono : « 07.09.2024 », « 03.2022 à 12.2023 ». `date` du Fait : AAAA-MM-JJ du début. */
  date: Fait;
  travaux: Fait;
  /** null : lieu non publié, la case l'écrit. */
  lieu: Fait | null;
  /** Programme du site concerné, pour les fiches (« Ce qui a été fait ici »). */
  programme?: ProgrammeSlug;
  sources: SourceRegistre[];
  /** Grand chiffre et unité ; ou un mot posé sur pointillés ; ou rien (pointillés seuls). */
  mesure?: { valeur: Fait; unite: string } | { mot: string };
};

export const REGISTRE: LigneRegistre[] = [
  {
    id: "millennium-city",
    // La date est celle du projet entier (mars 2022 à décembre 2023), pas celle de la
    // pose du réseau : la case Travaux le dit (contenu-maquette §5).
    date: f("03.2022 à 12.2023", "Article du site, 09.09.2024", { date: "2022-03" }),
    travaux: f(
      "Réseau de canalisation conçu et posé par Saloum Immo, sur un projet mené de mars 2022 à décembre 2023. Lotissement commercialisé par Senegindia.",
      "contenu-maquette §5 (réalisations)",
    ),
    lieu: f("Millennium City", "contenu-maquette §5"),
    sources: [{ libelle: "Article du site, 09.09.2024" }],
    mesure: { mot: "fait" },
  },
  {
    id: "kounoune-terrassement",
    date: f("07.09.2024", "YouTube Hi1DiDoX_zA", { date: "2024-09-07" }),
    travaux: f("Lancement du débroussaillage et du terrassement d’un terrain résidentiel.", "YouTube Hi1DiDoX_zA"),
    lieu: f("Kounoune", "contenu-maquette §5"),
    sources: [{ libelle: "YouTube, 07.09.2024", href: VIDEOS.terrassementKounoune.href }],
    mesure: { valeur: f("3", "contenu-maquette §5 et §7"), unite: "ha" },
  },
  {
    id: "trace-9-hectares",
    date: f("19.10.2024", "Article du site, 19.10.2024", { date: "2024-10-19" }),
    travaux: f("Tracé des parcelles d’un terrain de 9 hectares.", "contenu-maquette §5 et §7"),
    lieu: null,
    sources: [{ libelle: "Article du site, 19.10.2024" }],
    mesure: { valeur: f("342", "contenu-maquette §5 et §7"), unite: "parcelles" },
  },
  {
    id: "electrification-53",
    date: f("02.10.2025", "TikTok, 02.10.2025", { date: "2025-10-02", lien: TIKTOK.electrification }),
    travaux: f(
      "Électrification d’un projet de 53 parcelles. Poteaux et câble basse tension.",
      "contenu-maquette §5 et §7",
    ),
    lieu: null,
    sources: [{ libelle: "TikTok, 02.10.2025", href: TIKTOK.electrification }],
    mesure: { valeur: f("17", "contenu-maquette §5 et §7"), unite: "poteaux" },
  },
  {
    id: "adduction-58",
    date: f("18.11.2025", "TikTok, 18.11.2025", { date: "2025-11-18", lien: TIKTOK.adductionEau }),
    // Date dans une phrase : en toutes lettres (6.1).
    travaux: f("Adduction d’eau. Visite de contrôle de SEN’EAU le 20 novembre 2025.", "contenu-maquette §5 et §7"),
    lieu: null,
    sources: [
      { libelle: "TikTok, 18.11.2025", href: TIKTOK.adductionEau },
      { libelle: "TikTok, 20.11.2025", href: TIKTOK.controleSenEau },
    ],
    mesure: { valeur: f("58", "contenu-maquette §5 et §7"), unite: "parcelles" },
  },
  {
    id: "lac-town-lancement",
    date: f("30.03.2026", "YouTube qtAHrgDQd4U", { date: "2026-03-30" }),
    travaux: f("Lancement du site, entièrement réalisé par Saloum Immo.", "contenu-maquette §5"),
    lieu: f("Lac Town", "contenu-maquette §5"),
    programme: "lac-town",
    sources: [{ libelle: "YouTube, 30.03.2026", href: VIDEOS.lancementLacTown.href }],
  },
  {
    id: "lac-town-travaux",
    date: f("21.05.2026", "YouTube Wq8pwLDb4L0", { date: "2026-05-21" }),
    travaux: f(
      "Terrassement, viabilisation, voies ouvertes. Travaux en phase finale, vente ouverte.",
      "contenu-maquette §5",
    ),
    lieu: f("Lac Town", "contenu-maquette §5"),
    programme: "lac-town",
    sources: [{ libelle: "YouTube, 21.05.2026", href: VIDEOS.visiteLacTown.href }],
  },
];

/** Les lignes d'un programme, pour le bloc « Ce qui a été fait ici » des fiches. */
export function lignesDuProgramme(slug: ProgrammeSlug): LigneRegistre[] {
  return REGISTRE.filter((l) => l.programme === slug);
}

/** Bloc Millennium City de la page À propos (réalisations). */
export const MILLENNIUM_CITY = {
  texte: f(
    "Travaux réalisés : réseau de canalisation conçu et posé par Saloum Immo, sur un projet mené de 2022 à 2023. Le lotissement est commercialisé par Senegindia.",
    "contenu-maquette §5 (réalisations)",
    { date: "2022" },
  ),
  photo: "2537" as const,
};
