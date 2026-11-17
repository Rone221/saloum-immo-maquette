// Vidéos publiées par Saloum Immo (contenu-maquette §9 ; dates et durées
// retrouvées dans l'inventaire, reseaux.md et instagram.md). Toute vidéo s'ouvre sur sa plateforme, dans
// le même onglet : pas de lecteur intégré, pas de vignette tirée de YouTube.
// Un seul bloc « Vidéos » par page, trois entrées au plus (allegement.md, 2.9).

export type Video = {
  id: string;
  plateforme: "YouTube" | "Instagram";
  /** Titre du lien. La durée s'ajoute entre parenthèses quand elle est connue. */
  titre: string;
  /** AAAA-MM-JJ, date de publication. Jamais affichée sous le lien. */
  date?: string;
  /** « 7 min 26 » */
  duree?: string;
  href: string;
  source: string;
};

const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const VIDEOS = {
  presentation: {
    id: "CSF130Y_hRc",
    plateforme: "YouTube",
    titre: "Saloum Immo en quelques minutes",
    date: "2026-07-24",
    duree: "1 min 58",
    href: yt("CSF130Y_hRc"),
    source: "contenu-maquette §9",
  },
  interviewDG: {
    id: "rpbEvdrm5AA",
    plateforme: "YouTube",
    titre: "Babacar Ndiaye explique les trois documents",
    duree: "7 min 26",
    href: yt("rpbEvdrm5AA"),
    source: "contenu-maquette §2 et §9",
  },
  lancementLacTown: {
    id: "qtAHrgDQd4U",
    plateforme: "YouTube",
    titre: "Lancement de Lac Town",
    date: "2026-03-30",
    duree: "3 min 08",
    href: yt("qtAHrgDQd4U"),
    source: "contenu-maquette §5 et §9",
  },
  visiteLacTown: {
    id: "Wq8pwLDb4L0",
    plateforme: "YouTube",
    titre: "Visite commentée de Lac Town",
    date: "2026-05-21",
    duree: "2 min 14",
    href: yt("Wq8pwLDb4L0"),
    source: "contenu-maquette §9",
  },
  visiteSakina: {
    id: "HFnSMeaCXNI",
    plateforme: "YouTube",
    titre: "Visite virtuelle de Sakina City",
    duree: "9 min 25",
    href: yt("HFnSMeaCXNI"),
    source: "contenu-maquette §9",
  },
  lotsSKM: {
    id: "SG020Z9tq3o",
    plateforme: "YouTube",
    titre: "Les lots de Sicap Keur Massar",
    date: "2026-06-10",
    duree: "2 min 02",
    href: yt("SG020Z9tq3o"),
    source: "contenu-maquette §9 (titrée « Paradise City » par le client)",
  },
  reelLotsSKM: {
    id: "DfAoxMkAbKR",
    plateforme: "Instagram",
    // Le reel en présente deux (instagram.md, n° 10) : seul 2175 est publié dans contenu-maquette.
    titre: "Une collaboratrice présente des lots de Sicap Keur Massar",
    date: "2026-10-27",
    duree: "3 min 17",
    href: "https://www.instagram.com/saloum_immo/reel/DfAoxMkAbKR/",
    source: "contenu-maquette §5 ; Instagram",
  },
  realisations2026: {
    id: "oj5Z_z2O1_k",
    plateforme: "YouTube",
    titre: "Nos réalisations 2026",
    date: "2026-06-24",
    duree: "2 min 37",
    href: yt("oj5Z_z2O1_k"),
    source: "contenu-maquette §9",
  },
  nicad: {
    id: "Rrfi4zPWsbY",
    plateforme: "YouTube",
    titre: "Le NICAD expliqué en vidéo",
    duree: "1 min 12",
    href: yt("Rrfi4zPWsbY"),
    source: "contenu-maquette §6",
  },
  terrassementKounoune: {
    id: "Hi1DiDoX_zA",
    plateforme: "YouTube",
    // « Lancement » : le 7 septembre 2024, le terrassement est lancé sur 3 hectares, pas fini.
    titre: "Lancement du terrassement sur 3 hectares à Kounoune",
    date: "2024-09-07",
    duree: "7 min 28",
    href: yt("Hi1DiDoX_zA"),
    source: "contenu-maquette §5",
  },
} satisfies Record<string, Video>;

export type CleVideo = keyof typeof VIDEOS;

/** « Saloum Immo en quelques minutes (1 min 58) » : pour un nom accessible. */
export function titreVideo(cle: CleVideo): string {
  const v: Video = VIDEOS[cle];
  return v.duree ? `${v.titre} (${v.duree})` : v.titre;
}

/**
 * « YouTube · 1 min 58 » : la ligne sous le titre d'une vidéo, la même sur toutes les
 * pages (revue 3). La plateforme, puis la durée quand on l'a ; jamais la date.
 */
export function metaVideo(cle: CleVideo): string {
  const v: Video = VIDEOS[cle];
  return v.duree ? `${v.plateforme} · ${v.duree}` : v.plateforme;
}

/** « À regarder avant d'appeler » (page Diaspora), dans cet ordre. */
export const A_REGARDER: CleVideo[] = ["presentation", "interviewDG", "lotsSKM"];

/** La chaîne, pour le lien « Toutes nos vidéos sur YouTube ». */
export const CHAINE_YOUTUBE = "https://www.youtube.com/@saloumimobat";

/** Publications TikTok citées comme sources des travaux datés. */
export const TIKTOK = {
  electrification: "https://www.tiktok.com/@saloum_immo/video/7556624709337566475",
  adductionEau: "https://www.tiktok.com/@saloum_immo/video/7574024112855731467",
  controleSenEau: "https://www.tiktok.com/@saloum_immo/video/7574833892834708748",
};
